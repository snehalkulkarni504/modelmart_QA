import { color } from 'html2canvas/dist/types/css/types/color';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SearchService } from 'src/app/SharedServices/search.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ChartComponent } from "ng-apexcharts";

import {
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  ApexChart,
} from "ng-apexcharts";
import { environment } from 'src/environments/environments';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};


export interface Piedata {
  y: number;
  name: string;
}


@Component({
  selector: 'app-should-cost-gen',
  templateUrl: './should-cost-gen.component.html',
  styleUrls: ['./should-cost-gen.component.css']
})
export class ShouldCostGenComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  imgName: any;


  //private datePipe: DatePipe
  constructor(public searchservice: SearchService,
    public router: Router, private route: ActivatedRoute, private location: Location, private SpinnerService: NgxSpinnerService, public toastr: ToastrService) {
    // window.scrollTo(0, 0);
    // this.route.params.subscribe(param => {
    //   this.ComapredId = param['ComapredId'];
    // });

  }
  showError2: boolean = false;
  showError1: boolean = false;
  ComapredId: any;
  ShouldeCostData: any = [];
  shouldCostBreakdownList: any = [];
  shouldCostBreakdownNonList: any = [];

  shouldCostBreakdownListT2: any = [];
  shouldCostBreakdownNonListT2: any = [];

  ManufacturingProcess: any = [];
  MaterialGrade: any = [];
  MaterialGradeT2: any = [];

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
  ToolingCost: any;
  AnnualVolume: any;
  RoleId: any;
  fvOnly: any;
  ShouldCostModeller: any; ToolingCostModeller: any;
  PartLength: any; PartWidth: any; PartHeight: any; PartVolume: any; PartWeight: any; PartWeight_in_Pounds: any;
  imgsilderData: any;
  mainimg: any // =  "img/test_1.jpeg";
  mainimgzoom: any;
  userId: any;
  NA: any = "NA*";
  IsHiddenT2: boolean = false;
  AluminiumCastingGrade: any;
  modelTypes_Id: any;
  IsCSmodel: boolean = false;
  display = "none";
    header: string = '';
    txt_btn: string = '';
    date: Date = new Date();
   // engine: Engine[] = [];
    newArr: any = {};
    isErrorEngDis: boolean = false;
    statusValue: boolean = false;
    editModal: boolean = false;
    editRowIndex: any;
    textsearch: string = '';
    engineDis: any;
    Cartcategory:any;
  cartName:any;
  CreateNewCart:boolean=false;
  AddToCart:boolean=true;
  ShowHideNewCartButton:boolean=true;
  cartNameList:any={}
  ngOnInit(): void {

    this.router.events.subscribe((event) => {
      window.scrollTo(0, 0)
    });

    //debugger;;
    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    var uname = String(localStorage.getItem("userName"));
    if (environment.IsMaintenance && uname.toUpperCase() != environment.IsMaintenance_userName.toUpperCase()) {
      this.router.navigate(['/maintenance']);
      return;
    }

    this.userId = localStorage.getItem("userId");

    this.ComapredId = localStorage.getItem("ComapredId");
    // this.mainimg = localStorage.getItem("imagePath");
    // if (this.mainimg == "") {
    //   this.mainimg = 'assets/No-Image.png';
    // }

    this.ProjectDetails = new FormGroup({
      ProjectName: new FormControl(), CategoryCAT4: new FormControl(), EstimatedSpend: new FormControl(),
      BusinessUnit: new FormControl(), CategoryCAT2: new FormControl(), CategoryCAT3: new FormControl(),
      PartNumber: new FormControl(), Projecttype: new FormControl(), SupplierName: new FormControl(),
      Location: new FormControl(), TargetQuote: new FormControl(), Costtype: new FormControl(), PartName: new FormControl(),
      DebriefDate: new FormControl(), IncoTerms: new FormControl(), Forex: new FormControl(), BatchSize: new FormControl(),
      AnnualVolume: new FormControl()
    });

    this.PartDimensionDetails = new FormGroup({
      ShouldCostModeller: new FormControl(), ToolingCostModeller: new FormControl(),
      PartLength: new FormControl(), PartWidth: new FormControl(), PartHeight: new FormControl(), PartVolume: new FormControl(),
      PartWeight: new FormControl(),
    });
    // console.log("ComapredId : " + this.ComapredId);
    this.getShouldeCost(this.ComapredId);

    setTimeout(() => {
      this.appexChart();
      // this.getPiedata();
    }, 500);
    this.getCartName();

  }

  hasData(): boolean {
    return this.MaterialGrade.length > 0;
  }

  hasDataT2(): boolean {
    return this.MaterialGradeT2.length > 0;
  }

  async getShouldeCost(id: number) {
    try {
      this.SpinnerService.show('spinner');

      const data = await this.searchservice.getShouldeCost(id, this.userId).toPromise();
      //this.ShouldeCostData = data;

      this.BatchSize = data.projectDetails[0].batchSize;
      this.BusinessUnit = data.projectDetails[0].businessUnit;
      this.CategoryCAT2 = data.projectDetails[0].caT2;
      this.CategoryCAT3 = data.projectDetails[0].caT3;
      this.CategoryCAT4 = data.projectDetails[0].caT4;
      this.DebriefDate = data.projectDetails[0].debriefDate;
      this.DebriefDateFormated = data.projectDetails[0].debriefDateFormated;
      this.EstimatedSpend = data.projectDetails[0].estimatedSpend;
      this.Forex = data.projectDetails[0].forex;
      this.Location = data.projectDetails[0].mfgRegion;
      this.PartNumber = data.projectDetails[0].partNumber;
      this.PartName = data.projectDetails[0].partName;
      this.ProjectName = data.projectDetails[0].projectName;
      this.Projecttype = data.projectDetails[0].projectType;
      this.SupplierName = data.projectDetails[0].supplier;
      this.TargetQuote = data.projectDetails[0].targetQuote;
      this.ForexRegion = data.projectDetails[0].forexRegion;
      this.Costtype = data.projectDetails[0].costType;
      this.AnnualVolume = data.projectDetails[0].annualVolume;
      this.RoleId = data.projectDetails[0].roleId;
      this.UniqueId = data.projectDetails[0].uniqueId;
      this.modelTypes_Id = data.projectDetails[0].modelTypes_Id;
      localStorage.setItem('uniqueId',this.UniqueId);
      if (this.modelTypes_Id == 4) {
        this.IsCSmodel = true;
      }
      else {
        this.IsCSmodel = false;
      }

      if (data.projectDetails[0].toolingCost == undefined || data.projectDetails[0].toolingCost == null) {
        this.ToolingCost = this.NA;
      }
      else {

        this.ToolingCost = data.projectDetails[0].toolingCost.toFixed(2);
      }

      this.ShouldCostModeller = data.partDimensionDetails[0].shouldCostModeller;
      this.ToolingCostModeller = data.partDimensionDetails[0].toolingCostModeller;

      if (data.partDimensionDetails[0].length == undefined || data.partDimensionDetails[0].length == null) {
        this.PartLength = this.NA;
      }
      else {
        this.PartLength = data.partDimensionDetails[0].length.toFixed(2);
      }

      if (data.partDimensionDetails[0].width == undefined || data.partDimensionDetails[0].width == null) {
        this.PartWidth = this.NA;
      }
      else {
        this.PartWidth = data.partDimensionDetails[0].width.toFixed(2);
      }

      if (data.partDimensionDetails[0].height == undefined || data.partDimensionDetails[0].height == null) {
        this.PartHeight = this.NA;
      }
      else {
        this.PartHeight = data.partDimensionDetails[0].height.toFixed(2);
      }


      this.PartVolume = data.partDimensionDetails[0].volume;

      if (data.partDimensionDetails[0].finishWeight == undefined || data.partDimensionDetails[0].finishWeight == null) {
        this.PartWeight = this.NA;
        this.PartWeight_in_Pounds = this.NA;
      }
      else {
        this.PartWeight = data.partDimensionDetails[0].finishWeight.toFixed(2);
        this.PartWeight_in_Pounds = (parseFloat(this.PartWeight) * 2.20462).toFixed(2);
      }

      //debugger;;

      this.shouldCostBreakdownList = [];
      this.shouldCostBreakdownNonList = [];
      this.shouldCostBreakdownListT2 = [];
      this.shouldCostBreakdownNonListT2 = [];

      this.shouldCostBreakdownList = data.shouldCostBreakdown;
      this.shouldCostBreakdownNonList = data.shouldCostBreakdownNon;


      this.shouldCostBreakdownListT2 = data.shouldCostBreakdownT2;
      this.shouldCostBreakdownNonListT2 = data.shouldCostBreakdownNonT2;

      let totalCostT2 = 0;
      for (var i = 0; i < this.shouldCostBreakdownListT2.length; i++) {
        totalCostT2 += this.shouldCostBreakdownListT2[i].usdValue;
      }


      // if (this.shouldCostBreakdownListT2[0].usdValue <= 0) {
      //   this.IsHiddenT2 = true;
      // }
      // else {
      //   this.IsHiddenT2 = false;
      // }

      if (totalCostT2 > 0) {
        this.IsHiddenT2 = false;
      }
      else {
        this.IsHiddenT2 = true;
      }

      this.ManufacturingProcess = data.manufacturingProcess;

      //debugger;;
      this.MaterialGrade = data.materialGradeDetails;
      this.AluminiumCastingGrade = [];
      this.AluminiumCastingGrade = data.aluminiumCastingGradeRe;
      //console.log(this.AluminiumCastingGrade);

      for (var i = 0; i < this.MaterialGrade.length; i++) {
        for (var j = 0; j < this.AluminiumCastingGrade.length; j++) {
          var rr = this.AluminiumCastingGrade[j].materialName.toLowerCase();
          if (this.MaterialGrade[i].materialType.toLowerCase().includes(rr)) {
            // G6/((1+5%)*100%-((1-D6)*(0.9)))
            var Utilization = (this.MaterialGrade[i].partFinishWeight / this.MaterialGrade[i].partGrossWeight).toFixed(2);
            this.MaterialGrade[i].directMaterialRate = parseFloat(this.MaterialGrade[i].directMaterialRate) / ((1 + 0.05) * 1 - ((1 - parseFloat(Utilization)) * (0.9)));

            if (isNaN(this.MaterialGrade[i].directMaterialRate)) {
              this.MaterialGrade[i].directMaterialRate = null;
            }
            break;
          }

        }
      }

      this.MaterialGradeT2 = data.materialGradeDetailsT2;


      for (var i = 0; i < this.MaterialGradeT2.length; i++) {
        for (var j = 0; j < this.AluminiumCastingGrade.length; j++) {
          var rr = this.AluminiumCastingGrade[j].materialName.toLowerCase();
          if (this.MaterialGradeT2[i].materialType.toLowerCase().includes(rr)) {
            // G6/((1+5%)*100%-((1-D6)*(0.9)))
            var Utilization = (this.MaterialGradeT2[i].partFinishWeight / this.MaterialGradeT2[i].partGrossWeight).toFixed(2);
            this.MaterialGradeT2[i].directMaterialRate = parseFloat(this.MaterialGradeT2[i].directMaterialRate) / ((1 + 0.05) * 1 - ((1 - parseFloat(Utilization)) * (0.9)));

            if (isNaN(this.MaterialGradeT2[i].directMaterialRate)) {
              this.MaterialGradeT2[i].directMaterialRate = null;
            }
            break;
          }

        }
      }

      this.findsum(data.shouldCostBreakdown, data.shouldCostBreakdownNon);

      this.findsumT2(data.shouldCostBreakdownT2, data.shouldCostBreakdownNonT2);

      this.imgsilderData = data.imgsilderDatas;

      // debugger;;
      if (this.imgsilderData.length <= 0) {
        this.mainimg = localStorage.getItem("imagePath");
      }
      else {
        this.mainimg = this.imgsilderData[0];
        //console.log('mainimg', data.imgsilderDatas);
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
    const myElement1 = document.getElementById("ProjectDetails");
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

  UpdateReport() {
    this.router.navigate(['/home/tiercost']);
  }

  SendNewRequest() {
    this.router.navigate(['/home/shouldcostrequest', this.UniqueId]);
  }


  @ViewChild('printsection') printsection!: ElementRef;
  async DownloadReport() {

    this.toastr.success("Report downloading has started.");

    var id = this.UniqueId;
    var staticUrl = environment.apiUrl_Search + 'DownloadPDF?Id=' + id + '&modelTypes_Id=' + this.modelTypes_Id;

    var PartNo = '';
    var PartNm = '';
    var modelTypes_Id_var = this.modelTypes_Id;

    if (this.PartNumber == null) {
      PartNo = '';
    }
    else {
      PartNo = this.PartNumber;
    }
    if (this.PartName == null) {
      PartNm = '';
    }
    else {
      PartNm = this.PartName;
    }

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
            fileLink.download = 'CS Models ' + PartNo + ' ' + PartNm;
          }
          else {
            fileLink.download = PartNo + ' ' + PartNm;
          }

          fileLink.click();
        }
      }
      else {
        alert("File Not Fount");
      }
    };
    xhr.send();

  }

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


  // Graphdata: any = [];
  // categories: any = [];
  // PiachartOptionsData: any = [];

  // BarchartOptions: any = [];
  // WaterfallchartOptions: any = [];

  // appexChart() {
  //   debugger;

  // this.shouldCostBreakdownList.forEach((element: {
  //   particular: any; usdValue: any;
  // }) => {
  //   this.Graphdata.push(
  //     { label: element.particular, y: Number(element.usdValue.toFixed(0)) },
  //   );
  // });

  // this.Graphdata.push(
  //   { label: "Total Manufacturing Cost", y: Number(this.Manu_TotalInPer.toFixed(0)) },
  // );

  // this.shouldCostBreakdownNonList.forEach((element: {
  //   particular: any; usdValue: any;
  // }) => {
  //   if (element.usdValue > 0) {
  //     this.Graphdata.push(
  //       { label: element.particular, y: Number(element.usdValue.toFixed(0)) },
  //     );
  //   }
  // });

  // this.Graphdata.push(
  //   { label: "Part Cost", y: Number(this.TotalInPer.toFixed(0)) },
  // );
  // this.Graphdata.push(
  //   { label: "Part Cost", isCumulativeSum: true, indexLabel: "100%", color: "#2196F3" },
  // );


  // this.BarchartOptions = {
  //   animationEnabled: true,
  //   exportEnabled: false,
  //   theme: "light2",
  //   title: {
  //     text: "",
  //     labelFontSize: 10,
  //   },
  //   axisX: {
  //     labelFontSize: 10,
  //     labelMaxWidth: 50,
  //     labelWrap: true,
  //     interval: 1,
  //   },
  //   data: [{
  //     type: "column",
  //     indexLabel: "{y} %",
  //     indexLabelPlacement: "top",
  //     indexLabelFontColor: "black",
  //     dataPoints: this.Graphdata
  //   }]
  // };

  ////////// waterfall //////////////////////////////

  // this.shouldCostBreakdownList.forEach((element: {
  //   particular: any; usdValue: any;
  // }) => {
  //   this.Graphdata.push(
  //     { label: element.particular, y: Number(element.usdValue.toFixed(2)) },
  //   );
  // });

  Graphdata: any = [];
  PiachartOptionsData: any = [];
  WaterfallchartOptions: any = [];
  TotalMaterailDetails: any = [];


  appexChart() {
    debugger;
    this.TotalMaterailDetails = [];

    for (var i = 0; i < this.shouldCostBreakdownList.length; i++) {
      if (i <= 2) {
        this.TotalMaterailDetails.push(
          { label: this.shouldCostBreakdownList[i].particular, y: Number(this.shouldCostBreakdownList[i].usdValue.toFixed(2)), color: "#78B3CE" },
        );
      }
      if (i == 3) {
        this.TotalMaterailDetails.push(
          { label: "Total Material Cost", isCumulativeSum: true, indexLabel: "{y}", indexLabelPlacement: "inside",  color: "#d0ddd7" },
        );
        break;
      }
    }

    for (var i = 0; i < this.shouldCostBreakdownList.length; i++) {
      if (i > 2 && this.shouldCostBreakdownList.length - 1) {
        this.TotalMaterailDetails.push(
          { label: this.shouldCostBreakdownList[i].particular, y: Number(this.shouldCostBreakdownList[i].usdValue.toFixed(2)),indexLabelPlacement: "inside",  color: "#78B3CE" },
        );
      }
    }
    // this.TotalMaterailDetails.push(
    //   { label: "Total Manu Cost", isCumulativeSum: true, indexLabel: "{y}",  indexLabelPlacement: "inside", color: "#a5ae9e" },
    // );

    this.TotalMaterailDetails.push(
      { label: "Total Manu. Cost", isCumulativeSum: true, indexLabel: "{y}",  indexLabelPlacement: "inside", color: "#a5ae9e" },
    );

    //////////// shouldCostBreakdownNonList /////////////

    for (var i = 0; i < this.shouldCostBreakdownNonList.length; i++) {
      if (i <= 1) {
        this.TotalMaterailDetails.push(
          { label: this.shouldCostBreakdownNonList[i].particular, y: Number(this.shouldCostBreakdownNonList[i].usdValue.toFixed(2)), indexLabelPlacement: "inside",  color: "#9EDF9C" },
        );
      }
    }

    this.TotalMaterailDetails.push(
      { label: "Total SGA & Profit", isCumulativeSum: true, indexLabel: "{y}", indexLabelPlacement: "inside", color: "#d0ddd7" },
    );

    for (var i = 0; i < this.shouldCostBreakdownNonList.length; i++) {
      if (i > 1 && i < 4) {
        this.TotalMaterailDetails.push(
          { label: this.shouldCostBreakdownNonList[i].particular, y: Number(this.shouldCostBreakdownNonList[i].usdValue.toFixed(2)),indexLabelPlacement: "inside",  color: "#9EDF9C" },
        );
      }
    }

    this.TotalMaterailDetails.push(
      { label: "Total Packaging", isCumulativeSum: true, indexLabel: "{y}", indexLabelPlacement: "inside",  color: "#d0ddd7" },
    );

    for (var i = 0; i < this.shouldCostBreakdownNonList.length; i++) {
      if (i > 4) {
        this.TotalMaterailDetails.push(
          { label: this.shouldCostBreakdownNonList[i].particular, y: Number(this.shouldCostBreakdownNonList[i].usdValue.toFixed(2)), indexLabelPlacement: "inside",  color: "#9EDF9C" },
        );
      }
    }

    this.TotalMaterailDetails.push(
      { label: "Part Cost", isCumulativeSum: true, indexLabel: "{y}",  indexLabelPlacement: "inside", color: "#36BA98" },
    );



    this.WaterfallchartOptions = [];

    this.WaterfallchartOptions = {
      title: {
        text: ""
      },
      animationEnabled: true,
      axisX: {
        interval: 1,
        labelFontSize: 8,
      },
      axisY: {
        valueFormatString: "00.00",
        title: "Cost in USD($)",
        labelFontSize: 10,
      },
      data: [{
        type: "waterfall",
        yValueFormatString: "00.00",
        indexLabel: "{y}",
        indexLabelPlacement: "outside",
        indexLabelFontColor: "#000",
        risingColor: "#4CAF50",
        fallingColor: "#DD7E86",
        toolTipContent: "{label} : {y}$ ",
        dataPoints: this.TotalMaterailDetails
      }]
    }

  }

  ///////////////// apex ///////////////////////////////


  // this.Graphdata = [];
  // this.categories = [];

  // this.shouldCostBreakdownList.forEach((element: {
  //   particular: any; totalCostPer: any;
  // }) => {
  //   this.Graphdata.push(element.totalCostPer.toFixed(0));
  //   this.categories.push(element.particular.split(" "));
  // });

  // this.Graphdata.push(this.Manu_TotalInPer.toFixed(0));
  // this.categories.push(("Total Manufacturing Cost").split(" "));

  // this.shouldCostBreakdownNonList.forEach((element: {
  //   particular: any; totalCostPer: any;
  // }) => {
  //   if (element.totalCostPer > 0) {
  //     debugger;
  //     this.Graphdata.push(element.totalCostPer.toFixed(0));
  //     if (element.particular.includes("SG&A")) {
  //       this.categories.push(["SG&A"]);
  //     }
  //     else if (element.particular.includes("Profit")) {
  //       this.categories.push(["Profit"]);
  //     }
  //     else if (element.particular.includes("Freight")) {
  //       this.categories.push("Freight Logistics".split(" "));
  //     }
  //     else {
  //       this.categories.push(element.particular.split(" "));
  //     }
  //   }
  // });

  // this.Graphdata.push(this.TotalInPer.toFixed(0));
  // this.categories.push(("Part Cost").split(" "));

  // this.chartOptions = {
  //   series: [
  //     {
  //       name: "Inflation",
  //       data: this.Graphdata,// [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2,]
  //     }
  //   ],
  //   chart: {
  //     height: 350,
  //     type: "bar"
  //   },
  //   plotOptions: {
  //     bar: {
  //       horizontal: false,
  //       dataLabels: {
  //         position: "top" // top, center, bottom
  //       }
  //     }
  //   },
  //   dataLabels: {
  //     enabled: true,
  //     formatter: function (val) {
  //       return val + "%";
  //     },
  //     offsetY: -20,
  //     style: {
  //       fontSize: "10px",
  //       colors: ["#304758"]
  //     }
  //   },

  //   xaxis: {
  //     categories: this.categories, // ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",],
  //     position: "bottom",
  //     labels: {
  //       rotate: 0,
  //       style: {
  //         colors: "#000",
  //         fontSize: "8px",
  //       },
  //     },
  //     axisBorder: {
  //       show: true
  //     },
  //     axisTicks: {
  //       show: true
  //     },
  //     crosshairs: {
  //       fill: {
  //         type: "gradient",
  //         gradient: {
  //           colorFrom: "#775DD0",
  //           colorTo: "#fff",
  //           stops: [0, 100],
  //           opacityFrom: 0.4,
  //           opacityTo: 0.5
  //         }
  //       }
  //     },
  //     tooltip: {
  //       enabled: false,
  //       offsetY: -35
  //     },
  //   },
  //   fill: {
  //     type: "gradient",
  //     colors: ['#775DD0'],
  //     gradient: {
  //       shade: "light",
  //       type: "vertical",
  //       shadeIntensity: 1,
  //       gradientToColors: ['#775DD0', '#775DD0'],
  //       inverseColors: true,
  //       opacityFrom: 1,
  //       opacityTo: 1,
  //       stops: [50, 50, 100, 100]
  //     }
  //   },
  //   yaxis: {
  //     axisBorder: {
  //       show: false
  //     },
  //     axisTicks: {
  //       show: false
  //     },
  //     labels: {
  //       show: false,
  //       formatter: function (val) {
  //         return val + "%";
  //       }
  //     }
  //   },
  //   title: {
  //     text: '', //"Monthly Inflation in Argentina, 2002",
  //     offsetY: 320,
  //     align: "center",
  //     style: {
  //       color: "#444"
  //     }
  //   }
  // };



  PiachartOptions: any = [];

  getPiedata() {
    debugger;
    this.PiachartOptionsData = [];

    this.shouldCostBreakdownList.forEach((element: {
      particular: any; totalCostPer: any;
    }) => {
      if (element.totalCostPer > 0) {
        this.PiachartOptionsData.push({ y: element.totalCostPer.toFixed(0), name: element.particular });
      }
    });

    //this.PiachartOptionsData.push({ y: this.Manu_TotalInPer.toFixed(0), name: "Total Manufacturing Cost" });

    this.shouldCostBreakdownNonList.forEach((element: {
      particular: any; totalCostPer: any;
    }) => {
      if (element.totalCostPer > 0) {
        this.PiachartOptionsData.push({ y: element.totalCostPer.toFixed(0), name: element.particular });
      }
    });

    //this.PiachartOptionsData.push({ y: this.TotalInPer.toFixed(0), name: "Part Cost" });

    this.PiachartOptions = {
      animationEnabled: true,
      title: {
        text: ""
      },
      data: [{
        type: "pie",
        startAngle: -90,
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###.##'%'",
        dataPoints: this.PiachartOptionsData,
      }]
    }

    

    const si = document.getElementById("graphData") as HTMLElement;
    si.getElementsByClassName('canvasjs-chart-credit')[0].innerHTML = '';

  }

  //OPEN MODEL FOR CART VIEW

  public options: string[] = ["Cart1", "Cart2", "Cart3","Cart4"];
  selectedQuantity = "Cart1";

  openModal() {
    this.getCartName();

    if(this.cartNameList.length<=0)
    {
      this.onCartCreate();
    }

    this.display = "block";
    if (this.CreateNewCart) {
      this.showError2 = false;
      this.header = 'Create Cart and Save To Add Item';
      this.txt_btn = 'Create New Cart';
      this.engineDis = ""; 
      this.statusValue ;
    } else {
      this.showError2 = false;
      this.header = 'Add To Cart';
      this.txt_btn = 'Save';
      this.engineDis = "";
      this.statusValue;
    }
  };

  onCloseHandled() {

   this.CreateNewCart=false;
   this.AddToCart=true;
   this.ShowHideNewCartButton=true;
   this.showError1=false;
   this.display = "none";

    
  }

  blurCheckBlankInputValidation(inputName: string) {
    const inputElement = document.getElementsByName(inputName)[0] as HTMLInputElement
    if (inputName === 'engDis') {
      this.showError1 = inputElement.value.trim() === '';
      this.engineDis = inputElement.value;
    }
    if (inputName === 'status') {
      this.showError2 = inputElement.value.trim() === '';
      // this.statusValue = inputElement.defaultValue
    }
  }

  getCartName() {
    this.searchservice.getCartName(this.userId).subscribe((_result: any) => {
      this.cartNameList = _result;

    });
  }

  onCartCreate(){
    this.AddToCart=false;
    this.CreateNewCart=true;
    this.ShowHideNewCartButton=false;
    this.showError1=false;
    this.Cartcategory=undefined;

  }

  async onSaveButton() {

    if(!this.Cartcategory)
    {
      this.showError1=true;
      return;
    }

    if(this.CreateNewCart)
    {
      const matches = this.cartNameList.filter((x:any) => x.cartName.includes(this.Cartcategory)); 
      if(matches.length>0)
      {
        this.showError2=true;
        return;
      }
    }
  this.searchservice.SaveToCart(this.userId, this.UniqueId,this.Cartcategory,null)
    .subscribe({
      next: (_res) => {
        if(_res==1)
        {
        //this.getEngineAll();
        this.toastr.success("Item Inserted Successfully.");
        this.AddToCart=true;
        this.CreateNewCart=false;
        this.ShowHideNewCartButton=true;
        this.showError1=false;
        this.showError2=false;
        this.onCloseHandled();
        this.Cartcategory=undefined;
        this.getCartName();
        }
        if(_res==2)
        {
          this.toastr.warning("Item Already exist in the cart Please use different cart");
          this.showError1=false;
          this.showError2=false;
          this.Cartcategory=undefined;
        }
      },
      error: (error) => {
        console.error('Inserting API call error:', error);
        this.AddToCart=true;
        this.CreateNewCart=false;
        this.ShowHideNewCartButton=true;
        this.showError1=false;
        this.showError2=false;
        this.Cartcategory=undefined;
      },
    });
  }
   
    }
