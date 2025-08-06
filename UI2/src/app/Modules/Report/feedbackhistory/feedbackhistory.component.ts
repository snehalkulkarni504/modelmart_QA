import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feedbackhistory',
  templateUrl: './feedbackhistory.component.html',
  styleUrls: ['./feedbackhistory.component.css']
})

export class FeedbackhistoryComponent {
  constructor(
    private datePipe: DatePipe,
    private toastr: ToastrService,
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
  showTab2: boolean = false;
  showTab1: boolean = true
  demo: number = 0;

  selectdates = ['Last 3 Months', 'Last 6 Months', 'Last 1 Year'];
  selecteddates: any;
  minDate: string = '';
  maxDate: string = '';
  filteredData: any[] = [];


  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.userId = localStorage.getItem("userId");
    this.username = localStorage.getItem("userName");

    this.feedbackHistory = new FormGroup({
      textsearch: new FormControl(),
      fromDate: new FormControl(),
      toDate: new FormControl()
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
    this.filteredData = data;
  }


  viewfeedback(val: any) {
    const Params = {
      username: val.name,
      content: val.q1,
      effectiveness: val.q2,
      reuse: val.q3,
      login: val.q4,
      comments: val.comment,
      showsubmitbtn: false
    };

    this.router.navigate(['/home/feedback'], { queryParams: Params });
  }

  Fun_showTab1() {
    this.showTab2 = false;
    this.showTab1 = true;
  }

  Fun_showTab2() {
    this.showTab1 = false;
    this.showTab2 = true;
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
    const totalCounts: { [key: string]: number } = {};

    apiData.forEach((item: any) => {
      if (!groupedData[item.quesno]) {
        groupedData[item.quesno] = [];
        totalCounts[item.quesno] = 0;
      }
      totalCounts[item.quesno] += item.count;
      groupedData[item.quesno].push({ name: item.options, count: item.count, percentage: 0 });
    });

    Object.keys(groupedData).forEach((quesno) => {
      groupedData[quesno] = groupedData[quesno].map(option => ({
        name: option.name,
        count: option.count,
        percentage: (option.count / totalCounts[quesno]) * 100
      }));
    });

    this.tableData = groupedData || {};

    const colors = ["#5DE2E7", "#E4080A", "#7DDA58"]; // Blue, Black, Red

    function getColor(index: any) {
      return colors[index % colors.length];
    }

    this.chartOptions = Object.keys(groupedData).reduce((acc, quesno) => {
      acc[quesno] = {
        animationEnabled: true,
        width: 250,
        height: 250,
        //title: { text: `${quesno}` },
        data: [{
          type: "pie",
          startAngle: -90,
          indexLabel: "{name}: {y}",
          indexLabelFontSize: 12,
          yValueFormatString: "##0.##'%'",
          radius: "65%",
          dataPoints: groupedData[quesno].map((option, index) => ({
            name: option.name,
            y: option.percentage,
            color: getColor(index)
          }))
        }]
      };
      return acc;
    }, {} as { [key: string]: any });
  }

  onDateRangeChange() {
    const today = new Date();
    let pastDate = new Date();

    if (this.selecteddates === 'Last 3 Months') {
      pastDate.setMonth(today.getMonth() - 3);
    } else if (this.selecteddates === 'Last 6 Months') {
      pastDate.setMonth(today.getMonth() - 6);
    } else if (this.selecteddates === 'Last 1 Year') {
      pastDate.setFullYear(today.getFullYear() - 1);
    }

    this.minDate = pastDate.toISOString().split('T')[0];
    this.maxDate = today.toISOString().split('T')[0];

    this.feedbackHistory.patchValue({
      fromDate: this.minDate,
      toDate: this.maxDate
    });
  }

  filterByDateRange() {
    if (this.minDate && this.maxDate) {
      const fromDate = new Date(this.feedbackHistory.value.fromDate);
      const toDate = new Date(this.feedbackHistory.value.toDate);

      toDate.setHours(23, 59, 59, 999);

      this.filteredData = this.getData.filter((item: any) => {
        const createdOn = new Date(item.createdon);
        return createdOn >= fromDate && createdOn <= toDate;
      });

      this.filterMetadata.count = this.filteredData.length;
    }

  }

  clearFilters() {
    this.selecteddates = null;
    this.feedbackHistory.patchValue({
      fromDate: null,
      toDate: null,
      textsearch: ''
    });
    this.minDate = '';
    this.maxDate = '';
    this.filteredData = this.getData;

    this.page = 1;
    this.filterMetadata.count = this.filteredData.length;
  }

  exportToExcel(): void {

    if (this.getData && this.getData.length > 0) {
      const modifiedData = this.getData.map((item: any, index: number) => ({
        'Sr. No.': index + 1,
        'Submited By': item.createdby,
        'Full Name': item.name,
        'Email': item.email,
        'Submited On': item.createdon,
      }));

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modifiedData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const currentDate = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
      const fileName = `Feedback History Details_${formattedDate}.xlsm`;
      XLSX.writeFile(wb, fileName, { bookType: 'xlsm' });
    }
    else {
      this.toastr.warning("Data Not Found.");
    }
  }




}