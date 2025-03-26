import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, interval, map, Observable, startWith, switchMap, timer } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TimeService {
    private readonly timeSubject: BehaviorSubject<Date> = new BehaviorSubject(new Date());

    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    private readonly MILLIS_IN_ONE_MINUTE: number = 60000;

    public constructor() {
        const millisUntilNextMinute: number = this.getMillisUntilNextMinute();

        timer(millisUntilNextMinute).pipe(
            switchMap(() => interval(this.MILLIS_IN_ONE_MINUTE)
                .pipe(startWith(0))
            ),
            map(() => new Date()),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe((time: Date) => {
            this.timeSubject.next(time);
        });
    }

    public getTime(): Observable<Date> {
        return this.timeSubject.asObservable()
    }

    public getTimeFormatted(): Observable<string> {
        return this.getTime()
            .pipe(map((now: Date) => {
                return now.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });
            }));
    }

    private getMillisUntilNextMinute(): number {
        const now: Date = new Date();
        const millisSinceLastMinute: number = (now.getSeconds() * 1000) + now.getMilliseconds();
        return this.MILLIS_IN_ONE_MINUTE - millisSinceLastMinute;
    }
}
