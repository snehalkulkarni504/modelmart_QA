import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Location } from '@angular/common';
import { AdminService } from 'src/app/SharedServices/admin.service';
 
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
  mainmenulist: any;

  menulist: any;
  submenu: any;
  idleState: any;
  userName: any;


  constructor(
    public router: Router,
    private adminService: AdminService,
    private location: Location,

  ) { }


  async ngOnInit() {


    this.userName = localStorage.getItem('userName');

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    await this.getMenusUserInfo(this.userName);

    this.Getwelcomelist();
    this.Getmenulist();
    debugger
    const savedSubMenu = sessionStorage.getItem('selectedSubMenu');
    if (savedSubMenu) {
      this.submenu = JSON.parse(savedSubMenu);
      // this.submenu = savedSubMenu;
      this.showDynamicMenus = true;
      this.showMainMenus = false;
    } else {
      this.showMainMenus = true;
      this.showDynamicMenus = false;

    }
    sessionStorage.removeItem('selectedSubMenu');

  }

  async Getmenulist() {
    try {

      const data = await this.adminService.getMenus(this.userName).toPromise();
      this.menulist = data;

      // Initialize `isHovered` for each menu item.
      this.menulist.forEach((menu: any) => (menu.isHovered = false));
    } catch (error) {
      console.error('Error fetching menu list:', error);
    }

  }

  async Getwelcomelist() {
    try {
      const data = await this.adminService.Getwelcomelist(this.userName).toPromise();
      this.mainmenulist = data;

    }
    catch (error) {
      console.error('Error fetching welcome:', error);

    }
  }


  onMenuHover(menu: any, isHovered: boolean): void {
    menu.isHovered = isHovered;
  }

  // navigate(event: string): void {
  //   sessionStorage.setItem('lastSubmenuUrl', event);
  //   // sessionStorage.removeItem('selectedSubMenu');

  //   this.router.navigate([event]);
  //   console.log('Navigating to:', event);

  // }
  navigate(event: string): void {
    debugger
    sessionStorage.setItem('selectedSubMenu', JSON.stringify(this.submenu));
    // sessionStorage.setItem('selectedSubMenu', this.submenu);
    // sessionStorage.setItem('selectedSubMenu', this.submenu.SubMenu);

    sessionStorage.setItem('lastSubmenuUrl', event);

    // Check if the clicked URL exists in the current submenu
    const isInSubmenu = this.submenu?.some((menu: any) =>
      menu.submenulist?.some((sub: any) => sub.Navigate_Url === event)
    );

    if (!isInSubmenu) {
      // If not part of submenu, clear submenu and show main menu
      sessionStorage.removeItem('selectedSubMenu');
      this.submenu = null;
      this.showDynamicMenus = false;
      this.showMainMenus = true;
    }

    this.router.navigate([event]);
    console.log('Navigating to:', event);
  }

  mainnavigate(event: string): void {
    sessionStorage.setItem('lastSubmenuUrl', event);


    this.router.navigate([event]);
    console.log('Navigating to:', event);

  }


  public navigateToMasters(menu: any): void {
    // this.filterSubMenus(menu);
    this.showDynamicMenus = true;
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
      localStorage.removeItem("sessionId");
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

      localStorage.removeItem("sessionId");
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
    this.showDynamicMenus = false;
    this.showMainMenus = true;
  }


  showSubMenu(menu: any) {
    debugger;
    if(menu  == "Should Cost Request"){
      menu = "Request"
    }

    console.log(this.menulist);
    this.submenu = this.menulist.filter((d: { SubMenu: any; }) => d.SubMenu == menu);
    // sessionStorage.setItem('selectedSubMenu', JSON.stringify(this.submenu));

    this.showDynamicMenus = true;
    this.showMainMenus = false;

  }

  getBackgroundColor(menuName: string): string {
    switch (menuName) {
      case 'Reports': return '#003b3f';
      case 'Masters': return '#f48574';
      case 'Request': return '#6e1017';
      // case 'Menu4': return '#FFFF'; 
      default: return '#FFFFFF'; // Default color
    }
  }

  gowelcome() {
    this.router.navigate(['/welcomeuser']);
  }









}
