import { OrderStatus } from "../../models/order-status.enum"

export interface IUpdateOrderRequest {
    id: string,
    client: string,
    status: OrderStatus,
    item: string,
    qty: number,
    notes?: string;
}

// Por mais que a entidade contenha as mesmas informações que IUpdateOrderRequest, há o conceito de responsabilidade única, onde uma classe, nesse caso interface, tem apenas uma responsabilidade