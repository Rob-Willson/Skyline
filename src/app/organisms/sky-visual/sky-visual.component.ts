import { Component, ElementRef, ViewChild, ChangeDetectionStrategy, OnInit, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { select, timer } from 'd3';
import { PointMagnitude } from '../../shared/types/point.model';

@Component({
    selector: 'app-sky-visual',
    standalone: true,
    imports: [],
    templateUrl: './sky-visual.component.html',
    styleUrl: './sky-visual.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,  // Required for styles to affect svg
    host: { 'style': 'display: block' },    // Ensure the component behaves as a block element so that it can be styled correctly
                                            //    without relying on the parent (required due to encapsulation)
})
export class SkyVisualComponent implements OnChanges {
    @Input({required: true})
    public data!: PointMagnitude[];

    @Input({required: true})
    public width!: number;

    @Input({required: true})
    public height!: number;

    @ViewChild('skyContainerElement', { static: true })
    public skyContainerElement!: ElementRef<HTMLElement>;

    private svg!: any;
    private starsContainer!: any;
    private stars!: any;

    public ngOnChanges(changes: SimpleChanges): void {
        if ((!changes['width'] || !changes['width'].currentValue) && (!changes['height'] || !changes['height'].currentValue)) {
            return;
        }

        if (this.width === 0 || this.height === 0) {
            return;
        }
        
        this.update();
    }

    private update(): void {
        if (!this.svg) {
            this.generateSvg();
        }

        const maxDimension = this.getMaxDimension();

        this.svg
            .attr('width', maxDimension)
            .attr('height', maxDimension)
            .attr('viewBox', `0 0 ${maxDimension} ${maxDimension}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        this.starsContainer
            .data([this.data]);

        this.stars = this.starsContainer.selectAll('g')
            .data(
                (d: PointMagnitude[]) => d,
                (d: PointMagnitude, i: number) => `${d.x}-${d.y}-${i}`,
            )
            .join('g')
                .attr('class', 'sky-visual__container__stars-g__star-g')
                .attr('transform', (d: PointMagnitude) => `translate (${d.x * maxDimension}, ${d.y * maxDimension})`)

        this.stars.selectAll('circle')
            .data((d: any) => [d])
            .join('circle')
                .attr('class', 'sky-visual__container__stars-g__star-g__circle')
                .attr('r', (d: PointMagnitude) => d.magnitude)
                .style('animation-delay', () => `${Math.random() * 2}s`);

    }

    private generateSvg(): void {
        this.svg = select(this.skyContainerElement.nativeElement)
            .append('svg');

        this.starsContainer = this.svg.append('g')
            .attr('class', 'sky-visual__container__stars-g');

        timer((elapsed) => {
            const maxDimension = this.getMaxDimension();
            const cx = maxDimension / 2;
            const cy = maxDimension / 2;
            const angle = (elapsed * 0.001) % 360;
            this.starsContainer.attr('transform', `rotate(${angle}, ${cx}, ${cy})`);
        });
    }

    private getMaxDimension(): number {
        return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
    }
}
