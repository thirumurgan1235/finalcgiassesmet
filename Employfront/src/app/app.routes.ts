import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: 'employees', loadComponent: () => import('./components/employee-list/employee-list-new.component').then(m => m.EmployeeListNewComponent) },
  { path: 'employees/add', loadComponent: () => import('./components/employee-form/employee-form.component').then(m => m.EmployeeFormComponent) },
  { path: 'employees/edit/:id', loadComponent: () => import('./components/employee-form/employee-form.component').then(m => m.EmployeeFormComponent) },
  { path: '**', redirectTo: '/employees' }
];

