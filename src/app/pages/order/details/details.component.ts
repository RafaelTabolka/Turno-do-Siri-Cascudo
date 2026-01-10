import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { OrderService } from '../../../core/services/order.service';
import { ItemsService } from '../../../core/services/items.service';
import { OrderStatus } from '../../../core/interfaces/models/order/order-status.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageComponent } from '../../../components/modal/message/message.component';
import { IItem } from '../../../core/interfaces/models/item/item';
import { IOrder } from '../../../core/interfaces/models/order/order';

@Component({
  selector: 'app-details',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  readonly formEdit: FormGroup<{
    clientName: FormControl<string>;
    orderStatus: FormControl<OrderStatus>;
    createdIn: FormControl<string>;
    orderItem: FormControl<string>;
    qty: FormControl<number>;
    observations: FormControl<string>
  }>;

  items: IItem[] = [];
  order!: IOrder;

  clienteNameIsEmpty: boolean = false;
  qtyIsEmpty: boolean = false;
  observationsIsEmpty: boolean = false;


  // Guarda uma cópia do valor inicial do formulário de edição
  // ReturnType<typeof this.formEdit.getRawValue> Faz o TypeScript deduzir o tipo exato que getRawValue() retorna (um objeto com os campos do form).
  private initialValue!: ReturnType<typeof this.formEdit.getRawValue>;
  hasChanges: boolean = false; // Vai verificar se tem mudanças no formulário

  constructor(
    private fb: NonNullableFormBuilder,
    private orderService: OrderService,
    private itemService: ItemsService,
    private route: ActivatedRoute,
    private modal: NgbModal) {
    this.formEdit = this.fb.group({
      clientName: ['', [Validators.required]],
      orderStatus: [OrderStatus.Novo, [Validators.required]],
      createdIn: [{ value: '', disabled: true }],
      orderItem: ['', [Validators.required]],
      qty: [0, [Validators.required, Validators.min(1)]],
      observations: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.itemService.getAllItems().subscribe({
      next: (itensResponse: IItem[]) => {
        this.items = itensResponse;
      }
    })

    this.orderService.getOrderById(id).subscribe({
      next: (orderResponse) => {
        this.order = orderResponse;

        this.formEdit.patchValue({
          clientName: orderResponse.client,
          orderStatus: orderResponse.status,
          createdIn: orderResponse.createdIn,
          orderItem: orderResponse.item.id,
          qty: orderResponse.qty,
          observations: orderResponse.notes
        });

        // getRawValue() Pega o valor atual do form e cria uma "cópia" passando para initialValue.
        this.initialValue = this.formEdit.getRawValue();

        this.formEdit.valueChanges.subscribe({ // valueChanges Observable que dispara toda vez que algum campo do formulário muda.
          next: () => {
            const current = this.formEdit.getRawValue(); // Pega o estado atual do formEdit

            this.hasChanges = false;
            this.clienteNameIsEmpty = false;
            this.qtyIsEmpty = false;
            this.observationsIsEmpty = false;

            if (current.clientName.trim() === '') {
              this.clienteNameIsEmpty = true
              return;
            }

            if (current.qty === null || current.qty < 1) {
              this.qtyIsEmpty = true;
              return;
            }

            if (current.observations.trim() === '') {
              this.observationsIsEmpty = true;
              return;
            }

            // Se houver alguma diferença entre os valores salvos e o valor atual do form, modifica o hasChanges
            this.hasChanges = !this.sameOrder(current, this.initialValue);
          }
        })
      }
    });
  }

  private sameOrder(a: any, b: any): boolean {
    return (
      a.clientName.trim() === b.clientName.trim() &&
      a.orderStatus === b.orderStatus &&
      a.orderItem === b.orderItem &&
      a.qty === b.qty &&
      a.observations.trim() === b.observations.trim()
    );
  }

  onSubmit(): void {
    if (this.formEdit.invalid) {
      return;
    }

    const current = this.formEdit.getRawValue();

    const selectedItem = this.items.find((item) => item.id === current.orderItem);
    if (selectedItem === undefined) {
      return;
    }

    const idLocalStorage = localStorage.getItem('id');
    const nameLocalStorage = localStorage.getItem('name');
    if (idLocalStorage === null || nameLocalStorage === null) {
      return;
    }

    const body: IOrder = {
      id: this.order.id,
      client: current.clientName,
      status: current.orderStatus,
      item: {
        id: selectedItem.id,
        itemName: selectedItem.itemName
      },
      qty: current.qty,
      notes: current.observations,
      createdIn: current.createdIn,
      createdBy: {
        id: this.order.createdBy.id,
        name: this.order.createdBy.name
      },
      updatedBy: {
        id: idLocalStorage,
        name: nameLocalStorage
      }
    };

    this.orderService.updateOrder(body).subscribe({
      next: () => {
        const modalRef = this.modal.open(MessageComponent, { centered: true, backdrop: 'static' });

        modalRef.componentInstance.message = 'Atualização realizada com sucesso!'
      }
    })
  }
}
