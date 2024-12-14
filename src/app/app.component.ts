import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Model Mart';

  IsMaintenances = environment.IsMaintenance;

  constructor(private router: Router) {
  }

  ngOnInit() {
    // console.log("App in Username ", localStorage.getItem("userName"));
    // var Id = localStorage.getItem("userName") ;
    // if (this.IsMaintenances && Id != '8' && Id != null) {
    //   this.router.navigate(['/maintenance']);
    // }

  }

}
