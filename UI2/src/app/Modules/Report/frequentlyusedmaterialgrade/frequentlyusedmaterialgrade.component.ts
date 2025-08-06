import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-frequentlyusedmaterialgrade',
  templateUrl: './frequentlyusedmaterialgrade.component.html',
  styleUrls: ['./frequentlyusedmaterialgrade.component.css']
})
export class FrequentlyusedmaterialgradeComponent implements OnInit {

  constructor(
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public router: Router,
    private reportService: ReportServiceService,
    private location: Location) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
  }

  Frequentlyusedmaterialgrade!: FormGroup;
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

    this.Frequentlyusedmaterialgrade = new FormGroup({
      textsearch: new FormControl(),
    });

    this.GetFrequentlyuse();
  }

  backToPreviousPage() {
    this.location.back();
  }

  async GetFrequentlyuse() {
    const data = await this.reportService.GetFrequentlyusedmaterialgrade().toPromise();
    this.getData = data;
  }

  exportToExcel(): void {

    if (this.getData && this.getData.length > 0) {
      const modifiedData = this.getData.map((item: any, index: number) => ({
        'Sr. No.': index + 1,
        'Material Grade': item.Material_Grade,
        'Material Rate in USD/Kg ($)': item.Material_Rate_in_USD_Kg,
        'Location Used': item.Location_Used,

        'Last Used Date': this.datePipe.transform(item.Last_Used_Date, 'yyyy-MM-dd'), // Format date only
        'Part Description': item.Part_Description
      }));

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modifiedData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const currentDate = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
      const fileName = `Frequently Used Material Grade Details_${formattedDate}.xlsm`;
      XLSX.writeFile(wb, fileName, { bookType: 'xlsm' });
    }
    else {
      this.toastr.warning("Data Not Found.");
    }
  }


}
