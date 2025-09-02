# GenesVA Backend API 🧬

A FastAPI backend for the GenesVA gene visualization application. Provides RESTful endpoints for gene data with search, filtering, and statistics functionality.

## 🚀 Quick Start

### Prerequisites

- **Python 3.13+**
- **Docker & Docker Compose**
- **Git**

### 1. Clone and Setup

```bash
# Clone the project ONLY if you have not cloned the frontend
git clone <your-repo-url>
cd genesva-frontend/backend

# If you have already cloned genesva-frontend
cd backend

# Install dependencies with uv
make dev        # Installs all dependencies including dev tools
```

### 2. Start the Database

```bash
# Start PostgreSQL with Docker
make docker-up

# Initialize database tables
make db-init

# Import gene data (CRITICAL - required for API to work!)
make seed-data
```

### 3. Run the API Server

```bash
# Start development server with auto-reload
make run
```

**🎉 Your API is now running at: http://localhost:8000**

- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📊 What You Get

### Complete Gene API

- **57,000+ human genes** imported from CSV
- **Search by symbol**: `/api/v1/genes/search/symbol/BRCA1`
- **Search by Ensembl ID**: `/api/v1/genes/search/ensembl/ENSG00000139618`
- **Search by name**: `/api/v1/genes/search/name/tumor protein`
- **Filter by chromosome/biotype**: `/api/v1/genes/?chromosome=17&biotype=protein_coding`
- **Statistics**: `/api/v1/genes/stats/summary`

### Example API Response

```json
{
  "id": 1,
  "ensembl": "ENSG00000139618",
  "gene_symbol": "BRCA2",
  "name": "BRCA2 DNA repair associated",
  "biotype": "protein_coding",
  "chromosome": "13",
  "seq_region_start": 32315474,
  "seq_region_end": 32400266
}
```

## 🛠️ Development Commands

| Command            | Description                                    |
| ------------------ | ---------------------------------------------- |
| `make dev`         | Install all dependencies (including dev tools) |
| `make run`         | Start development server with auto-reload      |
| `make docker-up`   | Start PostgreSQL database                      |
| `make docker-down` | Stop all Docker services                       |
| `make seed-data`   | Import 57K+ genes from CSV **_(REQUIRED!)_**   |
| `make test`        | Run all unit tests (33 tests)                  |
| `make lint`        | Check code with ruff linter                    |
| `make format`      | Format code with ruff                          |
| `make typecheck`   | Run mypy type checking                         |

## 🗃️ Database Setup

### First Time Setup (New Developers)

```bash
# 1. Start database
make docker-up

# 2. Create tables
make db-init

# 3. Import gene data (THIS IS CRITICAL!)
make seed-data
```

**⚠️ Important**: The `make seed-data` step is **required**. Without it:

- API returns empty results `[]`
- Frontend shows "0 genes loaded"
- Search endpoints return no data

### Database Schema

```sql
-- genes table structure
CREATE TABLE genes (
    id SERIAL PRIMARY KEY,
    ensembl VARCHAR(50) NOT NULL,
    gene_symbol VARCHAR(50),
    name TEXT,
    biotype VARCHAR(50) NOT NULL,
    chromosome VARCHAR(10) NOT NULL,
    seq_region_start INTEGER NOT NULL,
    seq_region_end INTEGER NOT NULL
);
```

## 🧪 Testing

### Run Tests

```bash
make test                    # Run all 33 tests
make test | grep PASSED     # See passing tests
make test | grep FAILED     # See failing tests
```

### Test Coverage

- **33 comprehensive tests** covering all API endpoints
- **86% code coverage** of core functionality
- Tests for search, filtering, pagination, error handling
- In-memory SQLite for fast testing

### Test Categories

- **API Tests**: Endpoint responses, pagination, filtering
- **Search Tests**: Symbol/name/Ensembl ID searches
- **Model Tests**: Database operations, field validation
- **Stats Tests**: Gene count and metadata endpoints

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/v1/            # API endpoints
│   │   ├── genes.py       # Gene CRUD operations
│   │   └── router.py      # Route configuration
│   ├── core/              # Core functionality
│   │   ├── config.py      # App configuration
│   │   ├── database.py    # Database connection
│   │   └── init_db.py     # Database initialization
│   ├── models/            # SQLAlchemy models
│   │   └── gene.py        # Gene database model
│   ├── schemas/           # Pydantic schemas
│   │   └── gene.py        # Gene API schemas
│   ├── scripts/           # Utility scripts
│   │   └── import_genes.py # CSV import script
│   └── main.py           # FastAPI application
├── tests/                # Unit tests
├── data/                 # Gene CSV data
├── docker-compose.yml    # Docker services
├── Makefile             # Development commands
└── pyproject.toml       # Python dependencies
```

## 🌐 API Endpoints Reference

### Basic Operations

```bash
GET  /                           # API info
GET  /health                     # Health check
GET  /api/v1/genes/             # List genes (with pagination)
GET  /api/v1/genes/{id}         # Get gene by ID
```

### Search Operations

```bash
GET  /api/v1/genes/search/symbol/{symbol}     # Search by gene symbol
GET  /api/v1/genes/search/ensembl/{ensembl}   # Get by Ensembl ID
GET  /api/v1/genes/search/name/{name}         # Search by gene name
```

### Statistics

```bash
GET  /api/v1/genes/stats/summary              # Get gene statistics
```

### Query Parameters

```bash
# Pagination
?skip=0&limit=100

# Filtering
?chromosome=17&biotype=protein_coding

# Search options
?exact=true                      # For exact matches
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/genesva
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=genesva

# API
API_V1_STR=/api/v1
PROJECT_NAME="GenesVA Backend API"
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

### Docker Services

The `docker-compose.yml` provides:

- **PostgreSQL 15** database on port 5432
- **Persistent data** storage in Docker volume
- **Development-friendly** configuration

## 🚨 Common Issues & Solutions

### "No genes found" / Empty API responses

**Problem**: Frontend shows 0 genes, API returns `[]`
**Solution**: Run `make seed-data` to import gene data

### "Connection refused" errors

**Problem**: Can't connect to database
**Solution**: Run `make docker-up` to start PostgreSQL

### "Module not found" errors

**Problem**: Missing dependencies
**Solution**: Run `make dev` to install all dependencies

### Tests failing

**Problem**: Tests not passing
**Solution**: Ensure clean environment with `make docker-down && make docker-up`

### Port 8000 already in use

**Problem**: Another service using port 8000
**Solution**: Stop other services or change port in `make run`

## 🔄 Development Workflow

### Daily Development

```bash
# 1. Start your day
make docker-up              # Start database
make run                   # Start API server

# 2. Make changes to code
# ... edit Python files ...

# 3. Test your changes
make test                  # Run tests
make lint                  # Check code style

# 4. Before committing
make format                # Format code
make test                  # Final test run
```

### Adding New Features

1. **Write tests first** in `tests/`
2. **Implement feature** in `app/`
3. **Run tests** with `make test`
4. **Check code style** with `make lint`
5. **Format code** with `make format`

## 🤝 Team Collaboration

### New Team Member Setup

```bash
# Complete setup for new developers
git clone <repo-genesva-frontend>
cd backend
make dev                   # Install dependencies
make docker-up             # Start database
make db-init              # Create tables
make seed-data            # Import data (CRITICAL!)
make test                 # Verify everything works
make run                  # Start development server
```

### Before Pushing Code

```bash
make test                 # All tests must pass
make lint                 # Code must be clean
make format               # Code must be formatted
```
