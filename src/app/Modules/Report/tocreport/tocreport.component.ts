import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TcoService } from '../../../SharedServices/tco.service';

@Component({
  selector: 'app-tocreport',
  templateUrl: './tocreport.component.html',
  styleUrl: './tocreport.component.css'
})

export class TocreportComponent {

  constructor(
    public router: Router,
    private TcoService: TcoService,
    private location: Location,
    private route: ActivatedRoute,) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };


  }

  demodata = [
    {
      mmid: '201900209',
      tcoid: 101,
      requestid: 1234,
      tconumber: 384,
      suppliername: 'Tata Motors',
      status: 'Active'
    },
    {
      mmid: '2019039392',
      tcoid: 102,
      requestid: 2899,
      tconumber: 387,
      suppliername: 'Mahindra',
    },
    {
      mmid: '20183299289',
      tcoid: 103,
      requestid: 2728,
      tconumber: 283,
      suppliername: 'SLA Auto'
    },
    {
      mmid: '202100280',
      tcoid: 104,
      requestid: 3829,
      tconumber: 388,
      name: 'Maruti',
    },
    {
      mmid: '202500281',
      id: 105,
      requestid: 3837,
      suppliername: 'KIA',
    },
    {
      mmid: '2019228439',
      tcoid: 106,
      requestid: 3836,
      suppliername: 'MAHALE',
    },
    {
      mmid: '208300234',
      tcoid: 107,
      requestid: 3819,
      suppliername: 'BOSCH',
    },
    {
      mmid: '202100374',
      tcoid: 108,
      requestid: 3392,
      suppliername: 'KGN',
    },

  ]




  TcoHistory!: FormGroup;
  getData: { mmid: string; requestid: number; tcoid: number; suppliername: string }[] = [];
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
  modelmartid = null;
  requestid = null;

  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.userId = localStorage.getItem("userId");
    this.username = localStorage.getItem("userName");

    this.TcoHistory = new FormGroup({
      textsearch: new FormControl(),
    });

    this.gettcoreport();

  }

  uniqueRequestIDs: any[] = []
  uniqueModelMartIDs: any[] = []

  async gettcoreport() {
    debugger;
    this.getData = [];
    try {
      let rawData = await this.TcoService.gettcoreport().toPromise();
      this.getData = rawData;
      // Extract unique Request IDs
      this.uniqueRequestIDs = [...new Map(rawData.map((item: { requestid: any; }) => [item.requestid, item])).values()];
      // Extract unique Model Mart IDs
      this.uniqueModelMartIDs = [...new Map(rawData.map((item: { mmid: any; }) => [item.mmid, item])).values()];
    } catch (error) {
      console.log(error);
    }
  }

  tabledata: any = '';

  viewdata() {
    debugger;
    if (this.modelmartid === null && this.requestid === null) {
      this.tabledata = this.getData

    }
    else {
      this.tabledata = this.getData.filter(data => {
        return (
          (this.modelmartid ? data.mmid.toString() === this.modelmartid : true) &&
          (this.requestid ? data.requestid === this.requestid : true)
        );
      });
      this.filterMetadata.count = this.tabledata.length;

    }
  }

  clear() {
    this.tabledata = '';
    this.modelmartid = null;
    this.requestid = null;
    this.gettcoreport();
    this.viewdata();

  }

  viewsheet(tcoid: any, tconumber: any, tcotypesheet: any) {
    debugger;
    const param = {
      tcoid: tcoid,
      tcono: tconumber
    }
    if (tcotypesheet == 1) {
      this.router.navigate(['/home/tcosheet'], { queryParams: param });
    }
    else if (tcotypesheet) {
      this.router.navigate(['/home/tcosheet2'], { queryParams: param });
    }
  }

  refreshdata() {
    debugger;
    this.tabledata = [];
    this.tabledata = this.gettcoreport();
    debugger;
    this.tabledata = this.getData;

  }

  async deletebtn(tcoid: any, tcono: any) {
    debugger;
    try {
      const res = await this.TcoService.tcostatusedit(tcoid, tcono).toPromise()
      if (res == 1) {
        this.refreshdata();
      }
      else {
        alert("Error in Update");
      }

    }
    catch (error) {
      alert(error);
    }
  }


  dropdownOpen = false;
  mmiddropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  selectModel(mid: any) {
    this.modelmartid = mid;
    this.dropdownOpen = false;
  }


  dropdownOpen1 = false;
  toggleDropdown1() {
    this.dropdownOpen1 = !this.dropdownOpen1;
  }
  selectModel1(requestid: any) {
    this.requestid = requestid;
    this.dropdownOpen1 = false;
  }


  backToPreviousPage() {
    this.location.back();
  }

}
