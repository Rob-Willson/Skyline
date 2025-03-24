import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ElementRef, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { SkyVisualComponent } from "../../organisms/sky-visual/sky-visual.component";
import { PointMagnitude } from '../../shared/types/point.model';
import { StarsService } from '../../services/stars.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BasePageDirective } from '../base/base-page.directive';

@Component({
    selector: 'cityscape-page',
    standalone: true,
    imports: [SkyVisualComponent],
    templateUrl: './cityscape-page.component.html',
    styleUrl: './cityscape-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityscapePageComponent extends BasePageDirective implements OnInit, OnDestroy {

    public data!: PointMagnitude[];

    public constructor(
        private readonly starsService: StarsService,
    ) {
        super();
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.getStarData();
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
