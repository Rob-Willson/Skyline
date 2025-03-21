import { Routes } from '@angular/router';
import { CityscapePageComponent } from './pages/cityscape/cityscape-page.component';

export const routes: Routes = [
    { path: '', component: CityscapePageComponent, data: { title: 'Home' } },
];
