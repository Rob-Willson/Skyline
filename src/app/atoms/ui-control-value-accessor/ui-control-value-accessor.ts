import { ChangeDetectorRef, inject } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export abstract class UiBaseControlValueAccessor<T> implements ControlValueAccessor {
    public value!: T;
    public disabled = false;

    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    public writeValue(value: T): void {
        this.value = value;
        this.changeDetectorRef.markForCheck();
    }

    public registerOnChange(fn: (value: T) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.changeDetectorRef.markForCheck();
    }

    protected emitChange(value: T): void {
        this.value = value;
        this.onChange(value);
        this.onTouched();
    }

    private onChange: (value: T) => void = () => { };
    private onTouched: () => void = () => { };
}
