import { Injectable } from '@angular/core';
import { ConversationCase, ConversationState } from '../shared/types/conversation.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {
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

    private readonly state$ = new BehaviorSubject<ConversationState>(this.hiddenConversationState);
    public readonly conversationState$: Observable<ConversationState> = this.state$.asObservable();

    public start(): void {
        this.state$.next(this.entryConversationState);
    }

    public hide(): void {
        this.state$.next(this.hiddenConversationState);
    }

    public update(selectedCase: ConversationCase): void {
        this.state$.next(this.constructNextStateById(selectedCase));
    }

    private constructNextStateById(selectedCase: ConversationCase): ConversationState {
        if (selectedCase.goToStateId === undefined) {
            return this.shallowCloneState(this.state$.value, selectedCase);
        }

        const newStateUncloned = this.conversationStateData.find((state) => state.id === selectedCase.goToStateId);
        if (!newStateUncloned) {
            throw new Error(`ConversationService | getStateById(): could not find state id '${selectedCase.goToStateId}'`);
        }

        return this.shallowCloneState(newStateUncloned, selectedCase);
    }

    // We are treating ConversationCase as immutable, so a shallow clone here is fine.
    // If that changes, this will need to be updated
    private shallowCloneState(state: ConversationState, selectedCase: ConversationCase): ConversationState {
        return {
            ...state,
            lastSelection: selectedCase,
        }
    }
}
