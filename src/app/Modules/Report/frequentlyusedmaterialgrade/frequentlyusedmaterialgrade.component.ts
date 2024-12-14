import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
 


@Component({
  selector: 'app-frequentlyusedmaterialgrade',
  templateUrl: './frequentlyusedmaterialgrade.component.html',
  styleUrls: ['./frequentlyusedmaterialgrade.component.css']
})
export class FrequentlyusedmaterialgradeComponent implements OnInit {

  constructor(
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

    this.GetForexDetails();
  }

  backToPreviousPage() {
    this.location.back();
  }


  async GetForexDetails() {
    const data = await this.reportService.GetFrequentlyusedmaterialgrade().toPromise();
    this.getData = data;
  }



}
