.PHONY: dev test fmt clean

dev:
	uvicorn app.main:app --reload --host $${QUALITY_HOST:-0.0.0.0} --port $${QUALITY_PORT:-8000}

test:
	pytest -v

test-cov:
	pytest --cov=app --cov-report=html --cov-report=term

fmt:
	ruff check --fix . || true
	black .
	isort .

clean:
	rm -rf .pytest_cache
	rm -rf .coverage
	rm -rf htmlcov
	rm -rf .ruff_cache
	rm -rf .quality_tmp
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete

install:
	pip install -r requirements.txt

install-dev:
	pip install -r requirements.txt
	pip install pytest pytest-asyncio httpx black isort ruff pytest-cov
