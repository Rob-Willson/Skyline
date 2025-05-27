import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef, OnInit, inject, DestroyRef, ViewChild, HostBinding, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavButtonClickEvent } from '../../shared/types/nav-button.model';
import { select } from 'd3';
import { BehaviorSubject, Subject, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'ui-button',
    standalone: true,
    imports: [NgIf, MatIconModule],
    templateUrl: './ui-button.component.html',
    styleUrl: './ui-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class UiButtonComponent implements OnInit {
    @HostBinding('class.ui-button--reset')
    public get isTypeReset(): boolean {
        return this.type === 'reset';
    }

    @HostBinding('class.ui-button--disabled')
    public get isDisabled(): boolean {
        return this.disabled;
    }

    @HostBinding('class.ui-button--border')
    public get showBorder(): boolean {
        return !this.hideBorder || (this.showBorderOnHover && this.labelUpdate$.value);
    }

    @Input({ required: true })
    public label!: string;

    @Input({ required: true })
    public ariaLabel!: string;

    @Input()
    public hideLabel: boolean = false;

    @Input()
    public showLabelOnHover: boolean = false;

    @Input()
    public iconName?: string;

    @Input()
    public type: 'button' | 'submit' | 'reset' = 'button';

    @Input()
    public disabled: boolean = false;

    @Input()
    public hideBorder: boolean = true;

    @Input()
    public showBorderOnHover: boolean = true;

    @Output()
    public buttonClicked: EventEmitter<NavButtonClickEvent> = new EventEmitter();

    private labelUpdate$ = new BehaviorSubject<boolean>(false);
    private readonly destroyRef = inject(DestroyRef);

    private labelContainer!: any;
    private letterSpans!: any;

    private readonly labelAppearDelayMillis: number = 150;
    private readonly labelDisappearDelayMillis: number = 110;

    public constructor(public readonly elementRef: ElementRef) { }

    public ngOnInit(): void {
        this.labelUpdate$.pipe(
            debounceTime(Math.max(this.labelAppearDelayMillis, this.labelDisappearDelayMillis)),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe((show: boolean) => this.updateLabelText(show));

        if (!this.hideLabel) {
            this.labelUpdate$.next(true);
        }
    }

    public onMouseEnter(): void {
        if (this.showLabelOnHover) {
            this.labelUpdate$.next(true);
        }
    }

    public onMouseLeave(): void {
        if (this.hideLabel) {
            this.labelUpdate$.next(false);
        }
    }

    public onClick(): void {
        if (this.disabled) {
            return;
        }

        this.buttonClicked.emit({
            id: this.label.toLowerCase(),
            label: this.label,
            ariaLabel: this.ariaLabel,
            hideLabel: this.hideLabel,
            showLabelOnHover: this.showLabelOnHover,
            iconName: this.iconName,
            element: this.elementRef.nativeElement,
        } as NavButtonClickEvent);
    }

    private updateLabelText(show: boolean): void {
        const letters: string[] = show
            ? this.label.split('')
            : [];

        this.labelContainer = select(this.elementRef.nativeElement)
            .select('.ui-button__container__label-container')
            .data([letters]);

        this.letterSpans = this.labelContainer.selectAll('span')
            .data((d: string[]) => d, (d: string[], i: number) => `${d}-${i}`)

        this.letterSpans.enter()
            .append('span')
            .attr('class', 'ui-button__container__label-container__label')
            .text((d: string) => d)
            .style('opacity', 0)
            .style('display', 'none')
            .transition('enter')
            .delay((d: string, i: number, arr: unknown[]) => i * (this.labelAppearDelayMillis / arr.length))
            .style('opacity', 1)
            .style('display', 'inline-block')

        this.letterSpans
            .transition()
            .text((d: string) => d)
            .style('opacity', 1)

        this.letterSpans.exit()
            .transition()
            .delay((d: string, i: number, arr: unknown[]) => (arr.length - i - 1) * (this.labelDisappearDelayMillis / arr.length))
            .style('opacity', 0)
            .remove();
    }
}
