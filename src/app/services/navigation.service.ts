import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavButton } from '../shared/types/nav-button.model';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private headerButtons = new BehaviorSubject<NavButton[]>([]);
    public readonly headerButton$ = this.headerButtons.asObservable();

    private footerButtons = new BehaviorSubject<NavButton[]>([]);
    public readonly footerButton$ = this.footerButtons.asObservable();

    public setHeaderButtons(buttons: NavButton[]): void {
        this.headerButtons.next(buttons);
    }

    public setFooterButtons(buttons: NavButton[]): void {
        this.footerButtons.next(buttons);
    }
}
