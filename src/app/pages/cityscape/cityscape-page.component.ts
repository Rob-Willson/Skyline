import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NavButton } from '../../shared/types/nav-button.model';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'cityscape-page',
    standalone: true,
    imports: [],
    templateUrl: './cityscape-page.component.html',
    styleUrl: './cityscape-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityscapePageComponent implements OnInit {
    private readonly headerButtons: NavButton[] = [
        { id: 'about', label: 'About', ariaLabel: 'About', iconName:'help', hideLabel: true, showLabelOnHover: true }
    ];

    private readonly footerButtons: NavButton[] = [
        { id: 'contact', label: 'Contact', ariaLabel: 'Contact', iconName:'email', hideLabel: true, showLabelOnHover: true }
    ];

    public constructor(private readonly navService: NavigationService) {}

    public ngOnInit(): void {
        this.navService.setHeaderButtons(this.headerButtons);
        this.navService.setFooterButtons(this.footerButtons);
    }

}
