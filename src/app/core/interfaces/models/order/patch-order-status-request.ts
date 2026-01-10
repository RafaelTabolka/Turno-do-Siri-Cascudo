import { OrderStatus } from "./order-status.enum";

export interface IPatchOrderStatusRequest {
    status: OrderStatus;
}