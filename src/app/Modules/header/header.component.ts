import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/SharedServices/search.service';
import { AppComponent } from 'src/app/app.component';
import { AdminService } from 'src/app/SharedServices/admin.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  idleState = "Not Started";
  countdownIdle: number = 10;
 
  constructor(
     
    private Searchservice: SearchService,
    public admin: AdminService,
    public router: Router,
    public toastr: ToastrService,
    private adminService: AdminService,
    private idle: Idle, private cd: ChangeDetectorRef, public apppcomp: AppComponent) {
    idle.setIdle(600);  // 60 sec = 1 mint
    idle.setTimeout(60);  // 60 sec = 1 mint
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = "Stated";
      cd.detectChanges();
    })

    idle.onTimeout.subscribe(() => {
      this.idleState = "Timedout";
    })

    idle.onIdleStart.subscribe(() => {
      this.idleState = "Idle";
    })

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.countdownIdle = countdown;
    });

  }


  mainmenu: any;
  submenu: any;
  usernm: any;
  userFullname: any;

  async ngOnInit() {
  
    this.setStates();
 
    console.log("Username header localStorage", localStorage.getItem("userName"));

    this.getMenusUserInfo(localStorage.getItem("userName"));
 
  }

  setStates() {
    this.idle.watch();
    this.idleState = "Stated";
  }

  UserList: any;
  async getMenusUserInfo(username: any) {
   
    this.UserList = [];
    const da = await this.adminService.UserForModelMart(username).toPromise();
    this.UserList = da;
     
    if (this.UserList.length > 0) {

      localStorage.setItem("userName", this.UserList[0].UserName);
      localStorage.setItem("userEmailId", this.UserList[0].EmailId);
      localStorage.setItem("userId", this.UserList[0].Id);
      this.userFullname = this.UserList[0].FullName;
      localStorage.setItem("userFullName", this.userFullname);
      // this.usernm = this.UserList[0].UserName;
      localStorage.setItem("roleId", this.UserList[0].RoleId);
      console.log("userId " + localStorage.getItem("userId"));

      //this.router.navigate(['/home/search/ ']);
    }
    else {
      localStorage.removeItem("userName");
      localStorage.removeItem("userFullName");
      localStorage.removeItem("userEmailId");
      localStorage.removeItem("userId");

      this.router.navigate(['/invaliduser']);

    }

    this.mainmenu = [];
    const data = await this.adminService.getMenus(username).toPromise();
    this.mainmenu = data;
 
  }

  results: any;
  autoseachhide: boolean = true;

  async searchOnKeyUp(event: any) {
    let input = event.target.value;
    if (input.length <= 0) {
      this.autoseachhide = true;
      const myElement = document.getElementById("idmainsearch");
      myElement?.classList.remove("mainsearchborder");
      myElement?.classList.add("mainsearch");
    }
    else {
      this.autoseachhide = false;
      const myElement = document.getElementById("idmainsearch");
      myElement?.classList.remove("mainsearch");
      myElement?.classList.add("mainsearchborder");
    }

    const data = await this.Searchservice.GetSearch(input).toPromise();
    this.results = data;

    if (this.results.length >= 10) {
      const myElement = document.getElementById("searchdata");
      myElement?.classList.remove("searchdata");
      myElement?.classList.add("searchdataheight");
    }
    else {
      const myElement = document.getElementById("searchdata");
      myElement?.classList.remove("searchdataheight");
      myElement?.classList.add("searchdata");
    }


  }

  setvalue(v: any) {
    // console.log(v);
    (<HTMLInputElement>document.getElementById('searchProduct')).value = v.childCategory;
  }

  NavigatePage(event: any) {

    this.router.navigate([event]);
}
 
  gotohome() {

    if (this.router.url == "/home") {
      location.reload();
    }

    this.router.navigate(['/home']);
  }

  async Logout() {
    if (confirm("Are you sure? Do you want to Logout?")) {
      
      const sessionid=await this.admin.UpdateLogout(localStorage.getItem("userId")
      ,localStorage.getItem("sessionId"),false).toPromise();

      localStorage.removeItem("sessionId")
      localStorage.removeItem("userName");
      localStorage.removeItem("userFullName");
      localStorage.removeItem("userEmailId");
      localStorage.removeItem("userId");
      localStorage.removeItem("HopperColumns");
      localStorage.removeItem("Historysearch");
      localStorage.removeItem("cart");
      this.router.navigate(['/welcome']);
 
    }
    
  }

  async AutoLogout() {

    const sessionid=await this.admin.UpdateLogout(localStorage.getItem("userId")
    ,localStorage.getItem("sessionId"),true).toPromise();

    localStorage.removeItem("sessionId")
    localStorage.removeItem("userName");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userEmailId");
    localStorage.removeItem("userId");
    localStorage.removeItem("HopperColumns");
    localStorage.removeItem("Historysearch");
    this.router.navigate(['/welcome']);
    //kavita logout capture
  }

  gowelcome(){
    this.router.navigate(['/welcomeuser']);
  }

}