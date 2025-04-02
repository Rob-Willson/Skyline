import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

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
export class UiSliderComponent {
    @Input()
    public value!: number;

    @Input({required: true})
    public min!: number;

    @Input({required: true})
    public max!: number;

    @Input({required: true})
    public step!: number;

    @Input()
    public disabled: boolean = false;

    @Input()
    public label?: string;

    @Output()
    public valueChange: EventEmitter<number> = new EventEmitter();

    public writeValue(newValue: number): void {
        this.value = newValue;
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public onInputChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const newValue = Number(inputElement.value);
        console.log("onInputChange", newValue);

        this.value = newValue;
        this.onChange(newValue);
        this.onTouched();
        this.valueChange.emit(newValue);
    }

    private onChange = (value: number) => { };
    private onTouched = () => { };
}
