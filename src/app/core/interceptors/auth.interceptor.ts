import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Só aplica quando estiver utilizando os dados mocados em mock/db.json
    if (!req.url.startsWith('/api')) {
        return next(req); // Caso não comece com /api, ENCERRA a função e segue a requisição sem adicionar token no header
    }

    // Pega o token de onde foi salvo o login
    const token = localStorage.getItem('accessToken');

    // Caso não tenha token, deixa a requisição seguir normal
    if (token === null) {
        return next(req); // Caso o token esteja vazio, ENCERRA a função e segue a requisição sem adicionar token no header
    }

    // Se tem token, cria uma cópia da requisição com o header Authorization
    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    // Envia a requisição modificada
    return next(authReq); // Após passar pelas duas validações acima, ai sim adiciona o token no cabeçalho da requisição
}

// req: a requisição atual (ex: POST /api/orders)

// next: a função que “continua o caminho” da requisição. Pensa num “corredor”:
    // Componente → HttpClient → Interceptor 1 → Interceptor 2 → Servidor
    // O next(...) é você falando: “beleza, pode seguir”. Porque o interceptor não manda a requisição sozinho. Ele só pode modificar e depois deixar ela seguir.
    // Se você não chamar next(...), a requisição simplesmente morre ali (não vai pro servidor).
    // next(req) = segue sem mudar nada
    // next(authReq) = segue com a requisição clonada contendo o header

// startsWith('/api'): garante que você só põe token no que é do seu backend/proxy

// localStorage.getItem(...): pega o token salvo no login

// req.clone(...): cria uma cópia com header novo (porque req não pode ser alterada direto)

// Authorization: Bearer ...: padrão de token mais comum em API real

// return next(authReq): manda a requisição alterada seguir viagem