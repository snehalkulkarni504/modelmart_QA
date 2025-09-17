import { style } from '@angular/animations';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/SharedServices/search.service';
import { AppComponent } from 'src/app/app.component';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { zIndex } from 'html2canvas/dist/types/css/property-descriptors/z-index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  idleState = "Not Started";

  private warningTimeout: any;
  private logoutTimeout: any;
  warningDuration = 10 * 60 * 1000; // 10 minutes
  display = 60;

  constructor(
    private Searchservice: SearchService,
    public admin: AdminService,
    public router: Router,
    public toastr: ToastrService,
    private adminService: AdminService,
    public apppcomp: AppComponent) {
  }

  mainmenu: any;
  submenu: any;
  usernm: any;
  userFullname: any;
  Ismenuload = true;
  IsShouldeCostRequest = false;

  async ngOnInit() {
    this.resetTimers();
    //console.log("Username header localStorage", localStorage.getItem("userName"));

    this.getMenusUserInfo(localStorage.getItem("userName"));

  }

  // setStates() {
  //   this.idle.watch();
  //   this.idleState = "Stated";
  // }

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
      localStorage.setItem("roleId", this.UserList[0].RoleId);
      console.log("userId " + localStorage.getItem("userId"));
    }
    else {
      localStorage.removeItem("userName");
      localStorage.removeItem("userFullName");
      localStorage.removeItem("userEmailId");
      localStorage.removeItem("userId");
      localStorage.removeItem("sessionId");

      this.router.navigate(['/invaliduser']);

    }

    this.mainmenu = [];
    const data = await this.adminService.getMenus(username).toPromise();
    this.mainmenu = data;
    this.Ismenuload = false;

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
    (<HTMLInputElement>document.getElementById('searchProduct')).value = v.childCategory;
  }

  NavigatePage(event: any) {

    this.router.navigate([event]);
  }

  NavigateSubmenu(event: any) {
    debugger;
    if (event == "/home/shouldcostrequest/:request") {
      this.IsShouldeCostRequest = true;
      return;
    }

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

      const sessionid = await this.admin.UpdateLogout(localStorage.getItem("userId"), localStorage.getItem("sessionId"), false).toPromise();

      localStorage.removeItem("sessionId")
      localStorage.removeItem("userName");
      localStorage.removeItem("userFullName");
      localStorage.removeItem("userEmailId");
      localStorage.removeItem("userId");
      localStorage.removeItem("HopperColumns");
      localStorage.removeItem("Historysearch");
      this.router.navigate(['/welcome']);
    }

  }

  async AutoLogout() {

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

  gowelcome() {
    sessionStorage.removeItem('selectedSubMenu');
    this.router.navigate(['/welcomeuser']);
  }

  handlePopupClose(shouldNavigate: boolean) {
    this.IsShouldeCostRequest = false; // Hide popup

    if (shouldNavigate) {
      this.router.navigate(['/home/shouldcostrequest/:request']);
    }
  }

  //  autologout - ----------------------------------------------------------------------
  // Reset timers on all kinds of user activity
  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:click')
  @HostListener('window:scroll')
  @HostListener('window:touchstart')
  @HostListener('window:focus')
  @HostListener('document:visibilitychange')
  handleVisibilityChange(): void {
    if (!document.hidden) {
      this.resetTimers();
    }
  }

  onUserActivity(): void {
    this.resetTimers();
  }

  private startMonitoring(): void {
    this.warningTimeout = setTimeout(() => {
      this.idleState = "Idle";
      // this.logoutTimeout = setInterval(() => {
      //   this.display--;
      //   if (this.display === 0) {
      //     this.AutoLogout();
      //   }
      // }, 1000);

    }, this.warningDuration);
  }

  private resetTimers(): void {
    this.idleState = "Not Started";
    clearTimeout(this.warningTimeout);
    clearInterval(this.logoutTimeout);
    this.display = 60;
    this.startMonitoring();
  }

  showLogoutMenu(){
    // const d = document.getElementById('dropdown-content') as HTMLElement;
    // d.style.display = "block";
    // d.style.zIndex = "999";
  }

  

}