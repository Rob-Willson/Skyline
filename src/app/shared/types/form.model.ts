export type FormItemConfig =  FormToggleConfig | FormSliderConfig;

interface FormItemBaseConfig {
    formControlName: string;
    label: string;
    type: 'toggle' | 'slider';
    disabled?: boolean;
}

export interface FormToggleConfig extends FormItemBaseConfig {
}

export interface FormSliderConfig extends FormItemBaseConfig {
    min: number;
    max: number;
    step: number;
}