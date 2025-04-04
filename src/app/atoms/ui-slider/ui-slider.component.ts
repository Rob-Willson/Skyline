import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { UiBaseControlValueAccessor } from '../ui-control-value-accessor/ui-control-value-accessor';

@Component({
    selector: 'ui-slider',
    standalone: true,
    imports: [NgIf, MatSliderModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiSliderComponent),
            multi: true,
        }
    ],
    templateUrl: './ui-slider.component.html',
    styleUrl: './ui-slider.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class UiSliderComponent extends UiBaseControlValueAccessor<number> {
    @Input({required: true})
    public min!: number;

    @Input({required: true})
    public max!: number;

    @Input({required: true})
    public step!: number;

    @Input()
    public label?: string;

    @Output()
    public valueChange: EventEmitter<number> = new EventEmitter();

    public onValueChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const newValue = Number(inputElement.value);

        this.emitChange(newValue);
        this.valueChange.emit(newValue);
    }
}
