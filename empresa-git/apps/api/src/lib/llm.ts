import env from '../config/env.js';
import type { LLMProvider } from '../domain/types.js';
import type { Issue } from '../domain/dto.js';

/**
 * Mock LLM Provider for development
 * Returns deterministic responses based on input
 */
class MockLLMProvider implements LLMProvider {
    name = 'mock';

    /**
     * Classify a column header to determine its data type
     */
    async classify(
        headerName: string,
        examples?: string[]
    ): Promise<{ type: string; confidence: number; rationaleShort: string }> {
        const header = headerName.toLowerCase();

        // Deterministic classification based on header name
        if (header.includes('email') || header.includes('correo')) {
            return {
                type: 'email',
                confidence: 0.92,
                rationaleShort: 'Column name suggests email addresses',
            };
        }

        if (header.includes('phone') || header.includes('telefono') || header.includes('tel')) {
            return {
                type: 'phone_es',
                confidence: 0.88,
                rationaleShort: 'Column name suggests Spanish phone numbers',
            };
        }

        if (header.includes('date') || header.includes('fecha')) {
            return {
                type: 'date',
                confidence: 0.85,
                rationaleShort: 'Column name suggests date values',
            };
        }

        if (header.includes('price') || header.includes('precio') || header.includes('amount')) {
            return {
                type: 'numeric',
                confidence: 0.90,
                rationaleShort: 'Column name suggests numeric currency values',
            };
        }

        if (header.includes('id') || header.includes('sku') || header.includes('codigo')) {
            return {
                type: 'unique',
                confidence: 0.87,
                rationaleShort: 'Column name suggests unique identifiers',
            };
        }

        return {
            type: 'text',
            confidence: 0.50,
            rationaleShort: 'Generic text field',
        };
    }

    /**
     * Explain an issue and provide recommendations
     */
    async explain(issue: Issue): Promise<{ explanation: string; recommendation: string }> {
        const explanations: Record<string, { explanation: string; recommendation: string }> = {
            email_invalid: {
                explanation:
                    'The email address does not follow the standard format (user@domain.ext). This could be due to missing @ symbol, incomplete domain, or invalid characters.',
                recommendation:
                    'Verify the email with the data source or use a validation service. Consider marking it for manual review if confidence is low.',
            },
            phone_invalid: {
                explanation:
                    'The phone number does not match the expected Spanish format (+34 followed by 9 digits). It may have extra spaces, hyphens, or missing digits.',
                recommendation:
                    'Normalize to format +34XXXXXXXXX. Remove spaces and special characters. Verify area codes are valid.',
            },
            duplicate: {
                explanation:
                    'This record appears to be a duplicate based on key fields. Duplicates can cause data integrity issues and inflate metrics.',
                recommendation:
                    'Review if this is a true duplicate or if there are legitimate reasons for similarity. Consider merging records or marking one as inactive.',
            },
            date_format: {
                explanation:
                    'The date is in an inconsistent format compared to other rows. Mixed formats (DD/MM/YYYY, MM-DD-YYYY, ISO) make processing difficult.',
                recommendation:
                    'Convert all dates to ISO 8601 format (YYYY-MM-DD) for consistency. Verify day/month order to avoid errors.',
            },
            price_zero: {
                explanation:
                    'The price is set to zero, which is unusual for most products unless intentional (free items, promotions).',
                recommendation:
                    'Verify if zero price is correct. If not, check if pricing data was lost during import or if this is a data entry error.',
            },
            price_negative: {
                explanation:
                    'Negative prices are typically invalid except for specific cases like credits or refunds.',
                recommendation:
                    'Review transaction type. If this is an error, replace with absolute value or correct pricing data.',
            },
        };

        const result = explanations[issue.kind] || {
            explanation: `Data quality issue detected of type: ${issue.kind}`,
            recommendation: 'Review the data and apply appropriate corrections based on business rules.',
        };

        return result;
    }
}

/**
 * Get LLM provider based on configuration
 */
export function getLLMProvider(): LLMProvider {
    const provider = env.llmProvider.toLowerCase();

    if (provider === 'mock') {
        return new MockLLMProvider();
    }

    // For other providers, return mock with a warning
    console.warn(`LLM provider '${provider}' not configured, using mock`);
    return new MockLLMProvider();
}

export const llmProvider = getLLMProvider();
