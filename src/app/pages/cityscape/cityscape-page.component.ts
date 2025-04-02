import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { SkyVisualComponent } from "../../molecules/sky-visual/sky-visual.component";
import { PointMagnitude } from '../../shared/types/point.model';
import { StarsService } from '../../services/stars.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BasePageDirective } from '../base/base-page.directive';
import { BuildingsVisualComponent } from '../../molecules/buildings-visual/buildings-visual.component';
import { OptionsMenuComponent } from "../../organisms/options-menu/options-menu.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormItemConfig } from '../../shared/types/form.model';

@Component({
    selector: 'cityscape-page',
    standalone: true,
    imports: [SkyVisualComponent, BuildingsVisualComponent, OptionsMenuComponent],
    templateUrl: './cityscape-page.component.html',
    styleUrl: './cityscape-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityscapePageComponent extends BasePageDirective implements OnInit, OnDestroy {
    public form!: FormGroup;
    public formConfig!: FormItemConfig[];
    public starData!: PointMagnitude[];

    public constructor(
        private readonly starsService: StarsService,
        private readonly formBuilder: FormBuilder,
    ) {
        super();
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.getOptionsForm();
        this.getStarData();

        this.form.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((values) => this.onFormChange(values));
    }

    public onReset(): void {
        console.log("reset...");
    }

    private onFormChange(values: { showMoon: boolean, starCount: number }): void {
        this.getStarData();
    }

    private getOptionsForm(): void {
        this.form = this.formBuilder.group({
            starCount: [150, [Validators.required, Validators.min(50), Validators.max(200)]],
            showMoon: [true],
        });

        this.formConfig = [
            { formControlName: 'showMoon', label: 'Show moon', type: 'toggle' },
            { formControlName: 'starCount', label: 'Star count', type: 'slider', min: 50, max: 300, step: 25 },
        ];
    }

    private getStarData(): void {
        this.starsService.fetchStarData(this.starCount)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ((data: PointMagnitude[]) => {
                    this.starData = data;
                }),
                error: (error) => console.log("Failed to fetch star data", error),
            });
    }

    get starCount(): number {
        return this.form?.get('starCount')?.value;
    }
}
