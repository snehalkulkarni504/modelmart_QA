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

    setTimeout(() => {
      this.ShowChart();
    }, 1000);

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
  ManufacturingProcessDetail:any;
  CommericalDetailsShouldCostTier2:any;

  isExpand = true;
  isExpandTier2 = false;
  isExpandShouldCostTier2 = false;
  IsCommericalDetailsSC = false;
  IsCommericalDetailsSupplierCost = false;
  IsDetailedProcess = false;

  async GetData() {
   
    const data = await this.searchservice.getComparisonDataNew(this.ids).toPromise();
    this.partDetails = data.partDetails;
    this.technicalParatameters = data.technicalParatameters;
    this.CommericalDetailsSupplierCost = data.commericalDetailsSupplierCost;
    this.CommericalDetailsShouldCost = data.commericalDetailsShouldCost;
    this.shouldCostVolume = data.shouldCostVolume;
    this.ManufacturingProcessDetail = data.manufacturingProcessDetail;
    this.CommericalDetailsShouldCostTier2 = data.commericalDetailsShouldCostTier2;
    this.SpinnerService.hide('spinner');
  }

  async GetDataTier2() {
    debugger
  
    const data = await this.searchservice.getComparisonDataNewTier2(this.ids).toPromise();
    this.commericalDetailsTier2 = data;

    console.log(this.partDetails);
   
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
    debugger;
    this.CostInfo = [];
    this.TotalComparePart = [];
    this.TotalCost = [];

    for (var i = 0; i < this.CommericalDetailsShouldCost.length; i++) {

      if (this.CommericalDetailsShouldCost[i].id >= 2 && this.CommericalDetailsShouldCost[i].id <= 18) {
        this.TotalComparePart = [];
        this.TotalCost = [];
        debugger;
        var rr1 = this.CommericalDetailsShouldCost[i].details1 - this.CommericalDetailsShouldCost[i].details1;
        var rr2 = this.CommericalDetailsShouldCost[i].details2 - this.CommericalDetailsShouldCost[i].details2;
        var rr3 = this.CommericalDetailsShouldCost[i].details3 - this.CommericalDetailsShouldCost[i].details3;
        var rr4 = this.CommericalDetailsShouldCost[i].details4 - this.CommericalDetailsShouldCost[i].details4;

        if (this.CommericalDetailsShouldCost[i].id != 10) {
          if (this.CommericalDetailsShouldCost[i].details1 != null) {
            this.TotalCost.push(
              { y: Number(rr1), label: '', indexLabel: this.CommericalDetailsShouldCost[i].details1 + '$' }
            );
            // this.TotalComparePart.push(
            //   { y: Number(this.CommericalDetailsShouldCost[i].details1), label: this.CommericalDetailsShouldCost[1].details1 + ' ' + this.CommericalDetailsShouldCost[2].details1 + ' ' + this.CommericalDetailsShouldCost[4].details1 },
            // );
            this.TotalComparePart.push(
              { y: Number(this.CommericalDetailsShouldCost[i].details1), label: '' },
            );
          }
          if (this.CommericalDetailsShouldCost[i].details2 != null) {
            this.TotalCost.push(
              { y: Number(rr2), label: '', indexLabel: this.CommericalDetailsShouldCost[i].details2 + '$' }
            );
            // this.TotalComparePart.push(
            //   { y: Number(this.CommericalDetailsShouldCost[i].details2), label: this.CommericalDetailsShouldCost[1].details2 + ' ' + this.CommericalDetailsShouldCost[2].details2 + ' ' + this.CommericalDetailsShouldCost[4].details2 },
            // );
            this.TotalComparePart.push(
              { y: Number(this.CommericalDetailsShouldCost[i].details2), label: '' },
            );
          }
          if (this.CommericalDetailsShouldCost[i].details3 != null) {
            this.TotalCost.push(
              { y: Number(rr3), label: '', indexLabel: this.CommericalDetailsShouldCost[i].details3 + '$' }
            );
            // this.TotalComparePart.push(
            //   { y: Number(this.CommericalDetailsShouldCost[i].details3), label: this.CommericalDetailsShouldCost[1].details3 + ' ' + this.CommericalDetailsShouldCost[2].details3 + ' ' + this.CommericalDetailsShouldCost[4].details3 },
            // );
            this.TotalComparePart.push(
              { y: Number(this.CommericalDetailsShouldCost[i].details3), label: '' },
            );
          }
          if (this.CommericalDetailsShouldCost[i].details4 != null) {
            this.TotalCost.push(
              { y: Number(rr4), label: '', indexLabel: this.CommericalDetailsShouldCost[i].details4 + '$' }
            );
            // this.TotalComparePart.push(
            //   { y: Number(this.CommericalDetailsShouldCost[i].details4), label: this.CommericalDetailsShouldCost[1].details4 + ' ' + this.CommericalDetailsShouldCost[2].details4 + ' ' + this.CommericalDetailsShouldCost[4].details4 },
            // );
            this.TotalComparePart.push(
              { y: Number(this.CommericalDetailsShouldCost[i].details4), label: '' },
            );
          }
        }

        if (this.CommericalDetailsShouldCost[i].id == 2) {
          this.CostInfo.push(
            {
              type: "stackedColumn",
              name: this.CommericalDetailsShouldCost[i].particular,
              showInLegend: "true",
              // legend: {
              //   //     verticalAlign: "center",  // "top" , "bottom"
              //   horizontalAlign: "center" //"left"  // "center" , "right"
              // },
              indexLabelTextAlign: "left",
              dataPoints: this.TotalCost
            },
          );
        }
        else {
          this.CostInfo.push(
            {
              type: "stackedColumn",
              name: this.CommericalDetailsShouldCost[i].particular,
              showInLegend: "true",
              legend: {
                verticalAlign: "bottom" // "center",  // "top" , "bottom"
                //horizontalAlign: "center" //"left"  // "center" , "right"
              },
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


    // ----------------------------------------------------

   
  }
 
}

