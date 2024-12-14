import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/SharedServices/admin.service';

@Component({
  selector: 'app-welcomepage',
  templateUrl: './welcomepage.component.html',
  styleUrls: ['./welcomepage.component.css']
})
export class WelcomepageComponent implements OnInit {

  isUserLoggedIn: boolean = false;
  myScriptElement: HTMLScriptElement;
  emailID: any = "test";

  loginDisplay = false;

  constructor(public router: Router, private adminService: AdminService) {
    this.myScriptElement = document.createElement("script");
    this.myScriptElement.src = "assets/slider.js";
    document.body.appendChild(this.myScriptElement);
  }
 

  ngOnInit(): void {
  }


  GotoLogin() {
    this.router.navigate(['/login']);
  }

  async loginRedirect() {
   

    debugger;
    // KA975 -- Niraj Mohan
    const data = await this.adminService.getMenus('KA975').toPromise();
    if (data == null) {
      alert("VPN Connection is required for connecting from non-Cummins networks.")
      return;
    }


  }


}
