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
import { debounceTime } from 'rxjs';
import { ConversationCase, ConversationState } from '../../shared/types/conversation.model';
import { ConversationBubblesComponent } from '../../molecules/conversation-bubbles/conversation-bubbles.component';
import { ConversationService } from '../../services/conversation.service';

@Component({
    selector: 'cityscape-page',
    standalone: true,
    imports: [SkyVisualComponent, BuildingsVisualComponent, OptionsMenuComponent, ConversationBubblesComponent],
    templateUrl: './cityscape-page.component.html',
    styleUrl: './cityscape-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityscapePageComponent extends BasePageDirective implements OnInit, OnDestroy {
    public form!: FormGroup;
    public formConfig!: FormItemConfig[];
    public starData!: PointMagnitude[];
    public conversationState!: ConversationState;

    private readonly debounceDelayMillis: number = 300;

    private readonly minStars: number = 50;
    private readonly maxStars: number = 300;
    private readonly starCountStep: number = 25;

    public constructor(
        private readonly starsService: StarsService,
        private readonly formBuilder: FormBuilder,
        private readonly conversationService: ConversationService,
    ) {
        super();
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.getOptionsForm();
        this.getStarData();
        this.getConversationData();

        this.form.valueChanges
            .pipe(
                debounceTime(this.debounceDelayMillis),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((values) => this.onFormChange(values));
    }

    private onFormChange(values: { showMoon: boolean, starCount: number }): void {
        this.getStarData();
    }

    public onSubmit(): void {
        console.log("onSubmit...", this.form.value);
    }

    public onReset(): void {
        this.form.reset(this.getDefaultFormValues());
    }

    public onConversationSelect(data: ConversationCase): void {
        this.conversationService.update(data);
        this.getConversationData();
    }

    private getOptionsForm(): void {
        const defaults = this.getDefaultFormValues();

        this.form = this.formBuilder.group({
            starCount: [defaults.starCount, [Validators.required, Validators.min(this.minStars), Validators.max(this.maxStars)]],
            showMoon: [defaults.showMoon],
        });

        this.formConfig = [
            { formControlName: 'showMoon', label: 'Show moon', type: 'toggle' },
            { formControlName: 'starCount', label: 'Star count', type: 'slider', min: this.minStars, max: this.maxStars, step: this.starCountStep },
        ];
    }

    private getDefaultFormValues(): { starCount: number; showMoon: boolean } {
        return {
            starCount: 150,
            showMoon: true,
        };
    }

    private getStarData(): void {
        this.starsService.fetchStarData(this.starCount)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ((data: PointMagnitude[]) => {
                    this.starData = data;
                    this.changeDetectorRef.markForCheck();
                }),
                error: (error) => console.log("Failed to fetch star data", error),
            });
    }

    private getConversationData(): void {
        this.conversationService.fetchConversationState()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ((data: ConversationState) => {
                    console.log("pop", data);
                    this.conversationState = data;
                    this.changeDetectorRef.markForCheck();  // TODO: check if required
                })
            });
    }

    get starCount(): number {
        return this.form?.get('starCount')?.value;
    }
}
