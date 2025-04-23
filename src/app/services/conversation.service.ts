import { Injectable } from '@angular/core';
import { ConversationCase, ConversationState } from '../shared/types/conversation.model';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {
    private currentState!: ConversationState;

    public fetchConversationState(): Observable<ConversationState> {
        return of(this.currentState ?? this.conversationStateData[0]);
    }

    public update(data: ConversationCase): void {
        console.log("ConversationService | update(): ", data);

        const changeState = data.goToStateId !== undefined;

        if (changeState) {
            this.currentState = this.getStateById(data.goToStateId) ?? this.getEntryState();
            console.log("ConversationService | update(): changing state", this.currentState);
        }
    }

    private getEntryState(): ConversationState {
        return this.conversationStateData[0];
    }

    private getStateById(id: string): ConversationState | undefined {
        return this.conversationStateData.find((state) => state.id === id);
    }

    private readonly conversationStateData: ConversationState[] = [
        {
            id: '0',
            cases: [
                { input: `hello?`, output: `Hello there! How are you?`, goToStateId: `how_are_you` } as ConversationCase,
            ],
        } as ConversationState,
        {
            id: `how_are_you`,
            cases: [
                { input: `good`, output: `Wonderful! How can I help you today?`, goToStateId: `main` } as ConversationCase,
                { input: `bad`, output: `I'm sorry to hear that. Perhaps there's something I can help with.`, goToStateId: `main` } as ConversationCase,
            ],
        } as ConversationState,
        {
            id: `main`,
            cases: [
                { input: `who are you?`, output: `I'm a manifestation of Rob's underemployment.` } as ConversationCase,
                { input: `goodbye`, output: `Goodbye for now.`, goToStateId: `0` } as ConversationCase,
            ],
        } as ConversationState,
    ];
}
