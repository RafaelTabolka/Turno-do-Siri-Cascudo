import { OrderStatus } from "../../models/order-status.enum";

export interface IPatchOrderStatusRequest {
    status: OrderStatus;
}