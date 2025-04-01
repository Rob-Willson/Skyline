import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

@Component({
    selector: 'ui-slider',
    standalone: true,
    imports: [NgIf, MatSliderModule],
    templateUrl: './ui-slider.component.html',
    styleUrl: './ui-slider.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class UiSliderComponent {
    @Input({required: true})
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

    public onInputChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const newValue = Number(inputElement.value);
        console.log("onInputChange", newValue);

        this.valueChange.emit(newValue);
    }

}
