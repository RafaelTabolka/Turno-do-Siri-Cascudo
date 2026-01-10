import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { OrderStatus } from '../../../core/interfaces/models/order/order-status.enum';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../../components/modal/confirm/confirm.component';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IOrder } from '../../../core/interfaces/models/order/order';

@Component({
  selector: 'app-list',
  imports: [RouterLink, NgbModalModule, ReactiveFormsModule],
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

  readonly formFilter: FormGroup<{
    clientName: FormControl<string>;
    orderStatus: FormControl<string>;
  }>;

  orders: IOrder[] = [];
  allOrders: IOrder[] = [];
  totalOrders: number = 0;

  page: number = 1;
  pageSize: number = 3;

  constructor(
    private orderService: OrderService,
    private modal: NgbModal,
    private fb: NonNullableFormBuilder) {
    this.formFilter = this.fb.group({
      clientName: ['', [Validators.pattern(/\S+/)]],
      orderStatus: ['']
    });
  }

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: (ordersResponse) => {
        this.orders = ordersResponse;
        this.allOrders = ordersResponse;

        this.recalcSummary();
      },

      error: (err) => {
        alert(err.error);
      }
    })
  }

  private countStatuses(): void {
    this.orders.forEach((order) => {
      this.counts[order.status]++;
    })
  }

  private resetCounts(): void {
    this.counts = {
      [OrderStatus.Novo]: 0,
      [OrderStatus.Preparando]: 0,
      [OrderStatus.Entregue]: 0
    }
  }

  private countTotalOrders(): void {
    this.totalOrders = this.orders.length;
  }

  private recalcSummary(): void {
    this.resetCounts();
    this.countStatuses();
    this.countTotalOrders();
  }

  changeStatus(order: IOrder): void {
    const oldStatus: OrderStatus = order.status;
    const newStatus: OrderStatus = this.nextStatus[order.status];

    this.orderService.updateOrderStatus(order, newStatus).subscribe({
      next: () => {
        order.status = newStatus;

        this.counts[oldStatus]--;
        this.counts[newStatus]++;
      },
      error: (err) => {
        alert(err.error ?? 'Erro')
      }
    })

  }

  deleteOrder(orderParam: IOrder): void {
    const modalRef = this.modal.open(ConfirmComponent, { centered: true, backdrop: 'static' });

    modalRef.componentInstance.title = 'Excluir pedido';
    modalRef.componentInstance.message = `Excluir o pedido de ${orderParam.client}? Essa ação não terá volta!`;


    modalRef.result
      .then((confirm: boolean) => {
        if (!confirm) {
          return;
        }

        this.orderService.deleteOrder(orderParam).subscribe({
          next: () => {
            this.orders = this.orders.filter((order) => order.id !== orderParam.id);
            this.recalcSummary();
            this.fixPage();
          },

          error: (err) => {
            alert(err?.error ?? 'Erro') // o que isso significa: err?.error se err não estiver vazio, pegar error, caso contrário mostra 'Erro'
          }
        })
      })
  }

  makeFilters(): void {
    const clientName: string = (this.formFilter.controls.clientName.value ?? '').trim().toLocaleLowerCase();
    const orderStatus: string = this.formFilter.controls.orderStatus.value ?? '';

    this.orders = this.allOrders.filter((order: IOrder) => {
      const matchName: boolean = clientName === '' || order.client.toLocaleLowerCase().includes(clientName);
      const matchStatus: boolean = orderStatus === '' || order.status === orderStatus;
      return matchName && matchStatus;
    })

    this.recalcSummary();
    this.fixPage();
  }

  clearFilters(): void {
    this.formFilter.reset();
    this.orders = this.allOrders;
    this.recalcSummary();
    this.fixPage();
  }

  totalPages(): number {
    let pages = 0;
    let totalItens = this.orders.length;
    
    while (totalItens > 0) {
      pages++;
      totalItens -= this.pageSize;
    }

    return pages === 0 ? 1 : pages;
  }

  showItensPerPage(): IOrder[] {
    let start: number = 0;
    let i: number = 1;

    while (i < this.page) {
      start += this.pageSize;
      i++;
    }

    const end = start + this.pageSize;

    return this.orders.slice(start, end);
  }

  pages(): number[] {
    const numbers: number[] = [];

    let p = 1;
    while (p <= this.totalPages()) {
      numbers.push(p);
      p++
    }

    return numbers;
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) {
      return;
    }
    
    this.page = p;
  }

  fixPage(): void {
    const totalPages = this.totalPages();

    if (this.page > totalPages) {
      this.page = totalPages;
    }

    if (this.page < 1) {
      this.page = 1;
    }
  }
}
