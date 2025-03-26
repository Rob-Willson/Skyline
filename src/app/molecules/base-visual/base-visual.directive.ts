import { DestroyRef, Directive, inject, Input, SimpleChanges } from '@angular/core';

// NOTE on host styling:
// display: block - Ensure the component behaves as a block element so that it can be styled correctly, without relying on the parent. 
//                  This is required due to encapsulation. 
// pointer-events: none - makes sure that upper layers don't block interactions with lower layers. 
//                        We do this at the component-level because otherwise even a fully transparent upper will block events. 
@Directive({
    standalone: true,
    host: { 'style': 'display: block; pointer-events: none;' },
})
export abstract class BaseVisualDirective {
    @Input({ required: true })
    public width!: number;

    @Input({ required: true })
    public height!: number;

    protected isInitialised: boolean = false;

    protected readonly destroyRef: DestroyRef = inject(DestroyRef);

    public ngOnChanges(changes: SimpleChanges): void {
        if ((!changes['width'] || !changes['width'].currentValue) && (!changes['height'] || !changes['height'].currentValue)) {
            return;
        }

        if (this.width === 0 || this.height === 0) {
            return;
        }

        this.isInitialised = true;
        this.update();
    }

    protected abstract update(): void;
}
