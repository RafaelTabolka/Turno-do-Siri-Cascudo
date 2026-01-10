import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderStatus } from '../../../core/interfaces/models/order/order-status.enum';
import { ItemsService } from '../../../core/services/items.service';
import { OrderService } from '../../../core/services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageComponent } from '../../../components/modal/message/message.component';
import { IOrder } from '../../../core/interfaces/models/order/order';
import { IItem } from '../../../core/interfaces/models/item/item';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  readonly formRegister: FormGroup<{
    clientName: FormControl<string>;
    orderStatus: FormControl<OrderStatus>;
    orderItem: FormControl<string>;
    qty: FormControl<number>;
    observations: FormControl<string>;
  }>

  items: IItem[] = [];

  constructor(private fb: NonNullableFormBuilder,
    private itemService: ItemsService,
    private orderService: OrderService,
    private modal: NgbModal
  ) {
    this.formRegister = this.fb.group({
      clientName: ['', [Validators.required, Validators.pattern(/\S+/)]],
      orderStatus: [OrderStatus.Novo, [Validators.required, Validators.pattern(/\S+/)]],
      orderItem: ['', [Validators.required, Validators.pattern(/\S+/)]],
      qty: [1, [Validators.required, Validators.min(1), Validators.pattern(/\S+/)]],
      observations: ['']
    })
  }

  ngOnInit(): void {
    this.itemService.getAllItems().subscribe({
      next: (itemsResponse) => {
        this.items = itemsResponse;
      }
    })
  }

  onSubmit(): void {
    if (this.formRegister.invalid) {
      return
    }

    const current = this.formRegister.getRawValue();

    const matchItem = this.items.find((item) => item.id === current.orderItem);
    
    if (matchItem === undefined) {
      return
    }
    
    const idLocalStorage = localStorage.getItem('id');
    const nameLocalStorage = localStorage.getItem('name');

    if (idLocalStorage === null || nameLocalStorage === null) {
      return
    }

    const currentDate = new Date().toLocaleDateString('en-CA')

    const order: IOrder = {
      client: current.clientName,
      status: current.orderStatus,
      item: {
        id: matchItem.id,
        itemName: matchItem.itemName
      },
      qty: current.qty,
      notes: current.observations,
      createdIn: currentDate,
      createdBy: {
        id: idLocalStorage,
        name: nameLocalStorage
      }
    }

    this.orderService.registerOrder(order).subscribe({
      next: () => {
        const modalRef = this.modal.open(MessageComponent, { centered: true, backdrop: 'static' });

        modalRef.componentInstance.message = 'Pedido cadastrado com sucesso!'
        this.formRegister.reset();
      }
    })
  }
}
