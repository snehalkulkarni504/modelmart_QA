import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { Location } from '@angular/common';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import { SearchPipe } from "../../../pipe/search.pipe";

@Component({
  selector: 'app-feedbackhistory',
  templateUrl: './feedbackhistory.component.html',
  styleUrls: ['./feedbackhistory.component.css']
})
export class FeedbackhistoryComponent {
  constructor(
    public router: Router,
    private reportService: ReportServiceService,
    private location: Location,
    private route: ActivatedRoute) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };


  }

  feedbackHistory!: FormGroup;
  getData: any;
  textsearch: string = '';
  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };
  userId: any;
  param_CSHeaderId: any;
  param_userId: any;
  param_SCReportId: any;
  username: any;
  showpiechart: boolean = false;
  showgrid: boolean = true
  demo: number = 0;

  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.userId = localStorage.getItem("userId");
    this.username = localStorage.getItem("userName");

    this.feedbackHistory = new FormGroup({
      textsearch: new FormControl(),
    });

    this.GetfeedbackHistoryDetails();
    this.fetchChartData();
  }

  backToPreviousPage() {
    this.location.back();
  }


  async GetfeedbackHistoryDetails() {
    this.getData = [];
    const data = await this.reportService.GetFeedbackHistoryDetails(this.username).toPromise();
    this.getData = data;
    this.demo = data.q1;
  }

  viewfeedback(val: any) {
    const Params = {
      content: val.q1,
      effectiveness: val.q2,
      reuse: val.q3,
      login: val.q4,
      comments: val.comment,
      showsubmitbtn: false
    };

    this.router.navigate(['/home/feedback'], { queryParams: Params });
  }



  // chartOptions1 = {
  //   exportEnabled: false,
  //   animationEnabled: true,
  //   title: {
  //     text: "",
  //   },
  //   data: [{
  //     type: "pie",
  //     startAngle: -90,
  //     indexLabel: "{name}: {y}",
  //     indexLabelFontSize: 14, /* Ensuring label size is same */
  //     yValueFormatString: "#,###.##'%'",
  //     radius: "80%", /* Set a consistent size for all */
  //     dataPoints: [
  //       { y: 30, name: "Excellent" },
  //       { y: 25, name: "Good" },
  //       { y: 45, name: "Need Improvement" },
  //     ]
  //   }]
  // }

  // chartOptions2 = {
  //   exportEnabled: false,
  //   animationEnabled: true,
  //   title: {
  //     text: ""
  //   },
  //   data: [{
  //     type: "pie",
  //     startAngle: -90,
  //     indexLabel: "{name}: {y}",
  //     indexLabelFontSize: 14,
  //     yValueFormatString: "#,###.##'%'",
  //     radius: "80%", /* Matching size with chartOptions1 */
  //     dataPoints: [
  //       { y: 15, name: "Yes" },
  //       { y: 35, name: "No" },
  //       { y: 50, name: "Not Sure" },
  //     ]
  //   }]
  // }

  // chartOptions3 = {
  //   exportEnabled: false,
  //   animationEnabled: true,
  //   title: {
  //     text: ""
  //   },
  //   data: [{
  //     type: "pie",
  //     startAngle: -90,
  //     indexLabel: "{name}: {y}",
  //     indexLabelFontSize: 14,
  //     yValueFormatString: "#,###.##'%'",
  //     radius: "80%", /* Keeping it the same */
  //     dataPoints: [
  //       { y: 10, name: "Yes" },
  //       { y: 50, name: "No" },
  //       { y: 40, name: "Not Sure" },
  //     ]
  //   }]
  // }

  // chartOptions4 = {
  //   exportEnabled: false,
  //   animationEnabled: true,
  //   title: {
  //     text: ""
  //   },
  //   data: [{
  //     type: "pie",
  //     startAngle: -90,
  //     indexLabel: "{name}: {y}",
  //     indexLabelFontSize: 14, /* Ensuring label size is same */
  //     yValueFormatString: "#,###.##'%'",
  //     radius: "80%", /* Set a consistent size for all */
  //     dataPoints: [
  //       { y: 30, name: "Daily" },
  //       { y: 20, name: "Weekly" },
  //       { y: 50, name: "Fortnightly" },
  //     ]
  //   }]
  // }



  showgridd( ) {
    this.showpiechart=false;
    this.showgrid=true;
  }

  showpiechartbtn() {
    this.showgrid = false;
    this.showpiechart = true;
  }


  async fetchChartData() {
    debugger;
    try {
      const data = await this.reportService.Getpiechartdata().toPromise();
      this.processChartData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  tableData: { [key: string]: { count: number; percentage: number; name: string }[] } = {};
  chartOptions: { [key: string]: any } = {};
    
  
    processChartData(apiData: any) {
      if (!apiData || !Array.isArray(apiData)) {
        console.error("Invalid API Data:", apiData);
        return;
      }
    
      const groupedData: { [key: string]: { count: number; percentage: number; name: string }[] } = {};
      const totalCounts: { [key: string]: number } = {}; // Store total count for each question
    
      // 1️⃣ Grouping data & calculating total counts
      apiData.forEach((item: any) => {
        if (!groupedData[item.quesno]) {
          groupedData[item.quesno] = [];
          totalCounts[item.quesno] = 0;
        }
        totalCounts[item.quesno] += item.count; // Sum total for the question
        groupedData[item.quesno].push({ name: item.options, count: item.count, percentage: 0 });
      });
    
      // 2️⃣ Calculate percentages
      Object.keys(groupedData).forEach((quesno) => {
        groupedData[quesno] = groupedData[quesno].map(option => ({
          name: option.name,
          count: option.count, // Keep count for the table
          percentage: (option.count / totalCounts[quesno]) * 100 // Calculate percentage
        }));
      });
    
      // ✅ Ensure tableData is an empty object if no data is available
      this.tableData = groupedData || {};
    
      // ✅ Ensure chartOptions is an empty object if no data is available
      this.chartOptions = Object.keys(groupedData).reduce((acc, quesno) => {
        acc[quesno] = {
          animationEnabled: true,
          width:250,
          height: 250,
          //title: { text: `${quesno}` },
          data: [{
            type: "pie",
            startAngle: -90,
            indexLabel: "{name}: {y}",
            indexLabelFontSize: 12,
            yValueFormatString: "##0.##'%'",
            radius: "65%",
            dataPoints: groupedData[quesno].map(option => ({
              name: option.name,
              y: option.percentage // ✅ Use percentage for chart
            }))
          }]
        };
        return acc;
      }, {} as { [key: string]: any });
    
      // console.log("Processed Table Data:", this.tableData);
      // console.log("Processed Chart Options:", this.chartOptions);

    }
    
    
  


}