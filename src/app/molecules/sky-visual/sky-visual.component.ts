import {
    Component,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    inject,
    Input,
} from '@angular/core';
import { select, timer } from 'd3';
import { PointMagnitude } from '../../shared/types/point.model';
import { BaseVisualDirective } from '../base-visual/base-visual.directive';
import { TimeService } from '../../services/time-service';
import { SkyVisualClasses } from './sky-visual.classes';
import { Observable } from 'rxjs';

@Component({
    selector: 'sky-visual',
    standalone: true,
    imports: [],
    templateUrl: './sky-visual.component.html',
    styleUrl: './sky-visual.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,  // Required for styles to affect svg
})
export class SkyVisualComponent extends BaseVisualDirective<PointMagnitude[]> {
    @Input({required: true})
    public horizonPositionFraction!: number;

    private currentTimeFormatted!: string;

    private svg!: any;
    private defs!: any;
    private defsClipPathRect!: any;
    private horizonGlareContainer!: any;
    private horizonGlareLower!: any;
    private horizonGlareUpper!: any;
    private horizonLine!: any;
    private starsPositionContainer!: any;
    private starsRotationContainer!: any;
    private stars!: any;
    private sunAndMoonContainer!: any;
    private moonContainer!: any;
    private moon!: any;
    private moonText!: any;

    private readonly timeService: TimeService = inject(TimeService);

    protected override validateExternalData(data: PointMagnitude[]): boolean {
        return data?.length > 0;
    }

    protected override processDataInternal(data: string): void {
        this.currentTimeFormatted = data;
    }

    protected override getDataInternal(): Observable<string> {
        return this.timeService.getTimeFormatted();
    }

    protected initialise(): void {
        this.generageSvg();
        this.generateSvgDefs();
        this.generateSvgElements();
        this.startLuminaryRotations();
    }

    protected override update(): void {
        const maxDimension = this.getMaxDimensionExpanded();
        const horizonPosition = this.getHorizonPosition();

        this.svg
            .attr('width', maxDimension)
            .attr('height', maxDimension)
            .attr('viewBox', `0 0 ${maxDimension} ${maxDimension}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        this.defsClipPathRect
            .attr('width', maxDimension)
            .attr('height', horizonPosition);

        this.sunAndMoonContainer.attr(
            'transform',
            `translate(${maxDimension * 0.5}, ${horizonPosition})`
        );

        this.moonContainer.attr('transform', `rotate(270) translate(200, 0)`);

        const moonRadius: number = 40;
        this.moon.attr('r', moonRadius);

        this.moonText.text(this.currentTimeFormatted);

        this.horizonGlareLower
            .attr('rx', maxDimension * 0.6)
            .attr('ry', 400)
            .attr('cx', maxDimension * 0.5)
            .attr('cy', horizonPosition);

        this.horizonGlareUpper
            .attr('rx', maxDimension * 0.5)
            .attr('ry', 300)
            .attr('cx', maxDimension * 0.5)
            .attr('cy', horizonPosition);

        this.horizonLine
            .attr('x1', 0)
            .attr('y1', horizonPosition)
            .attr('x2', maxDimension)
            .attr('y2', horizonPosition);

        this.starsRotationContainer.data([this.data]);

        this.stars = this.starsRotationContainer
            .selectAll('g')
            .data(
                (d: PointMagnitude[]) => d,
                (d: PointMagnitude, i: number) => `${d.x}-${d.y}-${i}`
            )
            .join(
                (enter: any) => enter
                    .append('g')
                    .attr('class', SkyVisualClasses.starGroup)
                    .attr('transform', (d: PointMagnitude) => `translate (${d.x * maxDimension}, ${d.y * maxDimension})`),
                (update: any) => update,
                (exit: any) => exit
                    .attr('opacity', 1)
                    .transition()
                    .duration(1500)
                    .attr('opacity', 0)
                    .remove()
            );

        this.stars
            .selectAll('circle')
            .data((d: PointMagnitude) => [d])
            .join('circle')
            .attr('class', SkyVisualClasses.starCircle)
            .attr('r', (d: PointMagnitude) => d.magnitude)
            .style('animation-delay', () => `${Math.random() * 2}s`);
    }

    private generageSvg(): void {
        this.svg = select(this.containerElement.nativeElement)
            .append('svg')
            .attr('clip-path', 'url(#horizon)');
    }

    private generateSvgDefs() {
        this.defs = this.svg.append('defs');

        this.defsClipPathRect = this.defs
            .append('clipPath')
            .attr('id', 'horizon')
            .append('rect');

        this.defs
            .append('radialGradient')
            .attr('id', 'horizon-glare-upper')
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

        this.defs
            .append('radialGradient')
            .attr('id', 'horizon-glare-lower')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '50%')
            .attr('fx', '50%')
            .attr('fy', '60%')
            .selectAll('stop')
            .data([
                { offset: '0%', color: 'rgb(26, 28, 30)', opacity: 1.0 },
                { offset: '50%', color: 'rgb(26, 28, 30)', opacity: 1.0 },
                { offset: '100%', color: 'rgb(26, 28, 30)', opacity: 0 },
            ])
            .enter()
            .append('stop')
            .attr('offset', (d: any) => d.offset)
            .attr('stop-color', (d: any) => d.color)
            .attr('stop-opacity', (d: any) => d.opacity);
    }

    private generateSvgElements(): void {
        this.starsPositionContainer = this.svg
            .append('g')
            .attr('class', SkyVisualClasses.starsPositionGroup);
        this.starsRotationContainer = this.starsPositionContainer
            .append('g')
            .attr('class', SkyVisualClasses.starsRotationGroup);

        this.horizonGlareContainer = this.svg
            .append('g')
            .attr('class', SkyVisualClasses.horizonGlareGroup);
        this.horizonGlareLower = this.horizonGlareContainer
            .append('ellipse')
            .attr('class', SkyVisualClasses.horizonGlareLower);
        this.horizonGlareUpper = this.horizonGlareContainer
            .append('ellipse')
            .attr('class', SkyVisualClasses.horizonGlareUpper);

        this.sunAndMoonContainer = this.svg
            .append('g')
            .attr('class', SkyVisualClasses.sunAndMoonGroup);
        this.moonContainer = this.sunAndMoonContainer
            .append('g')
            .attr('class', SkyVisualClasses.moonGroup);
        this.moon = this.moonContainer
            .append('circle')
            .attr('class', SkyVisualClasses.moonCircle)
            .on('mouseover', () => {
                this.moonText.classed(SkyVisualClasses.moonTextHover, true);
            })
            .on('mouseout', () => {
                this.moonText.classed(SkyVisualClasses.moonTextHover, false);
            });

        this.moonText = this.moonContainer
            .append('text')
            .attr('class', SkyVisualClasses.moonText)
            .attr('y', 2);

        this.horizonLine = this.svg
            .append('line')
            .attr('class', SkyVisualClasses.horizonLine);
    }

    private startLuminaryRotations(): void {
        timer((elapsed) => {
            const starsRotationAngle = (elapsed * 0.001) % 360;

            const maxDimension = this.getMaxDimensionExpanded();
            const centerVsHorizonYPosDelta: number = this.getCenterVsHorizonYPosDelta();

            // Offset outer stars container so that it's centred on the horizon
            this.starsPositionContainer.attr('transform', `translate(0, ${centerVsHorizonYPosDelta})`)

            // Rotate inner stars container around its center
            this.starsRotationContainer.attr('transform', `rotate(${starsRotationAngle}, ${maxDimension / 2}, ${maxDimension / 2})`);

            const moonRotationAngle = (elapsed * 0.005) % 360;
            const moonOffset = this.width > this.height
                ? this.height * 0.45
                : this.height * 0.4;
            this.moonContainer.attr(
                'transform',
                `rotate(${moonRotationAngle}) translate(-${moonOffset}, ${moonOffset})`
            );
            this.moonText.attr('transform', `rotate(-${moonRotationAngle})`);
        });
    }

    // Working with the expanded size is important because the stars container is offset and rotated
    private getMaxDimensionExpanded = (): number => {
        const maxDimension: number = Math.max(this.width, this.height);
        const maxDimensionExpanded = Math.sqrt(Math.pow(maxDimension, 2) * 2);
        return maxDimensionExpanded;
    }

    private getHorizonPosition = (): number => {
        const excessHeight: number = this.getMaxDimensionExpanded() - this.height;
        const horizonPosition = this.height * this.horizonPositionFraction + (excessHeight / 2);
        return horizonPosition;
    }

    private getCenterVsHorizonYPosDelta = (): number => {
        return this.getHorizonPosition() - (this.getMaxDimensionExpanded() / 2)
    }
}
