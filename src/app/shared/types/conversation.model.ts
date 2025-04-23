export interface ConversationCase {
    input: string;
    output: string;
    goToStateId: string;
}

export interface ConversationState {
    id: string;
    cases: ConversationCase[];
} 