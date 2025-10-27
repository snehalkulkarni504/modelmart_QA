import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-popup',
  standalone: true,
  imports: [],
  templateUrl: './training-popup.component.html',
  styleUrl: './training-popup.component.css'
})
export class TrainingPopupComponent {


  @Output() popupClosed = new EventEmitter<void>();

  constructor(private router: Router) {}

  registerNow() {
    window.open('https://secure-web.cisco.com/1vbkhrbOYdyg8pdI2OZVAva3Rtys7VjtoozwIpPR_L-sx5j0w5e3xKgx_8X3cMONXiaGsduBVTvei8bG8cQ3RCBziZjFL8Uy53iZJF_Oy9hLDcqbDZgRhtuC0iSTgDDkiU4LAUCymXWw68m1RWOH61O135K50ssUT-ONpt087WVs3BAnwFyH1msp7EFcu9OYofjBXYVYGV1Mc7MaauVHS9Sy-t_FZqDG2HhRXHQJT5f75p52Lfs_oPp-79Wjm3v992--zGgx772lwetaEnYcTh93IN-UElTxbqmYAUKcSxhmQPNm5_XCznks_1okQl6p9dZ0AlPtvh8fCQ7k7JGwvGiRArf4MyMk6eo-uMg3vtoFWSku7rRInQJpeG8_y-cpFKygktEuIa_fIyq-DKg0QqdpIz2cEKxMXhTRrnvD3J8qXd3iHEymP7hL8WUj3ECnQ2uXAMZCyFUadvJ4xZTUO5qMCLziWWQcqWVlZRJC5gKU/https%3A%2F%2Fcummins365.sharepoint.com%2Fsites%2FCS405%2FSitePages%2FModelMart-2.0.aspx', '_blank');
    
    this.popupClosed.emit(); // Notify parent to hide popup
  }

  cancel() {
    this.router.navigateByUrl('/welcomeuser');
  
    this.popupClosed.emit(); // Notify parent to hide popup
  }


}
