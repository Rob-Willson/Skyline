import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PointMagnitude } from '../shared/types/point.model';

@Injectable({
    providedIn: 'root'
})
export class StarsService {
    private mockStarData: PointMagnitude[] = [];

    private readonly maxStarCount: number = 300;

    public fetchStarData(count: number): Observable<PointMagnitude[]> {
        if (this.mockStarData.length === 0) {
            this.mockStarData = this.generateStarData();
        }

        if (count > this.maxStarCount) {
            console.error(`StarsService | fetchStarData(): count: '${count}', exceeds the maximum allowed: '${this.maxStarCount}'.`);
        }

        return of(this.mockStarData.slice(0, count));
    }

    private generateStarData(count: number = this.maxStarCount): PointMagnitude[] {
        const data: PointMagnitude[] = [];

        for (let i = 0; i < count; i++) {
          data.push({
            x: +(Math.random().toFixed(2)),
            y: +(Math.random().toFixed(2)),
            magnitude: +(Math.random() * 3.5 + 1.0).toFixed(2), // Range: 0.5 to 4.0
          });
        }
      
        return data;
    }
}
