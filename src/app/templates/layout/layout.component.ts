import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { filter, map } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from "../../organisms/header/header.component";
import { FooterComponent } from "../../organisms/footer/footer.component";

@Component({
    selector: 'layout',
    standalone: true,
    imports: [RouterModule, RouterOutlet, MatButtonModule, MatIconModule, HeaderComponent, FooterComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
    @Input({ required: true })
    public siteName!: string;

    public pageTitle!: string;

    private readonly missingPageTitleFallback: string = '...';

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly titleService: Title,
    ) { }

    public ngOnInit(): void {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => this.activatedRoute.firstChild?.snapshot.data['title'] || this.missingPageTitleFallback),
            )
            .subscribe((title) => {
                this.pageTitle = title;
                const newTitle: string = `${this.siteName} | ${this.pageTitle}`;
                this.titleService.setTitle(newTitle);
            });
    }
}
