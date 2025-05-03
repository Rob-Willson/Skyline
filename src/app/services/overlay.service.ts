import { ComponentRef, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';

@Injectable({ providedIn: 'root' })
export class OverlayService {
    private readonly backdropClass: string = 'cdk-overlay-dark-backdrop';

    constructor(private readonly overlay: Overlay) { }

    public open<T>(
        component: ComponentType<T>,
        config: {
            viewContainerRef: ViewContainerRef;
            injector: Injector;
            positionStrategy: PositionStrategy;
        }
    ): { overlayRef: OverlayRef, componentRef: ComponentRef<T> } {

        const overlayRef = this.overlay.create({
            positionStrategy: config.positionStrategy,
            hasBackdrop: true,
            backdropClass: this.backdropClass,
        });

        const portal = new ComponentPortal(component, config.viewContainerRef, config.injector);

        const componentRef: ComponentRef<T> = overlayRef.attach(portal);
        overlayRef.backdropClick().subscribe(() => overlayRef.dispose());

        return { overlayRef, componentRef };
    }
}