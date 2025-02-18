import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TreeviewConfig, TreeviewItem } from '@charmedme/ngx-treeview';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { SearchService } from 'src/app/SharedServices/search.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-cartdetails',
  templateUrl: './cartdetails.component.html',
  styleUrls: ['./cartdetails.component.css']
})
export class CartdetailsComponent {

  constructor(public router: Router,
    public Searchservice: SearchService,
    public adminService: AdminService,
    public SpinnerService: NgxSpinnerService,
    private location: Location) {
    // this.myScriptElement = document.createElement("script");
    // this.myScriptElement.src = "assets/slider.js";
    // document.body.appendChild(this.myScriptElement);
  }

  @ViewChild('cat3') public cat3: any;
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
  userId: any;
  NA: any = "NA*";
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,


  });

  loginDisplay = false;
  UserList: any;
  settingForm: any;


  ngOnInit(): void {
    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;



    }

    // this.UserForModelMart(localStorage.getItem("userName"));

    this.userId = localStorage.getItem("userId");
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

      cartcheckbox: new FormControl(),
      Cat3Search: new FormControl()
    });

    this.ShowLandingPage(0, "0");
    // this.ShowCagetory3();
    this.ShowCagetory4();
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

  ChekNull(v: any): any {
    if (v == null || v == undefined || v <= 0) {
      return this.NA;
    }
    else {
      return v;
    }
  }

  async ShowLandingPage(flag: number, CategoryID: string) {

    try {

      this.SpinnerService.show('spinner');
      // const data = await this.Searchservice.GetLandingPageForCartView(flag, CategoryID).toPromise();
      // this.SearchProductList = data;
      // console.log(this.SearchProductList);
      this.SpinnerService.hide('spinner');
    }
    catch (e) {
      this.SpinnerService.hide('spinner');
      //console.log(e);
    }

  }

  async ShowCagetory4() {
    const data = await this.Searchservice.GetCagetory3("0").toPromise();
    this.Cat3 = data.filter((d: { groupCategory: any; }) => d.groupCategory == "Cat3");
    console.log(this.Cat3);

    // this.Cat3 = this.Cat3.map((value: { text: any; value: any; }) => {
    //   return new TreeviewItem({ text: value.text, value: value.value, checked: false });
    // });

  }

  increment() {

  }

  decrement() {

  }

  async ShowCagetory3() {
    // const data = await this.Searchservice.GetCart(this.userId).toPromise();
    // this.Cat3 = data;




    // this.Cat3 = this.Cat3.map((value: { text: any; value: any; }) => {
    //   return new TreeviewItem({ text: value.text, value: value.text, checked: false });
    // });

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
    this.router.navigate(['/home/search', event.categoryId]);
  }
  public myFunc(e: any) {
    console.log(e);
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


  // -----------------------------------------------------------------------------------------


  CartSearch: any;


  backToPreviousPage() {
    this.location.back();
  }


  clearCategory3() {

    var ul = document.getElementById("CartUL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      li[i].getElementsByTagName('input')[0].checked = false;
      const myElement = document.getElementById(li[i].getElementsByTagName('input')[0].value);
      myElement?.classList.remove("selectedCart");
    }
    
  }


  SearchCat(id: any, ULId: any) {
    var input = document.getElementById(id) as any;
    var filter = input.value.toUpperCase();
    var ul = document.getElementById(ULId);
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      var a = li[i].getElementsByTagName('label')[0].innerText;
      var txtValue = a;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  cleartext3(ULId: any) {
    this.CartSearch.nativeElement.value = "";
  }


  async getCategoryIdcat3() {
    var param_value = "";

    var ul = document.getElementById("CartUL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        param_value += li[i].getElementsByTagName('input')[0].value + ",";

        const myElement = document.getElementById(li[i].getElementsByTagName('input')[0].value);
        myElement?.classList.add("selectedCart");
      }
      else {
        const myElement = document.getElementById(li[i].getElementsByTagName('input')[0].value);
        myElement?.classList.remove("selectedCart");
      }
    }

    param_value = param_value.substring(0, param_value.length - 1);



  }



}

