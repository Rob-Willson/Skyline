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
        const changeState = data.goToStateId !== undefined;

        if (changeState) {
            this.currentState = this.getStateById(data.goToStateId) ?? this.getEntryState();
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
                { input: `hello`, output: `Hello there! How are you?`, goToStateId: `how_are_you` } as ConversationCase,
            ],
        } as ConversationState,
        {
            id: `how_are_you`,
            cases: [
                { input: `good`, output: `Wonderful! How can I help you today?`, goToStateId: `main` } as ConversationCase,
                { input: `bad`, output: `I'm sorry to hear that. I urge you to reach out to friends and family, or seek professional support. You should probably do that now, instead of playing around on this website.`, goToStateId: `0` } as ConversationCase,
            ],
        } as ConversationState,
        {
            id: `main`,
            cases: [
                { input: `who are you?`, output: `I'm a manifestation of Rob's underemployment.` } as ConversationCase,
                { input: `I found a bug`, output: `This is a relearning exercise, and is a work in progress. But feel free to contact Rob if it's upsetting you.` } as ConversationCase,
                { input: `stars`, output: `Aren't they beautiful? You can change the number of stars if you wish. Well... not just by wishing, there's a settings menu, of course.` } as ConversationCase,
                { input: `goodbye`, output: `Goodbye for now!`, goToStateId: `0` } as ConversationCase,
            ],
        } as ConversationState,
        {
            id: `goodbye`,
            cases: [
                { input: `goodbye`, output: `Goodbye for now!`, goToStateId: `0` } as ConversationCase,
            ],
        } as ConversationState,
    ];
}
