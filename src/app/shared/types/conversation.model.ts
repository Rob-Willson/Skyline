export interface ConversationCase {
    readonly input: string;
    readonly output: string;
    readonly goToStateId: string | undefined;
}

export interface ConversationState {
    readonly id: string;
    readonly cases: ReadonlyArray<ConversationCase>;
    lastSelection?: ConversationCase;
}
