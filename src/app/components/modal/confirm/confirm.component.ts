import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm',
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {
  @Input() title: string = 'Confirmar';
  @Input() message: string = 'Tem certeza?';

  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.activeModal.close(true); // Esse true é o valor que vai ser devolvido quando essa função for chamada
  }

  cancel() {
    this.activeModal.close(false); // Esse false é o valor que vai ser devolvido quando essa função for chamada
  }
}
