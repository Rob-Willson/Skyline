import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiButtonComponent } from "../../atoms/ui-button/ui-button.component";
import { UiToggleComponent } from '../../atoms/ui-toggle/ui-toggle.component';
import { UiSliderComponent } from '../../atoms/ui-slider/ui-slider.component';

@Component({
  selector: 'options-menu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiButtonComponent, UiToggleComponent, UiSliderComponent],
  templateUrl: './options-menu.component.html',
  styleUrl: './options-menu.component.scss',
changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsMenuComponent {
    public form!: FormGroup;

    public constructor(private readonly formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            starCount: [100, [Validators.required, Validators.min(50), Validators.max(200)]],
            showMoon: [true],
        });
    }

    public submit(): void {
        if (this.form.valid) {
            console.log("submitting form", this.form);
        } else {
            // Trigger validation messages
            this.form.markAllAsTouched();
        }
    }

}
