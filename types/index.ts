export interface VerifactResponse{
    verification: string,
    confidence: string
    explanation: string,
    category: string,
    sources: string[],
    labels: string[],
    sentiment: string
}