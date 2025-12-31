import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component')
        .then((l) => l.LoginComponent)
    },
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: 'order-list',
                loadComponent: () => import('./pages/order-list/order-list.component')
                .then((ol) => ol.OrderListComponent)
            },
            {
                path: 'order-details',
                loadComponent: () => import('./pages/order-details/order-details.component')
                .then((od) => od.OrderDetailsComponent)
            }
        ]
    },
    {
        path: 'order-details',
        loadComponent: () => import('./pages/order-details/order-details.component').then((od) => od.OrderDetailsComponent)
    },

    {path: '**', redirectTo: 'login'}
];
