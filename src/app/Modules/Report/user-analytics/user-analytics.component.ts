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
  UnqLogin!: string
  FromDate!: any;
  ToDate!: any;
  currentDate: any;
  dd: any;
  TeamcountArray: { Team: string; Count: number }[] = [];
  PagecountArray: { Page: string; Count: number }[] = [];
  PagetimeArray: { Page: string; Time: string }[] = [];
  TeamchartDataPoints: { label: string; y: number }[] = [];
  PagechartDataPoints: { label: string; y: number }[] = [];
  PageTimechartDataPoints: { label: string; y: number }[] = [];
  TeamChartOptions: any = [];
  PageChartOptions: any = [];
  pagetimechartOptions: any = [];
  chart: any;

  constructor(private datePipe: DatePipe, private location: Location, private reportservice: ReportServiceService,private spinnerService: NgxSpinnerService) { }

  // chartDataPoints = [
  //   { label: 'Tech Purchasing', y: 19 },
  //   { label: 'Direct Sourcing', y: 24 },
  //   { label: 'Category Sourcing Manager', y: 9 },
  //   { label: 'Catgeory Access', y: 12 },
  //   { label: 'Tech Sourcing CGT', y: 32 },
  // ];

  // chartModulePoints = [
  //   { label: 'Search', y: 54 },
  //   { label: 'Reports', y: 29 },
  //   { label: 'Simulation', y: 36 }  
  // ];
  // TeamcountArray = [
  //   { Team: 'Tech Purchasing', Count: 19 },
  //   { Team: 'Direct Sourcing', Count: 24 },
  //   { Team: 'Category Sourcing Manager', Count: 9 },
  //   { Team: 'Catgeory Access', Count: 12 },
  //   { Team: 'Tech Sourcing CGT', Count: 32 },
  // ];

  async ngOnInit(): Promise<void> {
    // this.chartDataPoints = this.TeamcountArray.map(item => ({
    //   label: item.Team, 
    //   y: item.Count 
    // }));
    // console.log(this.chartDataPoints)

    this.useranalytics = new FormGroup({
      currentDate: new FormControl(),
    });

    this.dd = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    var dd1: string = this.dd.toLocaleString();
    this.currentDate = dd1;

    var date = new Date();
    this.FromDate = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth() - 6, 1), "yyyy-MM-dd");
    console.log(this.FromDate)
    this.ToDate = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth(), 0), "yyyy-MM-dd");
    console.log(this.ToDate)
    await this.GetData(this.FromDate, this.ToDate);
    this.resetcharts();

    // this.TeamChartOptions = {
    //   animationEnabled: true,
    //   title: {
    //     text: 'Usage by Roles',
    //   },
    //   data: [
    //     {
    //       // Change type to "doughnut", "line", "splineArea", etc.
    //       type: 'column',
    //       dataPoints: this.TeamchartDataPoints
    //     },
    //   ],
    // };

    // this.PageChartOptions = {
    //   animationEnabled: true,
    //   title: {
    //     text: 'Usage by Module',
    //   },
    //   data: [
    //     {
    //       // Change type to "doughnut", "line", "splineArea", etc.
    //       type: 'pie',
    //       dataPoints: this.PagechartDataPoints
    //     },
    //   ],
    // };
    // this.pagetimechartOptions = {
    //   animationEnabled: true,
    //   title: {
    //     text: 'Average time spent per page',
    //   },
    //   axisX: {
    //     title: "Time in Hrs",
    //     interval:1,
    //      labelMaxWidth: 100,           
    //      labelAngle: -30,
    //   },
    //   data: [
    //     {
    //       // Change type to "doughnut", "line", "splineArea", etc.
    //       type: 'column',
    //       dataPoints: this.PageTimechartDataPoints
    //     },
    //   ],
    // }

  }

  UserData = [
    { UsageStats: 'Active Users', Count: 19 },
    { UsageStats: 'Application Logins', Count: 24 },
    { UsageStats: 'Average Usage time per user', Count: 9 },
    { UsageStats: 'Unique User Logins', Count: 32 },
  ];



  // PagecountArray = [
  //   { Page: 'Search', Count: '54' },
  //   { Page: 'Reports', Count: '29' },
  //   { Page: 'Simulation', Count: '36' }  
  // ];

  // PagetimeArray = [
  //   { Page: 'Search', Count: 5 },
  //   { Page: 'Project', Count: 3.5 },
  //   { Page: 'Simulation', Count: 2 },
  //   { Page: 'Cat Management', Count: 2 } ,
  //   { Page: 'Request', Count: 1.5 }  
  // ];

  // chartPagetimePoints = [
  //   { label: 'Search', y: 5 },
  //   { label: 'Project', y: 3.5 },
  //   { label: 'Simulation', y: 2 },
  //   { label: 'Cat Management', y: 2 } ,
  //   { label: 'Request', y: 1.5 }  
  // ];










  backToPreviousPage() {
    this.location.back();
  }

  exportToExcel(): void {
 
    debugger
    if ((this.selectedFromDate!=undefined) &&
    (this.selectedToDate!=undefined))
    {
      this.spinnerService.show();
      this.reportservice.ExcelExportUserAnalytics(this.selectedFromDate, this.selectedToDate).subscribe({
        next: (data) => {
          const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(blob);
 
          const a = document.createElement('a');
          a.href = url;
          a.download = "User Analytics Report" ;
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
    else if((this.selectedFromDate==undefined) &&
    (this.selectedToDate==undefined))
    {
      // startDate= this.fydate.getCurrentFinancialYearDates().startDate;
      // endDate=this.fydate.getCurrentFinancialYearDates().endDate;
      alert(
        'Please select dates.'
      );
    }
  }


  async GetData(FromDate: any, ToDate: any) {
    debugger;

    this.TeamchartDataPoints = [];
    this.PagechartDataPoints = [];
    this.PageTimechartDataPoints = [];

    const data = await this.reportservice.getUserAnalyticsData(FromDate, ToDate).toPromise();
    this.Activeusers = data.usersdata[0].Count;
    this.AppLogins = data.usersdata[1].Count;
    this.AvgUsagetime = data.usersdata[2].Count;
    this.NoofRequest=data.usersdata[3].Count;
    this.NoofUpload=data.usersdata[4].Count;
    this.UnqLogin = data.usersdata[5].Count;
    this.TeamcountArray = data.usagebyrole;
    this.PagecountArray = data.usagebypage;
    this.PagetimeArray = data.averagetimespent;
    console.log(this.TeamcountArray)


    // this.TeamchartDataPoints=[];
    this.TeamchartDataPoints = this.TeamcountArray.map(({ Team, Count }) => {
      return { label: Team, y: Count };
    })

    console.log(this.TeamchartDataPoints)

    this.PagechartDataPoints = this.PagecountArray.map(({ Page, Count }) => {
      return { label: Page, y: Count };
    })
    this.PageTimechartDataPoints = this.PagetimeArray.map(({ Page, Time }) => {
      return { label: Page, y: Number(Time.substring(0,5)) };
    })



  }

  resetcharts()
  {
    setTimeout(() => {

      this.TeamChartOptions = {
        animationEnabled: true,
        title: {
          text: 'Usage by Roles',
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
        toolTip:{
          content:"{label} : {y}" ,
        },
        title: {
          text: 'Average time spent per page',
        },
        axisY: {
          interval:5,
          gridThickness: 2,
        },
        axisX: {
          title: "Time in Hrs",
           labelMaxWidth: 100,           
           labelAngle: -75,
        },
        data: [
          {
            // Change type to "doughnut", "line", "splineArea", etc.
            type: 'column',
            dataPoints: this.PageTimechartDataPoints
          },
        ],
      }

    }, 500);
  }

  async onClickGetData() {
    debugger;
    await this.GetData(this.selectedFromDate, this.selectedToDate)
    this.pagetimechartOptions.data[0].dataPoints = this.PageTimechartDataPoints
    debugger;
    this.TeamChartOptions = [];
    this.PageChartOptions = [];
    this.pagetimechartOptions = [];
    this.resetcharts();
    
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
