.PHONY: help install dev run build clean lint format typecheck test docker-up docker-down docker-build db-init seed-data

help:
	@echo "Available commands:"
	@echo "  install     - Install dependencies"
	@echo "  dev         - Install dev dependencies"
	@echo "  run         - Run development server"
	@echo "  lint        - Check code with ruff"
	@echo "  format      - Format code with ruff"
	@echo "  fix         - Auto-fix linting issues"
	@echo "  typecheck   - Run mypy type checking"
	@echo "  test        - Run tests"
	@echo "  clean       - Clean up files"
	@echo "  docker-up   - Start Docker services"
	@echo "  docker-down - Stop Docker services"
	@echo "  docker-build- Build Docker images"
	@echo "  db-init     - Initialize database tables"
	@echo "  seed-data   - Import gene data from CSV"
	@echo "  precommit   - Run pre-commit on all files"

install:
	uv sync

dev:
	uv sync --extra dev

run:
	uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

lint:
	uv run ruff check app/

format:
	uv run ruff format app/

fix:
	uv run ruff check --fix app/

typecheck:
	uv run mypy app/

test:
	uv run pytest

clean:
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf .pytest_cache
	rm -rf .mypy_cache
	rm -rf .coverage
	rm -rf htmlcov

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-build:
	docker-compose build

db-init:
	docker-compose run --rm backend uv run python -m app.core.init_db

seed-data:
	docker-compose run --rm backend uv run python app/scripts/import_genes.py data/genes_human.csv

precommit:
	uv run pre-commit run --all-files

all: dev lint format typecheck