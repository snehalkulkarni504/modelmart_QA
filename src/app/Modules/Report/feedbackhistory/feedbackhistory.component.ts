import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { Location } from '@angular/common';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';

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
  username:any;

  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.userId = localStorage.getItem("userId");
    this.username=localStorage.getItem("userName");

    this.feedbackHistory = new FormGroup({
      textsearch: new FormControl(),
    });

    this.GetfeedbackHistoryDetails();
  }

  backToPreviousPage() {
    this.location.back();
  }


  async GetfeedbackHistoryDetails() {
    this.getData = [];
    const data = await this.reportService.GetFeedbackHistoryDetails(this.username).toPromise();
    this.getData = data;
  }

  viewfeedback(val: any) {
    const Params = {
      content: val.q1,
      effectiveness: val.q2,
      reuse: val.q3,
      login: val.q4,
      comments: val.comment,
      showsubmitbtn:false
    };

    this.router.navigate(['/home/feedback'], { queryParams: Params });
  }

}
