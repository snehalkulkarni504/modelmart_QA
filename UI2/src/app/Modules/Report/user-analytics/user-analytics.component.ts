import { Component, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import { count, from } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-analytics',
  templateUrl: './user-analytics.component.html',
  styleUrl: './user-analytics.component.css'
})
export class UserAnalyticsComponent implements OnInit {
   useranalytics!: FormGroup
  selectedFromDate!: any;
  selectedToDate!: any;
  Activeusers!: string
  AppLogins!: string
  AvgUsagetime!: string
  NoofRequest!: string
  NoofUpload!: string
  NoofTCOUpload!: string
  UnqLogin!: string
  FromDate!: any;
  ToDate!: any;
  deployedDate!: any;
  currentDate: any;
  currentDate1: any;
  category!: string
  dropdownOptions: any[] = [];
  TeamcountArray: { Team: string; Count: number }[] = [];
  PagecountArray: { Page: string; Count: number }[] = [];
  RolecountArray: { Role: string; Count: number }[] = [];
  PagetimeArray: { Page: string; Time: string }[] = [];
  TeamchartDataPoints: { label: string; y: number }[] = [];
  RolechartDataPoints: { label: string; y: number }[] = [];
  PagechartDataPoints: { label: string; y: number }[] = [];
  PageTimechartDataPoints: { label: string; y: number }[] = [];
  TeamChartOptions: any = [];
  PageChartOptions: any = [];
  RoleChartOptions: any = [];
  pagetimechartOptions: any = [];
  chart: any;
  minDate: any;
  dataloaded: boolean = false;

  constructor(private datePipe: DatePipe, private location: Location, private reportservice: ReportServiceService, private spinnerService: NgxSpinnerService) { }

  async ngOnInit(): Promise<void> {

    this.deployedDate = this.datePipe.transform(new Date(2025, 3, 3), "yyyy-MM-dd");
    console.log(this.deployedDate)
    this.minDate = this.getFormattedCurrentDate();

    this.dropdownOptions = [
      { id: 1, name: 'Last 3 Months' },
      { id: 2, name: 'Last 6 Months' },
      { id: 3, name: 'Last 1 Year' }
    ];

    this.useranalytics = new FormGroup({
      currentDate: new FormControl(),
      currentDate1: new FormControl(),
      selectedOption: new FormControl(this.dropdownOptions[1].id)
    });
    this.Setdatefilter('1')

  }

  getFormattedCurrentDate(): string {
    const today = new Date();
    const year = this.deployedDate.substring(0, 4);
    const month = this.deployedDate.substring(5, 7); // Month is 0-indexed
    const day = this.deployedDate.substring(8)
    console.log(`${year}-${month}-${day}`)
    return `${year}-${month}-${day}`;
  }

  assigncategory(e: any) {
    console.log('e.srcElement.value', e.srcElement.value)
    this.category = e.srcElement.value
    this.Setdatefilter(this.category)
  }

  async Setdatefilter(category: string) {
    var date = new Date();
    if (category == '1') {
      this.FromDate = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth() - 3, 1), "yyyy-MM-dd");
      console.log(this.FromDate)
      this.ToDate = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth(), date.getDate()), "yyyy-MM-dd");
      console.log(this.ToDate)
    }
    if (category == '2') {
      this.FromDate = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth() - 6, 1), "yyyy-MM-dd");
      console.log(this.FromDate)
      this.ToDate = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth(), date.getDate()), "yyyy-MM-dd");
      console.log(this.ToDate)
    }
    if (category == '3') {
      this.FromDate = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth() - 12, 1), "yyyy-MM-dd");
      console.log(this.FromDate)
      this.ToDate = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth(), date.getDate()), "yyyy-MM-dd");
      console.log(this.ToDate)
    }
    if (this.deployedDate > this.FromDate) {
      this.selectedFromDate = this.deployedDate
      this.selectedToDate = this.ToDate
      await this.GetData(this.deployedDate, this.ToDate);
    }
    else {
      this.selectedFromDate = this.FromDate
      this.selectedToDate = this.ToDate
      await this.GetData(this.FromDate, this.ToDate);
    }
    console.log('this.selectedFromDate', this.selectedFromDate)
    console.log('this.selectedToDate', this.selectedToDate)

    this.resetcharts();
  }


  backToPreviousPage() {
    this.location.back();
  }

  exportToExcel(): void {

    debugger
    if ((this.selectedFromDate != undefined) &&
      (this.selectedToDate != undefined)) {
      this.spinnerService.show();
      this.reportservice.ExcelExportUserAnalytics(this.selectedFromDate, this.selectedToDate).subscribe({
        next: (data) => {
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = "User Analytics Report";
          a.click();
        },
        error: (e) => {
          //this.ProcessOrderLoading = false;
          this.spinnerService.hide();
          alert(
            'Please select Proper dates.'
          );
        },
        complete: () => {
          this.spinnerService.hide();
        },
      });
    }
    else if ((this.selectedFromDate == undefined) &&
      (this.selectedToDate == undefined)) {
      // startDate= this.fydate.getCurrentFinancialYearDates().startDate;
      // endDate=this.fydate.getCurrentFinancialYearDates().endDate;
      alert(
        'Please select dates.'
      );
    }
  }


  async GetData(FromDate: any, ToDate: any) {
    debugger;
    this.dataloaded = false
    this.TeamchartDataPoints = [];
    this.PagechartDataPoints = [];
    this.RolechartDataPoints = [];
    this.PageTimechartDataPoints = [];

    let data;
    await this.reportservice.getUserAnalyticsData(FromDate, ToDate).subscribe(
      (response: any) => {
        this.dataloaded = true
        console.log('dataloaded')
        data = response
        this.Activeusers = data.usersdata[0].Count;
        this.AppLogins = data.usersdata[1].Count;
        this.AvgUsagetime = data.usersdata[2].Count;
        this.NoofRequest = data.usersdata[3].Count;
        this.NoofUpload = data.usersdata[4].Count;
        this.NoofTCOUpload = data.usersdata[5].Count;
        this.UnqLogin = data.usersdata[6].Count;
        this.TeamcountArray = data.usagebyteam;
        this.PagecountArray = data.usagebypage;
        this.RolecountArray = data.usagebyrole;
        this.PagetimeArray = data.averagetimespent;
        this.TeamchartDataPoints = this.TeamcountArray.map(({ Team, Count }) => {
          return { label: Team, y: Count };
        })

        console.log(this.TeamchartDataPoints)

        this.PagechartDataPoints = this.PagecountArray.map(({ Page, Count }) => {
          return { label: Page, y: Count };
        })

        this.RolechartDataPoints = this.RolecountArray.map(({ Role, Count }) => {
          return { label: Role, y: Count };
        })
        this.PageTimechartDataPoints = this.PagetimeArray.map(({ Page, Time }) => {
          return { label: Page, y: Number(Time.substring(0, 5)) };
        })

      },
      (error) => {
        console.error('API call error:', error);
      }
    );

    console.log(this.TeamcountArray)


    // this.TeamchartDataPoints=[];




  }

  resetcharts() {
    setTimeout(() => {
      console.log('resetcharts')
      if (this.dataloaded == true) {


        this.TeamChartOptions = {
          animationEnabled: true,
          title: {
            text: 'Usage by Team',
            fontSize: 18,
            fontWeight: "lighter",
          },
          axisX: {
            interval: 1,
            labelMaxWidth: 60,
            labelAngle: 70,
            labelFontSize: 10,
            labelWrap: true
          },
          data: [
            {
              // Change type to "doughnut", "line", "splineArea", etc.
              type: 'column',
              dataPoints: this.TeamchartDataPoints
            },
          ],
        };

        this.PageChartOptions = {
          animationEnabled: true,
          title: {
            text: 'Usage by Module',
            fontSize: 18,
            fontWeight: "lighter",
          },
          data: [
            {
              // Change type to "doughnut", "line", "splineArea", etc.
              type: 'pie',
              dataPoints: this.PagechartDataPoints
            },
          ],
        };

        this.pagetimechartOptions = {
          animationEnabled: true,
          toolTip: {
            content: "{label} : {y}",
          },
          title: {
            text: 'Average time spent per page',
            fontSize: 18,
            fontWeight: "lighter",
          },
          axisY: {
            interval: 5,
            gridThickness: 2,
          },
          axisX: {
            interval: 1,
            title: "Time in Hrs",
            labelMaxWidth: 100,
            labelAngle: 70,
            labelFontSize: 11,
          },
          data: [
            {
              // Change type to "doughnut", "line", "splineArea", etc.
              type: 'column',
              dataPoints: this.PageTimechartDataPoints
            },
          ],
        }

        this.RoleChartOptions = {
          animationEnabled: true,
          title: {
            text: 'Usage by Role',
            fontSize: 18,
            fontWeight: "lighter",
          },
          data: [
            {
              // Change type to "doughnut", "line", "splineArea", etc.
              type: 'column',
              dataPoints: this.RolechartDataPoints
            },
          ],
        };

      }
    }, 1000);

    setTimeout(() => {
      this.hideCanvaslink();
    }, 1200);

  }

  hideCanvaslink() {
    const graph1 = document.getElementById("TeamChartId") as any;
    graph1.getElementsByClassName('canvasjs-chart-credit')[0].style.display = "none";

    const graph2 = document.getElementById("ModulecardsId") as any;
    graph2.getElementsByClassName('canvasjs-chart-credit')[0].style.display = "none";

    const graph3 = document.getElementById("RoleChartId") as any;
    graph3.getElementsByClassName('canvasjs-chart-credit')[0].style.display = "none";

    const graph4 = document.getElementById("pagetimechartId") as any;
    graph4.getElementsByClassName('canvasjs-chart-credit')[0].style.display = "none";
  }

  async onClickGetData() {
    debugger;
    await this.GetData(this.selectedFromDate, this.selectedToDate)
    //this.pagetimechartOptions.data[0].dataPoints = this.PageTimechartDataPoints
    debugger;
    this.TeamChartOptions = [];
    this.PageChartOptions = [];
    this.pagetimechartOptions = [];
    this.RoleChartOptions = [];
    this.resetcharts()
  }

  getChartInstance(chart: object) {
    this.chart = chart;
    setTimeout(this.updateChart, 1000); //Chart updated every 1 second
  }

  updateChart = () => {
    var yVal =
      this.PageTimechartDataPoints[this.PageTimechartDataPoints.length - 1].y +
      Math.round(5 + Math.random() * (-5 - 5));
    this.PageTimechartDataPoints.push({ label: this.PageTimechartDataPoints[this.PageTimechartDataPoints.length - 1].label + 1, y: yVal });

    if (this.PageTimechartDataPoints.length > 10) {
      this.PageTimechartDataPoints.shift();
    }
    this.chart.render();
    setTimeout(this.updateChart, 1000); //Chart updated every 1 second
  };



}
