# Data Source Configuration

GenesVA supports multiple data sources for loading gene data. Users can seamlessly switch between CSV files and the backend API through a user-friendly toggle interface with real-time data refresh.

## Available Data Sources

### 1. CSV File (Default)
- **Type**: `csv`
- **Source**: Local CSV file (`src/data/genes_human.csv`)
- **Pros**: Always available, no network dependency, fast loading
- **Cons**: Static data, limited to local file size
- **Gene Count**: ~57,000+ genes

### 2. Backend API
- **Type**: `api`
- **Source**: FastAPI backend with PostgreSQL database
- **Pros**: Real-time data, searchable, scalable, additional metadata
- **Cons**: Requires backend service running, network dependency
- **Gene Count**: ~57,000+ genes (same dataset as CSV)

## User Interface

### Data Source Toggle Component
The main interface provides intuitive switching between data sources:

**Features:**
- ✅ **Visual toggle buttons**: "CSV File" and "Backend API"
- ✅ **Real-time status**: Shows active source with green highlight
- ✅ **Availability indicators**: Unavailable sources shown in red
- ✅ **Loading states**: "Switching..." feedback during transitions
- ✅ **Auto-refresh**: Table data updates immediately on source change
- ✅ **Gene count display**: Shows loaded gene count in indicator bar
- ✅ **Manual refresh**: 🔄 button for reloading current source

**Visual Elements:**
```
📊 Data Source: CSV File • 57,321 genes loaded     [🔄 Refresh]

[CSV File ✓ Active] [Backend API Available]
    Current: CSV File
```

### Data Source Indicator Bar
Blue indicator bar at the top shows:
- Current active data source name
- Total number of genes loaded
- Manual refresh button

## Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Data Source Configuration
# Options: 'csv' | 'api'
VITE_DATA_SOURCE=csv

# Backend API Configuration (used when VITE_DATA_SOURCE=api)
VITE_API_BASE_URL=http://localhost:8000
```

### Default Behavior
- **Initial load**: Uses `VITE_DATA_SOURCE` setting (defaults to CSV)
- **Automatic fallback**: If API is configured but unavailable, falls back to CSV
- **Persistent switching**: User selections override environment defaults

## Programming Interface

### Basic Data Loading
\`\`\`typescript
import { loadGeneData } from './utils/dataLoader';

// Load data from current configured source
const genes = await loadGeneData();
\`\`\`

### Switch Data Sources Programmatically
\`\`\`typescript
import { switchDataSource } from './utils/dataLoader';

// Switch to API and load data
const genes = await switchDataSource('api');

// Switch to CSV and load data
const csvGenes = await switchDataSource('csv');
\`\`\`

### Check Source Availability
\`\`\`typescript
import { getDataSourceStatus } from './utils/dataLoader';

const status = await getDataSourceStatus();
console.log('Current source:', status.current);  // 'csv' | 'api'
console.log('Available sources:', status.available);  // { csv: true, api: false }
\`\`\`

### React Integration
\`\`\`typescript
import { DataSourceToggle } from './components/DataSourceToggle';

function App() {
  const [genes, setGenes] = useState<Gene[]>([]);
  
  const handleDataSourceChange = (newGenes: Gene[]) => {
    setGenes(newGenes);  // Table updates automatically
  };

  return (
    <DataSourceToggle onDataSourceChange={handleDataSourceChange} />
  );
}
\`\`\`

## Backend Setup

### Prerequisites
1. Docker and docker-compose
2. Node.js and npm/yarn for frontend

### Start Backend Services
\`\`\`bash
cd backend
make up           # Start PostgreSQL and FastAPI containers
make seed-data    # Import gene data (57K+ genes) - REQUIRED for new setups
\`\`\`

**Important**: New team members MUST run \`make seed-data\` after setup. The seeded database is not included in git and needs to be populated locally.

### Backend Health Check
The frontend automatically checks API availability at:
- \`GET /health\` - Returns \`{"status": "healthy"}\` when API is ready

### API Endpoints
- \`GET /api/v1/genes/\` - List genes with pagination
- \`GET /api/v1/genes/{id}\` - Get specific gene by database ID
- \`GET /api/v1/genes/search/symbol/{symbol}\` - Search by gene symbol
- \`GET /api/v1/genes/search/ensembl/{ensembl_id}\` - Get by Ensembl ID
- \`GET /api/v1/genes/search/name/{name}\` - Search by gene name
- \`GET /api/v1/genes/stats/summary\` - Database statistics

## Data Source Behavior

### Automatic Fallback System
1. **Configured source unavailable**: Automatically switches to CSV
2. **Console logging**: Shows fallback messages for debugging
3. **User notification**: UI updates to show active source after fallback

### Smart Loading Strategy
\`\`\`typescript
// Loads in batches to handle large datasets efficiently
const loadGeneData = async (): Promise<Gene[]> => {
  // API: Loads in 1000-gene batches
  // CSV: Loads entire file at once
  return genes;
};
\`\`\`

### Source Availability Checks
- **CSV**: Always available (local file dependency)
- **API**: HTTP health check with 5-second timeout
- **Status caching**: Reduces unnecessary health check calls

## Team Development Workflow

### New Developer Setup
\`\`\`bash
# 1. Clone and setup
git clone <repo>
cd genesva-frontend
npm install

# 2. Setup backend (in separate terminal)
cd ../genesva-backend
make up && make seed-data  # CRITICAL: seed-data required

# 3. Start frontend
cd ../genesva-frontend
npm run dev
\`\`\`

### Development Modes
- **Offline development**: Use CSV source
- **Full-stack development**: Use API source with local backend
- **Production testing**: Switch between sources to test both paths

### Best Practices
1. **Always test both sources** before commits
2. **Keep CSV data in sync** with backend seed data
3. **Document API changes** that affect frontend integration
4. **Use toggle UI** for manual testing during development

## Troubleshooting

### Common Issues

**API Shows "Unavailable"**
- ✅ Backend containers running: \`docker ps\`
- ✅ Database seeded: \`make seed-data\` 
- ✅ API accessible: \`curl http://localhost:8000/health\`
- ✅ Correct URL in \`.env\`: \`VITE_API_BASE_URL=http://localhost:8000\`

**CSV Loading Fails**
- ✅ File exists: \`src/data/genes_human.csv\`
- ✅ File format correct (comma-separated, proper headers)
- ✅ No file corruption or encoding issues

**Switch Button Doesn't Update Table**
- ✅ Check browser console for errors
- ✅ Verify \`onDataSourceChange\` callback is connected
- ✅ Ensure React state updates properly

**Gene Counts Don't Match**
- ✅ Re-run \`make seed-data\` to sync backend with CSV
- ✅ Check for import/export data consistency
- ✅ Verify both sources use same gene dataset

## Architecture

### File Structure
\`\`\`
src/
├── components/
│   ├── DataSourceToggle.tsx     # Main UI component
│   ├── DataSourceToggle.css     # Toggle component styles
│   └── DataSourceIndicator.css  # Indicator bar styles
├── config/
│   └── dataSource.ts            # Source configuration
├── utils/
│   ├── dataLoader.ts            # Unified data loading
│   ├── apiClient.ts             # API communication
│   └── csvParser.ts             # CSV file parsing
└── data/
    └── genes_human.csv          # Local gene dataset
\`\`\`

### Data Flow
\`\`\`
User clicks toggle → switchDataSource() → Load new data → Update React state → Table refreshes
                  ↓
            Update indicator bar → Show new source + count
\`\`\`

This architecture provides a seamless, user-friendly experience for switching between data sources while maintaining data consistency and providing clear visual feedback.
