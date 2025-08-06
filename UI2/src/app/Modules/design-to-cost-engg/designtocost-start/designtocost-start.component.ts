import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-designtocost-start',
  standalone: false,
  // imports: [],
  templateUrl: './designtocost-start.component.html',
  styleUrl: './designtocost-start.component.css'
})
export class DesigntocostStartComponent implements OnInit {
 
  constructor(public router: Router) {

  }

  ngOnInit() {
     
  }

  Step1(){
    this.router.navigate(['/home/designtocost/step1']);
  }
 
}
