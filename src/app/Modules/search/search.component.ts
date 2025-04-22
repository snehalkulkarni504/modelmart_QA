import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeviewConfig, TreeviewI18n, TreeviewItem, DefaultTreeviewI18n } from '@charmedme/ngx-treeview';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/SharedServices/search.service';
import { Subject } from 'rxjs';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { environment } from 'src/environments/environments';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [
    {
      provide: TreeviewI18n, useValue: Object.assign(new DefaultTreeviewI18n(), {
        getFilterPlaceholder(): string {
          return 'search';
        },
      })
    }
  ],
})


export class SearchComponent implements OnInit {

  selectedFiles: any;

  @ViewChild('cat2') private cat2: any;
  @ViewChild('Cat2Search') private Cat2Search!: ElementRef;
  @ViewChild('Cat3Search') private Cat3Search!: ElementRef;
  @ViewChild('Cat4Search') private Cat4Search!: ElementRef;
  @ViewChild('BusinessUnitSearch') private BusinessUnitSearch!: ElementRef;
  @ViewChild('LocationSearch') private LocationSearch!: ElementRef;
  @ViewChild('EngineSearch') private EngineSearch!: ElementRef;
  @ViewChild('ProgramNameSearch') private ProgramNameSearch!: ElementRef;

  @ViewChild('cat3') private cat3: any;
  @ViewChild('cat4') private cat4: any;
  @ViewChild('cat5') private cat5: any;
  @ViewChild('Bunit') private Bunit: any;
  @ViewChild('location') private location: any;
  @ViewChild('engine') private engine: any;
  @ViewChild('PartSpecification') private PartSpecification: any;
  @ViewChild('searchProduct2') private searchProduct2!: ElementRef;

  scrollbarsearchcat2: any;
  setvalueFlag = true;


  constructor(private adminService: AdminService, public searchservice: SearchService,
    public router: Router,
    private route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    public toastr: ToastrService) {

    this.IsLogin = false;

    this.route.params.subscribe(param => {
      this.childCategory = param['cat'];
    });

    this.configPagination = {
      currentPage: 1,
      itemsPerPage: 100
    };

  }

  NA: any = "NA*";
  Catlist2: any;

  Cat2Value: any;
  Catlist3: any;
  Cat3Value: any;
  Catlist4: any;
  Cat4Value: any;
  SearchboxForm!: FormGroup;
  SearchSilulatedForm!: FormGroup;
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
  Locationsearch: any; FromShouldCost: any; ToShouldCost: any;
  FromFinishWeight: any; ToFinishWeight: any;
  ProgramNameList: any;

  UserList: any;
  childCategory: any;
  parentCategory: any;
  SearchList: any;
  flag: boolean = true;
  mainmenu: any;
  results: any;
  autoseachhide: boolean = false;
  Productvalue: any = [];
  SimulatedProductvalue: any = [];

  checkcount: number = 0;

  filters = {
    cat2: "", cat3: "", cat4: "", location: "", engine: "", unit: "",
    F_debriefDate: "",
    T_debriefDate: "",
    T_TotalCost: "",
    F_TotalCost: "",
    T_FinishWeight: "",
    F_FinishWeight: "",
    FinishWeight_KG: 1,
    PartNumber: "",
    PartName: "",
    ProgramName: "",
    like: "",
  };

  ComapredcheckedboxIds = {
    Ids: ""
  }

  ////////////////////////////////////////////////////////

  items: TreeviewItem[] = [];
  PartSpecific: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
  });
  Partconfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false
  });

  userId: any;
  usernm: any;

  items3: any = [];

  IsLogin: boolean = false;

  catIdSubject$ = new Subject<any>();

  FilterSearchDataAsceDesc_var: any;
  FilterSearchData_var: any;

  SortSearchData: any;


  page: number = 1;
  pageSize: number = 100;
  configPagination: any;
  SearchListSimulated: any;
  textsearch: string = '';
  filterMetadata = { count: 0 };

  async ngOnInit(): Promise<void> {

    this.router.events.subscribe((event) => {
      window.scrollTo(0, 0)
    });
    // ------------- new changes ----------------------------------------------------

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    var uname = String(localStorage.getItem("userName"));
    if (environment.IsMaintenance && uname.toUpperCase() != environment.IsMaintenance_userName.toUpperCase()) {
      this.router.navigate(['/maintenance']);
      return;
    }

   // await this.getUserId(localStorage.getItem("userName"));

    this.usernm = localStorage.getItem("userName");
    this.userId = localStorage.getItem("userId");

    this.SearchboxForm = new FormGroup({
      cat2checkbox: new FormControl(),
      searchText: new FormControl(),
      EngineSearch: new FormControl(),
      Cat2List: new FormControl(),
      EngineList: new FormControl(),
      FromDate: new FormControl(),
      ToDate: new FormControl(),
      Cat2search: new FormControl(),
      Cat3search: new FormControl(),
      Cat4search: new FormControl(),
      EngineDisplsearch: new FormControl(),
      Enginecheckbox: new FormControl(),
      BusinessUnitsearch: new FormControl(),
      BusinessUnitcheckbox: new FormControl(),
      Locationsearch: new FormControl(),
      Locationcheckbox: new FormControl(),
      FromShouldCost: new FormControl(),
      ToShouldCost: new FormControl(),
      FromFinishWeight: new FormControl(),
      ToFinishWeight: new FormControl(),
      ProgramNameSearch: new FormControl(),
      ProgramNamecheckbox: new FormControl(),
      cat4checkbox: new FormControl(),
      cat3checkbox: new FormControl()
    });

    this.SearchSilulatedForm = new FormGroup({
      textsearch: new FormControl()
    });

    let flag = 0;
    this.GetEngine();
    this.SupplierLocation();
    this.ShowCagetory3("");
    this.GetBusinessUnit();
    this.GetProgramName();

    console.log(this.childCategory);
    console.log(localStorage.getItem("childCategory"));

    if (this.childCategory == " " || localStorage.getItem("childCategory") == null) {
      localStorage.setItem("childCategory", this.childCategory);
      this.filters.cat4 = '';
    }
    else {
      this.filters.cat4 = this.childCategory;
      flag = 1;
      localStorage.removeItem('Historywildcardsearch');
    }
    //console.log(this.childCategory);

    const userJson = localStorage.getItem('Historysearch');

    if (userJson !== null && flag == 0) {
      this.filters = JSON.parse(userJson)
    }

    if (localStorage.getItem("Historysearch") != null && flag == 0) {
      this.GetSearchdata(this.filters);
    }
    else {
      this.GetSearchdata(this.filters);
    }

  }


  async getUserId(username: any) {
    this.SpinnerService.show('spinner');

    const da = await this.adminService.UserForModelMart(username).toPromise();
    this.UserList = da;
    if (this.UserList.length > 0) {
      localStorage.setItem("userName", this.UserList[0].UserName);
      localStorage.setItem("userEmailId", this.UserList[0].EmailId);
      localStorage.setItem("userId", this.UserList[0].Id);
      localStorage.setItem("userFullName", this.UserList[0].FullName);
      localStorage.setItem("roleId", this.UserList[0].RoleId);
    }

  }

  checkedCategory() {

    var ul = document.getElementById("Cat2UL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      var tt = li[i].getElementsByTagName('label')[0].innerText.trim();
      if (this.SearchList[0].caT2 == tt) {
        li[i].getElementsByTagName('input')[0].checked = true;
      }
    }

  }

  onSelectedChangeCat5(e: any) {

  }

  async searchOnKeyUp(event: any) {
    let input = event.target.value.trim();
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

    // debugger;
    const data = await this.searchservice.GetSearch(input).toPromise();
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


  search(v: any) {

    this.clearFilter(2);
    this.filters.like = this.searchProduct2.nativeElement.value.trim();
    localStorage.setItem("Historysearch", JSON.stringify(this.filters));
    this.GetSearchdata(this.filters);

    setTimeout(() => {
      this.autoseachhide = true;
    }, 300);

  }

  hidedropdown() {
    setTimeout(() => {
      this.autoseachhide = true;
    }, 300);
  }


  setvalue(v: any) {
    this.setvalueFlag = false;
    localStorage.removeItem("childCategory");

    if (v == '0') {
      localStorage.removeItem("Historywildcardsearch");
      this.search(v);
      return;
    }


    this.clearFilter(0);

    switch (v.filtergroup) {
      case "location": {
        this.filters.location = v.id;
        break;
      } case "Cat2": {
        this.filters.cat2 = v.id;
        break;
      } case "Cat3": {
        this.filters.cat3 = v.id;
        break;
      } case "Cat4": {
        this.filters.cat4 = v.id;
        break;
      } case "PartNumber": {
        this.filters.PartNumber = v.id;
        break;
      } case "PartName": {
        this.filters.PartName = v.id;
        break;
      } case "ProgramName": {
        this.filters.ProgramName = "'" + v.id + "'";
        break;
      }
    }

    localStorage.setItem("Historywildcardsearch", v.name);
    this.searchProduct2.nativeElement.value = v.name;
    this.autoseachhide = true;

    localStorage.setItem("Historysearch", JSON.stringify(this.filters));
    this.GetSearchdata(this.filters);

  }

  async clearCategory2() {
    var flag = false;
    this.Cat2Search.nativeElement.value = "";
    var ul = document.getElementById("Cat2UL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        flag = true;
      }

      li[i].getElementsByTagName('input')[0].checked = false;
      li[i].style.display = "";
    }

    this.filters.cat2 = '';
    if (flag) {
      this.GetSearchdata(this.filters);
    }

    localStorage.setItem("Historysearch", JSON.stringify(this.filters));

  }

  clearCategory3() {

    var flag = false;
    this.Cat3Search.nativeElement.value = "";
    var ul = document.getElementById("Cat3UL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        flag = true;
      }

      li[i].getElementsByTagName('input')[0].checked = false;
      li[i].style.display = "";
    }

    this.filters.cat3 = '';
    if (flag) {
      this.GetSearchdata(this.filters);
    }
    localStorage.setItem("Historysearch", JSON.stringify(this.filters));
  }

  clearCategory4() {

    var flag = false;
    this.Cat4Search.nativeElement.value = "";
    var ul = document.getElementById("Cat4UL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        flag = true;
      }

      li[i].getElementsByTagName('input')[0].checked = false;
      li[i].style.display = "";
    }

    this.filters.cat4 = '';
    if (flag) {
      this.GetSearchdata(this.filters);
    }
    localStorage.setItem("Historysearch", JSON.stringify(this.filters));
  }

  clearCategory5() {
    var flag = false;
    for (let i = 0; i < this.cat5.filterItems.length; i++) {
      if (this.cat5.filterItems[i].checked) {
        this.cat5.filterItems[i].checked = false;
        flag = true;
      }
    }
  }

  clearBusinessUnit() {

    var flag = false;
    this.BusinessUnitSearch.nativeElement.value = "";
    var ul = document.getElementById("BusinessUnitUL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        flag = true;
      }

      li[i].getElementsByTagName('input')[0].checked = false;
      li[i].style.display = "";
    }

    this.filters.unit = '';
    if (flag) {
      this.GetSearchdata(this.filters);
    }

    localStorage.setItem("Historysearch", JSON.stringify(this.filters));
  }

  clearLocation() {

    var flag = false;
    this.LocationSearch.nativeElement.value = "";
    var ul = document.getElementById("LocationUL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        flag = true;
      }

      li[i].getElementsByTagName('input')[0].checked = false;
      li[i].style.display = "";
    }

    this.filters.location = '';
    if (flag) {
      this.GetSearchdata(this.filters);
    }
    localStorage.setItem("Historysearch", JSON.stringify(this.filters));

  }

  clearEngine() {

    var flag = false;
    this.EngineSearch.nativeElement.value = "";
    var ul = document.getElementById("EngineUL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        flag = true;
      }

      li[i].getElementsByTagName('input')[0].checked = false;
      li[i].style.display = "";
    }

    this.filters.engine = '';
    if (flag) {
      this.GetSearchdata(this.filters);
    }
    localStorage.setItem("Historysearch", JSON.stringify(this.filters));
  }

  clearProgramName() {
    var flag = false;
    this.ProgramNameSearch.nativeElement.value = "";
    var ul = document.getElementById("ProgramnameUL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        flag = true;
      }

      li[i].getElementsByTagName('input')[0].checked = false;
      li[i].style.display = "";
    }

    this.filters.ProgramName = '';
    if (flag) {
      this.GetSearchdata(this.filters);
    }
    localStorage.setItem("Historysearch", JSON.stringify(this.filters));
  }

  clearFilter(f: any) {
    //debugger;
    //this.SpinnerService.show('spinner');
    this.SortSearchData = 0;


    try {

      if (f == 1) {
        localStorage.removeItem("Historysearch");
        localStorage.removeItem("Historywildcardsearch");
        localStorage.removeItem("SortSearchData");
        localStorage.removeItem("childCategory");
      }


      if (f != 2) {
        this.searchProduct2.nativeElement.value = "";
      }
      //this.clearCategory2();
      this.Cat2Search.nativeElement.value = "";
      var ul = document.getElementById("Cat2UL");
      var li = ul!.getElementsByTagName("li") as any;
      for (var i = 0; i < li.length; i++) {
        li[i].getElementsByTagName('input')[0].checked = false;
        li[i].style.display = "";
      }

      //this.clearCategory3();
      this.Cat3Search.nativeElement.value = "";
      var ul = document.getElementById("Cat3UL");
      var li = ul!.getElementsByTagName("li") as any;
      for (var i = 0; i < li.length; i++) {
        li[i].getElementsByTagName('input')[0].checked = false;
        li[i].style.display = "";
      }

      //this.clearCategory4();
      this.Cat4Search.nativeElement.value = "";
      var ul = document.getElementById("Cat4UL");
      var li = ul!.getElementsByTagName("li") as any;
      for (var i = 0; i < li.length; i++) {
        li[i].getElementsByTagName('input')[0].checked = false;
        li[i].style.display = "";
      }

      // this.clearCategory5();
      //this.clearBusinessUnit();
      this.BusinessUnitSearch.nativeElement.value = "";
      var ul = document.getElementById("BusinessUnitUL");
      var li = ul!.getElementsByTagName("li") as any;
      for (var i = 0; i < li.length; i++) {
        li[i].getElementsByTagName('input')[0].checked = false;
        li[i].style.display = "";
      }

      // this.clearLocation();
      this.LocationSearch.nativeElement.value = "";
      var ul = document.getElementById("LocationUL");
      var li = ul!.getElementsByTagName("li") as any;
      for (var i = 0; i < li.length; i++) {
        li[i].getElementsByTagName('input')[0].checked = false;
        li[i].style.display = "";
      }

      //this.clearEngine();
      this.EngineSearch.nativeElement.value = "";
      var ul = document.getElementById("EngineUL");
      var li = ul!.getElementsByTagName("li") as any;
      for (var i = 0; i < li.length; i++) {
        li[i].getElementsByTagName('input')[0].checked = false;
        li[i].style.display = "";
      }

      // this.clearProgramName();
      this.ProgramNameSearch.nativeElement.value = "";
      var ul = document.getElementById("ProgramnameUL");
      var li = ul!.getElementsByTagName("li") as any;
      for (var i = 0; i < li.length; i++) {
        li[i].getElementsByTagName('input')[0].checked = false;
        li[i].style.display = "";
      }


      this.filters.cat2 = ''; this.filters.cat3 = ''; this.filters.cat4 = ''; this.filters.location = ''; this.filters.engine = '';
      this.filters.unit = '';
      this.filters.PartNumber = '';
      this.filters.F_debriefDate = ''; this.filters.T_debriefDate = '';
      this.filters.PartName = '',
        this.filters.ProgramName = '',
        this.filters.like = '',
        this.filters.F_TotalCost = "";
      this.filters.T_TotalCost = "";
      this.filters.T_FinishWeight = "";
      this.filters.F_FinishWeight = "";

      this.flag = true;
      this.DebriefFrom_Date = "";
      this.DebriefTo_Date = "";
      this.FromShouldCost = "";
      this.ToShouldCost = "";
      this.FromFinishWeight = "";
      this.ToFinishWeight = "";
      this.childCategory = "";
      this.parentCategory = "";
      localStorage.removeItem('cat4');
      localStorage.removeItem('cat3');
      localStorage.removeItem('cat4Id');


      const cleartext = document.getElementsByClassName("form-control ng-valid ng-touched ng-dirty") as any;

      for (var i = 0; i < cleartext.length; i++) {
        cleartext[i].value = "";
      }

      if (f == 1) {
        this.GetSearchdata(this.filters);
      }

      //this.SpinnerService.hide('spinner');
    }
    catch (err: any) {
      this.SpinnerService.hide('spinner');
    }

  }

  categorydata: any;

  async ShowCagetory3(childCategory: any) {
    // this.SpinnerService.show('spinner');

    if (childCategory == "") {
      childCategory = 0;
    }
    const data = await this.searchservice.GetCagetory3(childCategory).toPromise();
    this.categorydata = data;

    this.Catlist2 = data.filter((d: { groupCategory: any; }) => d.groupCategory == "Cat2");
    this.Catlist3 = data.filter((d: { groupCategory: any; }) => d.groupCategory == "Cat3");
    this.Catlist4 = data.filter((d: { groupCategory: any; }) => d.groupCategory == "Cat4");

    setTimeout(() => {
      if (localStorage.getItem("Historysearch") != null) {
        var ul = document.getElementById("Cat2UL");
        var li = ul!.getElementsByTagName("li") as any;
        for (var i = 0; i < this.filters.cat2.split(',').length; i++) {
          var rr = this.filters.cat2.split(',')[i];
          for (var j = 0; j < li.length; j++) {
            if (rr == li[j].getElementsByTagName('input')[0].value) {
              li[j].getElementsByTagName('input')[0].checked = true;
            }
          }
        }

        var ul = document.getElementById("Cat3UL");
        var li = ul!.getElementsByTagName("li") as any;
        for (var i = 0; i < this.filters.cat3.split(',').length; i++) {
          var rr = this.filters.cat3.split(',')[i];
          for (var j = 0; j < li.length; j++) {
            if (rr == li[j].getElementsByTagName('input')[0].value) {
              li[j].getElementsByTagName('input')[0].checked = true;
            }
          }
        }

        var ul = document.getElementById("Cat4UL");
        var li = ul!.getElementsByTagName("li") as any;
        for (var i = 0; i < this.filters.cat4.split(',').length; i++) {
          var rr = this.filters.cat4.split(',')[i];
          for (var j = 0; j < li.length; j++) {
            if (rr == li[j].getElementsByTagName('input')[0].value) {
              li[j].getElementsByTagName('input')[0].checked = true;
            }
          }
        }
      }
    }, 200);


  }

  EngineListdata: any;
  async GetEngine() {
    // this.SpinnerService.show('spinner');
    const data = await this.searchservice.GetEngine().toPromise();
    this.EngineList = data;

    setTimeout(() => {
      if (localStorage.getItem("Historysearch") != null) {
        var ul = document.getElementById("EngineUL");
        var li = ul!.getElementsByTagName("li") as any;
        for (var i = 0; i < this.filters.engine.split(',').length; i++) {
          var rr = this.filters.engine.split(',')[i];
          for (var j = 0; j < li.length; j++) {
            if (rr == li[j].getElementsByTagName('input')[0].value) {
              li[j].getElementsByTagName('input')[0].checked = true;
            }
          }
        }
      }
    }, 200);
  }

  ProgramnameListdata: any;
  async GetProgramName() {
    //debugger;
    // this.SpinnerService.show('spinner');
    const data = await this.searchservice.GetProgramName(this.userId).toPromise();
    this.ProgramNameList = data;

    setTimeout(() => {
      if (localStorage.getItem("Historysearch") != null) {
        // debugger;
        var ul = document.getElementById("ProgramnameUL");
        var li = ul!.getElementsByTagName("li") as any;
        for (var i = 0; i < this.filters.ProgramName.split(',').length; i++) {
          var rr = this.filters.ProgramName.split(',')[i];
          for (var j = 0; j < li.length; j++) {
            if (rr.substring(1, rr.length - 1) == li[j].getElementsByTagName('input')[0].value) {
              li[j].getElementsByTagName('input')[0].checked = true;
            }
          }
        }
      }
    }, 200);
  }

  Locationdata: any;
  async SupplierLocation() {
    // this.SpinnerService.show('spinner');
    const data = await this.searchservice.GetLocation().toPromise();
    this.Location = data;

    setTimeout(() => {
      if (localStorage.getItem("Historysearch") != null) {
        var ul = document.getElementById("LocationUL");
        var li = ul!.getElementsByTagName("li") as any;
        for (var i = 0; i < this.filters.location.split(',').length; i++) {
          var rr = this.filters.location.split(',')[i];
          for (var j = 0; j < li.length; j++) {
            if (rr == li[j].getElementsByTagName('input')[0].value) {
              li[j].getElementsByTagName('input')[0].checked = true;
            }
          }
        }
      }
    }, 200);
  }

  BusinessUnitdata: any;
  IsHideBusinessUnit: boolean = false;
  async GetBusinessUnit() {
    var id = localStorage.getItem("userId");
    const data = await this.searchservice.GetBusinessUnit(id).toPromise();
    this.BusinessUnit = data;
    // console.log(this.BusinessUnit);

    setTimeout(() => {
      if (this.BusinessUnit) {
        var buids = this.BusinessUnit[0].userwise_BU;
        var ul = document.getElementById("BusinessUnitUL");
        var li = ul!.getElementsByTagName("li") as any;
        for (var j = 0; j < li.length; j++) {
          li[j].getElementsByTagName('input')[0].disabled = true;
        }
        for (var i = 0; i < buids.split(',').length; i++) {
          var rr = buids.split(',')[i];
          for (var j = 0; j < li.length; j++) {
            if (rr == li[j].getElementsByTagName('input')[0].value) {
              li[j].getElementsByTagName('input')[0].disabled = false;
              li[j].classList.remove("BUdisabled");
            }
          }
        }
      }
    }, 200);

    setTimeout(() => {
      if (localStorage.getItem("Historysearch") != null) {
        var ul = document.getElementById("BusinessUnitUL");
        var li = ul!.getElementsByTagName("li") as any;
        for (var i = 0; i < this.filters.unit.split(',').length; i++) {
          var rr = this.filters.unit.split(',')[i];
          for (var j = 0; j < li.length; j++) {
            if (rr == li[j].getElementsByTagName('input')[0].value) {
              li[j].getElementsByTagName('input')[0].checked = true;
            }
          }
        }
      }
    }, 200);

  }



  cleartext2(ULId: any) {
    this.Cat2Search.nativeElement.value = "";
    this.ClearSearchTextBox(ULId);
  }

  cleartext3(ULId: any) {
    this.Cat3Search.nativeElement.value = "";
    this.ClearSearchTextBox(ULId);
  }

  cleartext4(ULId: any) {
    this.Cat4Search.nativeElement.value = "";
    this.ClearSearchTextBox(ULId);
  }

  cleartextBusinessUnit(ULId: any) {
    this.BusinessUnitSearch.nativeElement.value = "";
    this.ClearSearchTextBox(ULId);
  }

  cleartextLocation(ULId: any) {
    this.LocationSearch.nativeElement.value = "";
    this.ClearSearchTextBox(ULId);
  }

  cleartextEngine(ULId: any) {
    this.EngineSearch.nativeElement.value = "";
    this.ClearSearchTextBox(ULId);
  }

  cleartextProgrmaname(ULId: any) {
    this.ProgramNameSearch.nativeElement.value = "";
    this.ClearSearchTextBox(ULId);
  }


  ClearSearchTextBox(ULId: any) {
    var ul = document.getElementById(ULId);
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      li[i].style.display = "";
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


  getCategoryIdcat2() {
    localStorage.removeItem("childCategory");
    var param_value = "";

    var ul = document.getElementById("Cat2UL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        param_value += li[i].getElementsByTagName('input')[0].value + ",";
      }
    }



    param_value = param_value.substring(0, param_value.length - 1);

    if (param_value == "") {
      this.filters.cat2 = '';
    }

    this.filters.cat2 = param_value;
    this.GetSearchdata(this.filters);

    localStorage.setItem("Historysearch", JSON.stringify(this.filters));
  }

  //// click on cat3 checkbox
  async getCategoryIdcat3() {
    localStorage.removeItem("childCategory");

    var param_value = "";

    var ul = document.getElementById("Cat3UL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        param_value += li[i].getElementsByTagName('input')[0].value + ",";
      }
    }

    param_value = param_value.substring(0, param_value.length - 1);

    if (param_value == "") {
      this.filters.cat3 = '';
    }

    this.filters.cat3 = param_value;
    this.GetSearchdata(this.filters);
    localStorage.setItem("Historysearch", JSON.stringify(this.filters));
  }

  //// click on cat4 checkbox
  async getCategoryIdcat4() {
    localStorage.removeItem("childCategory");

    var param_value = "";

    var ul = document.getElementById("Cat4UL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        param_value += li[i].getElementsByTagName('input')[0].value + ",";
      }
    }

    param_value = param_value.substring(0, param_value.length - 1);

    if (param_value == "") {
      this.filters.cat4 = '';
    }

    this.filters.cat4 = param_value;
    this.GetSearchdata(this.filters);
    localStorage.setItem("Historysearch", JSON.stringify(this.filters));

    this.PartSpecific = [];

    if (param_value != "") {
      const data = await this.searchservice.PartSpecificationFilters(param_value).toPromise();
      this.PartSpecific = data.map((value: { text: any; value: any; children: any, checked: false }) => {
        return new TreeviewItem({ text: value.text, value: value.value, children: value.children, checked: value.checked });
      });
    }

  }

  async getLocationName() {
    localStorage.removeItem("childCategory");

    var param_value = "";

    var ul = document.getElementById("LocationUL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        param_value += li[i].getElementsByTagName('input')[0].value + ",";
      }
    }

    param_value = param_value.substring(0, param_value.length - 1);

    if (param_value == "") {
      this.filters.location = '';
    }

    this.filters.location = param_value;
    this.GetSearchdata(this.filters);

    localStorage.setItem("Historysearch", JSON.stringify(this.filters));

  }

  async getEnginelist() {
    localStorage.removeItem("childCategory");

    var param_value = "";

    var ul = document.getElementById("EngineUL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        param_value += li[i].getElementsByTagName('input')[0].value + ",";
      }
    }

    param_value = param_value.substring(0, param_value.length - 1);

    if (param_value == "") {
      this.filters.engine = '';
    }

    this.filters.engine = param_value;
    this.GetSearchdata(this.filters);

    localStorage.setItem("Historysearch", JSON.stringify(this.filters));

  }

  getProgramNamelist() {
    //debugger;
    localStorage.removeItem("childCategory");
    var param_value = "";

    var ul = document.getElementById("ProgramnameUL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        param_value += "'" + li[i].getElementsByTagName('input')[0].value + "',";
      }
    }

    param_value = param_value.substring(0, param_value.length - 1);

    if (param_value == "") {
      this.filters.ProgramName = '';
    }

    this.filters.ProgramName = param_value;
    this.GetSearchdata(this.filters);

    localStorage.setItem("Historysearch", JSON.stringify(this.filters));
  }


  getBusinessUnitValues() {
    localStorage.removeItem("childCategory");

    var param_value = "";

    var ul = document.getElementById("BusinessUnitUL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        param_value += li[i].getElementsByTagName('input')[0].value + ",";
      }
    }

    param_value = param_value.substring(0, param_value.length - 1);

    if (param_value == "") {
      this.filters.unit = '';
    }

    this.filters.unit = param_value;
    this.GetSearchdata(this.filters);

    localStorage.setItem("Historysearch", JSON.stringify(this.filters));

  }

  getFifnishWeightKG(e: any) {
    localStorage.removeItem("childCategory");

    if (this.FromFinishWeight != undefined && this.ToFinishWeight != undefined) {
      if (this.FromFinishWeight != "" && this.ToFinishWeight != "") {
        if (e.srcElement.id == "pounds") {
          this.filters.FinishWeight_KG = 0;
          this.FromFinishWeight = (this.FromFinishWeight * 2.20462).toFixed(3);
          this.ToFinishWeight = (this.ToFinishWeight * 2.20462).toFixed(3);
        }
        else {
          this.filters.FinishWeight_KG = 1;
          this.FromFinishWeight = (this.FromFinishWeight * 0.453592).toFixed(3);
          this.ToFinishWeight = (this.ToFinishWeight * 0.453592).toFixed(3);
        }

        this.GetSearchdata(this.filters);

        localStorage.setItem("Historysearch", JSON.stringify(this.filters));
      }
    }
  }

  NoModelFound = true;
  ModelFound = true;
  ModelCount: any;
  radiobtn: any;

  async GetSearchdata(filters_list: any) {
    try {
      //debugger;
      this.SpinnerService.show('spinner');
      this.SortSearchData = 0;
      this.checkcount = 0;
      this.Productvalue = [];
      this.SimulatedProductvalue = [];
      //console.log('search Userid function' + localStorage.getItem("userId"));

      this.userId = localStorage.getItem("userId");
      //console.log('search Userid function' + this.userId);

      const data = await this.searchservice.SearchFilters(filters_list, this.userId).toPromise();

      console.log(data);
      this.SearchList = data;
      this.flag = false;

      this.NoModelFound = false;

      this.ModelCount = this.SearchList.length;

      if (this.SearchList.length <= 0) {
        this.NoModelFound = false;
        this.ModelFound = true;
      }
      else {
        this.NoModelFound = true;
        this.ModelFound = false;
      }


      if (localStorage.getItem("Historysearch") != null) {
        //console.log(this.filters);

        this.searchProduct2.nativeElement.value = this.filters.like.trim();

        if (localStorage.getItem('Historywildcardsearch') != null) {
          this.searchProduct2.nativeElement.value = localStorage.getItem('Historywildcardsearch');
        }


        const Weight = document.getElementsByName("dolleroptions") as any;


        if (this.filters.FinishWeight_KG == 0) {
          Weight[1].checked = true;
          this.filters.FinishWeight_KG = 0;
          this.FromFinishWeight = (parseFloat(this.filters.F_FinishWeight) * 2.20462).toFixed(3);
          this.ToFinishWeight = (parseFloat(this.filters.T_FinishWeight) * 2.20462).toFixed(3);
        }
        else {
          Weight[0].checked = true;
          this.filters.FinishWeight_KG = 1;
          this.FromFinishWeight = this.filters.F_FinishWeight;
          this.ToFinishWeight = this.filters.T_FinishWeight;
        }


        if (this.filters.F_TotalCost != '') {
          this.FromShouldCost = this.filters.F_TotalCost;
          this.ToShouldCost = this.filters.T_TotalCost;
        }

        if (this.filters.F_debriefDate != '') {
          this.DebriefFrom_Date = this.filters.F_debriefDate;
          this.DebriefTo_Date = this.filters.T_debriefDate;
        }
      }

      //debugger;
      if (this.SearchList.length > 0) {
        if (localStorage.getItem("SortSearchData") != null || localStorage.getItem("SortSearchData") != undefined) {
          this.SortSearchData = localStorage.getItem("SortSearchData");
          this.FilterSearchData();
        }
      }


      this.SpinnerService.hide('spinner');
    }
    catch (e) {
      this.SpinnerService.hide('spinner');
    }
    this.SpinnerService.hide('spinner');
  }

  clearDate() {
    var flag = true;
    if (this.DebriefFrom_Date == undefined || this.DebriefTo_Date == undefined) {
      flag = false;
    }

    if (this.DebriefFrom_Date == "" || this.DebriefTo_Date == "") {
      flag = false;
    }

    this.DebriefFrom_Date = "";
    this.DebriefTo_Date = "";
    this.filters.F_debriefDate = "";
    this.filters.T_debriefDate = "";
    if (flag) {
      this.GetSearchdata(this.filters);
    }
    localStorage.setItem("Historysearch", JSON.stringify(this.filters));
  }

  DebriefFilter() {
    localStorage.removeItem("childCategory");
    if (this.DebriefFrom_Date != undefined && this.DebriefTo_Date != undefined) {
      if (this.DebriefFrom_Date != "" && this.DebriefTo_Date != "") {
        if (Date.parse(this.DebriefFrom_Date) > Date.parse(this.DebriefTo_Date)) {
          this.toastr.warning("From Date should not be less then To Date");
          this.DebriefTo_Date = "";
          return
        }

        this.filters.F_debriefDate = this.DebriefFrom_Date;
        this.filters.T_debriefDate = this.DebriefTo_Date;
        this.GetSearchdata(this.filters);
        localStorage.setItem("Historysearch", JSON.stringify(this.filters));
      }
    }
  }

  clearShouldCost() {

    var flag = true;
    if (this.FromShouldCost == undefined || this.ToShouldCost == undefined) {
      flag = false;
    }

    if (this.FromShouldCost == "" || this.ToShouldCost == "") {
      flag = false;
    }

    this.FromShouldCost = "";
    this.ToShouldCost = "";
    this.filters.F_TotalCost = "";
    this.filters.T_TotalCost = "";
    if (flag) {
      this.GetSearchdata(this.filters);
    }
    localStorage.setItem("Historysearch", JSON.stringify(this.filters));

  }

  ShouldCostFilter() {
    localStorage.removeItem("childCategory");

    if (this.FromShouldCost != undefined && this.ToShouldCost != undefined) {
      if (this.FromShouldCost != "" && this.ToShouldCost != "") {
        if (parseFloat(this.FromShouldCost) > parseFloat(this.ToShouldCost)) {
          this.toastr.warning("From Should Cost should not be less then To Should Cost");
          // this.ToShouldCost = "";
          return
        }

        this.filters.F_TotalCost = this.FromShouldCost;
        this.filters.T_TotalCost = this.ToShouldCost;
        this.GetSearchdata(this.filters);

        localStorage.setItem("Historysearch", JSON.stringify(this.filters));
      }
    }
  }


  clearWeight() {
    var flag = true;
    if (this.FromFinishWeight == undefined || this.ToFinishWeight == undefined) {
      flag = false;
    }

    if (this.FromFinishWeight == "" || this.ToFinishWeight == "") {
      flag = false;
    }

    const Weight = document.getElementsByName("dolleroptions") as any;
    Weight[0].checked = true;

    this.FromFinishWeight = "";
    this.ToFinishWeight = "";
    this.filters.T_FinishWeight = "";
    this.filters.F_FinishWeight = "";
    this.filters.FinishWeight_KG = 1;
    localStorage.setItem("Historysearch", JSON.stringify(this.filters));
    if (flag) {
      this.GetSearchdata(this.filters);
    }

  }

  WeightFilter() {
    localStorage.removeItem("childCategory");

    if (this.FromFinishWeight != undefined && this.ToFinishWeight != undefined) {
      if (this.FromFinishWeight != "" && this.ToFinishWeight != "") {

        if (parseFloat(this.FromFinishWeight) > parseFloat(this.ToFinishWeight)) {
          this.toastr.warning("From Finish Weight should not be less then To Finish Weight");
          // this.ToFinishWeight = "";
          return
        }

        this.filters.T_FinishWeight = this.ToFinishWeight;
        this.filters.F_FinishWeight = this.FromFinishWeight;
        this.GetSearchdata(this.filters);

        localStorage.setItem("Historysearch", JSON.stringify(this.filters));
      }
    }
  }

  setcheckboxvalues(flag: number) {

  }

  getShouldeCost(e: any) {
    //debugger;

    localStorage.setItem("ComapredId", e.csHeaderId);
    if (e.imagePath == null) {
      localStorage.setItem("imagePath", "../../../assets/No-Image.png");
    }
    else {
      localStorage.setItem("imagePath", e.imagePath);
    }
    this.router.navigate(['/home/shouldcost']);
    // this.router.navigate(['/home/viewspreadsheets']);

  }

  ChekNull(v: any): any {
    if (v == null || v == undefined || v <= 0) {
      return this.NA;
    }
    else {
      return v;
    }
  }

  // getComparison() {

  //   if (this.SearchList.length <= 0) {
  //     this.toastr.error("Record Not Found");
  //     return
  //   }

  //   const comparecheckbox = document.getElementsByClassName("SearchCheckbox") as any;
  //   let checkcount = 0;

  //   for (let i = 0; i < comparecheckbox.length; i++) {
  //     if (comparecheckbox[i].checked) {
  //       checkcount = checkcount + 1;
  //     }
  //   }
  //   if (checkcount < 2) {
  //     this.toastr.warning("Please select at least 2 Products");
  //     return
  //   }

  //   localStorage.setItem("ComapredcheckedboxIds", this.Productvalue);
  //   this.router.navigate(['/home/comparison']);

  // }

  getComparison() {

    //debugger;

    if (this.SearchList.length <= 0) {
      this.toastr.error("Record Not Found");
      return
    }

    const comparecheckbox = document.getElementsByClassName("SearchCheckbox") as any;
    let checkcount = 0;

    for (let i = 0; i < comparecheckbox.length; i++) {
      if (comparecheckbox[i].checked) {
        checkcount = checkcount + 1;
      }
    }
    if (checkcount < 2) {
      this.toastr.warning("Please select at least 2 Products");
      return
    }

    this.compareIds = [];

    this.compareIds.push(
      {
        "M": this.Productvalue,
        "S": this.SimulatedProductvalue
      }
    )

    localStorage.setItem("ComapredcheckedboxIds", JSON.stringify(this.compareIds));
    this.router.navigate(['/home/comparison']);


  }


  compareIds: any = [];
  displaySimulatedPopup = "none";
  compareIdArray: any = [0];
  compareIdArraylength = 0;

  getPartId(e: any, model: any) {
    debugger;


    // // -- new compare code ----
    // this.compareIdArray = [];
    // this.compareIdArraylength = 0;

    // const myElement = document.getElementById("compareBottomPanel");
    // myElement?.classList.remove("compareBottomPanelhide");
    // myElement?.classList.add("compareBottomPanel");

    // this.checkcount = 0;
    // const Comparecheckbox = document.getElementsByClassName("SearchCheckbox") as any;

    // // --- main models---------
    // for (let i = 0; i < Comparecheckbox.length; i++) {
    //   if (Comparecheckbox[i].checked) {
    //     this.checkcount = this.checkcount + 1;
    //     const dd = this.SearchList.find((p: { csHeaderId: any; }) => p.csHeaderId == Comparecheckbox[i].id)
    //     if (this.compareIdArray.length < 4) {
    //       this.compareIdArray.push(
    //         {
    //           "scReportId": '0',
    //           "csHeaderId": dd.csHeaderId,
    //           "partNumber": dd.partNumber,
    //           "partName": dd.partName,
    //           "uniqueId": dd.uniqueId,
    //           "imagePath": dd.imagePath
    //         }
    //       );
    //     }
    //     else {
    //       this.toastr.warning("You can select only 4 Parts");
    //       Comparecheckbox[i].checked = false;
    //     }
    //     this.compareIdArraylength = this.compareIdArray.length;
    //   }
    // }


    // // -- simulated models ---------
    // console.log(this.SearchListSimulated);
    // const SimulatedCheckbox = document.getElementsByClassName("SimulatedCheckbox") as any;
    // for (let i = 0; i < this.SearchListSimulated.length; i++) {
    //   if (this.SearchListSimulated[i].isActive == 1) {
    //     this.checkcount = this.checkcount + 1;
    //     //const dd = this.SearchListSimulated.find((p: { scReportId: any; }) => p.scReportId == SimulatedCheckbox[i].id)
    //     if (this.compareIdArray.length < 4) {
    //       this.compareIdArray.push(
    //         {
    //           "scReportId": this.SearchListSimulated[i].scReportId,
    //           "csHeaderId": '0',
    //           "partNumber": this.SearchListSimulated[i].partNumber,
    //           "partName": this.SearchListSimulated[i].partName,
    //           "uniqueId": this.SearchListSimulated[i].uniqueId,
    //           "imagePath": this.SearchListSimulated[i].imagePath
    //         }
    //       );

    //       this.SearchListSimulated[i].isActive = 1;
    //       console.log(this.SearchListSimulated);

    //     }
    //     else {
    //       this.toastr.warning("You can select only 4 Parts");
    //       SimulatedCheckbox[i].checked = false;
    //       this.SearchListSimulated[i].isActive = 0;
    //     }
    //     this.compareIdArraylength = this.compareIdArray.length;
    //   }
    // }

    // for (let i = 0; i < SimulatedCheckbox.length; i++) {
    //   if (SimulatedCheckbox[i].checked) {
    //     this.checkcount = this.checkcount + 1;
    //     const dd = this.SearchListSimulated.find((p: { scReportId: any; }) => p.scReportId == SimulatedCheckbox[i].id)
    //     if (this.compareIdArray.length < 4) {
    //       this.compareIdArray.push(
    //         {
    //           "scReportId": dd.scReportId,
    //           "csHeaderId": '0',
    //           "partNumber": dd.partNumber,
    //           "partName": dd.partName,
    //           "uniqueId": dd.uniqueId,
    //           "imagePath": dd.imagePath
    //         }
    //       );
          
    //       dd.isActive = 1;
    //     }
    //     else {
    //       this.toastr.warning("You can select only 4 Parts");
    //       SimulatedCheckbox[i].checked = false;
    //       this.SearchListSimulated[i].isActive = 0;
    //     }
    //     this.compareIdArraylength = this.compareIdArray.length;
    //   }

    // }


    // if (this.checkcount <= 0) {
    //   myElement?.classList.remove("compareBottomPanel");
    //   myElement?.classList.add("compareBottomPanelhide");
    //   this.compareIdArray = [];
    // }



    // // -- new compare code end ----


    this.checkcount = 0;

    const compareBottomPanel = document.getElementsByClassName("compareBottomPanel") as any;
    compareBottomPanel.display = "block";

    const Comparecheckbox = document.getElementsByClassName("SearchCheckbox") as any;

    const SearchCheckboxSimulated = document.getElementsByClassName("SearchCheckboxSimulated") as any;
    //SearchCheckboxSimulated
    if (model == 'M') {
      this.Productvalue = [];
      for (let i = 0; i < Comparecheckbox.length; i++) {
        if (Comparecheckbox[i].checked) {
          this.Productvalue.push(Comparecheckbox[i].id);
        }
      }

      if (Number(this.Productvalue.length) + Number(this.SimulatedProductvalue.length) > 4) {
        this.toastr.warning("You can select only 4 Parts");
        for (let i = 0; i < Comparecheckbox.length; i++) {
          if (Comparecheckbox[i].id == e.csHeaderId) {
            Comparecheckbox[i].checked = false;
            this.Productvalue.pop();
            return
          }
        }
        return
      }
    }
    else {
      this.SimulatedProductvalue = [];
      for (let i = 0; i < SearchCheckboxSimulated.length; i++) {
        if (SearchCheckboxSimulated[i].checked) {
          this.SimulatedProductvalue.push(SearchCheckboxSimulated[i].id);
        }
      }

      if (Number(this.Productvalue.length) + Number(this.SimulatedProductvalue.length) > 4) {
        this.toastr.warning("You can select only 4 Parts");
        for (let i = 0; i < SearchCheckboxSimulated.length; i++) {
          if (SearchCheckboxSimulated[i].id == e.scReportId) {
            SearchCheckboxSimulated[i].checked = false;
            this.SimulatedProductvalue.pop();
            return
          }
        }
        return
      }
    }

    this.checkcount = Number(this.Productvalue.length) + Number(this.SimulatedProductvalue.length);

  }


  CloseComparePopup() {
    const myElement = document.getElementById("compareBottomPanel");
    myElement?.classList.remove("compareBottomPanel");
    myElement?.classList.add("compareBottomPanelhide");

    // -- main models
    const comparecheckbox = document.getElementsByClassName("SearchCheckbox") as any;
    for (let i = 0; i < comparecheckbox.length; i++) {
      if (comparecheckbox[i].checked) {
        comparecheckbox[i].checked = false;
      }
    }

    // --- simulated models
    const SimulatedCheckbox = document.getElementsByClassName("SimulatedCheckbox") as any;
    for (let i = 0; i < SimulatedCheckbox.length; i++) {
      if (SimulatedCheckbox[i].checked) {
        SimulatedCheckbox[i].checked = false;
      }
    }

  }


  RemoveModelfromCompare(arr: any, index: any) {
    debugger;

    // -- main models
    const comparecheckbox = document.getElementsByClassName("SearchCheckbox") as any;
    for (let i = 0; i < comparecheckbox.length; i++) {
      if (Number(comparecheckbox[i].id) == Number(arr[index].csHeaderId)) {
        comparecheckbox[i].checked = false;
        break;
      }
    }

    // --- simulated models
    const SimulatedCheckbox = document.getElementsByClassName("SimulatedCheckbox") as any;
    for (let i = 0; i < SimulatedCheckbox.length; i++) {
      if (Number(SimulatedCheckbox[i].id) == Number(arr[index].scReportId)) {
        SimulatedCheckbox[i].checked = false;
        break;
      }
    }

    this.compareIdArray.splice(index, 1);
    this.compareIdArraylength = this.compareIdArray.length;

    if (this.compareIdArraylength <= 0) {
      const myElement = document.getElementById("compareBottomPanel");
      myElement?.classList.remove("compareBottomPanel");
      myElement?.classList.add("compareBottomPanelhide");
    }

  }

  onCloseHandled_Popup() {
    this.displaySimulatedPopup = "none";
  }

  async ShowSimulatedPopup() {
    debugger;
    this.SpinnerService.show('spinner');
    if (this.SearchListSimulated == undefined) {
      const data = await this.searchservice.SearchSimulated(this.userId).toPromise();
      this.SearchListSimulated = data;
      console.log(this.SearchListSimulated);
    }

    console.log(this.SearchListSimulated);
    this.displaySimulatedPopup = "block";
    this.SpinnerService.hide('spinner');
  }


  // this.checkcount = Number(this.Productvalue.length) + Number(this.SimulatedProductvalue.length);



  // getPartId(e: any) {
  //   this.checkcount = 0;
  //   this.Productvalue = [];
  //   const Comparecheckbox = document.getElementsByClassName("SearchCheckbox") as any;
  //   for (let i = 0; i < Comparecheckbox.length; i++) {
  //     if (Comparecheckbox[i].checked) {
  //       this.checkcount = this.checkcount + 1;
  //       this.Productvalue.push(Comparecheckbox[i].id);
  //     }
  //   }

  //   if (this.checkcount > 4) {
  //     this.toastr.warning("You can select only 4 Parts");
  //     for (let i = 0; i < Comparecheckbox.length; i++) {
  //       if (Comparecheckbox[i].id == e.csHeaderId) {
  //         Comparecheckbox[i].checked = false;
  //         this.checkcount = this.checkcount - 1;
  //         this.Productvalue.pop();
  //         return
  //       }
  //     }
  //     return
  //   }
  // }


  keyPressDecimal(event: any) {
    const reg = /^-?\d*(\.\d{0,3})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
      return false;
    }
    else {
      return true;
    }
  }

  async DownloadPDF(data: any) {

    //debugger;
    console.log(this.SearchList);

    this.toastr.success("Report downloading has started.");

    var id = data.uniqueId;
    var staticUrl = environment.apiUrl_Search + 'DownloadPDF?uniqueId=' + id + '&modelTypes_Id=' + data.modelTypes_Id + '&userId=' + this.userId;

    var modelTypes_Id_var = data.modelTypes_Id;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', staticUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
      if (this.status == 200) {
        var myBlob = this.response;
        var reader = new window.FileReader();
        reader.readAsDataURL(myBlob);
        reader.onloadend = function () {
          const base64data = reader.result;

          var file = new Blob([myBlob], { type: 'application/zip' });
          var fileURL = URL.createObjectURL(file);

          var fileLink = document.createElement('a');
          fileLink.href = fileURL;

          if (modelTypes_Id_var == 4) {
            fileLink.download = 'CES Sub level Models ' + data.partNumber + ' ' + data.partName;
          }
          else {
            fileLink.download = data.partNumber + ' ' + data.partName;
          }


          fileLink.click();
        }
      }
      else {
        alert("File Not Found");
      }
    };
    xhr.send();
  }


  FilterSearchData() {
    //debugger;
    if (this.SortSearchData == 0 || this.SortSearchData == undefined) {
      return
    }

    localStorage.setItem("SortSearchData", this.SortSearchData);

    switch (this.SortSearchData) {
      case '1': // Debrief Date Sort by Ascending to Descending
        this.SearchList = this.SearchList.sort((a: { debriefDateFormated: any; }, b: { debriefDateFormated: any; }) => (Date.parse(a.debriefDateFormated)) - Date.parse(b.debriefDateFormated));
        break;
      case '2': // Debrief Date Sort by Descending to Ascending
        this.SearchList = this.SearchList.sort((a: { debriefDateFormated: any; }, b: { debriefDateFormated: any; }) => (Date.parse(b.debriefDateFormated)) - Date.parse(a.debriefDateFormated));
        break;
      case '3': // Location Sort by A-Z
        this.SearchList = this.SearchList.sort((a: { mfgRegion: any; }, b: { mfgRegion: any; }) => (a.mfgRegion == null ? '' : a.mfgRegion.localeCompare(b.mfgRegion == null ? '' : b.mfgRegion)));
        break;
      case '4': // Location Sort by Z-A
        this.SearchList = this.SearchList.sort((a: { mfgRegion: any; }, b: { mfgRegion: any; }) => (b.mfgRegion == null ? '' : b.mfgRegion.localeCompare(a.mfgRegion == null ? '' : a.mfgRegion)));
        break;
      case '5': // Tooling Cost Sort by Smallest to Largest
        this.SearchList = this.SearchList.sort((a: { toolingCostModeller: any; }, b: { toolingCostModeller: any; }) => (a.toolingCostModeller == null ? 0 : parseFloat(a.toolingCostModeller)) - (b.toolingCostModeller == null ? 0 : parseFloat(b.toolingCostModeller)));
        break;
      case '6': // Tooling Cost Sort by Largest to Smallest
        this.SearchList = this.SearchList.sort((a: { toolingCostModeller: any; }, b: { toolingCostModeller: any; }) => (b.toolingCostModeller == null ? 0 : parseFloat(b.toolingCostModeller)) - (a.toolingCostModeller == null ? 0 : parseFloat(a.toolingCostModeller)));
        break;
      case '7': // Should Cost Sort by Smallest to Largest
        this.SearchList = this.SearchList.sort((a: { totalCost: any; }, b: { totalCost: any; }) => (a.totalCost == null ? 0 : parseFloat(a.totalCost)) - (b.totalCost == null ? 0 : parseFloat(b.totalCost)));
        break;
      case '8': // Should Cost Sort by Largest to Smallest
        this.SearchList = this.SearchList.sort((a: { totalCost: any; }, b: { totalCost: any; }) => (b.totalCost == null ? 0 : parseFloat(b.totalCost)) - (a.totalCost == null ? 0 : parseFloat(a.totalCost)));
        break;
    }

  }

  viewReport(val: any) {
    debugger;
    const Params = {
      param_CSHeaderId: val.csHeaderId,
      param_SCReportId: val.scReportId
    };

    this.router.navigate(['/home/shouldcostuserhistory/:data'], { queryParams: Params });
  }



}