import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
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

    @Output()
    public lightToggleEvent: EventEmitter<boolean> = new EventEmitter(false);

    private svg!: any;
    private horizonHouse!: any;
    private horizonHouseWindow!: any;
    private horizonHouseDoor!: any;

    private lightsOn: boolean = false;
    private doorOpen: boolean = false;

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

        this.horizonHouseWindow = this.horizonHouse
            .append('rect')
            .attr('class', BuildingsVisualClasses.horizonHouseWindow)
            .attr('width', 7)
            .attr('height', 7)
            .attr('transform', 'translate(6, 4)');

        this.horizonHouseDoor = this.horizonHouse
            .append('rect')
            .attr('class', BuildingsVisualClasses.horizonHouseDoor)
            .attr('height', 18)
            .attr('transform', 'translate(24, 2)');

        this.horizonHouse
            .append('rect')
            .attr('class', BuildingsVisualClasses.horizonHouseGroupInteract)
            .attr('width', 50)
            .attr('height', 52)
            .attr('transform', 'translate(-5 -28)')
            .on('mouseover', () => this.setLights(true))
            .on('mouseout', () => this.setLights(false))
            .on('click', () => this.toggleDoor());
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

    private setLights(value: boolean): void {
        if (this.doorOpen) {
            return;
        }

        this.lightsOn = value;
        this.horizonHouseWindow.classed(BuildingsVisualClasses.horizonHouseWindowLightsOn, this.lightsOn);
        this.horizonHouseWindow.classed(BuildingsVisualClasses.horizonHouseWindowLightsOff, !this.lightsOn);
    }

    private toggleDoor(): void {
        this.doorOpen = !this.doorOpen;
        this.horizonHouseDoor.classed(BuildingsVisualClasses.horizonHouseDoorLightsOn, this.doorOpen);
        this.horizonHouseDoor.classed(BuildingsVisualClasses.horizonHouseDoorLightsOff, !this.doorOpen);
        this.lightToggleEvent.emit(this.doorOpen);

        if (this.doorOpen) {
            this.setLights(true);
        }
    }
}
