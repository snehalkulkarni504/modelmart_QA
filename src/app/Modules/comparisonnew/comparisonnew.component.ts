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
    // debugger;

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
    //debugger;
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
    //this.material_Detailed_Count = data.material_Detailed.length;
    // alert(this.ComparePartCount);
    //debugger;
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

  ShowChart() {
    // debugger;
    this.CostInfo = [];
    this.TotalComparePart = [];
    this.TotalCost = [];

    for (var i = 0; i < this.compardata.length; i++) {
      if (this.compardata[i].id >= 4 && this.compardata[i].id <= 20) {
        this.TotalComparePart = [];
        this.TotalCost = [];

        if (this.compardata[i].id != 12) {
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

        if (this.compardata[i].id == 4) {
          this.CostInfo.push(
            {
              type: "stackedColumn",
              name: this.compardata[i].particular,
              showInLegend: "true",
              indexLabelTextAlign: "left",
              dataPoints: this.TotalCost
            },
          );
        }
        else {
          this.CostInfo.push(
            {
              type: "stackedColumn",
              name: this.compardata[i].particular,
              showInLegend: "true",
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
      data: this.CostInfo,


    }

  }

  ShowChartSupplier() {
    debugger;
    this.CostInfo = [];
    this.TotalComparePart = [];
    this.TotalCost = [];
    console.log(this.compardataSupplier);

    for (var i = 0; i < this.compardataSupplier.length; i++) {
      this.TotalComparePart = [];
      this.TotalCost = [];

      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].directMaterialCost), label: 'Direct Material Cost' },
      );
      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].materialRefund), label: 'materialRefund' },
      );
      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].boughtOutFinishCost), label: 'boughtOutFinishCost' },
      );
      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].roughPartCost), label: 'roughPartCost' },
      );
      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].directLabourCost), label: 'directLabourCost' },
      );
      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].processOverheadCost), label: 'processOverheadCost' },
      );
      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].surfaceTreatmentCost), label: 'surfaceTreatmentCost' },
      );
      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].sga), label: 'sga' },
      );
      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].profit), label: 'profit' },
      );
      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].packaging), label: 'packaging' },
      );
      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].fright_Logistics), label: 'fright_Logistics' },
      );
      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].directedBuy), label: 'directedBuy' },
      );
      this.TotalComparePart.push(
        { y: Number(this.compardataSupplier[i].handlingCharges), label: 'handlingCharges' },
      );


      this.CostInfo.push(
        {
          type: "stackedColumn",
          name: "dsds",
          showInLegend: "true",
          indexLabelTextAlign: "left",
          dataPoints: this.TotalComparePart
        },
      );
    }

    console.log(this.TotalComparePart);


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

