interface JDLEntityProperty {
    type: string;
    maxLength?: number;
    minLength?: number;
    required?: boolean;
    format?: string;
}

interface Entity {
    properties: Record<string, string>;
    relationship?: Record<string, string>;
}

interface Relationship {
    target: string;
    type: string;
    field: string;
}