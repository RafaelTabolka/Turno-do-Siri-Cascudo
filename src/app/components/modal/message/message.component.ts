import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() title: string = 'Sucesso';
  @Input() message: string = 'Operação realizada!';

  constructor(public activeModal: NgbActiveModal) { }

  confirm() {
    this.activeModal.close(true); // Esse true é o valor que vai ser devolvido quando essa função for chamada
  }

  cancel() {
    this.activeModal.close(false); // Esse false é o valor que vai ser devolvido quando essa função for chamada
  }
}
