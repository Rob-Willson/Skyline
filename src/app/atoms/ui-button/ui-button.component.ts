import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef, OnInit, inject, DestroyRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NavButton } from '../../shared/types/nav-button.model';
import { select, selectAll, transition } from 'd3';
import { Subject, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'ui-button',
    standalone: true,
    imports: [NgIf, MatIconModule],
    templateUrl: './ui-button.component.html',
    styleUrl: './ui-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent implements OnInit {
    @Input({required: true})
    public label!: string;

    @Input({required: true})
    public ariaLabel!: string;

    @Input()
    public hideLabel: boolean = false;

    @Input()
    public showLabelOnHover: boolean = false;

    @Input()
    public iconName?: string;

    @Output()
    public buttonClicked: EventEmitter<NavButton> = new EventEmitter();

    private labelUpdate$ = new Subject<boolean>();
    private readonly destroyRef = inject(DestroyRef);

    private labelContainer!: any;
    private letterSpans!: any;

    private readonly labelAppearDelayMillis: number = 150;
    private readonly labelDisappearDelayMillis: number = 110;

    public constructor(private readonly elementRef: ElementRef) {}

    public ngOnInit(): void {
        this.labelUpdate$.pipe(
            debounceTime(Math.max(this.labelAppearDelayMillis, this.labelDisappearDelayMillis)),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe((show: boolean) => this.updateLabelText(show))
    }

    public onMouseEnter(): void {
        this.labelUpdate$.next(true);
    }

    public onMouseLeave(): void {
        this.labelUpdate$.next(false);
    }

    public onClick(): void {
        this.buttonClicked.emit();
    }

    private updateLabelText(show: boolean): void {
        const letters: string[] = show
            ? this.label.split('')
            : [];

        this.labelContainer = select(this.elementRef.nativeElement)
            .selectAll('.ui-button__label-container')
            .data([letters]);

        this.letterSpans = this.labelContainer.selectAll('span')
            .data((d: string[]) => d, (d: string[], i: number) => `${d}-${i}`)

        this.letterSpans.enter()
            .append('span')
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
