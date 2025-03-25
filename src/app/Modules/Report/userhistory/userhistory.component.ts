import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { Location } from '@angular/common';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import { SearchPipe } from "../../../pipe/search.pipe";
@Component({
  selector: 'app-userhistory',
  templateUrl: './userhistory.component.html',
  styleUrls: ['./userhistory.component.css'],
})
export class UserhistoryComponent implements OnInit {

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

  UserHistory!: FormGroup;
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

  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.userId = localStorage.getItem("userId");

    this.UserHistory = new FormGroup({
      textsearch: new FormControl(),
    });

    this.GetUserHistoryDetails();
  }

  backToPreviousPage() {
    this.location.back();
  }


  async GetUserHistoryDetails() {
    this.getData = [];
    const data = await this.reportService.GetUserHistoryDetails(this.userId).toPromise();
    this.getData = data;
  }

  viewReport(val: any) {
    
    const Params = {
      param_CSHeaderId: val.CSHeaderID,
      param_SCReportId: val.SCReportId
    };

    this.router.navigate(['/home/shouldcostuserhistory/:data'], { queryParams: Params });
  }



}
