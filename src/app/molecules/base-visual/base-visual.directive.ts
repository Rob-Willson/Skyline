import { AfterViewInit, DestroyRef, Directive, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';

// NOTE on host styling:
// display: block - Ensure the component behaves as a block element so that it can be styled correctly, without relying on the parent. 
//                  This is required due to encapsulation. 
// pointer-events: none - makes sure that upper layers don't block interactions with lower layers. 
//                        We do this at the component-level because otherwise even a fully transparent upper will block events. 
@Directive({
    standalone: true,
    host: { 'style': 'display: block; pointer-events: none;' },
})
export abstract class BaseVisualDirective implements OnChanges, OnInit, AfterViewInit {
    @Input({ required: true })
    public width!: number;

    @Input({ required: true })
    public height!: number;

    // Your component **must** include an element with #containerElement
    // e.g. `<div #containerElement></div>`
    @ViewChild('containerElement', { static: true })
    public containerElement!: ElementRef<HTMLElement>;

    protected isInitialised: boolean = false;

    private readonly dimensionsReady = new ReplaySubject<void>();
    private readonly viewReady = new ReplaySubject<void>();

    protected readonly destroyRef: DestroyRef = inject(DestroyRef);

    public ngOnInit(): void {
        combineLatest([
            this.dimensionsReady,
            this.viewReady,
            this.getData(),
        ])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ([_, __, data]: [void, void, unknown]) => {
                    if (!this.isInitialised) {
                        this.initialise();
                        this.isInitialised = true;
                    }
    
                    this.processData(data);
                    this.update();
                },
                error: (error) => console.log(`Failed to get data on '${this.constructor.name}'`, error),
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ((!changes['width'] || !changes['width'].currentValue) && (!changes['height'] || !changes['height'].currentValue)) {
            return;
        }

        if (this.width === 0 || this.height === 0) {
            return;
        }

        this.dimensionsReady.next();
    }

    public ngAfterViewInit(): void {
        if (!this.containerElement) {
            console.error(`Element 'containerElement' is missing from '${this.constructor.name}'`);
            return;
        }

        this.viewReady.next();
    }

    protected abstract getData(): Observable<unknown>;
    protected abstract processData(data: unknown): void;
    protected abstract initialise(): void;
    protected abstract update(): void;
}
