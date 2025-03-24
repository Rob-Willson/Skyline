import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseVisualDirective } from '../base-visual/base-visual.directive';
import { select } from 'd3';

@Component({
    selector: 'buildings-visual',
    standalone: true,
    imports: [],
    templateUrl: './buildings-visual.component.html',
    styleUrl: './buildings-visual.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,  // Required for styles to affect svg
})
export class BuildingsVisualComponent extends BaseVisualDirective {
    @ViewChild('buildingsContainerElement', { static: true })
    public buildingsContainerElement!: ElementRef<HTMLElement>;

    private svg!: any;
    private horizonHouse!: any;

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

        this.horizonHouse
            .attr('transform', `translate(${maxDimension / 2 - 20}, ${horizonPosition - 10})`)
    }

    private generateSvg(): void {
        this.svg = select(this.buildingsContainerElement.nativeElement)
            .append('svg');

        this.horizonHouse = this.svg
            .append('g')
            .attr('class', 'buildings-visual__container__horizon-house-g');
        this.horizonHouse
            .append('rect')
            .attr('class', 'buildings-visual__container__horizon-house-g__base')
            .attr('width', 40)
            .attr('height', 28);
        this.horizonHouse
            .append('rect')
            .attr('class', 'buildings-visual__container__horizon-house-g__roof')
            .attr('width', 32)
            .attr('height', 32)
            .attr('transform', 'translate(0 -16), rotate(45, 20, 20)');
        this.horizonHouse
            .append('rect')
            .attr('class', 'buildings-visual__container__horizon-house-g__chimney')
            .attr('width', 7)
            .attr('height', 20)
            .attr('transform', 'translate(28, -20)');
    }

    private getMaxDimension(): number {
        return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
    }
}
