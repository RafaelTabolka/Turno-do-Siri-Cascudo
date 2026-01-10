import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderStatus } from '../interfaces/models/order/order-status.enum';
import { IPatchOrderStatusRequest } from '../interfaces/models/order/patch-order-status-request';
import { ICreateOrderResponse } from '../interfaces/models/order/create-order-response';
import { IOrder } from '../interfaces/models/order/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = '/api/orders';

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.baseUrl);
  }

  getOrderById(id: string): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.baseUrl}/${id}`);
  }

  registerOrder(order: IOrder): Observable<ICreateOrderResponse> {
    return this.http.post<ICreateOrderResponse>(this.baseUrl, order)
  }

  updateOrder(order: IOrder): Observable<IOrder> {
    return this.http.put<IOrder>(`${this.baseUrl}/${order.id}`, order);
  }

  updateOrderStatus(order: IOrder, statusOrder: OrderStatus): Observable<IOrder> {
    const body: IPatchOrderStatusRequest = {
      status: statusOrder
    };

    return this.http.patch<IOrder>(`${this.baseUrl}/${order.id}`, body); // Não pode passar como corpo da requisição o status. O corpo espera um objeto para que possa atualizar, se mandar o status vira somente uma string e o patch, put e register esperam um corpo de requisição
  }

  deleteOrder(order: IOrder): Observable<IOrder> {
    return this.http.delete<IOrder>(`${this.baseUrl}/${order.id}`);
  }
}
