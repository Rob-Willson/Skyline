import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UiBaseControlValueAccessor } from '../ui-control-value-accessor/ui-control-value-accessor';

@Component({
    selector: 'ui-toggle',
    standalone: true,
    imports: [MatSlideToggleModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiToggleComponent),
            multi: true,
        }
    ],
    templateUrl: './ui-toggle.component.html',
    styleUrl: './ui-toggle.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiToggleComponent extends UiBaseControlValueAccessor<boolean> {
    @Input({ required: true })
    public label!: string;

    @Output()
    public valueChange: EventEmitter<boolean> = new EventEmitter();

    public onValueChange(newValue: boolean): void {
        this.emitChange(newValue);
        this.valueChange.emit(newValue);
    }
}
