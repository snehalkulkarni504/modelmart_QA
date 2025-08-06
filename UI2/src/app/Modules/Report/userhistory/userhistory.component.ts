import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { DatePipe, Location } from '@angular/common';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import { SearchPipe } from "../../../pipe/search.pipe";
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-userhistory',
  templateUrl: './userhistory.component.html',
  styleUrls: ['./userhistory.component.css'],
})
export class UserhistoryComponent implements OnInit {

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

  exportToExcel(): void {
    if (this.getData && this.getData.length > 0) {
      const modifiedData = this.getData.map((item: any, index: number) => ({
        'Sr. No.': index + 1,
        'User Name': item.UserName,
        'Full Name': item.FullName,
        'ModelMart Id': item.Modelmartid,
        'Project Name': item.PName,
        'Updated Date': item.CreatedOn,
        'Previous Should Cost ($)': item.value_existing,
        'User simulation ($)': item.value_updated,
        'Variation(%)': item.variation,
      }));

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modifiedData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const currentDate = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
      const fileName = `User History Details_${formattedDate}.xlsm`;
      XLSX.writeFile(wb, fileName, { bookType: 'xlsm' });
    }
    else {
      this.toastr.warning("Data Not Found.");
    }
  }


}
