import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'ui-toggle',
    standalone: true,
    imports: [MatSlideToggleModule],
    templateUrl: './ui-toggle.component.html',
    styleUrl: './ui-toggle.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiToggleComponent {
    @Input({required: true})
    public label!: string;

    @Input({required: true})
    public checked: boolean = false;

    @Input()
    public disabled: boolean = false;

    @Output()
    public toggled: EventEmitter<boolean> = new EventEmitter();

    public onChange(event: MatSlideToggleChange): void {
        console.log("toggle change...", event);
        this.toggled.emit(event.checked);
    }

}
