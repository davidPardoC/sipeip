export interface IndicatorMeasurement {
    id: number;
    indicatorId: number;
    period: string; // e.g., "2024-Q1"
    targetValue: string; // Decimal as string
    currentValue: string; // Decimal as string
    complianceStatus: string; // "CUMPLIDO", "NO_CUMPLIDO", etc.
    createdBy?: string | null;
    updatedBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
}

export interface CreateIndicatorMeasurement {
    indicatorId: number;
    period: string;
    targetValue: string;
    currentValue: string;
    complianceStatus: string;
    createdBy?: string;
}
