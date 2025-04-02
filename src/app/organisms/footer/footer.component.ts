import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { UiButtonComponent } from "../../atoms/ui-button/ui-button.component";
import { AsyncPipe, NgForOf } from '@angular/common';
import { Observable } from 'rxjs';
import { NavButton } from '../../shared/types/nav-button.model';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'footer-section',
    standalone: true,
    imports: [UiButtonComponent, NgForOf, AsyncPipe],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
    @Output()
    public navButtonClicked : EventEmitter<NavButton> = new EventEmitter<NavButton>();

    readonly navButton$!: Observable<NavButton[]>;

    public constructor(private readonly navService: NavigationService) {
        this.navButton$ = navService.footerButton$;
    }

}
