import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order';

@Component({
  selector: 'app-details',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  readonly formEdit: FormGroup<{
    clientName: FormControl<string>;
    orderStatus: FormControl<string>;
    createdIn: FormControl<Date>;
    orderItem: FormControl<string>;
    qty: FormControl<number>;
    observations: FormControl<string>
  }>;

  orders: Order[] = [];

  constructor(
    private fb: NonNullableFormBuilder,
    private orderService: OrderService,
    private route: ActivatedRoute) {
    this.formEdit = this.fb.group({
      clientName: [''],
      orderStatus: [''],
      createdIn: [new Date()],
      orderItem: [''],
      qty: [0],
      observations: ['']
    })
  }
  
  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    
    this.orderService.getOrderById(id).subscribe({
      next: (orderResponse) => {
        console.log(orderResponse)
      }
    })
  }

}
