import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/SharedServices/search.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environments';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-comparisonnew',
  templateUrl: './comparisonnew.component.html',
  styleUrls: ['./comparisonnew.component.css']
})
export class ComparisonnewComponent implements OnInit {

  chartOptions: any = [];
  chartOptionssupplier: any = [];


  constructor(public searchservice: SearchService, public router: Router, private location: Location, private SpinnerService: NgxSpinnerService) {

  }

  compardata: any[] = [];
  compardataTier2: any[] = [];
  colunms: any[] = [];
  headers: any[] = [];
  ids: any = [];
  data: any[] = [];


  NA: any = "NA*";

  shouldCostBreakdownList: any;
  shouldCostBreakdownNonList: any;

  Manu_TotalInUSD: number = 0;
  TotalInUSD: number = 0;

  ngOnInit(): void {
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

    this.ids = localStorage.getItem("ComapredcheckedboxIds");

    this.GetData();
    this.GetDataTier2();
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
  compardataSupplier: any;

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

  async GetData() {

    const data = await this.searchservice.getComparisonDataNew(this.ids).toPromise();
    this.partDetails = data.partDetails;
    this.ComparePartCount = data.partDetails.length;
    this.technicalParatameters = data.technicalParatameters;
    this.CommericalDetailsSupplierCost = data.commericalDetailsSupplierCost;
    this.CommericalDetailsShouldCost = data.commericalDetailsShouldCost;
    this.compardata = data.commericalDetailsShouldCost;
    this.compardataSupplier = data.commericalDetailsSupplierCost;

    this.shouldCostVolume = data.shouldCostVolume;
    this.ManufacturingProcessDetail = data.manufacturingProcessDetail;
    this.CommericalDetailsShouldCostTier2 = data.commericalDetailsShouldCostTier2;
    this.material_Main = data.material_Main;
    this.material_Detailed = data.material_Detailed;

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
    //debugger;
    this.ShoudeCostInfo = [];
    this.TotalComparePart = [];
    this.TotalCost = [];

    for (var i = 0; i < this.compardata.length; i++) {
      if (this.compardata[i].id >= 4 && this.compardata[i].id <= 20) {
        this.TotalComparePart = [];
        this.TotalCost = [];

        if (this.compardata[i].id != 11) {
          if (this.compardata[i].details1 != null) {
            this.TotalCost.push(
              { y: 0, label: '', indexLabel: this.compardata[i].details1 + '$' }
            );
            this.TotalComparePart.push(
              { y: Number(this.compardata[i].details1), label: this.compardata[1].details1 + ' ' + this.compardata[2].details1 },
            );
          }
          if (this.compardata[i].details2 != null) {
            this.TotalCost.push(
              { y: 0, label: '', indexLabel: this.compardata[i].details2 + '$' }
            );
            this.TotalComparePart.push(
              { y: Number(this.compardata[i].details2), label: this.compardata[1].details2 + ' ' + this.compardata[2].details2 },
            );
          }
          if (this.compardata[i].details3 != null) {
            this.TotalCost.push(
              { y: 0, label: '', indexLabel: this.compardata[i].details3 + '$' }
            );
            this.TotalComparePart.push(
              { y: Number(this.compardata[i].details3), label: this.compardata[1].details3 + ' ' + this.compardata[2].details3 },
            );
          }
          if (this.compardata[i].details4 != null) {
            this.TotalCost.push(
              { y: 0, label: '', indexLabel: this.compardata[i].details4 + '$' }
            );
            this.TotalComparePart.push(
              { y: Number(this.compardata[i].details4), label: this.compardata[1].details4 + ' ' + this.compardata[2].details4 },
            );
          }
        }

        if (this.compardata[i].id == 20) {
          this.ShoudeCostInfo.push(
            {
              type: "stackedColumn",
              name: this.compardata[i].particular,
              indexLabelTextAlign: "left",
              dataPoints: this.TotalCost
            },
          );
        }
        else {
          this.ShoudeCostInfo.push(
            {
              type: "stackedColumn",
              name: this.compardata[i].particular,
              indexLabelTextAlign: "left",
              dataPoints: this.TotalComparePart
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
        labelFontSize: 10,
        labelMaxWidth: 100,
        labelWrap: true,
        interval: 1,
      },
      axisY: {
        title: "Cost in USD($)",
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


  compardataSupplierlable = ['Total Cost ($)', 'Direct Material Cost ($)', 'Material Refund ($)', 'Bought Out Finish Cost ($)',
    'Rough Part Cost ($)', 'Direct Labour Cost ($)', 'Process Overhead Cost ($)', 'Surface Treatment Cost ($)',
    'SGA ($)', 'Profit ($)', 'Packaging ($)', 'Fright Logistics ($)', 'Directed Buy ($)', 'Handling Charges ($)', 'ICC ($)', 'Rejection ($)'];

  compardataSuppliervalue = ['totalCost', 'directMaterialCost', 'materialRefund', 'boughtOutFinishCost',
    'roughPartCost', 'directLabourCost', 'processOverheadCost', 'surfaceTreatmentCost',
    'sga', 'profit', 'packaging', 'fright_Logistics', 'directedBuy', 'handlingCharges', '0', '0'];

  ShowChartSupplier() {
    //debugger;
    this.CostInfo = [];
    this.TotalComparePart = [];

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      var lbl = this.compardataSupplier[j].partName + ',' + this.compardataSupplier[j].partNumber + ',' + this.compardataSupplier[j].supplierName + ',' + this.compardataSupplier[j].suppManfLocation;
      this.TotalComparePart.push(
        { label: lbl, y: Number(this.compardataSupplier[j].directMaterialCost) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Direct Material Cost ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: Number(this.compardataSupplier[j].materialRefund) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Material Refund ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      //var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: Number(this.compardataSupplier[j].boughtOutFinishCost) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Bought Out Finish Cost ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: Number(this.compardataSupplier[j].roughPartCost) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Rough Part Cost ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      //  var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: Number(this.compardataSupplier[j].directLabourCost) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Direct Labour Cost ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: Number(this.compardataSupplier[j].processOverheadCost) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Process Overhead Cost ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: Number(this.compardataSupplier[j].surfaceTreatmentCost) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Surface Treatment Cost ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: Number(this.compardataSupplier[j].sga) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'SGA ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: Number(this.compardataSupplier[j].profit) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Profit ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: Number(this.compardataSupplier[j].packaging) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Packaging ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: Number(this.compardataSupplier[j].fright_Logistics) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Fright/Logistics ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: Number(this.compardataSupplier[j].directedBuy) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Directed Buy ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: Number(this.compardataSupplier[j].handlingCharges) },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Handling Charges ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: 0 },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'ICC ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      // var lbl  = this.compardataSupplier[j].partName + ' ' + this.compardataSupplier[j].partNumber + ' ' + this.compardataSupplier[j].supplierName + ' ' + this.compardataSupplier[j].suppManfLocation ;
      this.TotalComparePart.push(
        { label: '', y: 0 },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Rejection ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.TotalComparePart = [];
    for (var j = 0; j < this.compardataSupplier.length; j++) {
      this.TotalComparePart.push(
        { y: 0, label: '', indexLabel: this.compardataSupplier[j].totalCost + '$' },
      );
    }
    this.CostInfo.push(
      {
        type: "stackedColumn",
        name: 'Total Cost ($)',
        indexLabelTextAlign: "left",
        dataPoints: this.TotalComparePart
      },
    );

    this.chartOptionssupplier = {
      animationEnabled: true,
      exportEnabled: false,
      theme: "light1",
      title: {
        text: ""
      },
      axisX: {
        labelFontSize: 10,
        labelMaxWidth: 100,
        labelWrap: true,
        interval: 1,
      },
      axisY: {
        title: "Cost in USD($)",
      },
      axisY2: {
        maximum: 15,
        lineThickness: 0,
        tickLength: 0,
      },
      toolTip: {
        shared: true
      },
      legend: {
        horizontalAlign: "right",
        verticalAlign: "center",
        reversed: true
      },
      data: this.CostInfo
    }

  }

}

