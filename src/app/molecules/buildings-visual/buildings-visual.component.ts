import {
    ChangeDetectionStrategy,
    Component,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { BaseVisualDirective } from '../base-visual/base-visual.directive';
import { select } from 'd3';
import { BuildingsVisualClasses } from './buildings-visual.classes';

@Component({
    selector: 'buildings-visual',
    standalone: true,
    imports: [],
    templateUrl: './buildings-visual.component.html',
    styleUrl: './buildings-visual.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None, // Required for styles to affect svg
})
export class BuildingsVisualComponent extends BaseVisualDirective<void> {
    @Input({required: true})
    public horizonPositionFraction!: number;

    private svg!: any;
    private horizonHouse!: any;

    protected override validateExternalData(_: void): boolean {
        return true;
    }

    protected initialise(): void {
        this.svg = select(this.containerElement.nativeElement)
            .append('svg')
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        this.horizonHouse = this.svg
            .append('g')
            .attr('class', BuildingsVisualClasses.horizonHouseGroup);

        this.horizonHouse
            .append('rect')
            .attr('class', BuildingsVisualClasses.horizonHouseBase)
            .attr('width', 40)
            .attr('height', 28);

        this.horizonHouse
            .append('rect')
            .attr('class', BuildingsVisualClasses.horizonHouseRoof)
            .attr('width', 32)
            .attr('height', 32)
            .attr('transform', 'translate(0 -16), rotate(45, 20, 20)');

        this.horizonHouse
            .append('rect')
            .attr('class', BuildingsVisualClasses.horizonHouseChimney)
            .attr('width', 7)
            .attr('height', 20)
            .attr('transform', 'translate(28, -20)');

        this.horizonHouse
            .append('rect')
            .attr('class', BuildingsVisualClasses.horizonHouseWindow)
            .attr('width', 7)
            .attr('height', 7)
            .attr('transform', 'translate(6, 4)');
}

    protected override update(): void {
        const maxDimension = this.getMaxDimension();
        const horizonPosition = this.height * this.horizonPositionFraction;

        this.svg
            .attr('width', maxDimension)
            .attr('height', this.height)
            .attr('viewBox', `0 0 ${maxDimension} ${this.height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        this.horizonHouse.attr(
            'transform',
            `translate(${maxDimension / 2 - 20}, ${horizonPosition - 20})`
        );
    }

    private getMaxDimension(): number {
        return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
    }
}
