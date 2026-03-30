export interface VerifactResponse{
    verification: string,
    category: string
    confidence: string,
    explanation: string,
    bias: string,
    sources: string[]
    sentiment: string
}