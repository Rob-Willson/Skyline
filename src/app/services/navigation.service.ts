import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NavButton, NavButtonClickEvent } from '../shared/types/nav-button.model';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private headerButtons = new BehaviorSubject<NavButton[]>([]);
    public readonly headerButton$ = this.headerButtons.asObservable();

    private footerButtons = new BehaviorSubject<NavButton[]>([]);
    public readonly footerButton$ = this.footerButtons.asObservable();

    private readonly navButtonClickSubject = new Subject<NavButtonClickEvent>();
    public readonly navButtonClick$: Observable<NavButtonClickEvent> = this.navButtonClickSubject.asObservable();

    public setHeaderButtons(buttons: NavButton[]): void {
        this.headerButtons.next(buttons);
    }

    public setFooterButtons(buttons: NavButton[]): void {
        this.footerButtons.next(buttons);
    }

    public emitNavButtonClick(button: NavButtonClickEvent): void {
        this.navButtonClickSubject.next(button);
    }
}
