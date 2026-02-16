# LLM Integration - AI Data Steward

## Visión General

AI Data Steward utiliza Large Language Models (LLMs) para mejorar la detección y corrección de problemas de calidad de datos. El sistema está diseñado con un **driver multi-proveedor** que permite cambiar entre diferentes LLMs sin modificar el código.

## Arquitectura del Driver

```
┌────────────────────────────────────────┐
│         API (Orchestration)             │
└──────────────┬─────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│        LLM Driver (Abstract)             │
│  ┌────────────────────────────────────┐  │
│  │  interface LLMProvider {           │  │
│  │    analyze(data, rules): issues    │  │
│  │    suggest(issue): fix             │  │
│  │    validate(fix): confidence       │  │
│  │  }                                 │  │
│  └────────────────────────────────────┘  │
└───┬──────────┬──────────┬────────────┬──┘
    │          │          │            │
    ▼          ▼          ▼            ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  Mock  │ │ Gemini │ │ OpenAI │ │ Azure  │
└────────┘ └────────┘ └────────┘ └────────┘
```

## Proveedores Soportados

### 1. Mock (Default)

**Propósito**: Desarrollo y testing sin coste ni dependencias externas.

**Configuración**:
```env
LLM_PROVIDER=mock
```

**Comportamiento**:
- Devuelve sugerencias estáticas predefinidas
- Confianza siempre 0.5
- No realiza llamadas a APIs externas

**Ejemplo de implementación**:
```typescript
class MockLLMProvider implements LLMProvider {
  async analyze(data: string[], rules: Rule[]): Promise<Issue[]> {
    // Detección básica con regex
    return detectSimpleIssues(data);
  }

  async suggest(issue: Issue): Promise<Fix> {
    return {
      value: applySimpleRule(issue),
      confidence: 0.5,
      reasoning: "Mock suggestion"
    };
  }

  async validate(fix: Fix): Promise<number> {
    return 0.5;
  }
}
```

### 2. Google Gemini (Recommended)

**Propósito**: Integración con Gemini API para análisis avanzado.

**Configuración**:
```env
LLM_PROVIDER=gemini
LLM_API_KEY=your-gemini-api-key
LLM_MODEL=gemini-pro  # o gemini-1.5-pro
```

**Ventajas**:
- Multimodal (texto, imágenes, futuro)
- Contexto largo (hasta 1M tokens en Gemini 1.5)
- Excelente para análisis de datos estructurados
- Precio competitivo

**Ejemplo de prompt**:
```javascript
const prompt = `
Analyze the following CSV data and identify quality issues:

Headers: ${headers.join(', ')}
Rows: ${rows.slice(0, 10).map(r => r.join(',')).join('\n')}

Rules to apply:
${rules.map(r => `- ${r.name}: ${r.description}`).join('\n')}

Return issues in JSON format:
[
  {
    "row": <number>,
    "column": "<column_name>",
    "issue": "<description>",
    "severity": "critical|high|medium|low",
    "suggestedFix": "<value>",
    "confidence": <0-1>
  }
]
`;
```

### 3. OpenAI (GPT-4)

**Propósito**: Alternativa con GPT-4/GPT-3.5.

**Configuración**:
```env
LLM_PROVIDER=openai
LLM_API_KEY=sk-...
LLM_MODEL=gpt-4-turbo-preview  # o gpt-3.5-turbo
```

**Ventajas**:
- Ampliamente probado
- Function calling nativo
- Buena documentación

**Consideraciones**:
- Más costoso que Gemini
- Límites de contexto menores (128k en GPT-4 Turbo)

### 4. Azure OpenAI

**Propósito**: Cumplimiento empresarial estricto, deployment privado.

**Configuración**:
```env
LLM_PROVIDER=azure
LLM_API_KEY=your-azure-key
LLM_ENDPOINT=https://your-resource.openai.azure.com/
LLM_MODEL=gpt-4
LLM_DEPLOYMENT_NAME=your-deployment-name
```

**Ventajas**:
- SLA empresarial
- Datos permanecen en Azure
- Integración con Azure AD

## Casos de Uso

### 1. Detección de Anomalías

**Input**: CSV con columna "email"  
**LLM Task**: Identificar emails inválidos o sospechosos

**Prompt**:
```
Given these email addresses, identify which are invalid or suspicious:
- juan@example.com
- maria.garcia@  (incomplete domain)
- LUIS@EXAMPLE.COM  (all caps)
- ana@   (missing domain)

For each invalid email, suggest a correction if possible.
```

**Output**:
```json
[
  {
    "value": "maria.garcia@",
    "issue": "Incomplete domain",
    "suggestion": "maria.garcia@example.com",
    "confidence": 0.3,
    "note": "Domain assumed, low confidence"
  }
]
```

### 2. Normalización de Datos

**Input**: Fechas en múltiples formatos  
**LLM Task**: Convertir a formato ISO 8601

**Prompt**:
```
Normalize these dates to ISO 8601 format (YYYY-MM-DD):
- 15/02/2024
- Feb 15 2024
- 2024-02-15T10:30:00
- 15-Feb-24
```

**Output**:
```json
{
  "normalized": [
    "2024-02-15",
    "2024-02-15",
    "2024-02-15",
    "2024-02-15"
  ]
}
```

### 3. Corrección Contextual

**Input**: Texto con errores ortográficos en contexto empresarial  
**LLM Task**: Corregir manteniendo significado técnico

**Prompt**:
```
Correct spelling errors in this product name, preserving technical terms:
"Laptpo Dell XPS 13 con proceador Intel Core i7"
```

**Output**:
```json
{
  "original": "Laptpo Dell XPS 13 con proceador Intel Core i7",
  "corrected": "Laptop Dell XPS 13 con procesador Intel Core i7",
  "changes": [
    {"from": "Laptpo", "to": "Laptop"},
    {"from": "proceador", "to": "procesador"}
  ],
  "confidence": 0.95
}
```

## Privacidad y Seguridad

> [!WARNING]
> Al usar LLMs externos, los datos se envían a servidores de terceros.

### Mitigaciones

1. **Anonimización**:
   ```typescript
   function anonymizeData(rows: Row[]): Row[] {
     return rows.map(row => ({
       ...row,
       email: row.email ? hashEmail(row.email) : null,
       phone: row.phone ? maskPhone(row.phone) : null,
     }));
   }
   ```

2. **Data Processing Agreements (DPA)**:
   - Google Gemini: [Terms of Service](https://ai.google.dev/terms)
   - OpenAI: [API Data Usage Policies](https://openai.com/policies/api-data-usage-policies)
   - Azure: DPA incluido en contrato Enterprise

3. **Self-Hosted LLM** (futuro):
   - Llama 2/3 via Ollama
   - Mistral
   - Deployment en infraestructura propia

### Configuración de Privacidad

```env
# Deshabilitar LLM para datos críticos
LLM_PROVIDER=none  # Solo análisis basado en reglas

# O usar mock para testing
LLM_PROVIDER=mock
```

## Optimización de Costes

### Estrategias

1. **Cache de Prompts**:
   - Cachear resultados de análisis similares en Redis
   - TTL: 1 hora

2. **Batching**:
   - Analizar múltiples filas en un solo prompt
   - Límite: 100 filas o 4000 tokens

3. **Progressive Analysis**:
   - Análisis rápido con reglas simples primero
   - LLM solo para casos ambiguos

4. **Model Selection**:
   - GPT-3.5 para tareas simples
   - GPT-4/Gemini Pro para análisis complejos

### Límites de Coste

```env
# Límite mensual en USD
LLM_COST_LIMIT=100

# Acción al alcanzar límite
LLM_COST_LIMIT_ACTION=warn  # warn | block
```

## Testing del Driver

### Unit Tests

```typescript
describe('LLMDriver', () => {
  it('should switch providers based on config', () => {
    const mockDriver = createLLMDriver('mock');
    const geminiDriver = createLLMDriver('gemini');
    
    expect(mockDriver).toBeInstanceOf(MockLLMProvider);
    expect(geminiDriver).toBeInstanceOf(GeminiLLMProvider);
  });

  it('should fallback to mock on API error', async () => {
    const driver = createLLMDriver('gemini');
    // Simulate API error
    mockAPIError();
    
    const result = await driver.analyze(data, rules);
    expect(result.provider).toBe('mock'); // Fallback
  });
});
```

### Integration Tests

```bash
# Test con mock (gratis)
LLM_PROVIDER=mock npm test

# Test con Gemini (requiere API key)
LLM_PROVIDER=gemini LLM_API_KEY=xxx npm run test:integration
```

## Roadmap

- [x] Mock provider para desarrollo
- [ ] Gemini provider (Fase 2)
- [ ] OpenAI provider (Fase 2)
- [ ] Azure OpenAI provider (Fase 3)
- [ ] Self-hosted LLM (Llama/Mistral) (Fase 4)
- [ ] Fine-tuning con datos históricos (Fase 5)
- [ ] A/B testing de prompts (Fase 5)

## Referencias

- [Gemini API Documentation](https://ai.google.dev/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Azure OpenAI Service](https://learn.microsoft.com/azure/ai-services/openai/)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
