import { OrderStatus } from "./order-status.enum";

export interface IOrder {
    id?: string,
    client: string,
    status: OrderStatus,
    item: { id: string, itemName: string },
    qty: number,
    notes?: string;
    createdIn: string;
    createdBy: { id: string, name: string };
    updatedBy?: { id: string, name: string };
}