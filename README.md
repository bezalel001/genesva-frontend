# Gene Data Viewer

A React app built with TypeScript for viewing and exploring human gene data. Created for the datavisyn coding challenge.

![React](https://img.shields.io/badge/React-19.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![Vite](https://img.shields.io/badge/Vite-7.1-purple)

## What does it do?

This app lets you browse through a dataset of ~50,000 human genes. You can search, filter, and click on genes to see detailed information and charts.

**Main features:**

- 📊 **Data table** - Search, sort, and filter genes
- 📈 **Interactive charts** - Visual breakdown of gene types and chromosomes
- 🎨 **Dark/Light themes** - Toggle between themes
- 📱 **Mobile responsive** - Works on all screen sizes

## Quick Start

**Prerequisites:** Node.js 18+ and npm

```bash
# Clone and install
git clone <repo-url>
cd genesva-frontend
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 - you should see the gene data table.

## What's inside?

### Tech Stack

- **React 19** with hooks (no class components)
- **TypeScript** for type safety
- **Vite** for fast development and builds
- **Mantine** for UI components
- **ECharts** for interactive charts
- **Papa Parse** for CSV data processing

### Project Structure

```
src/
├── components/           # React components
│   ├── charts/          # Chart components
│   ├── GeneTable.tsx    # Main data table
│   ├── GeneDetailView.tsx # Gene info panel
│   └── Layouts.tsx      # App layout
├── types/               # TypeScript types
├── utils/               # Helper functions
├── data/                # CSV data files
└── App.tsx              # Main app component
```

## How it works

### Data Flow

1. App loads CSV file with gene data (~50K records)
2. Data gets parsed and stored in React state
3. User can search/filter in the table
4. Clicking a row shows details and updates charts
5. Charts show gene type distribution and chromosome data

### Key Components

**App.tsx** - Main component that:

- Loads gene data from CSV
- Manages selected gene state
- Handles loading/error states

**GeneTable.tsx** - Data table that:

- Displays all genes with sorting/filtering
- Has color-coded columns (chromosomes, gene types)
- Emits selection events when rows are clicked

**GeneDetailView.tsx** - Detail panel that:

- Shows info about selected gene
- Displays two interactive charts
- Links to external databases

**Charts** - Two chart components:

- **BiotypeChart** - Pie chart of gene types on selected chromosome
- **ChromosomeChart** - Bar chart showing genes per chromosome

## Performance Notes

The app handles 50K+ records smoothly by:

- Using `useMemo` for expensive calculations
- Separating data processing from UI updates
- Memoizing chart data to avoid recalculation on theme changes

Example optimization in charts:

```typescript
// Heavy data processing - only runs when data changes
const chartData = useMemo(() => {
  return processGeneData(allGenes);
}, [allGenes]);

// Light styling - only runs when theme changes
const chartOptions = useMemo(() => {
  return createChartOptions(chartData, theme);
}, [chartData, theme]);
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

## Code Quality

The project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks (auto-format on commit)
- **TypeScript strict mode** for type safety

## Data Structure

Each gene has this structure:

```typescript
interface Gene {
  ensembl: string; // Gene ID (e.g., "ENSG00000012048")
  geneSymbol: string | null; // Gene name (e.g., "BRCA1")
  name: string | null; // Full description
  biotype: string; // Gene type (e.g., "Protein Coding")
  chromosome: string | number; // Chromosome (1-22, X, Y, MT)
  seqRegionStart: number; // Start position
  seqRegionEnd: number; // End position
}
```

## Browser Support

Works in all modern browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Responsive Design

- **Desktop (1200px+)**: Side-by-side table and detail view
- **Tablet (768px-1199px)**: Stacked layout
- **Mobile (320px-767px)**: Single column, touch-optimized

## Common Issues

**Port already in use:**

```bash
npx kill-port 5173
```

**Dependencies issues:**

```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**

```bash
npm run lint:fix
```

## What's Next?

Potential improvements:

- Add unit tests (Jest + React Testing Library)
- Implement virtual scrolling for better performance
- Add more chart types (scatter plots, heatmaps)
- Export functionality (PDF, CSV)
- Gene comparison features
- Dynamic column addition from external APIs
- Gosling.js genomic visualization
- Gene expression analysis
- Differential expression analysis

## Contributing

1. Follow the existing code style
2. Run `npm run lint` before committing
3. Use conventional commit messages
4. Update documentation for new features

---

**Built with modern React patterns and TypeScript for type safety and better developer experience.**
