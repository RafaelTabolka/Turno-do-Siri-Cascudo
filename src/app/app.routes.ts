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
        .then((m) => m.LoginComponent)
    },
    {
        path: 'order',
        component: AppLayoutComponent,
        children: [
            {
                path: 'list',
                loadComponent: () => import('./pages/order/list/list.component')
                .then((m) => m.ListComponent)
            },
            {
                path: 'list/:id',
                loadComponent: () => import('./pages/order/details/details.component')
                .then((m) => m.DetailsComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./pages/order/register/register.component')
                .then((m) => m.RegisterComponent)
            }
        ]
    },

    {path: '**', redirectTo: 'login'}
];
