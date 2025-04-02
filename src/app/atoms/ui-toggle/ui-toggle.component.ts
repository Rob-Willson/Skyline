import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';

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
export class UiToggleComponent {
    @Input({ required: true })
    public label!: string;

    @Input()
    public value: boolean = false;

    @Input()
    public disabled: boolean = false;

    @Output()
    public toggled: EventEmitter<boolean> = new EventEmitter();

    public writeValue(newValue: boolean): void {
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

    public onToggleChange(newValue: boolean): void {
        this.value = newValue;
        this.onChange(newValue);
        this.onTouched();
        this.toggled.emit(newValue);
    }

    private onChange = (value: boolean) => { };
    private onTouched = () => { };
}
