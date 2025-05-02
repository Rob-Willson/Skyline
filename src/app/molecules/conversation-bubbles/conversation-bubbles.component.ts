import { ChangeDetectionStrategy, Component, EventEmitter, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { ConversationCase, ConversationState } from '../../shared/types/conversation.model';
import { NgFor, NgStyle } from '@angular/common';
import { BaseVisualDirective } from '../base-visual/base-visual.directive';
import { select } from 'd3';
import { UiButtonComponent } from '../../atoms/ui-button/ui-button.component';

@Component({
    selector: 'conversation-bubbles',
    standalone: true,
    imports: [NgFor, NgStyle, UiButtonComponent],
    templateUrl: './conversation-bubbles.component.html',
    styleUrl: './conversation-bubbles.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,  // Required for styles to affect svg
})
export class ConversationBubblesComponent extends BaseVisualDirective<ConversationState> implements OnChanges {
    @Output()
    public select: EventEmitter<ConversationCase> = new EventEmitter();

    public lastSelection?: ConversationCase = undefined;

    private svg!: any;
    private defs!: any;
    private defsClipPathRect!: any;

    private readonly horizonPositionFraction: number = 0.666;

    public onSelect(selectedCase: ConversationCase): void {
        this.select.emit(selectedCase);
        this.lastSelection = selectedCase;
    }

    public getBubbleYOffset(i: number): { [key: string]: string } {
        const radius: number = 80;
        const totalCount: number = this.data.cases.length;
        const arcStart = -Math.PI / 3;
        const arcEnd = Math.PI / 3;
    
        const t = (i + 0.5) / totalCount;
        const angle = arcStart + t * (arcEnd - arcStart);
    
        const yOffset = (1 - Math.cos(angle)) * radius;
    
        return {
            'margin-top': `${yOffset}px`
        };
    }

    protected override validateExternalData(data: ConversationState): boolean {
        return data.cases?.length > 0;
    }

    protected initialise(): void {
        this.generageSvg();
        this.generateSvgDefs();
        this.generateSvgElements();
    }

    protected override update(): void {
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
    }

    private generateSvgElements(): void {

    }

    private getMaxDimension = (): number => {
        return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
    }
}
