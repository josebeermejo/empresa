import { ClassifyOut, ExplainOut, RuleSpecOut } from './schemas';

export interface LLMDriver {
    classifyColumn(input: { headerName: string; examples?: string[]; lang?: string }): Promise<ClassifyOut>;
    explainIssue(input: { issue: any; lang?: string }): Promise<ExplainOut>;
    rulesAssistant?(input: { instruction: string; lang?: string }): Promise<RuleSpecOut>;
}
