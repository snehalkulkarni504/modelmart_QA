import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {


   constructor(public router: Router, private location:Location) { }

//HERE I NEED TO COMMENT OUT
  // toSupportPage(){
  //   this.router.navigate(['/home/supportpage']);
  // }

  toSendMessagePage(){
    this.router.navigate(['/home/sendmessage']);
  }

  openPDF() {
    this.router.navigate(['/home/faq']);
    // var pdfPath = '../../../assets/ModelMart user manual.pdf';
    // window.open(pdfPath, '_blank');
  }

  backToPreviousPage() {
    this.location.back();
  }

}
