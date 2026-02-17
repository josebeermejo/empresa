export interface Dataset {
    id: string;
    projectId: string; // Assuming we might need this, or just use 'default' for now
    name: string;
    fileUrl: string;
    status: 'PENDING' | 'ANALYZING' | 'WAITING_REVIEW' | 'EXPORTING' | 'COMPLETED' | 'ERROR';
    rowCount: number;
    errorCount: number;
    mimetype: string;
    createdAt: string;
    updatedAt: string;
}

export interface Issue {
    id: string;
    datasetId: string;
    row: number;
    column: string;
    value: string;
    issueType: string;
    message: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    status: 'OPEN' | 'IGNORED' | 'FIXED';
    suggestedFix?: string;
    createdAt: string;
}

export interface Rule {
    id: string;
    name: string;
    description: string;
    field: string;
    operator: string;
    value: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    enabled: boolean;
}

export interface FixPreview {
    original: any;
    fixed: any;
    changes: {
        row: number;
        column: string;
        oldValue: any;
        newValue: any;
    }[];
}
