import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { BUnitMaster } from 'src/app/Model/BUnitMaster';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';

@Component({
  selector: 'app-welcomeuser',
  templateUrl: './welcomeuser.component.html',
  styleUrls: ['./welcomeuser.component.css'],
})
export class WelcomeuserComponent implements OnInit {

  subIndex: number = 0;
  UserId: any;
  showDynamicMenus = false; // Initially hide the dynamic menus
  showMainMenus = true;

  userFullname: any;

  menulist: any;
  submenu: any;


  constructor(
    public router: Router,
    private adminService: AdminService,
      private location:Location,

  ) { }


  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    const userName = this.getUserName(); // Get the username dynamically.
    this.Getmenulist(userName);

    console.log("Username header localStorage", localStorage.getItem("userName"));

    this.getMenusUserInfo(localStorage.getItem("userName"));

  }

  async Getmenulist(userName: string) {
    try {
      const data = await this.adminService.getMenus(userName).toPromise();
      this.menulist = data;

      // Initialize `isHovered` for each menu item.
      this.menulist.forEach((menu: any) => (menu.isHovered = false));
    } catch (error) {
      console.error('Error fetching menu list:', error);
    }
  }


  onMenuHover(menu: any, isHovered: boolean): void {
    menu.isHovered = isHovered;
  }

  navigate(event: string): void {

    this.router.navigate([event]);
    console.log('Navigating to:', event);

  }
  public navigateToMasters(menu: any): void {
    // this.filterSubMenus(menu);
    this.showDynamicMenus = true;
  }

  getUserName(): string {
    return localStorage.getItem('userName') || 'DefaultUser';
  }
  UserList: any;
  async getMenusUserInfo(username: any) {
    debugger;

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

  }
  toggleDynamicMenus() {
    this.showDynamicMenus = !this.showDynamicMenus;
  }

  Logout() {
    if (confirm("Are you sure? Do you want to Logout?")) {
      localStorage.removeItem("userName");
      localStorage.removeItem("userFullName");
      localStorage.removeItem("userEmailId");
      localStorage.removeItem("userId");
      localStorage.removeItem("HopperColumns");
      localStorage.removeItem("Historysearch");
      this.router.navigate(['/welcome']);

    }
  }
  backToPreviousPage() {
    this.showDynamicMenus =  false;
    this.showMainMenus =  true;
  }
  

  showSubMenu(menu: any) {
    debugger;

    console.log(this.menulist);
    this.submenu = this.menulist.filter((d: { SubMenu: any; }) => d.SubMenu == menu);

    this.showDynamicMenus =  true;
    this.showMainMenus =  false;

  }



}
