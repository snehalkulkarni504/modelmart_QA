import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/SharedServices/search.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environments';
 

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.css']
})
export class ComparisonComponent implements OnInit {

  chartOptions: any = [];

  constructor(public searchservice: SearchService, public router: Router, private location: Location) {

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

    this.ids = localStorage.getItem("ComapredcheckedboxIds");
    this.GetData();
    setTimeout(() => {
      this.ShowChart();
    }, 1000);

  }


  getComparison(e: any) {
    //debugger;;
    localStorage.setItem("ComapredId", e);
    this.router.navigate(['/home/shouldcost']);
  }

  async GetData() {
    const data = await this.searchservice.getComparisonData(this.ids).toPromise();
    this.compardata = data;

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

  // -------------- popup -------

  //elPopup: any;
  async showPopup(d: any, evt: any, key: any, row: any, getId: number) {
    //debugger;;
    this.compardataTier2 = [];

    let CSheaderId;
    switch (getId) {
      case 1: {
        CSheaderId = this.compardata[0].details1;
        break;
      }
      case 2: {
        CSheaderId = this.compardata[0].details2;
        break;
      }
      case 3: {
        CSheaderId = this.compardata[0].details3;
        break;
      }
      case 4: {
        CSheaderId = this.compardata[0].details4;
        break;
      }
    }

    let val = parseFloat(row);
    if (d.id == 19 && key == 'data' && val > 0) {

      const data = await this.searchservice.getCompardataTier2(CSheaderId).toPromise();
      this.compardataTier2 = data;
      this.shouldCostBreakdownList = [];
      this.shouldCostBreakdownNonList = [];

      this.shouldCostBreakdownList = data.compardatashouldCostBreakdown;
      this.shouldCostBreakdownNonList = data.compardatashouldCostBreakdownNon;

      // Position:
      const absX = evt.clientX + window.scrollX;
      const absY = evt.clientY + window.scrollY;

      const element = document.getElementById('Tier2Pupop') as HTMLElement;
      element.style.left = absX + 'px';
      element.style.top = absY + 'px';
      element.style.visibility = 'visible';


      setTimeout(() => {
        this.findsum(data.compardatashouldCostBreakdown, data.compardatashouldCostBreakdownNon);
      }, 100);

    }
    else {
      const element = document.getElementById('Tier2Pupop') as HTMLElement;
      element.style.visibility = 'hidden';
    }
  }

  findsum(data: any, data2: any) {

    //debugger;;
    let Non_TotalInUSD = 0;
    this.Manu_TotalInUSD = 0;
    this.TotalInUSD = 0;

    for (let i = 0; i < data.length; i++) {
      this.Manu_TotalInUSD += data[i].col2;
    }
    for (let i = 0; i < data2.length; i++) {
      Non_TotalInUSD += data2[i].col2;
    }

    this.TotalInUSD = this.Manu_TotalInUSD + Non_TotalInUSD;
  }


  CostInfo: any = [];
  TotalComparePart: any = [];
  TotalCost: any = [];

  ShowChart() {
    debugger;
    this.CostInfo = [];
    this.TotalComparePart = [];
    this.TotalCost = [];

    for (var i = 0; i < this.compardata.length; i++) {

      if (this.compardata[i].id >= 16 && this.compardata[i].id <= 33) {
        this.TotalComparePart = [];
        this.TotalCost = [];

        if (this.compardata[i].id != 23 && this.compardata[i].id != 32) {
          if (this.compardata[i].details1 != null) {
            this.TotalCost.push(
              { y: 0, label: '',  indexLabel: this.compardata[i].details1 + '$' }
            );
            this.TotalComparePart.push(
              { y: Number(this.compardata[i].details1), label: this.compardata[1].details1 + ' ' + this.compardata[2].details1 + ' ' + this.compardata[4].details1 },
            );
          }
          if (this.compardata[i].details2 != null) {
            this.TotalCost.push(
              { y: 0, label: '',   indexLabel: this.compardata[i].details2 + '$' }
            );
            this.TotalComparePart.push(
              { y: Number(this.compardata[i].details2), label: this.compardata[1].details2 + ' ' + this.compardata[2].details2 + ' ' + this.compardata[4].details2 },
            );
          }
          if (this.compardata[i].details3 != null) {
            this.TotalCost.push(
              { y: 0, label: '',   indexLabel: this.compardata[i].details3 + '$' }
            );
            this.TotalComparePart.push(
              { y: Number(this.compardata[i].details3), label: this.compardata[1].details3 + ' ' + this.compardata[2].details3 + ' ' + this.compardata[4].details3 },
            );
          }
          if (this.compardata[i].details4 != null) {
            this.TotalCost.push(
              { y: 0, label: '',  indexLabel: this.compardata[i].details4 + '$' }
            );
            this.TotalComparePart.push(
              { y: Number(this.compardata[i].details4), label: this.compardata[1].details4 + ' ' + this.compardata[2].details4 + ' ' + this.compardata[4].details4 },
            );
          }
        }

        if (this.compardata[i].id == 33) {
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


}

