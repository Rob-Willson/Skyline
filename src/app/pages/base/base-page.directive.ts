import { ChangeDetectorRef, DestroyRef, Directive, ElementRef, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { NavButton } from '../../shared/types/nav-button.model';

@Directive({
    standalone: true,
})
export abstract class BasePageDirective implements OnInit {
    public width!: number;
    public height!: number;

    public readonly horizonPositionFraction: number = 0.75;

    protected resizeObserver!: ResizeObserver;

    protected readonly elementRef: ElementRef = inject(ElementRef);
    protected readonly destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly navService: NavigationService = inject(NavigationService);
    protected readonly changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.initialiseHeader();
        this.initialiseFooter();
        this.initialiseResizeObserver();
    }

    public ngOnDestroy(): void {
        this.resizeObserver.disconnect();
    }

    protected initialiseHeader(buttons?: NavButton[] ): void {
        this.navService.setHeaderButtons(buttons ?? this.getDefaultHeaderButtons());
    }

    protected initialiseFooter(buttons?: NavButton[]): void {
        this.navService.setFooterButtons(buttons ?? this.getDefaultFooterButtons());
    }

    protected initialiseResizeObserver(): void {
        this.resizeObserver = new ResizeObserver(() => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.changeDetectorRef.markForCheck();
        });
        this.resizeObserver.observe(this.elementRef.nativeElement);
    }

    private getDefaultHeaderButtons(): NavButton[] {
        return [
            { id: 'about', label: 'About', ariaLabel: 'About', iconName:'help', hideLabel: true, showLabelOnHover: true }
        ];
    }
    
    private getDefaultFooterButtons(): NavButton[] {
        return [
            { id: 'contact', label: 'Contact', ariaLabel: 'Contact', iconName:'email', hideLabel: true, showLabelOnHover: true }
        ];
    }
}
