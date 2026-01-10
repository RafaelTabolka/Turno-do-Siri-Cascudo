import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { orderExistsGuard } from './core/guards/order-exists.guard';

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
        canMatch: [authGuard],
        children: [
            {
                path: 'list',
                loadComponent: () => import('./pages/order/list/list.component')
                .then((m) => m.ListComponent)
            },
            {
                path: 'list/:id',
                loadComponent: () => import('./pages/order/details/details.component')
                .then((m) => m.DetailsComponent),
                canActivate: [orderExistsGuard]
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
