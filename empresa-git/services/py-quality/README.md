# Python Quality Service

AI Data Steward - Python microservice for data quality detection and fixing.

## Features

- 📊 **Schema Inference**: Automatic type detection for columns (email, phone, dates, currency, etc.)
- 🔍 **Issue Detection**: 8 detector types (email, phone_es, dates, currency, duplicates, price, ID/SKU, NIF/CIF)
- 🔧 **Data Normalization**: 4 normalizers (phone, dates, currency, text)
- 🛠️ **Fix Preview & Apply**: Preview changes before applying, generate clean datasets
- 🚀 **Fast API**: FastAPI with automatic OpenAPI documentation
- ✅ **Deterministic**: No external dependencies, reproducible results

## Supported Issue Types

| Issue Kind | Description | Severity |
|-----------|-------------|----------|
| `email_invalid` | Invalid email format | ERROR |
| `phone_invalid` | Missing +34 or invalid format | WARN/ERROR |
| `duplicate` | Fuzzy duplicate detection | WARN |
| `date_format` | Inconsistent date formats | WARN |
| `currency` | Currency parsing issues | ERROR |
| `price_zero` | Zero price values | WARN |
| `price_negative` | Negative prices | ERROR |
| `id_missing` | Empty ID fields | ERROR |
| `nif_cif_basic` | Invalid NIF/CIF pattern | WARN |

## Quick Start

### Installation

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Or with dev dependencies
make install-dev

# Copy environment file
cp .env.example .env
```

### Run Locally

```bash
# Start development server (with auto-reload)
make dev

# Server will start at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Run Tests

```bash
# Run all tests
make test

# With coverage
make test-cov
```

## API Endpoints

### Health & Version
- `GET /health` - Health check
- `GET /version` - Version and commit info

### Data Quality Operations
- `POST /infer` - Infer schema and column types
- `POST /detect_issues` - Detect data quality issues
- `POST /preview_fixes` - Preview proposed fixes
- `POST /apply_fixes` - Apply fixes and generate clean file

## Usage Examples

### 1. Infer Schema

```bash
curl -X POST http://localhost:8000/infer \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "/path/to/data.csv",
    "file_type": "csv"
  }'
```

Response:
```json
{
  "columns": [
    {
      "name": "email",
      "inferred_type": "email",
      "confidence": 0.95,
      "sample": ["user@example.com", "..."],
      "missing_pct": 2.5,
      "unique_count": 48
    }
  ],
  "kpis": {
    "rows": 50,
    "cols": 6,
    "empties_pct": 3.2,
    "duplicates_suspected": 2
  },
  "warnings": []
}
```

### 2. Detect Issues

```bash
curl -X POST http://localhost:8000/detect_issues \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "/path/to/data.csv",
    "file_type": "csv"
  }'
```

Response:
```json
{
  "issues": [
    {
      "kind": "email_invalid",
      "severity": "error",
      "row": 2,
      "col": "email",
      "details": {
        "value": "maria@",
        "reason": "Email format invalid"
      }
    }
  ],
  "summary": {
    "total_issues": 12,
    "by_kind": {"email_invalid": 3, "phone_invalid": 4},
    "by_severity": {"error": 5, "warn": 7}
  }
}
```

### 3. Preview Fixes

```bash
curl -X POST http://localhost:8000/preview_fixes \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "/path/to/data.csv",
    "file_type": "csv"
  }'
```

### 4. Apply Fixes

```bash
curl -X POST http://localhost:8000/apply_fixes \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "/path/to/data.csv",
    "file_type": "csv"
  }'
```

Response:
```json
{
  "applied": 8,
  "rejected": 2,
  "file_clean_path": "/path/to/clean_data.csv",
  "summary": {
    "total_issues": 10,
    "original_rows": 50,
    "clean_rows": 48
  }
}
```

## Configuration

Environment variables (`.env`):

```bash
# Server
QUALITY_PORT=8000
QUALITY_HOST=0.0.0.0

# Storage
QUALITY_TMP_DIR=./.quality_tmp

# Phone validation
PHONE_CC=+34
PHONE_LENGTH=9

# Duplicates detection
DUP_THRESHOLD=0.90
DUP_KEY_COLUMNS=nombre,email

# Preview limits
PREVIEW_MAX_ROWS=100
```

## Project Structure

```
app/
├── detectors/       # Issue detectors (email, phone, dates, etc.)
├── normalizers/     # Data normalizers (phone, dates, currency, text)
├── services/        # Business logic (infer, issues, fixes)
├── routers/         # FastAPI routes
├── schemas/         # Pydantic models (DTOs, types)
├── utils/           # Utilities (hashing, ID gen, sampling)
├── config.py        # Configuration
├── io_utils.py      # CSV/XLSX I/O
└── main.py          # FastAPI app

tests/               # Test suite
```

## Development

```bash
# Format code
make fmt

# Run linter
ruff check .

# Clean temp files
make clean
```

## Integration with Node.js API

This service is designed to be called from the Node.js API (Prompt 2):

```typescript
// From apps/api
const response = await fetch('http://localhost:8000/detect_issues', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    file_path: '/path/to/dataset.csv',
    file_type: 'csv'
  })
});
```

## Performance

- **1K rows**: < 1s
- **10K rows**: < 10s
- **50K rows**: < 180s target

Large files are chunked automatically for preview operations.

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
