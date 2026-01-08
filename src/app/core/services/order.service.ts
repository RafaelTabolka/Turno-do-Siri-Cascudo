import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Observable } from 'rxjs';
import { OrderStatus } from '../models/order-status.enum';
import { IPatchOrderStatusRequest } from '../interfaces/order/patch-order-status-request';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = '/api/orders';

  constructor(private http: HttpClient) { }

  public getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  public getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  public updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${order.id}`, order);
  }

  public updateOrderStatus(id: string, statusOrder: OrderStatus): Observable<Order> {
    const body: IPatchOrderStatusRequest = {
      status: statusOrder
    };

    return this.http.patch<Order>(`${this.baseUrl}/${id}`, body); // Não pode passar como corpo da requisição o status. O corpo espera um objeto para que possa atualizar, se mandar o status vira somente uma string e o patch, put e register esperam um corpo de requisição
  }

  public deleteOrder(id: string): Observable<Order> {
    return this.http.delete<Order>(`${this.baseUrl}/${id}`);
  }
}
