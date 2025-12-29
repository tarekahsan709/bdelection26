# Bangladesh Election Map

An interactive dot density map visualization showing voter distribution across Bangladesh's 300 parliamentary constituencies. Inspired by [The Pudding's](https://pudding.cool) storytelling approach and [UK GE Dot Map](https://github.com/PaulC91/gedotmap).

![Bangladesh Election Map](screenshot.png)

## Features

- **Dot Density Visualization**: Each dot represents ~2,500 registered voters
- **Urban/Rural Classification**: Cyan dots for urban areas, amber for rural
- **Interactive Map**: Pan, zoom, hover for tooltips, click to select constituencies
- **District Boundaries**: Highlighted borders on hover and selection
- **Candidate Information**: Bottom sheet showing candidates for selected constituency
- **Filter by Region**: Division → District → Constituency cascading filters
- **Real-time Statistics**: Total voters, urban/rural breakdown, constituency count
- **Mobile Responsive**: Collapsible sidebar, bottom sheet for candidate details

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Map**: Leaflet.js with CartoDB dark tiles
- **Data**: Static JSON files

## Getting Started

```bash
# Clone the repository
git clone https://github.com/tarekahsan709/bangladesh-election.git
cd bangladesh-election

# Install dependencies
cd app
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
bangladesh-election/
├── app/                          # Next.js application
│   ├── public/data/              # JSON data files
│   ├── src/
│   │   ├── app/                  # App router pages
│   │   ├── components/
│   │   │   ├── candidates/       # Candidate panel components
│   │   │   ├── map/              # Leaflet map components
│   │   │   ├── mobile/           # Mobile-specific components
│   │   │   └── sidebar/          # Sidebar components
│   │   ├── styles/               # Global styles
│   │   └── types/                # TypeScript definitions
│   └── package.json
├── data/                         # Source data files
│   ├── geojson/                  # Geographic boundaries
│   ├── bd-constituencies.json    # 300 constituencies
│   ├── bnp_candidates.json       # BNP candidates
│   └── jamat_candidate.json      # Jamaat candidates
└── scripts/                      # Data generation scripts
```

## Data Sources

- **Constituency Data**: Bangladesh Election Commission
- **Geographic Boundaries**: Bangladesh Bureau of Statistics
- **Voter Registration**: 2024 Electoral Roll
- **Map Tiles**: CartoDB Dark Matter

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run typecheck # Type check with TypeScript
```

## Roadmap

- [ ] Social Pulse page with social media analytics
- [ ] Historical election comparison (2008, 2014, 2018, 2024)
- [ ] Constituency profile pages
- [ ] Search functionality
- [ ] Complete NCP candidate data (125/300)
- [ ] Actual election results visualization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**Nazmul Ahsan**

- Email: tarekahsan709@gmail.com
- GitHub: [@tarekahsan709](https://github.com/tarekahsan709)

## Acknowledgments

- Inspired by [UK GE Dot Map](https://github.com/PaulC91/gedotmap) by Paul Campbell
- Design inspiration from [The Pudding](https://pudding.cool)
- Map tiles by [CartoDB](https://carto.com)
