import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewContainerRef, Injector, InjectionToken } from '@angular/core';
import { SkyVisualComponent } from "../../molecules/sky-visual/sky-visual.component";
import { PointMagnitude } from '../../shared/types/point.model';
import { StarsService } from '../../services/stars.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BasePageDirective } from '../base/base-page.directive';
import { BuildingsVisualComponent } from '../../molecules/buildings-visual/buildings-visual.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormItemConfig } from '../../shared/types/form.model';
import { debounceTime } from 'rxjs';
import { ConversationCase, ConversationState } from '../../shared/types/conversation.model';
import { ConversationBubblesComponent } from '../../molecules/conversation-bubbles/conversation-bubbles.component';
import { ConversationService } from '../../services/conversation.service';
import { OverlayService } from '../../services/overlay.service';
import { OptionsMenuComponent } from '../../organisms/options-menu/options-menu.component';
import { Overlay } from '@angular/cdk/overlay';

@Component({
    selector: 'cityscape-page',
    standalone: true,
    imports: [SkyVisualComponent, BuildingsVisualComponent, ConversationBubblesComponent],
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

    private readonly minStars: number = 100;
    private readonly maxStars: number = 400;
    private readonly starCountStep: number = 25;

    public constructor(
        private readonly overlay: Overlay,
        private readonly overlayService: OverlayService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly injector: Injector,
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

        this.navService.navButtonClick$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((button) => {
                if (button.id === 'settings') {
                    this.openOptionsOverlay(button.element);
                }
            });
    }

    private onFormChange(values: { showMoon: boolean, starCount: number }): void {
        if (this.starCount != this.starData.length) {
            this.getStarData();
        }
    }

    // TODO: this is not currently called, but should be when the form is submitted
    public onSubmit(): void {
        console.log("onSubmit...", this.form.value);
    }

    public onReset(): void {
        console.log(this.conversationState);
        const defaultValues = this.formConfig.reduce((acc, item) => {
            acc[item.formControlName] = item.defaultValue;
            return acc;
        }, {} as Record<string, any>);

        this.form.reset(defaultValues);
    }

    public toggleConversationDisplay(doShow: boolean): void {
        if (doShow) {
            this.conversationService.start();
        } else {
            this.conversationService.hide();
        }
    }

    public onConversationSelect(selectedCase: ConversationCase): void {
        this.conversationService.update(selectedCase);
    }

    private openOptionsOverlay(origin: HTMLElement): void {
        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(origin)
            .withPositions([
                {
                    originX: 'start', originY: 'bottom',
                    overlayX: 'start', overlayY: 'top',
                }
            ])
            .withFlexibleDimensions(false)
            .withGrowAfterOpen(false)
            .withPush(true);    // Let overlay be pushed onto screen if position strategy fails

        const inputInjector = Injector.create({
            providers: [
                { provide: FormGroup, useValue: this.form },            // TODO: should use InjectionToken
                { provide: 'formConfig', useValue: this.formConfig },   // TODO: magic string, should use InjectionToken?
            ],
            parent: this.injector,
        });

        const { overlayRef, componentRef } = this.overlayService.open(OptionsMenuComponent, {
            viewContainerRef: this.viewContainerRef,
            injector: inputInjector,
            positionStrategy,
        });

        componentRef.instance.submit
            // .pipe(takeUntilDestroyed(this.destroyRef))   // TODO: I don't think this is right, it needs to respect the lifecycle of the overlay surely?
            .subscribe(() => this.onSubmit());

        componentRef.instance.reset
            // .pipe(takeUntilDestroyed(this.destroyRef))   // TODO: I don't think this is right, it needs to respect the lifecycle of the overlay surely?
            .subscribe(() => this.onReset());
    }

    private getOptionsForm(): void {
        this.formConfig = this.getFormConfig();

        const formGroupConfig: { [key: string]: FormControl } = {};

        for (const item of this.formConfig) {
            formGroupConfig[item.formControlName] = new FormControl(
                { value: item.defaultValue, disabled: item.disabled ?? false },
                item.validators ?? []
            );
        }

        this.form = this.formBuilder.group(formGroupConfig);
    }

    private getFormConfig(): FormItemConfig[] {
        return [
            {
                formControlName: 'starCount',
                label: 'Star count',
                type: 'slider',
                defaultValue: 200,
                min: this.minStars,
                max: this.maxStars,
                step: this.starCountStep,
                validators: [Validators.required, Validators.min(this.minStars), Validators.max(this.maxStars)],
            },
            {
                formControlName: 'showMoon',
                label: 'Show moon',
                type: 'toggle',
                defaultValue: true,
                disabled: true,
            },
        ];
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
        this.conversationService.conversationState$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ((state: ConversationState) => {
                    this.conversationState = state;
                })
            });
    }

    get starCount(): number {
        return this.form?.get('starCount')?.value;
    }
}
