# GenesVA Backend

FastAPI backend for GenesVA gene visualization application.

## Features

- FastAPI with Python 3.13
- PostgreSQL database with SQLAlchemy
- Docker support
- uv package manager
- Linting with ruff
- Pre-commit hooks

## Development

Install dependencies:
```bash
uv sync
```

Run the development server:
```bash
uv run uvicorn app.main:app --reload
```

Run with Docker:
```bash
docker-compose up
```

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /api/v1/test` - Test endpoint