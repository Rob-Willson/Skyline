import { Component, ElementRef, ViewChild, ChangeDetectionStrategy, Input, ViewEncapsulation } from '@angular/core';
import { select, timer } from 'd3';
import { PointMagnitude } from '../../shared/types/point.model';
import { BaseVisualDirective } from '../base-visual/base-visual.directive';

@Component({
    selector: 'sky-visual',
    standalone: true,
    imports: [],
    templateUrl: './sky-visual.component.html',
    styleUrl: './sky-visual.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,  // Required for styles to affect svg
})
export class SkyVisualComponent extends BaseVisualDirective {
    @Input({required: true})
    public data!: PointMagnitude[];

    @ViewChild('skyContainerElement', { static: true })
    public skyContainerElement!: ElementRef<HTMLElement>;

    private svg!: any;
    private defs!: any;
    private defsClipPathRect!: any;
    private defsHorizonGlareRadialGradient!: any;
    private horizonGlare!: any;
    private horizonLine!: any;
    private starsContainer!: any;
    private stars!: any;

    private readonly horizonPositionFraction: number = 0.666;

    protected override update(): void {
        if (!this.svg) {
            this.generateSvg();
        }

        const maxDimension = this.getMaxDimension();
        const horizonPosition = maxDimension * this.horizonPositionFraction;

        this.svg
            .attr('width', maxDimension)
            .attr('height', maxDimension)
            .attr('viewBox', `0 0 ${maxDimension} ${maxDimension}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        this.defsClipPathRect
            .attr('width', maxDimension)
            .attr('height', horizonPosition);

        this.horizonGlare
            .attr('rx', maxDimension / 2)
            .attr('ry', 300)
            .attr('cx', maxDimension / 2)
            .attr('cy', horizonPosition);

        this.horizonLine
            .attr('x1', 0)
            .attr('y1', horizonPosition)
            .attr('x2', maxDimension)
            .attr('y2', horizonPosition);

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
                // .style('animation-delay', () => `${Math.random() * 2 + 2}s`);

        this.stars.selectAll('circle')
            .data((d: any) => [d])
            .join('circle')
                .attr('class', 'sky-visual__container__stars-g__star-g__circle')
                .attr('r', (d: PointMagnitude) => d.magnitude)
                .transition()
                .delay(3000)
                .style('animation-delay', () => `${Math.random() * 2}s`);

    }

    private generateSvg(): void {
        this.svg = select(this.skyContainerElement.nativeElement)
            .append('svg')
            .attr('clip-path', 'url(#horizon)');

        this.defs = this.svg
            .append('defs');

        this.defsClipPathRect = this.defs
            .append('clipPath')
            .attr('id', 'horizon')
            .append('rect');

        this.defsHorizonGlareRadialGradient = this.defs
            .append('radialGradient')
            .attr('id', 'horizon-glare')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '50%')
            .attr('fx', '50%')
            .attr('fy', '50%')
            .selectAll('stop')
            .data([
              { offset: '0%', color: 'rgb(83, 107, 117)', opacity: 0.6 },
              { offset: '60%', color: 'rgb(25, 53, 53)', opacity: 0.6 },
              { offset: '100%', color: 'rgb(26, 28, 30)', opacity: 0 },
            ])
            .enter()
            .append('stop')
            .attr('offset', (d: any) => d.offset)
            .attr('stop-color', (d: any) => d.color)
            .attr('stop-opacity', (d: any) => d.opacity);

        this.starsContainer = this.svg.append('g')
            .attr('class', 'sky-visual__container__stars-g');

        this.horizonGlare = this.svg
            .append('ellipse')
            .attr('class', 'sky-visual__container__horizon-glare');

        this.horizonLine = this.svg
            .append('line')
            .attr('class', 'sky-visual__container__horizon-line');

        timer((elapsed) => {
            const maxDimension = this.getMaxDimension();
            const cx = maxDimension * 0.5;
            const cy = maxDimension * this.horizonPositionFraction;
            const angle = (elapsed * 0.001) % 360;
            this.starsContainer.attr('transform', `rotate(${angle}, ${cx}, ${cy})`);
        });
    }

    private getMaxDimension(): number {
        return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
    }
}
