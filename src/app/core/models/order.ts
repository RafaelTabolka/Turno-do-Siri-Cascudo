import { OrderStatus } from "./order-status.enum";

export interface Order {
    id: string,
    client: string,
    status: OrderStatus,
    item: string,
    qty: number,
    notes?: string;
}