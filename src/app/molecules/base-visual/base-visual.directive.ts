import { AfterViewInit, DestroyRef, Directive, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, Observable, of, ReplaySubject } from 'rxjs';

// NOTE on host styling:
// display: block - Ensure the component behaves as a block element so that it can be styled correctly, without relying on the parent. 
//      This is required due to encapsulation. 
// pointer-events: none - makes sure that upper layers don't block interactions with lower layers. 
//      We do this at the component-level because otherwise even a fully transparent upper will block events. 
@Directive({
    standalone: true,
    host: { 'style': 'display: block; pointer-events: none;' },
})
export abstract class BaseVisualDirective<T> implements OnChanges, OnInit, AfterViewInit {
    @Input({ required: true })
    public data!: T;

    @Input({ required: true })
    public width!: number;

    @Input({ required: true })
    public height!: number;

    // Your component **must** include an element with #containerElement
    // e.g. `<div #containerElement></div>`
    @ViewChild('containerElement', { static: true })
    public containerElement!: ElementRef<HTMLElement>;

    protected isInitialised: boolean = false;

    private readonly dataReady = new ReplaySubject<void>();
    private readonly dimensionsReady = new ReplaySubject<void>();
    private readonly viewReady = new ReplaySubject<void>();

    protected readonly destroyRef: DestroyRef = inject(DestroyRef);

    public ngOnInit(): void {
        combineLatest([
            this.dimensionsReady,
            this.viewReady,
            this.dataReady,
            this.getDataInternal(),
        ])
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ([_, __, ___, dataInternal]: [void, void, void, unknown]) => {
                    if (!this.isInitialised) {
                        this.initialise();
                        this.isInitialised = true;
                    }
    
                    this.processDataInternal(dataInternal);
                    this.update();
                },
                error: (error) => console.log(`Failed to get data on '${this.constructor.name}'`, error),
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.validateExternalData(this.data)) {
            this.dataReady.next();
        }

        if (this.validateDimensions(this.width, this.height)) {
            this.dimensionsReady.next();
        }
    }

    public ngAfterViewInit(): void {
        if (!this.containerElement) {
            console.error(`Element 'containerElement' is missing from '${this.constructor.name}'`);
            return;
        }

        this.viewReady.next();
    }
    
    // 'Internal data' may be fetched by the visual component itself, instead of being passed in, when it's worth using an external service for (e.g. time). 
    // In most cases this won't be used and data will be passed in from the parent. 
    protected getDataInternal(): Observable<unknown> {
        return of(undefined);
    }

    protected processDataInternal(data: unknown): void {
    }
    
    protected validateDimensions(width: number, height: number): boolean {
        return width > 0 && height > 0;
    }

    protected abstract validateExternalData(data: T): boolean;

    protected abstract initialise(): void;
    protected abstract update(): void;
}
