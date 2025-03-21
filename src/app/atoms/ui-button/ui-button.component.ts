import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavButton } from '../../shared/types/nav-button.model';

@Component({
    selector: 'ui-button',
    standalone: true,
    imports: [NgIf, MatIconModule],
    templateUrl: './ui-button.component.html',
    styleUrl: './ui-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
    @Input({required: true})
    public label!: string;

    @Input({required: true})
    public ariaLabel!: string;

    @Input()
    public hideLabel: boolean = false;

    @Input()
    public showLabelOnHover: boolean = false;

    @Input()
    public iconName?: string;

    @Output()
    public buttonClicked: EventEmitter<NavButton> = new EventEmitter();

    public onMouseEnter(): void {
        if (this.showLabelOnHover) {
            this.hideLabel = false;
        }
    }

    public onMouseLeave(): void {
        if (this.showLabelOnHover) {
            this.hideLabel = true;
        }
    }

    public onClick(): void {
        this.buttonClicked.emit();
    }
}
