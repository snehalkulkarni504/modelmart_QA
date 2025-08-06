import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/SharedServices/search.service';
import { environment } from 'src/environments/environments';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-viewspreadsheets',
  templateUrl: './viewspreadsheets.component.html',
  styleUrls: ['./viewspreadsheets.component.css']
})
export class ViewspreadsheetsComponent implements OnInit {
  imgName: any;

  constructor(public searchservice: SearchService,
    public router: Router, private location: Location, private SpinnerService: NgxSpinnerService, public toastr: ToastrService) {
  }

  ComapredId: any;
  ShouldeCostData: any = [];
  shouldCostBreakdownList: any = [];
  shouldCostBreakdownNonList: any = [];

  shouldCostBreakdownListT2: any = [];
  shouldCostBreakdownNonListT2: any = [];

  ManufacturingProcess: any = [];
  MaterialGrade: any = [];
  MaterialManufacturingProcess: any = [];

  TotalInUSD: number = 0;
  TotalInLocal: number = 0;
  TotalInPer: number = 0;

  Manu_TotalInUSD: number = 0
  Manu_TotalInLocal: number = 0
  Manu_TotalInPer: number = 0

  Non_TotalInUSD: number = 0
  Non_TotalInLocal: number = 0
  Non_TotalInPer: number = 0

  TotalInUSDT2: number = 0;
  TotalInLocalT2: number = 0;
  TotalInPerT2: number = 0;

  Manu_TotalInUSDT2: number = 0
  Manu_TotalInLocalT2: number = 0
  Manu_TotalInPerT2: number = 0

  Non_TotalInUSDT2: number = 0
  Non_TotalInLocalT2: number = 0
  Non_TotalInPerT2: number = 0

  ProjectDetails!: FormGroup; ShouldCostBreakdown!: FormGroup; PartDimensionDetails!: FormGroup;
  ProjectName: any; CategoryCAT4: any; EstimatedSpend: any; BusinessUnit: any; CategoryCAT2: any; CategoryCAT3: any;
  PartNumber: any; Projecttype: any; SupplierName: any; Location: any; TargetQuote: any; Costtype: any; DebriefDate: any;
  PartName: any; IncoTerms: any; Forex: any; BatchSize: any; ForexRegion: any; DebriefDateFormated: any; UniqueId: any;
  ToolingCost: any; EngineDisplacement: any; SourcingManager: any; localCurrency: any; annualSetups: any;
  AnnualVolume: any;
  RoleId: any; fvOnly: any; fixAdjustmentFactor: any;
  sgA_T1: any; profit_T1: any; sgA_T2: any; profit_T2: any; handlingCharges: any; packaging_T1: any; freight_T1: any; packaging_T2: any;
  freight_T2: any; costAnalyst: any;
  ShouldCostModeller: any; ToolingCostModeller: any;
  PartLength: any; PartWidth: any; PartHeight: any; PartVolume: any; PartWeight: any; PartWeight_in_Pounds: any;
  imgsilderData: any; revLevel: any;
  mainimg: any // =  "img/test_1.jpeg";
  mainimgzoom: any;
  userId: any;
  NA: any = "NA*";
  IsHiddenT2: boolean = false;
  AluminiumCastingGrade: any;

  ngOnInit(): void {
    //debugger;;
    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.userId = localStorage.getItem("userId");

    this.ComapredId = localStorage.getItem("ComapredId");

    console.log("ComapredId : " + this.ComapredId);
    this.getShouldeCost(this.ComapredId);

  }


  hasData(): boolean {
    return this.MaterialGrade.length > 0;
  }

  hasDataT2(): boolean {
    return this.MaterialManufacturingProcess.length > 0; 
  }

  async getShouldeCost(id: number) {
    try {
      //debugger;;
      this.SpinnerService.show('spinner');

      const data = await this.searchservice.getviewspreadsheets(id, this.userId).toPromise();

      // costSummaryView
      this.UniqueId = data.costSummaryView[0].uniqueId;
      this.ProjectName = data.costSummaryView[0].programName;
      this.CategoryCAT2 = data.costSummaryView[0].caT2;
      this.CategoryCAT3 = data.costSummaryView[0].caT3;
      this.CategoryCAT4 = data.costSummaryView[0].caT4;
      this.EstimatedSpend = data.costSummaryView[0].estimatedSpend;
      this.BusinessUnit = data.costSummaryView[0].businessUnit;
      this.Projecttype = data.costSummaryView[0].projectType;
      this.EngineDisplacement = data.costSummaryView[0].engineDisplacement;
      this.SourcingManager = data.costSummaryView[0].sourcingManager;
      this.TargetQuote = data.costSummaryView[0].targetQuote;
      this.ShouldCostModeller = data.costSummaryView[0].shouldCostModeller;
      this.ToolingCostModeller = data.costSummaryView[0].toolingCostModeller;

      if (data.costSummaryView[0].finishWeight == undefined || data.costSummaryView[0].finishWeight == null) {
        this.PartWeight = this.NA;
        this.PartWeight_in_Pounds = this.NA;
      }
      else {
        this.PartWeight = data.costSummaryView[0].finishWeight.toFixed(2);
        this.PartWeight_in_Pounds = (parseFloat(this.PartWeight) * 2.20462).toFixed(2);
      }

      this.DebriefDateFormated = data.costSummaryView[0].debriefDateFormated;

      if (data.costSummaryView[0].length == undefined || data.costSummaryView[0].length == null) {
        this.PartLength = this.NA;
      }
      else {
        this.PartLength = data.costSummaryView[0].length.toFixed(2);
      }

      if (data.costSummaryView[0].width == undefined || data.costSummaryView[0].width == null) {
        this.PartWidth = this.NA;
      }
      else {
        this.PartWidth = data.costSummaryView[0].width.toFixed(2);
      }

      if (data.costSummaryView[0].height == undefined || data.costSummaryView[0].height == null) {
        this.PartHeight = this.NA;
      }
      else {
        this.PartHeight = data.costSummaryView[0].height.toFixed(2);
      }

      this.PartVolume = data.costSummaryView[0].volume;
      this.Costtype = data.costSummaryView[0].costType;
      if (data.costSummaryView[0].toolingCost == undefined || data.costSummaryView[0].toolingCost == null) {
        this.ToolingCost = this.NA;
      }
      else {
        this.ToolingCost = data.costSummaryView[0].toolingCost.toFixed(2);
      }


      // costSummarySubView
      this.PartNumber = data.costSummarySubView[0].partNumber;
      this.PartName = data.costSummarySubView[0].partName;
      this.revLevel = data.costSummarySubView[0].revLevel;
      this.SupplierName = data.costSummarySubView[0].supplier;
      this.Location = data.costSummarySubView[0].mfgRegion;
      this.ForexRegion = data.costSummarySubView[0].localCurrency;
      this.AnnualVolume = data.costSummarySubView[0].annualVolume;
      this.BatchSize = data.costSummarySubView[0].batchSize;
      this.annualSetups = data.costSummarySubView[0].annualSetups;
      this.Forex = data.costSummarySubView[0].oldForex;
      this.fixAdjustmentFactor = data.costSummarySubView[0].fixAdjustmentFactor;
      this.sgA_T1 = data.costSummarySubView[0].sgA_T1;
      this.profit_T1 = data.costSummarySubView[0].profit_T1;
      this.sgA_T2 = data.costSummarySubView[0].sgA_T2;
      this.profit_T2 = data.costSummarySubView[0].profit_T2;
      this.handlingCharges = data.costSummarySubView[0].handlingCharges;
      this.packaging_T1 = data.costSummarySubView[0].packaging_T1;
      this.freight_T1 = data.costSummarySubView[0].freight_T1;
      this.packaging_T2 = data.costSummarySubView[0].packaging_T2;
      this.freight_T2 = data.costSummarySubView[0].freight_T2;
      this.costAnalyst = data.costSummarySubView[0].costAnalyst;


      this.shouldCostBreakdownList = [];
      this.shouldCostBreakdownNonList = [];
      this.shouldCostBreakdownListT2 = [];
      this.shouldCostBreakdownNonListT2 = [];
      this.MaterialGrade = [];
      this.MaterialManufacturingProcess = [];

      this.shouldCostBreakdownList = data.shouldCostBreakdownView;
      this.shouldCostBreakdownNonList = data.shouldCostBreakdownNonView;


      this.shouldCostBreakdownListT2 = data.shouldCostBreakdownViewT2;
      this.shouldCostBreakdownNonListT2 = data.shouldCostBreakdownNonViewT2;

      this.MaterialGrade = data.materialGradeView;
      this.MaterialManufacturingProcess = data.materialProcessView;

      let totalCostT2 = 0;
      for (var i = 0; i < this.shouldCostBreakdownListT2.length; i++) {
        totalCostT2 += this.shouldCostBreakdownListT2[i].usdValue ;
      }
      if (totalCostT2 > 0) {
        this.IsHiddenT2 = false;
      }
      else {
        this.IsHiddenT2 = true;
      }

      this.findsum(data.shouldCostBreakdownView, data.shouldCostBreakdownNonView);

      this.findsumT2(data.shouldCostBreakdownViewT2, data.shouldCostBreakdownNonViewT2);

      this.imgsilderData = data.imgsilderDatas;

      //debugger;;
      if (this.imgsilderData.length <= 0) {
        this.mainimg = localStorage.getItem("imagePath");
      }
      else {
        this.mainimg = this.imgsilderData[0];
        console.log('mainimg', data.imgsilderDatas);
        this.fvOnly = data.imgsilderDatas.map((item: string) => item.split('\\').pop());
        this.imgName = this.fvOnly.map((item: string) => item.split('.')[0]);

        localStorage.setItem("imagePath", this.mainimg);
      }

      localStorage.setItem("DebriefDateFormated", this.DebriefDateFormated)
      localStorage.setItem("ForexRegion", this.ForexRegion)
      var ProjectName = this.Projecttype + '-' + this.BusinessUnit + '-' + this.ProjectName + '-' + this.Location + '-' + this.PartName + '-' + this.PartNumber;
      localStorage.setItem("ProjectName", ProjectName);

      this.SpinnerService.hide('spinner');
    }
    catch (e) {
      this.SpinnerService.hide('spinner');
    }
  }

  ChekNull(v: any): any {
    if (v == null || v == undefined || v <= 0) {
      return this.NA;
    }
    else {
      return v;
    }
  }

  ChekNull_LWH(v: any): any {
    if (v == null || v == undefined) {
      return this.NA;
    }
    else {
      return v + " mm ";
    }
  }

  ChekNull_Wt(): any {
    if (this.PartWeight == null || this.PartWeight == 0 || this.PartWeight == undefined || this.PartWeight == 'NA*' || this.PartWeight_in_Pounds == 0 || this.PartWeight_in_Pounds == null || this.PartWeight_in_Pounds === undefined || this.PartWeight_in_Pounds == 'NA*') {
      return this.NA;
    }
    else {
      return this.PartWeight + ' kg' + ' / ' + this.PartWeight_in_Pounds + ' lbs';
    }
  }


  findsum(data: any, data2: any) {

    for (let i = 0; i < data.length; i++) {
      this.Manu_TotalInUSD += data[i].usdValue;
      this.Manu_TotalInLocal += data[i].localValue;
    }

    for (let i = 0; i < data2.length; i++) {
      this.Non_TotalInUSD += data2[i].usdValue;
      this.Non_TotalInLocal += data2[i].localValue;
    }

    this.TotalInUSD = this.Manu_TotalInUSD + this.Non_TotalInUSD;
    this.TotalInLocal = this.Manu_TotalInLocal + this.Non_TotalInLocal;

    //debugger;
    for (let i = 0; i < data.length; i++) {
      this.shouldCostBreakdownList[i].totalCostPer = data[i].usdValue / this.TotalInUSD * 100;
    }

    //debugger;;
    for (let i = 0; i < this.shouldCostBreakdownNonList.length; i++) {
      this.shouldCostBreakdownNonList[i].totalCostPer = data2[i].usdValue / this.TotalInUSD * 100;
    }

    for (let i = 0; i < this.shouldCostBreakdownList.length; i++) {
      this.Manu_TotalInPer += this.shouldCostBreakdownList[i].totalCostPer;
    }

    for (let i = 0; i < this.shouldCostBreakdownNonList.length; i++) {
      this.Non_TotalInPer += this.shouldCostBreakdownNonList[i].totalCostPer;
    }

    this.TotalInPer = Number(this.Manu_TotalInPer) + Number(this.Non_TotalInPer);
  }



  findsumT2(data: any, data2: any) {

    for (let i = 0; i < data.length; i++) {
      this.Manu_TotalInUSDT2 += data[i].usdValue;
      this.Manu_TotalInLocalT2 += data[i].localValue;
    }

    for (let i = 0; i < data2.length; i++) {
      this.Non_TotalInUSDT2 += data2[i].usdValue;
      this.Non_TotalInLocalT2 += data2[i].localValue;
    }

    this.TotalInUSDT2 = this.Manu_TotalInUSDT2 + this.Non_TotalInUSDT2;
    this.TotalInLocalT2 = this.Manu_TotalInLocalT2 + this.Non_TotalInLocalT2;

    for (let i = 0; i < data.length; i++) {
      this.shouldCostBreakdownListT2[i].totalCostPer = data[i].usdValue / this.TotalInUSDT2 * 100;
    }

    for (let i = 0; i < this.shouldCostBreakdownNonListT2.length; i++) {
      this.shouldCostBreakdownNonListT2[i].totalCostPer = data2[i].usdValue / this.TotalInUSDT2 * 100;
    }

    for (let i = 0; i < this.shouldCostBreakdownListT2.length; i++) {
      this.Manu_TotalInPerT2 += this.shouldCostBreakdownListT2[i].totalCostPer;
    }

    for (let i = 0; i < this.shouldCostBreakdownNonListT2.length; i++) {
      this.Non_TotalInPerT2 += this.shouldCostBreakdownNonListT2[i].totalCostPer;
    }

    this.TotalInPerT2 = Number(this.Manu_TotalInPerT2) + Number(this.Non_TotalInPerT2);
  }

  showdata(e: any) {
    const myElement1 = document.getElementById("costSummaryView");
    const myElement2 = document.getElementById("ShouldCostBreakdown");
    const myElement3 = document.getElementById("MaterialGradeDetails");
    const myElement4 = document.getElementById("PartDimensionDetails");
    const myElement5 = document.getElementById("CostModelerDetails");

    myElement1?.classList.remove("showblock");
    myElement2?.classList.remove("showblock");
    myElement3?.classList.remove("showblock");
    myElement4?.classList.remove("showblock");
    myElement5?.classList.remove("showblock");

    myElement1?.classList.add("hideblock");
    myElement2?.classList.add("hideblock");
    myElement3?.classList.add("hideblock");
    myElement4?.classList.add("hideblock");
    myElement5?.classList.add("hideblock");


    const btn1 = document.getElementById("btnProjectDetails");
    const btn2 = document.getElementById("btnShouldCostBreakdown");
    const btn3 = document.getElementById("btnMaterialGradeDetails");
    const btn4 = document.getElementById("btnPartDimensionDetails");
    const btn5 = document.getElementById("btnCostModelerDetails");
    btn1?.classList.remove("active");
    btn2?.classList.remove("active");
    btn3?.classList.remove("active");
    btn4?.classList.remove("active");
    btn5?.classList.remove("active");


    switch (e) {
      case 1: {
        myElement1?.classList.add("showblock");
        btn1?.classList.add("active");
        break;
      }
      case 2: {
        myElement2?.classList.add("showblock");
        btn2?.classList.add("active");
        break;
      }
      case 3: {
        myElement3?.classList.add("showblock");
        btn3?.classList.add("active");
        break;
      }
      case 4: {
        myElement4?.classList.add("showblock");
        btn4?.classList.add("active");
        break;
      }
      case 5: {
        myElement5?.classList.add("showblock");
        btn5?.classList.add("active");
        break;
      }
    }
  }

  // UpdateReport() {
  //   this.router.navigate(['/home/tiercost']);
  // }

  // SendNewRequest() {
  //   this.router.navigate(['/home/shouldcostrequest', this.UniqueId]);
  // }


  // @ViewChild('printsection') printsection!: ElementRef;
  // async DownloadReport() {

  //   this.toastr.success("Report downloading has started.");

  //   var id = this.UniqueId;
  //   var staticUrl = environment.apiUrl_Search + 'DownloadPDF?Id=' + id;

  //   var PartNo = '';
  //   var PartNm = '';

  //   if (this.PartNumber == null) {
  //     PartNo = '';
  //   }
  //   else {
  //     PartNo = this.PartNumber;
  //   }
  //   if (this.PartName == null) {
  //     PartNm = '';
  //   }
  //   else {
  //     PartNm = this.PartName;
  //   }

  //   var xhr = new XMLHttpRequest();
  //   xhr.open('GET', staticUrl, true);
  //   xhr.responseType = 'blob';
  //   xhr.onload = function (e) {
  //     if (this.status == 200) {
  //       var myBlob = this.response;
  //       var reader = new window.FileReader();
  //       reader.readAsDataURL(myBlob);
  //       reader.onloadend = function () {
  //         const base64data = reader.result;

  //         var file = new Blob([myBlob], { type: 'application/zip' });
  //         var fileURL = URL.createObjectURL(file);

  //         var fileLink = document.createElement('a');
  //         fileLink.href = fileURL;


  //         fileLink.download = PartNo + ' ' + PartNm;
         
  //         fileLink.click();
  //       }
  //     }
  //     else {
  //       alert("File Not Fount");
  //     }
  //   };
  //   xhr.send();

  // }

  setImg(e: any) {
    this.mainimg = e
  }

  ZoomImg(e: any) {

    if (e.currentTarget.currentSrc != "") {
      this.mainimgzoom = e.currentTarget.currentSrc;

      const zoomImg = document.getElementById("zoomImg");
      zoomImg?.classList.remove("zoomImghide");
      zoomImg?.classList.add("zoomImgshow");
    }

  }

  ZoomImgclose() {
    const zoomImg = document.getElementById("zoomImg");
    zoomImg?.classList.remove("zoomImgshow");
    zoomImg?.classList.add("zoomImghide");
    this.mainimgzoom = '';
  }

  ChekNull_ToolingCost(TC: any): any {
    if (TC == null || TC == undefined || TC <= 0) {
      return this.NA;
    }
    else {
      return '$' + this.ToolingCost
    }
  }

  backToPreviousPage() {
    this.location.back();
  }

}
