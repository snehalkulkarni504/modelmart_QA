import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent  implements OnInit {
  
  constructor(public router: Router, private location:Location) { }

  ngOnInit() {

  }

  backToPreviousPage() {
    this.location.back();
  }

}
