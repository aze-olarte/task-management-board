import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard-container/dashboard-container.component').then(
        (m) => m.DashboardContainerComponent
      ),
  },
  {
    path: 'task-board',
    loadComponent: () =>
      import('./features/board/board-container/board-container.component').then(
        (m) => m.BoardContainerComponent
      ),
  }
];
