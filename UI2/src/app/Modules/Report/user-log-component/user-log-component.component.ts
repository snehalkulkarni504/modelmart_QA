import { DatePipe ,Location} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-log-component',
  templateUrl: './user-log-component.component.html',
  styleUrls: ['./user-log-component.component.css']
})
export class UserLogComponentComponent implements OnInit {
  CostReport!: FormGroup
  newArr: any = [];
  newArr2: any = [];
  costReport: any = [];
  sumS: number = 0;
  sumT: number = 0;
  currentDate: any;
  dd: any;
  activitytype = 'Edit'
  selectedValue: any
  selectedFromDate: any;
  selectedToDate: any;
  selectedUserName: any;
  selectedActivity: string = '';
  Edit: string = 'Edit';
  Search: string = 'Search';
  View: string = 'View';
  Download: string = 'Download';
  getEditData: any;
  getViewData: any;
  getSearchData: any;
  getDownloadData: any;
  getUsers: any = {};


  textsearch: string = '';
  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };

  constructor(
    private datePipe: DatePipe,
    public router: Router,
    public toastr: ToastrService,
    private reportService: ReportServiceService,
    private adminService: AdminService , private location:Location) { 
      this.config = {
        currentPage: 1,
        itemsPerPage: 10
      };
    }

  ngOnInit(): void {
    
    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.getUsersList();

    this.CostReport = new FormGroup({
      textsearch: new FormControl(),
      currentDate: new FormControl(),
      replytype: new FormControl()
    });

    this.dd = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    var dd1: string = this.dd.toLocaleString();
    this.currentDate = dd1;
    //console.log(this.currentDate)

  }
  getUsersList() {
    debugger;
    this.adminService.GetUsersList().subscribe((_result: any) => {
      this.getUsers = _result;
      //console.log('users list', this.getUsers)
    })
  }

  getEditedUsers() {
    this.reportService.getEditedUsers(this.selectedFromDate, this.selectedToDate, this.selectedUserName).subscribe(_result => {
      this.getEditData = _result;
      console.log('EditData',this.getEditData)
    })
  }

  getViewedUsers() {
    this.reportService.getViewUsers(this.selectedFromDate, this.selectedToDate, this.selectedUserName).subscribe(_result => {
      this.getViewData = _result;
      console.log(this.getViewData)
    })
  }

  getSearchedUsers() {
    this.reportService.getSearchUsers(this.selectedFromDate, this.selectedToDate, this.selectedUserName).subscribe(_result => {
      this.getSearchData = _result;
      console.log(this.getSearchData)
    })
  }

  getDownloadedUsers() {
    this.reportService.getDownloadeUsers(this.selectedFromDate, this.selectedToDate, this.selectedUserName).subscribe(_result => {
      this.getDownloadData = _result;
      console.log(this.getDownloadData)
    })
  }

  onClickGetData() {
    //console.log(this.selectedFromDate, this.selectedToDate, this.selectedUserName);
    //console.log(this.selectedActivity)
    if (this.selectedUserName == '' || this.selectedUserName == undefined){
      this.toastr.warning("Select Username");
    }
    if (this.selectedActivity == '' || this.selectedActivity == undefined){
      this.toastr.warning("Select Activity");
    }
    if (this.selectedFromDate == '' || this.selectedFromDate == undefined){
      this.toastr.warning("Select From Date");
    }
    if (this.selectedToDate == '' || this.selectedToDate == undefined){
      this.toastr.warning("Select To Date");
    }
    
    if (this.selectedActivity == 'Search') {
      this.getSearchedUsers();
    }
    else if (this.selectedActivity == 'View') {
      this.getViewedUsers();
    }
    else if (this.selectedActivity == 'Download') {
      this.getDownloadedUsers();
    }
    else {
      this.getEditedUsers();
    }

  }


  onChange(event: any) {
    this.activitytype = event.target.value;
  }

  ClearData(){
    this.getEditData = [];
    this.getViewData=[];
    this.getSearchData=[];
    this.getDownloadData=[];
  }

  ViewReport(dd:any){
   // debugger;
    console.log('CSHeaderId :',dd.CSHeaderId)
    localStorage.setItem('SCReportId',dd.SCReportId);
    localStorage.setItem('IsCastingSheet', '0');
    localStorage.setItem('ComapredId', dd.CSHeaderId);
    this.router.navigate(['/home/shouldcostreportview/',0]);

  }


  backToPreviousPage() {
    this.location.back();
  }


}
