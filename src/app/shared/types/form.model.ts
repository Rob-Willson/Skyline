import { ValidatorFn } from "@angular/forms";

export type FormItemConfig =  FormToggleConfig | FormSliderConfig;

interface FormItemBaseConfig {
    formControlName: string;
    label: string;
    type: 'toggle' | 'slider';
    disabled?: boolean;
    validators?: ValidatorFn[];
}

export interface FormToggleConfig extends FormItemBaseConfig {
    defaultValue: boolean,
}

export interface FormSliderConfig extends FormItemBaseConfig {
    defaultValue: number,
    min: number;
    max: number;
    step: number;
}