import { Injectable } from '@angular/core';
import { ConversationCase, ConversationState } from '../shared/types/conversation.model';
import { Observable, of } from 'rxjs';
import { scaleSequential } from 'd3';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {
    private currentState!: ConversationState;

    public fetchConversationState(): Observable<ConversationState> {
        return of(this.currentState);
    }

    public start(): void {
        this.currentState = this.entryConversationState;
    }

    public end(): void {
        this.currentState = this.hiddenConversationState;
    }

    public update(selectedCase: ConversationCase): void {
        const changeState = selectedCase.goToStateId !== undefined;

        if (changeState) {
            this.currentState = this.getStateById(selectedCase) ?? this.entryConversationState;
        } else {
            this.currentState.lastSelection = selectedCase;
        }
    }

    private getStateById(selectedCase: ConversationCase): ConversationState {
        if (selectedCase.goToStateId === undefined) {
            return this.currentState;
        }

        const newStateUncloned = this.conversationStateData.find((state) => state.id === selectedCase.goToStateId);
        if (!newStateUncloned) {
            throw new Error(`ConversationService | getStateById(): could not find state id '${selectedCase.goToStateId}'`);
        }

        const newStateCloned = this.shallowCloneState(newStateUncloned);
        newStateCloned.lastSelection = selectedCase;
        return newStateCloned;
    }

    // We are treating ConversationCase as immutable, so a shallow clone here is fine.
    // If that changes, this will need to be updated
    private shallowCloneState(state: ConversationState): ConversationState {
        return {
            id: state.id,
            cases: state.cases,
        }
    }

    private readonly hiddenConversationState: ConversationState = {
        id: `hidden`,
        cases: [],
    };

    private readonly entryConversationState: ConversationState = {
        id: `0`,
        cases: [
            { input: `hello`, output: `Hello there! How are you?`, goToStateId: `main` } ,
        ],
    };

    private readonly conversationStateData: ReadonlyArray<ConversationState> = [
        this.hiddenConversationState,
        this.entryConversationState,
        {
            id: `main`,
            cases: [
                { input: `who are you?`, output: `I'm a manifestation of Rob's underemployment.`, goToStateId: undefined },
                { input: `I found a bug`, output: `This is a relearning exercise, and is a work in progress. But feel free to contact Rob if it's upsetting you.`, goToStateId: undefined },
                { input: `stars`, output: `You can change the number of stars if you wish. Well... not just by wishing, there's a settings menu, of course.`, goToStateId: undefined },
                { input: `goodbye`, output: `Goodbye for now!`, goToStateId: `hidden` },
            ],
        },
        {
            id: `goodbye`,
            cases: [
                { input: `goodbye`, output: `Goodbye for now!`, goToStateId: `hidden` },
            ],
        },
    ];
}
