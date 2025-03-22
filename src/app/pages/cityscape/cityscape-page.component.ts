import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ElementRef, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { NavButton } from '../../shared/types/nav-button.model';
import { NavigationService } from '../../services/navigation.service';
import { SkyVisualComponent } from "../../organisms/sky-visual/sky-visual.component";
import { PointMagnitude } from '../../shared/types/point.model';
import { StarsService } from '../../services/stars.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'cityscape-page',
    standalone: true,
    imports: [SkyVisualComponent],
    templateUrl: './cityscape-page.component.html',
    styleUrl: './cityscape-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityscapePageComponent implements OnInit, OnDestroy {
    private readonly headerButtons: NavButton[] = [
        { id: 'about', label: 'About', ariaLabel: 'About', iconName:'help', hideLabel: true, showLabelOnHover: true }
    ];

    private readonly footerButtons: NavButton[] = [
        { id: 'contact', label: 'Contact', ariaLabel: 'Contact', iconName:'email', hideLabel: true, showLabelOnHover: true }
    ];

    public data!: PointMagnitude[];
    public width!: number;
    public height!: number;

    private resizeObserver!: ResizeObserver;
    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    public constructor(
        private readonly elementRef: ElementRef,
        private readonly navService: NavigationService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly starsService: StarsService,
    ) {}

    public ngOnInit(): void {
        this.initialiseHeaderFooter();
        this.initialiseResizeObserver();
        this.getStarData();
    }

    public ngOnDestroy(): void {
        this.resizeObserver.disconnect();
    }

    private initialiseHeaderFooter(): void {
        this.navService.setHeaderButtons(this.headerButtons);
        this.navService.setFooterButtons(this.footerButtons);
    }

    private initialiseResizeObserver(): void {
        this.resizeObserver = new ResizeObserver(() => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.changeDetectorRef.markForCheck();
        });
        this.resizeObserver.observe(this.elementRef.nativeElement);
    }

    private getStarData(): void {
        this.starsService.fetchStarData()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ((data: PointMagnitude[]) => {
                    this.data = data;
                }),
                error: (error) => console.log("Failed to fetch star data", error),
            });
    }
}
