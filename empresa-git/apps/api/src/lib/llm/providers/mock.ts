import { LLMDriver } from '../driver';
import { ClassifyOut, ExplainOut } from '../schemas';

export class MockProvider implements LLMDriver {
    async classifyColumn(input: { headerName: string; examples?: string[]; lang?: string }): Promise<ClassifyOut> {
        const header = input.headerName.toLowerCase();

        // Simple heuristics for mock
        let type = 'text';
        let confidence = 0.5;
        let rationaleShort = 'Default heuristic based on name';

        if (/phone|movil|celular|tel/.test(header)) {
            type = 'phone_es';
            confidence = 0.9;
            rationaleShort = 'Detected phone keywords in header';
        } else if (/mail|correo/.test(header)) {
            type = 'email';
            confidence = 0.95;
            rationaleShort = 'Detected email keywords';
        } else if (/date|fecha|time/.test(header)) {
            type = 'date';
            confidence = 0.85;
            rationaleShort = 'Detected date keywords';
        } else if (/amount|precio|cost|importe/.test(header)) {
            type = 'currency';
            confidence = 0.8;
            rationaleShort = 'Detected currency keywords';
        } else if (/id|uuid|kode/.test(header)) {
            type = 'id';
            confidence = 0.9;
            rationaleShort = 'Detected ID keywords';
        }

        return { type, confidence, rationaleShort };
    }

    async explainIssue(input: { issue: any; lang?: string }): Promise<ExplainOut> {
        const kind = input.issue?.kind || 'unknown';

        // Mock explanations
        const explanations: Record<string, string> = {
            email_invalid: 'El formato del correo electrónico no es válido.',
            phone_invalid: 'El número de teléfono no cumple con el formato estándar.',
            price_zero: 'El precio es 0, lo cual puede ser un error.',
            default: 'Se ha detectado una anomalía en los datos.',
        };

        const recommendations: Record<string, string> = {
            email_invalid: 'Verifica que contenga @ y un dominio válido.',
            phone_invalid: 'Asegúrate de incluir el prefijo si es necesario.',
            price_zero: 'Revisa si es un producto gratuito o un error de carga.',
            default: 'Revisa el valor manualmente.',
        };

        return {
            explanation: explanations[kind] || explanations['default'],
            recommendation: recommendations[kind] || recommendations['default'],
        };
    }
}
