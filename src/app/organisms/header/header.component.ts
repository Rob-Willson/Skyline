import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { UiButtonComponent } from "../../atoms/ui-button/ui-button.component";
import { NavButton } from '../../shared/types/nav-button.model';
import { NgFor, AsyncPipe } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'header-section',
    standalone: true,
    imports: [UiButtonComponent, NgFor, AsyncPipe],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    @Input({ required: true })
    public siteName!: string;

    @Input({ required: true })
    public pageTitle!: string;

    @Output()
    public navButtonClicked : EventEmitter<NavButton> = new EventEmitter<NavButton>();

    readonly navButton$!: Observable<NavButton[]>;

    public constructor(private readonly navService: NavigationService) {
        this.navButton$ =this.navService.headerButton$;
    }
}
