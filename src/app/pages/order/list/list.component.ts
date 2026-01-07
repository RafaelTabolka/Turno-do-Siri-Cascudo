import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { OrderStatus } from '../../../core/models/order-status.enum';
import { Order } from '../../../core/models/order';

@Component({
  selector: 'app-list',
  imports: [RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  counts: Record<OrderStatus, number> = {
    [OrderStatus.Novo]: 0,
    [OrderStatus.Preparando]: 0,
    [OrderStatus.Entregue]: 0
  };

  nextStatus: Record<OrderStatus, OrderStatus> = {
    [OrderStatus.Novo]: OrderStatus.Preparando,
    [OrderStatus.Preparando]: OrderStatus.Entregue,
    [OrderStatus.Entregue]: OrderStatus.Novo
  };

  imgStatus: Record<OrderStatus, string> = {
    [OrderStatus.Novo]: '/assets/img/img-order-list/img_new_order.png',
    [OrderStatus.Preparando]: '/assets/img/img-order-list/img_oder_in_preparation.png',
    [OrderStatus.Entregue]: '/assets/img/img-order-list/img_delivered_order.png',
  };

  orders: Order[] = [];

  totalOrders: number = 0;

  constructor(private orderService: OrderService) {}
  
  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: (ordersResponse) => {
        
        ordersResponse.forEach((order) => {
          this.counts[order.status]++;
        })

        this.orders = ordersResponse;

        this.totalOrders = this.counts.novo + this.counts.preparando + this.counts.entregue;
      },

      error: (err) => {
        alert(err.error);
      }
    })
  }

  changeStatus(order: Order): void {
    const oldStatus: OrderStatus = order.status;
    const newStatus: OrderStatus = this.nextStatus[order.status];

    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: (orderResponse) => {
        console.log(orderResponse)
      }
    })

    // order.status = newStatus;

    this.counts[oldStatus]--
    this.counts[newStatus]++
  }
}
