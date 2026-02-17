# API Documentation - AI Data Steward

## Overview

This document describes the REST API for the AI Data Steward platform. The API provides endpoints for dataset upload, quality analysis, rule management, and AI-powered assistance.

**Base URL**: `http://localhost:8080` (development)

**Current Version**: v1 (MVP)

## Authentication

> [!NOTE]
> Authentication is not yet implemented. All endpoints are currently public.

## Common Response Formats

### Success Response
```json
{
  "data": { ... }
}
```

### Error Response
```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "details": { /* optional additional info */ }
  }
}
```

---

## Endpoints Reference

### Health & Monitoring

#### `GET /health`

Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "time": "2024-01-15T10:30:00.000Z",
  "name": "ai-data-steward"
}
```

**Status**: `200 OK`

---

#### `GET /ready`

Readiness probe with dependency checks.

**Response**:
```json
{
  "ready": true,
  "deps": {
    "redis": "ok"
  }
}
```

**Status**:
- `200 OK` - Service ready
- `503 Service Unavailable` - Not ready (production only)

---

### Dataset Management

#### `POST /api/upload`

Upload a CSV or XLSX file for analysis.

**Request**:
- Content-Type: `multipart/form-data`
- Field `file`: CSV or XLSX file (max 50MB)

**Response**:
```json
{
  "datasetId": "ds_abc123xyz"
}
```

**Status Codes**:
- `201 Created` - Upload successful
- `400 Bad Request` - No file provided
- `415 Unsupported Media Type` - Invalid file type
- `413 Payload Too Large` - File exceeds 50MB

---

#### `GET /api/datasets`

List all datasets.

**Response**:
```json
{
  "datasets": [
    {
      "id": "ds_abc123xyz",
      "filename": "clientes.csv",
      "size": 15360,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "status": "ready",
      "summary": {
        "rows": 150,
        "columns": 8,
        "issues": 12
      }
    }
  ]
}
```

---

#### `GET /api/datasets/:id`

Get dataset metadata.

**Parameters**:
- `id` (path) - Dataset ID

**Response**:
```json
{
  "id": "ds_abc123xyz",
  "filename": "clientes.csv",
  "size": 15360,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "status": "ready",
  "summary": {
    "rows": 150,
    "columns": 8,
    "issues": 12
  }
}
```

**Status Codes**:
- `200 OK` - Success
- `404 Not Found` - Dataset not found

**Dataset Status Values**:
- `new` - Just uploaded
- `processing` - Being analyzed
- `ready` - Analysis complete
- `error` - Processing failed

---

#### `DELETE /api/datasets/:id`

Delete a dataset and its files. This action cascades to delete all associated issues, fixes, and analysis results.

**Parameters**:
- `id` (path) - Dataset ID

**Response**:
```json
{
  "deleted": true
}
```

**Status Codes**:
- `200 OK` - Deleted
- `404 Not Found` - Dataset not found

---

### Issues Detection

#### `GET /api/datasets/:id/issues`

Get detected data quality issues for a dataset.

**Parameters**:
- `id` (path) - Dataset ID

**Response**:
```json
{
  "issues": [
    {
      "kind": "email_invalid",
      "severity": "error",
      "row": 2,
      "col": "email",
      "details": {
        "value": "maria.garcia@",
        "reason": "Incomplete email domain"
      }
    },
    {
      "kind": "phone_invalid",
      "severity": "warn",
      "row": 6,
      "col": "telefono",
      "details": {
        "value": "600234567",
        "reason": "Missing country code"
      }
    }
  ]
}
```

**Issue Kinds**:
- `email_invalid` - Invalid email format
- `phone_invalid` - Invalid phone number
- `duplicate` - Duplicate record
- `date_format` - Inconsistent date format
- `currency` - Currency format issue
- `price_zero` - Zero price value
- `price_negative` - Negative price
- `id_missing` - Missing ID field
- `missing_value` - Required field empty
- `inconsistent_case` - Case inconsistency
- `whitespace` - Extra whitespace
- `special_chars` - Invalid special characters

**Severity Levels**:
- `error` - Critical issue
- `warn` - Warning
- `info` - Informational

---

### Fixes

#### `POST /api/datasets/:id/fixes/preview`

Preview fix suggestions without applying them.

**Parameters**:
- `id` (path) - Dataset ID

**Request Body**:
```json
{
  "ruleIds": ["rule_xyz"],
  "limit": 50
}
```

**Response**:
```json
{
  "previews": [
    {
      "row": 2,
      "col": "email",
      "before": "maria.garcia@",
      "after": "maria.garcia@example.com",
      "ruleId": null,
      "explanation": "Complete email domain with example.com"
    }
  ]
}
```

---

#### `POST /api/datasets/:id/fixes/apply`

Apply fixes to dataset.

**Parameters**:
- `id` (path) - Dataset ID

**Request Body**:
```json
{
  "ruleIds": ["rule_xyz"],
  "autoApply": false
}
```

**Response**:
```json
{
  "applied": 8,
  "rejected": 2
}
```

---

### Rules Management

#### `GET /api/rules`

List all data quality rules.

**Response**:
```json
{
  "rules": [
    {
      "id": "rule_abc123",
      "name": "Spanish Phone Validator",
      "kind": "phone_es",
      "spec": {
        "countryCode": "+34",
        "length": 9
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### `GET /api/rules/:id`

Get single rule.

**Parameters**:
- `id` (path) - Rule ID

**Response**: Single rule object

**Status Codes**:
- `200 OK`
- `404 Not Found`

---

#### `POST /api/rules`

Create a new rule.

**Request Body**:
```json
{
  "name": "Email Validator",
  "kind": "email",
  "spec": {
    "pattern": "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
  }
}
```

**Response**: Created rule object with `id` and `createdAt`

**Status**: `201 Created`

**Rule Kinds**:
- `regex` - Regular expression validation
- `numeric` - Numeric range validation
- `date` - Date format validation
- `map` - Value mapping/substitution
- `phone_es` - Spanish phone validation
- `email` - Email validation
- `enum` - Enumerated values
- `required` - Required field check
- `unique` - Uniqueness check

---

#### `PUT /api/rules/:id`

Update a rule.

**Parameters**:
- `id` (path) - Rule ID

**Request Body**: Partial rule object

**Response**: Updated rule object with `updatedAt`

---

#### `DELETE /api/rules/:id`

Delete a rule.

**Parameters**:
- `id` (path) - Rule ID

**Response**:
```json
{
  "deleted": true
}
```

---
 
 ### Privacy & Consent
 
 #### `POST /api/consent`
 
 Log user consent for cookies and data processing.
 
 **Request Body**:
 ```json
 {
   "acceptedAt": "2024-01-15T10:30:00.000Z",
   "userAgent": "Mozilla/5.0 ..."
 }
 ```
 
 **Response**:
 ```json
 {
   "success": true
 }
 ```
 
 **Status Codes**:
 - `200 OK`
 - `400 Bad Request`
 
 ---

### AI Assistance

> [!IMPORTANT]
> AI endpoints currently use a deterministic mock provider.
> Set `LLM_PROVIDER=mock` in environment.

#### `POST /api/assist/classify`

Classify a column header to determine its data type.

**Request Body**:
```json
{
  "headerName": "telefono",
  "examples": ["600123456", "655987654"]
}
```

**Response**:
```json
{
  "type": "phone_es",
  "confidence": 0.88,
  "rationaleShort": "Column name suggests Spanish phone numbers"
}
```

**Status Codes**:
- `200 OK` - Success
- `501 Not Implemented` - LLM provider not configured

---

#### `POST /api/assist/explain`

Get explanation and recommendation for an issue.

**Request Body**:
```json
{
  "issue": {
    "kind": "email_invalid",
    "severity": "error",
    "row": 2,
    "col": "email",
    "details": {}
  }
}
```

**Response**:
```json
{
  "explanation": "The email address does not follow the standard format...",
  "recommendation": "Verify the email with the data source..."
}
```

---

#### `POST /api/assist/rag`

Query documentation using RAG (Retrieval Augmented Generation).

**Request Body**:
```json
{
  "query": "How do I configure RGPD compliance?"
}
```

**Response**:
```json
{
  "answer": "RGPD compliance involves...",
  "sources": ["SEC_RGPD.md", "ARCH.md"]
}
```

---

## Rate Limiting

Current limit: **100 requests/minute per IP**

When exceeded:
```json
{
  "error": {
    "message": "Rate limit exceeded. Please slow down your requests.",
    "code": "RATE_LIMIT_EXCEEDED",
    "statusCode": 429
  }
}
```

---

## CORS

Allowed origins:
- `http://localhost:5173` (development frontend)
- Production origin (configured via `API_CORS_ORIGIN` env var)

---

## Error Codes Reference

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed (includes `details` with field errors) |
| `DATASET_NOT_FOUND` | Dataset ID not found |
| `RULE_NOT_FOUND` | Rule ID not found |
| `NO_FILE` | No file provided in upload |
| `UNSUPPORTED_FILE_TYPE` | File type not CSV/XLSX |
| `LLM_NOT_CONFIGURED` | LLM provider not available |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Internal server error |

---

## Development Guide

### Adding a New Route

1. **Create Service** (`src/domain/services/`)
   ```typescript
   export async function myFunction(params) {
     // Business logic
     return result;
   }
   ```

2. **Define DTO Schemas** (`src/domain/dto.ts`)
   ```typescript
   export const MyRequestSchema = z.object({
     field: z.string(),
   });
   ```

3. **Create Route** (`src/routes/my-route.ts`)
   ```typescript
   import { validateBody } from '../lib/validation.js';
   import * as myService from '../domain/services/my.service.js';

   export default async function myRoutes(fastify: FastifyInstance) {
     fastify.post('/api/my-endpoint', async (request, reply) => {
       const body = validateBody(MyRequestSchema, request.body);
       const result = await myService.myFunction(body);
       return result;
     });
   }
   ```

4. **Register Route** (`src/app.ts`)
   ```typescript
   import myRoutes from './routes/my-route.js';
   await app.register(myRoutes);
   ```

5. **Add Tests** (`src/tests/my-route.test.ts`)
   ```typescript
   describe('My Route', () => {
     it('should work', async () => {
       // Test implementation
     });
   });
   ```

6. **Update Documentation** (this file)

### Running Tests

```bash
# Run all tests
npm test --workspace=apps/api

# Run specific test
npm test --workspace=apps/api -- health.e2e.test

# With coverage
npm test --workspace=apps/api -- --coverage
```

### Local Development

```bash
# Start API in watch mode
npm run dev --workspace=apps/api

# Or use make command from root
make dev
```

---

## Future Enhancements

- [ ] Authentication & Authorization (JWT)
- [ ] Webhook support
- [ ] Batch operations
- [ ] Export to Google Sheets
- [ ] Real-time progress updates (WebSocket)
- [ ] API versioning (`/v1`, `/v2`)

---

## Support

For API questions and issues:
- GitHub Issues: [Project Repository](#)
- Documentation: `/docs`
