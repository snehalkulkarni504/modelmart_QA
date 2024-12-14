import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent {

  
  constructor(private location: Location) {
    // window.scrollTo(0, 0);
    // this.route.params.subscribe(param => {
    //   this.ComapredId = param['ComapredId'];
    // });
  }

  backToPreviousPage() {
    this.location.back();
  }


}
