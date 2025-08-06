import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/SharedServices/search.service';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environments';
import { NgxSpinnerService } from 'ngx-spinner';
import { compareIds } from 'src/app/Model/CompareIds';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';


@Component({
  selector: 'app-comparisonnew',
  templateUrl: './comparisonnew.component.html',
  styleUrls: ['./comparisonnew.component.css']
})

export class ComparisonnewComponent implements OnInit {

  chartOptions: any = [];
  chartOptionssupplier: any = [];


  constructor(public searchservice: SearchService, public router: Router, private location: Location, private SpinnerService: NgxSpinnerService,
    public reportservice: ReportServiceService,) {

  }

  compardata: any[] = [];
  compardataTier2: any[] = [];
  colunms: any[] = [];
  headers: any[] = [];
  compare_Ids: compareIds[] = [];
  ids: any;
  data: any[] = [];
  userId: any;
  NA: any = "NA*";
  suppshouldcost: any[] = [];

  shouldCostBreakdownList: any;
  shouldCostBreakdownNonList: any;
  showChild = false;

  Manu_TotalInUSD: number = 0;
  TotalInUSD: number = 0;

  ngOnInit(): void {
    //debugger;
    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    var uname = String(localStorage.getItem("userName"));

    if (environment.IsMaintenance && uname.toUpperCase() != environment.IsMaintenance_userName.toUpperCase()) {
      this.router.navigate(['/maintenance']);
      return;
    }

    this.SpinnerService.show('spinner');

    this.userId = localStorage.getItem("userId");
    this.ids = localStorage.getItem("ComapredcheckedboxIds");  // localStorage.getItem("ComapredcheckedboxIds");

    this.compare_Ids = JSON.parse(this.ids);

    //debugger;
    this.GetData();
    this.GetDataTier2();
    this.InsertCompareLog();
  }


  getComparison(e: any) {

    localStorage.setItem("ComapredId", e);
    this.router.navigate(['/home/shouldcost']);
  }

  partDetails: any;
  technicalParatameters: any;
  CommericalDetailsSupplierCost: any;
  CommericalDetailsShouldCost: any;
  commericalDetailsTier2: any;
  shouldCostVolume: any;
  ManufacturingProcessDetail: any;
  CommericalDetailsShouldCostTier2: any;
  material_Main: any;
  material_Detailed: any;
  // compardataSupplier: any;
  TechnicalParameterDetailed: any;

  isExpand = true;
  isExpandTier2 = false;
  isExpandShouldCostTier2 = false;
  IsCommericalDetailsSC = false;
  IsCommericalDetailsSupplierCost = false;
  IsDetailedProcess = false;
  IsMaterialDetails = false;
  ComparePartCount: any;
  Hidematerial_Detailedtable3 = true;
  Hidematerial_Detailedtable4 = true;
  IsTechnicalParameterDetailed = true;


  async GetData() {
    debugger;
    this.TechnicalParameterDetailed = [];
    const data = await this.searchservice.getComparisonDataNew(this.compare_Ids).toPromise();
    this.partDetails = data.partDetails;
    this.ComparePartCount = data.partDetails.length;
    debugger;
    this.technicalParatameters = data.technicalParatameters;

    this.CommericalDetailsSupplierCost = data.commericalDetailsSupplierCost;
    console.log(this.CommericalDetailsSupplierCost);
    this.CommericalDetailsShouldCost = data.commericalDetailsShouldCost;
    this.compardata = data.commericalDetailsShouldCost;
    // this.compardataSupplier = data.commericalDetailsSupplierCost;

    this.shouldCostVolume = data.shouldCostVolume;
    this.ManufacturingProcessDetail = data.manufacturingProcessDetail;
    this.CommericalDetailsShouldCostTier2 = data.commericalDetailsShouldCostTier2;
    this.material_Main = data.material_Main;
    this.material_Detailed = data.material_Detailed;

    this.TechnicalParameterDetailed = data.technicalParametersDetailed;

    if (data.partDetails.length == 3) {
      this.Hidematerial_Detailedtable3 = false;
      this.Hidematerial_Detailedtable4 = true;
    }
    if (data.partDetails.length == 4) {
      this.Hidematerial_Detailedtable3 = false;
      this.Hidematerial_Detailedtable4 = false;
    }




    this.SpinnerService.hide('spinner');
    setTimeout(() => {
      this.ShowChart();
      this.ShowChartSupplier();
    }, 200);

    setTimeout(() => {
      this.hidename();
    }, 300);
  }


  hidename() {
    const r = document.getElementById("chartOptionsId") as any;
    r.getElementsByClassName('canvasjs-chart-credit')[0].style.display = "none";

    const r2 = document.getElementById("chartOptionssupplierId") as any;
    r2.getElementsByClassName('canvasjs-chart-credit')[0].style.display = "none";
  }

  async GetDataTier2() {
    debugger;
    const data = await this.searchservice.getComparisonDataNewTier2(this.ids).toPromise();
    this.commericalDetailsTier2 = data;

    //console.log(this.partDetails);

  }

  showShouldCostTier2() {
    this.isExpandShouldCostTier2 = !this.isExpandShouldCostTier2
  }

  ChekNull(v: any): any {
    if (v == null || v == undefined || v <= 0) {
      return this.NA;
    }
    else {
      return v;
    }
  }

  backToPreviousPage() {
    this.location.back();
  }


  CostInfo: any = [];
  TotalComparePart: any = [];
  TotalCost: any = [];


  ShoudeCostInfo: any = [];
  chartOptionstest: any = [];

  ShowChart() {
    debugger;
    this.ShoudeCostInfo = [];
    this.TotalComparePart = [];

    for (var i = 0; i < this.compardata.length; i++) {
      if (this.compardata[i].id >= 4 && this.compardata[i].id <= 22) {
        this.TotalComparePart = [];
        this.TotalCost = [];

        if (this.compardata[i].id != 12 && this.compardata[i].id != 21) {
          if (this.compardata[i].details1 != null) {
            this.TotalComparePart.push(
              { y: Number(this.compardata[i].details1), label: this.compardata[1].details1 + ' - ' + this.compardata[2].details1 },
            );
          }
          if (this.compardata[i].details2 != null) {
            this.TotalComparePart.push(
              { y: Number(this.compardata[i].details2), label: this.compardata[1].details2 + ' - ' + this.compardata[2].details2 },
            );
          }
          if (this.compardata[i].details3 != null) {
            this.TotalComparePart.push(
              { y: Number(this.compardata[i].details3), label: this.compardata[1].details3 + ' - ' + this.compardata[2].details3 },
            );
          }
          if (this.compardata[i].details4 != null) {
            this.TotalComparePart.push(
              { y: Number(this.compardata[i].details4), label: this.compardata[1].details4 + ' - ' + this.compardata[2].details4 },
            );
          }
        }

        if (this.compardata[i].id == 22) {
          this.ShoudeCostInfo.push(
            {
              type: "stackedColumn",
              name: this.compardata[i].particular,
              indexLabelTextAlign: "left",
              indexLabel: "#total$",
              yValueFormatString: "#0.##",
              indexLabelPlacement: "outside",
              dataPoints: this.TotalComparePart,
            },
          );
        }
        else {
          this.ShoudeCostInfo.push(
            {
              type: "stackedColumn",
              name: this.compardata[i].particular,
              indexLabelTextAlign: "left",
              dataPoints: this.TotalComparePart,
            },
          );

        }
      }

    }


    this.chartOptions = {

      animationEnabled: true,
      exportEnabled: false,
      theme: "light1",
      title: {
        text: ""
      },
      axisX: {
        labelFontSize: 11,
        labelMaxWidth: 100,
        labelWrap: true,
        interval: 1,
      },
      axisY: {
        title: "Cost in USD($)",
        valueFormatString: "#0.#",
      },
      toolTip: {
        shared: true
      },
      legend: {
        horizontalAlign: "right",
        verticalAlign: "center",
        reversed: true
      },
      data: this.ShoudeCostInfo,


    }

  }

  calculateAndSetTotals(): void {

    this.chartOptions.data[this.chartOptions.data.length - 1].dataPoints = this.TotalCost;

    const totalDataPoints: { label: string, y: number }[] = [];
    const dataSeries = this.chartOptions.data;

    // Assuming all data series have the same labels and number of data points
    if (dataSeries.length > 0 && dataSeries[0].dataPoints) {
      for (let i = 0; i < dataSeries[0].dataPoints.length; i++) {
        let sum = 0;
        const label = dataSeries[0].dataPoints[i].label;

        for (let j = 0; j < dataSeries.length - 1; j++) { // Exclude the last (hidden) series
          if (dataSeries[j].dataPoints.length > 0) {
            sum += dataSeries[j].dataPoints[i].y;
          }
        }
        totalDataPoints.push({ label: label, y: sum });
      }
    }
    this.chartOptions.data[this.chartOptions.data.length - 1].dataPoints = totalDataPoints;
  }


  // compardataSupplierlable = ['Total Cost ($)', 'Direct Material Cost ($)', 'Material Refund ($)', 'Bought Out Finish Cost ($)',
  //   'Rough Part Cost ($)', 'Direct Labour Cost ($)', 'Process Overhead Cost ($)', 'Surface Treatment Cost ($)',
  //   'SGA ($)', 'Profit ($)', 'Packaging ($)', 'Fright Logistics ($)', 'Directed Buy ($)', 'Handling Charges ($)', 'ICC ($)', 'Rejection ($)'];

  // compardataSuppliervalue = ['totalCost', 'directMaterialCost', 'materialRefund', 'boughtOutFinishCost',
  //   'roughPartCost', 'directLabourCost', 'processOverheadCost', 'surfaceTreatmentCost',
  //   'sga', 'profit', 'packaging', 'fright_Logistics', 'directedBuy', 'handlingCharges', '0', '0'];

  ShowChartSupplier() {
    // //debugger;
    // this.CostInfo = [];
    // this.TotalComparePart = [];

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   var lbl = this.compardataSupplier[j].partName + ',' + this.compardataSupplier[j].partNumber + ',' + this.compardataSupplier[j].supplierName + ',' + this.compardataSupplier[j].suppManfLocation;
    //   this.TotalComparePart.push(
    //     { label: lbl, y: Number(this.compardataSupplier[j].directMaterialCost) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Direct Material Cost ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: Number(this.compardataSupplier[j].materialRefund) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Material Refund ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   //var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: Number(this.compardataSupplier[j].boughtOutFinishCost) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Bought Out Finish Cost ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: Number(this.compardataSupplier[j].roughPartCost) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Rough Part Cost ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   //  var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: Number(this.compardataSupplier[j].directLabourCost) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Direct Labour Cost ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: Number(this.compardataSupplier[j].processOverheadCost) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Process Overhead Cost ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: Number(this.compardataSupplier[j].surfaceTreatmentCost) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Surface Treatment Cost ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: Number(this.compardataSupplier[j].sga) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'SGA ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: Number(this.compardataSupplier[j].profit) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Profit ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: Number(this.compardataSupplier[j].packaging) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Packaging ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: Number(this.compardataSupplier[j].fright_Logistics) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Fright/Logistics ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: Number(this.compardataSupplier[j].directedBuy) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Directed Buy ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: Number(this.compardataSupplier[j].handlingCharges) },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Handling Charges ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: 0 },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'ICC ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
    //   this.TotalComparePart.push(
    //     { label: '', y: 0 },
    //   );
    // }
    // this.CostInfo.push(
    //   {
    //     type: "stackedColumn",
    //     name: 'Rejection ($)',
    //     indexLabelTextAlign: "left",
    //     dataPoints: this.TotalComparePart
    //   },
    // );

    // this.TotalComparePart = [];
    // for (var j = 0; j < this.compardataSupplier.length; j++) {
    //   this.TotalComparePart.push(
    //     { y: 0, label: '', indexLabel: this.compardataSupplier[j].totalCost + '$' },
    //   );
    // }
    // this.CostInfo.push(
    //   {

    //     type: "stackedColumn",
    //     indexLabelTextAlign: "left",
    //     indexLabel: "#total$",
    //     yValueFormatString: "#0.##",
    //     indexLabelPlacement: "outside",
    //     dataPoints: this.TotalComparePart,

    //   },
    // );

    // this.chartOptionssupplier = {
    //   animationEnabled: true,
    //   exportEnabled: false,
    //   theme: "light1",
    //   title: {
    //     text: ""
    //   },
    //   axisX: {
    //     labelFontSize: 10,
    //     labelMaxWidth: 100,
    //     labelWrap: true,
    //     interval: 1,
    //   },
    //   axisY: {
    //     title: "Cost in USD($)",
    //   },
    //   axisY2: {
    //     maximum: 15,
    //     lineThickness: 0,
    //     tickLength: 0,
    //   },
    //   toolTip: {
    //     shared: true
    //   },
    //   legend: {
    //     horizontalAlign: "right",
    //     verticalAlign: "center",
    //     reversed: true
    //   },
    //   data: this.CostInfo
    // };


    this.ShoudeCostInfo = [];
    this.TotalComparePart = [];

    for (var i = 0; i < this.CommericalDetailsSupplierCost.length; i++) {
      if (this.CommericalDetailsSupplierCost[i].id >= 6 && this.CommericalDetailsSupplierCost[i].id <= 21) {
        this.TotalComparePart = [];
        if (this.CommericalDetailsSupplierCost[i].id != 13) {
          if (this.CommericalDetailsSupplierCost[i].details1 != null) {
            this.TotalComparePart.push(
              { y: Number(this.CommericalDetailsSupplierCost[i].details1), label: this.CommericalDetailsSupplierCost[1].details1 + ' - ' + this.CommericalDetailsSupplierCost[2].details1 + ' - ' + this.CommericalDetailsSupplierCost[3].details1 + ' - ' + this.CommericalDetailsSupplierCost[4].details1 },
            );
          }
          if (this.CommericalDetailsSupplierCost[i].details2 != null) {
            this.TotalComparePart.push(
              { y: Number(this.CommericalDetailsSupplierCost[i].details2), label: this.CommericalDetailsSupplierCost[1].details2 + ' - ' + this.CommericalDetailsSupplierCost[2].details2 + ' - ' + this.CommericalDetailsSupplierCost[3].details2 + ' - ' + this.CommericalDetailsSupplierCost[4].details2 },
            );
          }
          if (this.CommericalDetailsSupplierCost[i].details3 != null) {
            this.TotalComparePart.push(
              { y: Number(this.CommericalDetailsSupplierCost[i].details3), label: this.CommericalDetailsSupplierCost[1].details3 + ' - ' + this.CommericalDetailsSupplierCost[2].details3 + ' - ' + this.CommericalDetailsSupplierCost[3].details3 + ' - ' + this.CommericalDetailsSupplierCost[4].details3 },
            );
          }
          if (this.CommericalDetailsSupplierCost[i].details4 != null) {
            this.TotalComparePart.push(
              { y: Number(this.CommericalDetailsSupplierCost[i].details4), label: this.CommericalDetailsSupplierCost[1].details4 + ' - ' + this.CommericalDetailsSupplierCost[2].details4 + ' - ' + this.CommericalDetailsSupplierCost[3].details4 + ' - ' + this.CommericalDetailsSupplierCost[4].details4 },
            );
          }
        }

        if (this.CommericalDetailsSupplierCost[i].id == 21) {
          this.ShoudeCostInfo.push(
            {
              type: "stackedColumn",
              name: this.CommericalDetailsSupplierCost[i].particular,
              indexLabelTextAlign: "left",
              indexLabel: "#total$",
              yValueFormatString: "#0.##",
              indexLabelPlacement: "outside",
              dataPoints: this.TotalComparePart,
            },
          );
        }
        else {
          this.ShoudeCostInfo.push(
            {
              type: "stackedColumn",
              name: this.CommericalDetailsSupplierCost[i].particular,
              indexLabelTextAlign: "left",
              dataPoints: this.TotalComparePart,
            },
          );

        }
      }

    }


    this.chartOptionssupplier = {

      animationEnabled: true,
      exportEnabled: false,
      theme: "light1",
      title: {
        text: ""
      },
      axisX: {
        labelFontSize: 11,
        labelMaxWidth: 100,
        labelWrap: true,
        interval: 1,
      },
      axisY: {
        title: "Cost in USD($)",
        valueFormatString: "#0.#",
      },
      toolTip: {
        shared: true
      },
      legend: {
        horizontalAlign: "right",
        verticalAlign: "center",
        reversed: true
      },
      data: this.ShoudeCostInfo,


    }


  }

  async InsertCompareLog() {

    const data = await this.reportservice.InsertCompareLogData(this.ids, this.userId).toPromise();
    return;
  }

  getsuppComparison(e: string) {
    // debugger;
    var colindex: number;
    const ShouldCost: any[][] = (this.CommericalDetailsShouldCost as any[]).map(item => [item.id, item.particular, item.details1,
    item.details2, item.details3, item.details4]);
    for (let i = 2; i <= 5; i++) {
      if (ShouldCost?.[0]?.[i] != undefined) {
        if (ShouldCost[0][i] == e) {
          colindex = i
        }
      }
    }

    this.suppshouldcost = ShouldCost.map((obj: { [s: string]: unknown; } | ArrayLike<unknown>) => {
      const values = Object.values(obj);
      return { Id: values[0], particular: values[1], value: values[colindex] };  // Index-based mapping
    });
    console.log("array", this.suppshouldcost);
    localStorage.setItem("suppcomshouldcost", JSON.stringify(this.suppshouldcost));
    this.router.navigate(['/home/suppcomparison']);
  }


}

