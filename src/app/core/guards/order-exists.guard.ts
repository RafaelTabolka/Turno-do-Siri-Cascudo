import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { OrderService } from "../services/order.service";
import { catchError, map, of } from "rxjs";

export const orderExistsGuard: CanActivateFn = (route) => {
    const router = inject(Router);
    const orderService = inject(OrderService);

    const id = String(route.paramMap.get('id'));


    // Pipe é como se fosse uma esteira onde vão ter ações. Uma dessas ações é o map
    // Exemplo do que map faz:
    // of(10).pipe(
    //     map(x => x + 1)
    // )
    // of(10) emite 10.
    // map(x => x + 1) transforma 10 em 11.
    // Resultado final: emite 11.
    
    // A API, quando dá certo, devolve um Order (objeto do pedido):
    // getOrderById(id) emite: Order
    // Mas o guard não quer um Order. O guard quer uma decisão: true (pode entrar) ou UrlTree (redireciona)
    // Então você usa map pra transformar Order → true:
    // map(() => true)
    // Linha a linha dessa ideia
    // “Se chegou aqui, é porque a requisição deu certo.”
    // “Se deu certo, o pedido existe.”
    // “Se existe, o guard deve liberar entrada.”
    // Então eu devolvo true.

    return orderService.getOrderById(id).pipe(
        map(() => true),

        // of cria um observable que emite um valor e termina. Nesse caso é necessário porque o catchError espera como retorno um observable
        // of(x) = “cria um Observable que entrega x uma vez e finaliza”.
        // Exemplo:
        
        // of(123).subscribe(valor => {
        //   console.log(valor);
        // });
        
        // O que acontece
        // subscribe(...) = “começa”.
        // of(123) entrega um único valor: 123.
        // O console.log imprime 123.
        // Depois disso, acabou. Não tem segundo valor.
        // Saída: 123 
        catchError(() => of(router.createUrlTree(['/order/list'])))
    );
}