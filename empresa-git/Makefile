.PHONY: help install dev up down logs build test fmt lint typecheck seed clean

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	@pnpm install

dev: ## Start development servers (web + api) without Docker
	@echo "🚀 Starting development servers..."
	@if [ ! -f .env ]; then cp .env.example .env; echo "✅ Created .env from .env.example"; fi
	@pnpm run dev

up: ## Start all services with Docker Compose
	@echo "🐳 Starting Docker services..."
	@if [ ! -f .env ]; then cp .env.example .env; echo "✅ Created .env from .env.example"; fi
	@docker compose up -d --build
	@echo "✅ Services started. Web: http://localhost:5173, API: http://localhost:8080"

down: ## Stop and remove Docker containers and volumes
	@echo "🛑 Stopping Docker services..."
	@docker compose down -v

logs: ## Show Docker logs
	@docker compose logs -f

build: ## Build all applications
	@echo "🔨 Building applications..."
	@npm run build

test: ## Run tests (placeholder)
	@echo "🧪 Running tests..."
	@echo "⚠️  Test suite not yet implemented"

fmt: ## Format code with Prettier
	@echo "✨ Formatting code..."
	@npm run fmt

lint: ## Run ESLint
	@echo "🔍 Linting code..."
	@npm run lint

lint:fix: ## Fix linting issues
	@echo "🔧 Fixing linting issues..."
	@npm run lint:fix

typecheck: ## Run TypeScript type checking
	@echo "📝 Type checking..."
	@npm run typecheck

seed: ## Seed database (placeholder)
	@echo "🌱 Seeding database..."
	@echo "⚠️  Database seeding not yet implemented"

clean: ## Clean build artifacts and dependencies
	@echo "🧹 Cleaning..."
	@rm -rf node_modules apps/*/node_modules apps/*/dist services/*/node_modules
	@rm -rf apps/*/.vite
	@echo "✅ Cleaned"
