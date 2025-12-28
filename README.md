# Bangladesh Election Map 2026

An interactive visualization of Bangladesh's 300 parliamentary constituencies with voter data, candidate information, and community issue tracking.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

![Bangladesh Election Map Preview](app/public/images/og.jpg)

## Features

- **Interactive Map** - Explore all 300 constituencies with dot-density visualization
- **Candidate Profiles** - View candidates from major parties (BNP, Jamaat, NCP, etc.)
- **Voter Statistics** - Real-time voter counts by division, district, and constituency
- **Janatar Dabi (জনতার দাবি)** - Community voting on local issues (mosquitoes, traffic, roads, etc.)
- **Area Videos** - YouTube integration showing local news and election coverage
- **Bilingual UI** - Bengali and English language support
- **Mobile Responsive** - Works on all device sizes

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Maps | [Leaflet](https://leafletjs.com/) |
| Database | [Redis](https://redis.io/) (via ioredis) |
| Validation | [Zod](https://zod.dev/) |
| CAPTCHA | [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |

## Project Structure

```
app/src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── janatar-dabi/  # Community issue voting API
│   │   └── meme-pulse/    # YouTube video feed API
│   ├── [division]/        # Dynamic division/district/constituency pages
│   ├── privacy/           # Privacy policy
│   └── terms/             # Terms of service
├── components/            # React components
│   ├── map/              # Leaflet map components & hooks
│   ├── sidebar/          # Filter panel, stats, constituency details
│   ├── candidates/       # Candidate panel
│   ├── janatar-dabi/     # Community voting component
│   └── meme-pulse/       # Video feed component
├── constants/            # Configuration & constants
│   ├── colors.ts         # Color palette (Golden Delta theme)
│   ├── divisions.ts      # Division/constituency colors
│   ├── site.ts           # Site metadata & SEO config
│   └── env.ts            # Environment helpers
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Redis (optional, for vote persistence)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tarekahsan709/bangladesh-election.git
   cd bangladesh-election/app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   # Site URL
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"

   # Development banner (optional)
   NEXT_PUBLIC_SHOW_DEV_BANNER="true"

   # Redis (optional - falls back to in-memory)
   REDIS_URL="redis://localhost:6379"

   # Cloudflare Turnstile (use test keys for development)
   NEXT_PUBLIC_TURNSTILE_SITE_KEY="1x00000000000000000000AA"
   TURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA"

   # YouTube API (optional - for video feed)
   YOUTUBE_API_KEY=""
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint issues |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run tests |
| `pnpm format` | Format code with Prettier |

## Key Features Explained

### Janatar Dabi (জনতার দাবি)

"People's Demand" - A community voting system where users can vote on the most pressing issues in their constituency:

- Mosquitoes/Dengue
- Water Logging
- Traffic Jam
- Extortion
- Bad Roads
- Load Shedding

Protected by Cloudflare Turnstile CAPTCHA and rate limiting.

### Dot Density Map

Each dot represents approximately 1,000 voters. The map uses:
- Division-based color coding
- Party-based color mode (toggle available)
- Viewport-based filtering for performance

### Area Videos (Meme Pulse)

Fetches recent election-related videos from YouTube for each district. Features:
- Content filtering (blocklist for inappropriate content)
- Redis caching (6-hour TTL)
- Trending/Recent sorting

## Data Sources

- **Voter Data**: Bangladesh Election Commission
- **Constituency Boundaries**: GeoJSON from official sources
- **Candidate Information**: Publicly available party nominations

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting (`pnpm lint`)
5. Run type checking (`pnpm typecheck`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Security

For security considerations and deployment guidelines, see [SECURITY.md](SECURITY.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Bangladesh Election Commission](https://www.ecs.gov.bd) for official data
- [OpenStreetMap](https://www.openstreetmap.org) for map tiles
- [Noto Sans Bengali](https://fonts.google.com/noto/specimen/Noto+Sans+Bengali) font by Google

## Disclaimer

This is **not** an official government application. Data is sourced from publicly available information and may not reflect the most current official records. The "Janatar Dabi" voting feature is for community sentiment only and has no official standing.

---

Built with love for Bangladesh
