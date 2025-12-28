# Election App Security Guide

A comprehensive security checklist for deploying a Bangladesh Election information app.

---

## Table of Contents

1. [Infrastructure Security (Cloudflare)](#1-infrastructure-security-cloudflare)
2. [Application Security (Already Implemented)](#2-application-security-already-implemented)
3. [Database Security (Redis)](#3-database-security-redis)
4. [Monitoring & Incident Response](#4-monitoring--incident-response)
5. [Legal & Compliance](#5-legal--compliance)
6. [Pre-Launch Checklist](#6-pre-launch-checklist)

---

## 1. Infrastructure Security (Cloudflare)

### Why Cloudflare?

During elections, your app becomes a target for:
- **DDoS attacks** - Overwhelming your server with traffic
- **Bot attacks** - Automated voting/scraping
- **Data scraping** - Competitors stealing your data
- **Reputation attacks** - Defacement attempts

Cloudflare acts as a shield between attackers and your server.

### Setup Steps

#### Step 1: Add Domain to Cloudflare (Free Plan)

1. Create account at [cloudflare.com](https://cloudflare.com)
2. Click "Add Site" → Enter your domain
3. Select **Free Plan** (sufficient for most cases)
4. Cloudflare will scan your DNS records
5. Update nameservers at your domain registrar:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```

#### Step 2: Enable Proxy (Orange Cloud)

In DNS settings, ensure the **orange cloud** is enabled for:
- `A` record pointing to Railway
- `CNAME` record if using subdomain

This hides your actual Railway IP address.

#### Step 3: SSL/TLS Configuration

Go to **SSL/TLS** → **Overview**:
- Set encryption mode to **Full (Strict)**
- Enable **Always Use HTTPS**
- Enable **Automatic HTTPS Rewrites**

#### Step 4: Security Settings

**Firewall Rules** (Security → WAF → Custom Rules):

```
Rule 1: Block Known Bad Bots
Expression: (cf.client.bot) and not (cf.bot_management.verified_bot)
Action: Block

Rule 2: Block Suspicious Countries (Optional)
Expression: (ip.geoip.country in {"CN" "RU" "KP"})
Action: Challenge

Rule 3: Protect Voting API
Expression: (http.request.uri.path eq "/api/janatar-dabi") and (http.request.method eq "POST") and (cf.threat_score gt 10)
Action: Challenge

Rule 4: Rate Limit API
Expression: (http.request.uri.path contains "/api/")
Action: Rate Limit (100 requests per minute)
```

**Bot Fight Mode**:
- Go to **Security** → **Bots**
- Enable **Bot Fight Mode** (Free)
- Consider **Super Bot Fight Mode** (Pro plan) for elections

**DDoS Protection**:
- Enabled by default on all plans
- Go to **Security** → **DDoS** → Set sensitivity to **High**

#### Step 5: Page Rules (Performance + Security)

```
Rule 1: Cache Static Assets
URL: *yourdomain.com/data/*
Settings: Cache Level: Cache Everything, Edge TTL: 1 day

Rule 2: Bypass Cache for API
URL: *yourdomain.com/api/*
Settings: Cache Level: Bypass, Disable Performance
```

#### Step 6: Under Attack Mode

During high-traffic periods (election day):
1. Go to **Overview**
2. Enable **Under Attack Mode**
3. This adds a 5-second challenge to all visitors

---

## 2. Application Security (Already Implemented)

### Security Headers ✅

Located in `next.config.js`:

| Header | Purpose |
|--------|---------|
| `X-Frame-Options: DENY` | Prevents clickjacking |
| `X-Content-Type-Options: nosniff` | Prevents MIME sniffing |
| `Content-Security-Policy` | Controls resource loading |
| `Referrer-Policy` | Limits referrer leakage |
| `Permissions-Policy` | Restricts browser APIs |

### Edge Rate Limiting ✅

Located in `src/middleware.ts`:

- 100 requests/minute per IP
- Blocks suspicious user agents on voting endpoint
- Returns proper rate limit headers

### Input Validation ✅

Located in `src/app/api/janatar-dabi/route.ts`:

- Zod schema validation for all inputs
- Constituency ID: 1-300 only
- Issue types: Strict enum validation
- JSON parsing error handling

### API Rate Limiting ✅

- 10 votes per minute per IP (Redis-based)
- Atomic increments prevent race conditions

---

## 3. Database Security (Redis)

### Railway Redis (Recommended)

Railway's internal Redis is automatically:
- Private network only (not accessible from internet)
- Encrypted at rest
- No authentication needed (internal only)

### External Redis (Upstash, Redis Cloud)

If using external Redis:

```bash
# Always use TLS connection
REDIS_URL=rediss://username:password@host:port

# NOT this (unencrypted)
REDIS_URL=redis://username:password@host:port
```

### Redis Security Checklist

- [ ] Use `rediss://` (TLS) not `redis://`
- [ ] Enable authentication if publicly accessible
- [ ] Set memory limits to prevent OOM attacks
- [ ] Disable dangerous commands (`FLUSHALL`, `CONFIG`)
- [ ] Set `maxclients` limit

---

## 4. Monitoring & Incident Response

### Set Up Monitoring

#### Cloudflare Analytics (Free)
- Traffic patterns
- Threat detection
- Bot traffic percentage

#### Railway Metrics
- CPU/Memory usage
- Request latency
- Error rates

#### Recommended: Add Error Tracking

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

### Incident Response Plan

#### During DDoS Attack:
1. Enable Cloudflare "Under Attack Mode"
2. Check Cloudflare Analytics for attack source
3. Add specific firewall rules to block attackers
4. Scale up Railway instance if needed

#### During Data Breach Attempt:
1. Check middleware logs for suspicious patterns
2. Block offending IPs via Cloudflare
3. Rotate Redis credentials if compromised
4. Review and patch vulnerability

#### During Vote Manipulation Attempt:
1. Check Redis for unusual vote patterns
2. Review API logs for automation signatures
3. Temporarily increase rate limits
4. Consider CAPTCHA for voting endpoint

---

## 5. Legal & Compliance

### Data Protection

Since this app handles:
- No personal user data (no login required)
- No cookies (stateless voting)
- Public election information only

**Risk Level: Low**

However, still implement:

```typescript
// Already in layout.tsx
<Disclaimer />
// "এটি সরকারি অ্যাপ নয় | Not an Official Government App"
```

### Terms of Service (Recommended)

Create a `/terms` page stating:
- Data is sourced from Election Commission
- Voting feature is for sentiment only, not official
- No guarantee of accuracy
- User assumes all risk

### Privacy Policy (Recommended)

Create a `/privacy` page stating:
- IP addresses stored temporarily for rate limiting
- No personal information collected
- No cookies used
- Data retained for 24 hours only

---

## 6. Pre-Launch Checklist

### Infrastructure

- [ ] Domain added to Cloudflare
- [ ] Orange cloud (proxy) enabled
- [ ] SSL set to Full (Strict)
- [ ] Bot Fight Mode enabled
- [ ] DDoS protection on High
- [ ] Firewall rules configured

### Application

- [ ] Security headers verified (check at securityheaders.com)
- [ ] Rate limiting tested
- [ ] Input validation tested with malicious payloads
- [ ] Error pages don't leak stack traces

### Database

- [ ] Redis using TLS connection
- [ ] Credentials not in source code
- [ ] Backup strategy in place

### Monitoring

- [ ] Cloudflare alerts configured
- [ ] Railway metrics dashboard set up
- [ ] Error tracking (Sentry) configured
- [ ] Uptime monitoring (UptimeRobot) set up

### Legal

- [ ] Disclaimer visible on all pages
- [ ] Terms of Service page created
- [ ] Privacy Policy page created
- [ ] Source attribution to Election Commission

---

## Security Testing Commands

### Test Security Headers

```bash
# Check headers
curl -I https://yourdomain.com

# Or use online tool
# https://securityheaders.com
```

### Test Rate Limiting

```bash
# Send 150 requests rapidly (should get blocked after 100)
for i in {1..150}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://yourdomain.com/api/janatar-dabi?constituency_id=1
done
```

### Test Input Validation

```bash
# Should return 400 Bad Request
curl -X POST https://yourdomain.com/api/janatar-dabi \
  -H "Content-Type: application/json" \
  -d '{"constituency_id": "999", "issue": "invalid"}'

# Should return 400 Bad Request (SQL injection attempt)
curl -X POST https://yourdomain.com/api/janatar-dabi \
  -H "Content-Type: application/json" \
  -d '{"constituency_id": "1; DROP TABLE votes;", "issue": "traffic"}'
```

---

## Additional Security Measures (Optional)

### 1. CAPTCHA for Voting

Add hCaptcha or reCAPTCHA to voting endpoint:

```bash
npm install @hcaptcha/react-hcaptcha
```

### 2. Device Fingerprinting

Prevent multiple votes from same device:

```bash
npm install @fingerprintjs/fingerprintjs
```

### 3. Anomaly Detection

Flag unusual voting patterns:
- Same issue getting 1000 votes in 1 minute
- Single constituency getting unusual traffic

### 4. Geographic Restrictions

Block votes from outside Bangladesh:

```typescript
// In middleware.ts
const country = request.headers.get('cf-ipcountry');
if (country !== 'BD' && path === '/api/janatar-dabi') {
  return NextResponse.json({ error: 'Voting restricted to Bangladesh' }, { status: 403 });
}
```

### 5. Time-based Restrictions

Only allow voting during election period:

```typescript
const ELECTION_START = new Date('2026-02-01');
const ELECTION_END = new Date('2026-02-28');

if (new Date() < ELECTION_START || new Date() > ELECTION_END) {
  return NextResponse.json({ error: 'Voting not yet open' }, { status: 403 });
}
```

---

## Emergency Contacts

- **Cloudflare Support**: support.cloudflare.com
- **Railway Support**: railway.app/help
- **Bangladesh CERT**: cert.gov.bd

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-28 | 1.0 | Initial security documentation |

---

*This document should be reviewed and updated before each major deployment.*
