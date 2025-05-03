import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Inject, Optional, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UiButtonComponent } from "../../atoms/ui-button/ui-button.component";
import { UiToggleComponent } from '../../atoms/ui-toggle/ui-toggle.component';
import { UiSliderComponent } from '../../atoms/ui-slider/ui-slider.component';
import { FormItemConfig, FormSliderConfig, FormToggleConfig } from '../../shared/types/form.model';

@Component({
    selector: 'options-menu',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UiButtonComponent, UiToggleComponent, UiSliderComponent, NgIf],
    templateUrl: './options-menu.component.html',
    styleUrl: './options-menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsMenuComponent {
    @Input({ required: true })
    public form!: FormGroup;

    @Input({ required: true })
    public formConfig!: FormItemConfig[];

    @Output()
    public submit: EventEmitter<void> = new EventEmitter();

    @Output()
    public reset: EventEmitter<void> = new EventEmitter();

    constructor(
        @Optional() @Inject(FormGroup) form: FormGroup,
        @Optional() @Inject('formConfig') formConfig: FormItemConfig[]      // TODO: magic string?
    ) {
        this.form = form;
        this.formConfig = formConfig;
    }

    public onSubmit(): void {
        console.log("submitting form...", this.form);
        if (this.form.valid) {
            console.log("  FORM VALID", this.form);
        } else {
            console.log("  FORM INVALID", this.form);
            // Trigger validation messages
            this.form.markAllAsTouched();
        }
    }

    public isToggle(config: FormItemConfig): config is FormToggleConfig {
        return config.type === 'toggle';
    }

    public isSlider(config: FormItemConfig): config is FormSliderConfig {
        return config.type === 'slider';
    }
}
