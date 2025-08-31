# Gene Table Viewer

A modern React application for visualizing and exploring human gene data using Mantine UI components and interactive charts. This project was built as part of the datavisyn coding challenge.

## 🧬 Features

- **Interactive Gene Table**: Browse through human gene data with sorting, filtering, and pagination
- **Gene Detail View**: Comprehensive information about selected genes including statistics and visualizations
- **Dark/Light Theme**: Toggle between dark and light color schemes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Statistics**: Dynamic calculations of gene properties and chromosome statistics
- **Visual Charts**: Interactive charts showing gene density and distribution patterns

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 18.0 or higher)
- **npm** (version 8.0 or higher) or **yarn** (version 1.22 or higher)
- **Git** (for cloning the repository)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/genesva-frontend.git
   cd genesva-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 📁 Project Structure

```
genesva-frontend/
├── public/
│   └── vite.svg                 # Vite logo
├── src/
│   ├── components/
│   │   ├── charts/              # Chart components
│   │   │   └── ChromosomeDensityChart.tsx
│   │   ├── GeneDetailView.tsx   # Gene detail panel
│   │   ├── GeneTable.tsx        # Main data table
│   │   └── Layouts.tsx          # App layout wrapper
│   ├── data/
│   │   └── genes_human.csv      # Gene dataset
│   ├── types/
│   │   └── gene.types.ts        # TypeScript type definitions
│   ├── utils/
│   │   └── csvParser.ts         # CSV parsing utilities
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Global styles
│   ├── main.tsx                 # Application entry point
│   └── ThemeProvider.tsx        # Theme configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
└── README.md                   # This file
```

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Mantine** - Modern React components library
- **ECharts** - Interactive charting library
- **Papa Parse** - CSV parsing library
- **Axios** - HTTP client for data fetching

## 📊 Data Structure

The application works with human gene data stored in CSV format. Each gene record contains:

```typescript
interface Gene {
  ensembl: string; // Ensembl gene ID
  geneSymbol: string | null; // Gene symbol (e.g., "BRCA1")
  name: string | null; // Full gene name
  biotype: string; // Gene type (e.g., "Protein Coding")
  chromosome: string | number; // Chromosome number
  seqRegionStart: number; // Start position on chromosome
  seqRegionEnd: number; // End position on chromosome
}
```

## 🎨 Key Components

### GeneTable

- Displays gene data in a sortable, filterable table
- Supports row selection with radio buttons
- Includes custom cell renderers for different data types
- Responsive design with sticky headers

### GeneDetailView

- Shows detailed information about selected genes
- Calculates real-time statistics (gene length, position percentile, etc.)
- Displays interactive charts and visualizations
- Provides external links to gene databases

### ChromosomeDensityChart

- Visualizes gene density across chromosomes
- Interactive scatter plot with tooltips
- Color-coded by chromosome and gene type

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Run TypeScript type checking

# Testing (if configured)
npm run test         # Run tests
npm run test:coverage # Run tests with coverage
```

## 🌐 Browser Support

This application supports all modern browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Design

The application is fully responsive and works on:

- **Desktop** (1200px+): Full layout with side-by-side table and detail view
- **Tablet** (768px - 1199px): Stacked layout with full-width components
- **Mobile** (320px - 767px): Optimized for touch interaction

## 🎯 Usage Guide

### Basic Navigation

1. **Browse Genes**: Use the table to scroll through gene data
2. **Search**: Use the global filter to search across all columns
3. **Sort**: Click column headers to sort data
4. **Select**: Click on any row to view detailed gene information
5. **Theme**: Use the sun/moon icon in the header to toggle themes

### Gene Details

When you select a gene, the detail panel shows:

- **Basic Information**: Gene symbol, name, and identifiers
- **Genomic Location**: Chromosome, coordinates, and length
- **Statistics**: Position percentile, gene density, and comparisons
- **Visualizations**: Interactive charts showing gene context

## 🏗️ Build for Production (Local)

If you want to build the project for production locally:

```bash
npm run build
```

This creates a `dist` folder with optimized production files that you can serve locally or use for testing.

## 🔍 Troubleshooting

### Common Issues

**1. Port already in use**

```bash
# Kill process on port 5173
npx kill-port 5173
# or use a different port
npm run dev -- --port 3000
```

**2. Node version issues**

```bash
# Check Node version
node --version

# Use nvm to switch versions
nvm use 18
```

**3. Dependencies issues**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. TypeScript errors**

```bash
# Run type checking
npm run type-check

# Fix linting issues
npm run lint:fix
```

## 🤝 Development

### Local Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Ensure all linting passes (`npm run lint`)
- Update documentation as needed
- Test changes locally before committing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **datavisyn** for providing the coding challenge
- **Mantine** team for the excellent UI components
- **ECharts** for the powerful charting capabilities
- **React** community for the amazing ecosystem

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review the code and documentation
3. Ensure all dependencies are properly installed
4. Check that you're using the correct Node.js version

---

**Happy coding! 🧬✨**
