export interface NavButton {
    id: string;
    label: string;
    ariaLabel: string;
    hideLabel: boolean;
    showLabelOnHover: boolean;
    iconName: string;
}

export interface NavButtonClickEvent extends NavButton {
    element: HTMLElement;
}