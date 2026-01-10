import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";

export const authGuard: CanMatchFn = () => {
    const router = inject(Router); // Injeta o router sem a utilização de um construtor
    const token = localStorage.getItem('accessToken'); // Pega o token do localStorage

    if (token !== null) {
        return true;
    }

    return router.createUrlTree(['/login']);
}