import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { UiButtonComponent } from "../../atoms/ui-button/ui-button.component";

@Component({
    selector: 'header-section',
    standalone: true,
    imports: [UiButtonComponent],
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
    public buttonClicked : EventEmitter<string> = new EventEmitter();

}
