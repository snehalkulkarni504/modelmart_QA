import { DatePipe, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-region-kg-rate',
  templateUrl: './region-kg-rate.component.html',
  styleUrls: ['./region-kg-rate.component.css']
})
export class RegionKgRateComponent {
  RegionRate!: FormGroup
  selectedCat4!: string;
  selectedSuppManuLoc!: string;
  selectedFromDate!: string;
  selectedToDate!: string;
  locArr: any = [];
  newArr: any = [];
  newArr2: any = [];
  RegRateReport: any = [];
  sumR: number = 0;
  parentSelector: boolean = false;
  currentDate: any;
  dd: any;
  getCat4: any = {};
  getData: any = {};
  UserId: any;
  RoleId: any;
  sortDirection = true; 
  activeSortColumn = '';

  constructor(private datePipe: DatePipe,
    public router: Router,
    private reportService: ReportServiceService,
    private toastr: ToastrService,
    private masterService: MasterServiceService, private location: Location, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }
    this.UserId = localStorage.getItem("userId")
    this.RoleId = localStorage.getItem("roleId")

    this.RegionRate = new FormGroup({
      currentDate: new FormControl()
    });

    this.dd = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    var dd1: string = this.dd.toLocaleString();
    this.currentDate = dd1;

    this.reportService.getCat4().subscribe(_result => {
      this.getCat4 = _result;
      console.log('cat4', this.getCat4)
    })

    this.masterService.GetSupplierManuLocationData().subscribe(_result => {
      this.locArr = _result;

    });

  }



  ClearGird() {
    this.getData = [];
    this.sumR = 0;
  }

  getRegionWiseRate() {
    this.SpinnerService.show('spinner');

    if(this.selectedFromDate == ""){ this.selectedFromDate = 'undefined'}
    if(this.selectedToDate == ""){ this.selectedToDate = 'undefined'}

    this.reportService.getRegionWiseRate(this.selectedFromDate, this.selectedToDate, this.selectedCat4, this.selectedSuppManuLoc, this.UserId, this.RoleId).subscribe(_result => {
      this.getData = _result;
      this.getData = this.getData.map((d: any) => ({ ...d, isChecked: false }));
       this.SpinnerService.hide('spinner');
    })
    var checkbox = document.getElementById('MainCheckbox') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
      this.sumR = 0

    } else {
      
    }
  }
  onChangeMainCheckbox(event: any) {
    this.sumR = 0
    for (var value of this.getData) {
      if (event.target.checked) {
        value.isChecked = true;
        this.onChangeCheckboxLogic(value.SrNo, value.isChecked);

      } else {
        value.isChecked = false;
        this.onChangeCheckboxLogic(value.SrNo, value.isChecked);
        this.sumR = 0;

      }
    }
  }
  onChangeCheckboxLogic(SrNo: any, isCheckedMain: boolean) {
    const isChecked = isCheckedMain;

    this.getData = this.getData.map((d: { SrNo: number; isChecked: boolean; NetWeight: number; }) => {
      if (d.SrNo == +SrNo) {
        d.isChecked = isChecked;
        this.parentSelector = false;
        if (d.isChecked == true) {
          this.sumR += d.NetWeight
        }
        if (d.isChecked == false) {
          this.sumR -= d.NetWeight
        }

        return d;
      }
      // if (SrNo == -1) {
      //   d.isChecked = this.parentSelector;
      //   return d;
      // }
      return d;
    })



  }

  onChangeCheckbox(event: any) {
    const SrNo = event.target.value;
    const isChecked = event.target.checked;

    this.getData = this.getData.map((d: { SrNo: number; isChecked: boolean; NetWeight: number; }) => {
      if (d.SrNo == +SrNo) {
        d.isChecked = isChecked;
        this.parentSelector = false;
        if (d.isChecked == true) {
          this.sumR += d.NetWeight
        }
        if (d.isChecked == false) {
          this.sumR -= d.NetWeight
        }

        return d;
      }
      if (SrNo == -1) {
        d.isChecked = this.parentSelector;
        return d;
      }
      return d;
    })

  }

  backToPreviousPage() {
    this.location.back();
  }

  exportToExcel(): void {

    if (this.getData && this.getData.length > 0) {


      const modifiedData = this.getData.map((item: any, index: number) => ({
        'Sr. No.': index + 1,
        'Part Name': item.PartName,
        'Part Number': item.PartNumber,
        'ModelMart Id': item.UniqueId,
        'DebriefDate': this.formatDate(item.DebriefDate),//new Date(item.DebriefDate).toLocaleDateString('en-US') ,
        'Category 4': item.CAT4,
        'Supp. Manf. Location': item.MfgRegion,
        'Total Tooling Cost($)': item.ToolingCost,
        'Total Finish Weight (kg)': item.FinishWeight,
        'Per KG Rate ($)': item.NetWeight,


      }));

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modifiedData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const currentDate = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
      const fileName = `RegionWiseKGperRateReport_${formattedDate}.xlsm`;
      XLSX.writeFile(wb, fileName, { bookType: 'xlsm' });
    }
    else {
      this.toastr.warning("Data Not Found.");
    }
  }
  
  sortData(column: string) {
    this.SpinnerService.show('spinner');

    if (this.activeSortColumn === column) {
      this.sortDirection = !this.sortDirection; // Toggle sorting direction
    } else {
      this.sortDirection = true; // Default to ascending for new column
    }
    this.activeSortColumn = column;

    this.getData = this.getData.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
      const aValue = a[column];
      const bValue = b[column];

      // Check if the column is 'date'
      if (column === 'DebriefDate') {
        return this.compareDates(aValue, bValue);
      } else {
        return this.compareValues(aValue, bValue);
      }
    });
    this.SpinnerService.hide('spinner');

  }

  compareValues(a: any, b: any): number {
    if (a < b) {
      return this.sortDirection ? -1 : 1;
    } else if (a > b) {
      return this.sortDirection ? 1 : -1;
    } else {
      return 0;
    }
  }

  compareDates(a: string, b: string): number {
    const dateA = new Date(a);
    const dateB = new Date(b);

    if (dateA < dateB) {
      return this.sortDirection ? -1 : 1;
    } else if (dateA > dateB) {
      return this.sortDirection ? 1 : -1;
    } else {
      return 0;
    }
  }
  
  formatDate(dateString: string): string {
    if (!dateString) {
      return '';
    }
    else{
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = this.getMonthName(date.getMonth());
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
    }
  }

  getMonthName(monthIndex: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthIndex];
  }

}

