import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TreeviewConfig, TreeviewItem } from '@charmedme/ngx-treeview';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { SearchService } from 'src/app/SharedServices/search.service';
import { environment } from 'src/environments/environments';
 
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {

 
  constructor(public router: Router,
    private Searchservice: SearchService,
    private adminService: AdminService,
    private SpinnerService: NgxSpinnerService) {
    // this.myScriptElement = document.createElement("script");
    // this.myScriptElement.src = "assets/slider.js";
    // document.body.appendChild(this.myScriptElement);
  }

  @ViewChild('cat3') private cat3: any;
  Cat2: any;
  Cat2Value: any;
  Cat3: any;
  Cat3Value: any;
  Cat4: any;
  Cat4Value: any;
  SearchboxForm!: FormGroup;
  BusinessUnit: any;
  BusinessUnitValue: any;
  Location: any;
  LocationValue: any;
  DebriefFrom_Date: any;
  DebriefTo_Date: any;
  EngineList: any;
  EngineValue: any;
  SearchProductList: any;
  Cat2search: any;
  Cat3search: any;
  Cat4search: any;
  EngineDisplsearch: any;
  BusinessUnitsearch: any;
  Locationsearch: any;
  flag: number = 0;
  CategoryID: string = "0";
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,

  });

  loginDisplay = false;
  UserList: any;

  ngOnInit(): void {
    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    var uname = String(localStorage.getItem("userName"));
    if(environment.IsMaintenance && uname.toUpperCase() != environment.IsMaintenance_userName.toUpperCase()){
      this.router.navigate(['/maintenance']);
      return;
    }
    
    this.SearchboxForm = new FormGroup({
      Cat2List: new FormControl(),
      EngineList: new FormControl(),
      FromDate: new FormControl(),
      ToDate: new FormControl(),
      Cat2search: new FormControl(),
      Cat3search: new FormControl(),
      Cat4search: new FormControl(),
      EngineDisplsearch: new FormControl(),
      BusinessUnitsearch: new FormControl(),
      Locationsearch: new FormControl(),
    });

    this.ShowLandingPage(0, "0");
    this.ShowCagetory3();

  }

  getCategoryId(e: any) {
    const cat3 = document.getElementsByClassName("Cat3Checkbox") as any;
    var param_value = "";

    for (let i = 0; i < e.length; i++) {
      param_value += e[i] + ",";
    }

    param_value = param_value.substring(0, param_value.length - 1);

    if (param_value == "") {
      this.ShowLandingPage(0, "0");
      return;
    }

    this.ShowLandingPage(1, param_value);
  }


  async ShowLandingPage(flag: number, CategoryID: string) {
  
    try {

      this.SpinnerService.show('spinner');
      const data = await this.Searchservice.GetLandingPage(flag, CategoryID).toPromise();
      this.SearchProductList = data;
     // console.log(this.SearchProductList);
      this.SpinnerService.hide('spinner');
    }
    catch (e) {
      this.SpinnerService.hide('spinner');
      //console.log(e);
    }

  }

 async ShowCagetory3() {
    const data = await this.Searchservice.GetCagetory3("0").toPromise();
    this.Cat3 = data.filter((d: { groupCategory: any; }) => d.groupCategory == "Cat3");
    this.Cat3 = this.Cat3.map((value: { text: any; value: any; }) => {
      return new TreeviewItem({ text: value.text, value: value.value, checked: false });
    });

  }

  public clearall() {

    for (let i = 0; i < this.cat3.filterItems.length; i++) {
      this.cat3.filterItems[i].checked = false;
    }

    this.ShowLandingPage(0, "0");
  }

  clearFilter() {
    alert("Clear All");
  }

  showProduct(event: any) {
    let ss = event.categoryId;
    localStorage.setItem("childCategory",event.categoryId);
    this.router.navigate(['/home/search', event.categoryId]);
  }

  
  public async ShowLandingPage_Home(flag: number, CategoryID: string) {
   // debugger;
    try {

      this.ShowCagetory3();

      this.SearchProductList = [];
  
      this.SpinnerService.show('spinner');
      const data = await this.Searchservice.GetLandingPage(flag, CategoryID).toPromise();
      this.SearchProductList = data;
     // console.log(this.SearchProductList);
      this.SpinnerService.hide('spinner');
    }
    catch (e) {
      this.SpinnerService.hide('spinner');
      //console.log(e);
    }

  }



}
