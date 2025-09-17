import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-req-confirmation',
  standalone: false,
  templateUrl: './send-req-confirmation.component.html',
  styleUrl: './send-req-confirmation.component.css'
})
export class SendReqConfirmationComponent {
  
  @Output() closePopup = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  confirm() {
    this.closePopup.emit(true);
    this.router.navigate(['/home/shouldcostrequest/:request']);
  }

  cancel() {
    this.closePopup.emit(false);
    // this.router.navigate(['/welcomeuser']);
  }
}
