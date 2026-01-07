import { OrderStatus } from "../../models/order-status.enum"

export interface ICreateOrderRequest {
    client: string,
    status: OrderStatus,
    item: string,
    qty: number,
    notes?: string; // Pode não haver observações, então utilizamos ? para indicar que pode vir vazio
}