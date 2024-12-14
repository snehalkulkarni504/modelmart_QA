
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



}
