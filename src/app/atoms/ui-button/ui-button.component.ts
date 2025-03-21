import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'ui-button',
    standalone: true,
    imports: [NgIf],
    templateUrl: './ui-button.component.html',
    styleUrl: './ui-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
    @Input()
    public label?: string;

    @Output()
    public buttonClicked : EventEmitter<void> = new EventEmitter();

    public onClick(): void {
        this.buttonClicked.emit();
    }
}
