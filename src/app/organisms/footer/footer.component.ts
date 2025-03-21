import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UiButtonComponent } from "../../atoms/ui-button/ui-button.component";

@Component({
    selector: 'footer-section',
    standalone: true,
    imports: [UiButtonComponent],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {

}
