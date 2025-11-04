import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'task-board',
    loadComponent: () =>
      import('./components/board/board.component').then(
        (m) => m.BoardComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
];
