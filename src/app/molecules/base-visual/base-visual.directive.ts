import { Directive, Input, SimpleChanges } from '@angular/core';

@Directive({
    standalone: true,
    host: { 'style': 'display: block' },    // Ensure the component behaves as a block element so that it can be styled correctly
                                            //    without relying on the parent (required due to encapsulation)
})
export abstract class BaseVisualDirective {
    @Input({ required: true })
    public width!: number;

    @Input({ required: true })
    public height!: number;

    constructor() { }

    public ngOnChanges(changes: SimpleChanges): void {
        if ((!changes['width'] || !changes['width'].currentValue) && (!changes['height'] || !changes['height'].currentValue)) {
            return;
        }

        if (this.width === 0 || this.height === 0) {
            return;
        }

        this.update();
    }

    protected abstract update(): void;

}
