# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-12-28

### Added
- **Interactive Map**: Dot-density visualization of 300 parliamentary constituencies
- **Candidate Profiles**: View candidates from BNP, Jamaat, NCP, and JUIB
- **Voter Statistics**: Real-time voter counts by division, district, and constituency
- **Janatar Dabi (জনতার দাবি)**: Community voting system for local issues
  - Mosquitoes/Dengue, Water Logging, Traffic, Extortion, Bad Roads, Load Shedding
  - Protected by Cloudflare Turnstile CAPTCHA
  - Redis-backed vote persistence with rate limiting
- **Area Videos**: YouTube integration for local election news
- **Division Pages**: Dedicated pages for each of the 8 divisions
- **Constituency Detail Pages**: Deep-link pages for all 300 constituencies
- **Mobile Responsive**: Full mobile support with touch-friendly UI
- **Bilingual Support**: Bengali and English language throughout

### Security
- Content Security Policy (CSP) headers
- Rate limiting middleware (100 req/min per IP)
- Input validation with Zod schemas
- XSS protection headers
- Cloudflare Turnstile CAPTCHA integration

### Infrastructure
- Next.js 15 with App Router
- TypeScript 5.8 strict mode
- Tailwind CSS 4 with custom Golden Delta theme
- Redis integration for vote storage
- Railway deployment configuration

### Developer Experience
- ESLint with import sorting
- Prettier with Tailwind plugin
- Husky pre-commit hooks
- lint-staged for staged file linting
- TypeScript strict type checking

### Documentation
- README with setup instructions
- CONTRIBUTING guidelines
- SECURITY documentation
- MIT License

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 0.1.0 | 2025-12-28 | Initial public release |

## Versioning Strategy

This project uses [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes, major redesigns
- **MINOR** (0.1.0): New features, backwards compatible
- **PATCH** (0.0.1): Bug fixes, minor improvements

### Pre-1.0 Development

While in `0.x.x`, the API and features may change without major version bumps.
The project will reach `1.0.0` when:
- All 300 constituencies have complete candidate data
- Voting system is battle-tested in production
- Core features are stable

[Unreleased]: https://github.com/tarekahsan709/bangladesh-election/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/tarekahsan709/bangladesh-election/releases/tag/v0.1.0
