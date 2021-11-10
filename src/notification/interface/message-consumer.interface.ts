export interface MessageTaskSendResponse {
    token: string;
    isSuccess: boolean;
}

export interface BulkMessageTaskSendResponse {
    successCount: number;
    failureCount: number;
    failureTokens?: string[];
}
