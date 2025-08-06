
import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-forexreport',
  templateUrl: './forexreport.component.html',
  styleUrls: ['./forexreport.component.css']
})
export class ForexreportComponent implements OnInit {

  constructor(
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public router: Router,
    private masterService: MasterServiceService,
    private location: Location) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
  }

  ForexReport!: FormGroup;
  getData: any;
  textsearch: string = '';
  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };

  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.ForexReport = new FormGroup({
      textsearch: new FormControl(),
    });

    this.GetForexDetails();
  }

  backToPreviousPage() {
    this.location.back();
  }


  async GetForexDetails() {
    const data = await this.masterService.GetForexDetails().toPromise();
    this.getData = data;
  }


  exportToExcel(): void {
    if (this.getData && this.getData.length > 0) {
      const modifiedData = this.getData.map((item: any, index: number) => ({
        'Sr. No.': index + 1,
        'Location': item.Location,
        'Currency': item.Currency,
        'Year': item.Year,
        'Forex Value': item.ForexValue,
      }));

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modifiedData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const currentDate = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
      const fileName = `User Forex Details_${formattedDate}.xlsm`;
      XLSX.writeFile(wb, fileName, { bookType: 'xlsm' });
    }
    else {
      this.toastr.warning("Data Not Found.");
    }

  }



}
