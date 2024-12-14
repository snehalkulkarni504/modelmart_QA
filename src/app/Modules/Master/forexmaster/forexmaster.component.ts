import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ForexMaster } from 'src/app/Model/forex-master';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forexmaster',
  templateUrl: './forexmaster.component.html',
  styleUrls: ['./forexmaster.component.css']
})
export class ForexmasterComponent implements OnInit {

  constructor(public router: Router,
    private masterService: MasterServiceService,
    private toastr: ToastrService, private location: Location, private renderer: Renderer2) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
  }

  forexMasterForm !: FormGroup;
  forexMaster: ForexMaster[] = [];
  display = "none";
  header: string = '';
  txt_btn: string = '';
  region: any;
  currency: any;
  year: any;
  status: any;
  date: Date = new Date();
  editModal: boolean = false;
  editRowIndex: any;
  textsearch: string = '';
  dataArr: any = {};

  showError1: boolean = false;
  showError2: boolean = false;
  showError3: boolean = false;
  showError4: boolean = false;
  UserId: any;

  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };

  forexValue: any;

  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.UserId = localStorage.getItem("userId");


    this.forexMasterForm = new FormGroup({
      textsearch: new FormControl(),

    });
    this.getForex();
  }

  openModal() {
    this.display = "block";
    if (this.editModal) {
      this.header = 'Edit Data';
      this.txt_btn = 'Update';
      this.region = this.editRowIndex.Location; // this.forexMaster[this.editRowIndex].Location;
      this.currency = this.editRowIndex.Currency; //this.forexMaster[this.editRowIndex].Currency;
      this.year = this.editRowIndex.Year; //this.forexMaster[this.editRowIndex].Year;
      this.forexValue = this.editRowIndex.ForexValue;
      this.status = this.editRowIndex.Status; // this.forexMaster[this.editRowIndex].Status;
      console.log(this.dataArr)
    } else {
      this.showError1 = false;
      this.showError2 = false;
      this.header = 'Add Data';
      this.txt_btn = 'Save';
      this.region = "";
      this.currency = "";
      this.year = "";
      this.forexValue = "";
      this.status = "";
      console.log(this.dataArr)

    }
  };

  getForex() {
    this.masterService.getForex().subscribe(_result => {
      this.forexMaster = _result;
      console.log('ssssss', this.forexMaster)
    })
  }
  deleteRow(rowIndex: any) {
    if (confirm("Are you sure you want to delete Forex?")) {
      this.dataArr = {
        ForexId: rowIndex,
        ModifiedBy: this.UserId
      };
      this.masterService.deleteForex(this.dataArr).subscribe({
        next: (_res) => {

          this.toastr.success("Data Deleted Successfully.");
          this.getForex();
        },
        error: (error) => {
          console.error('API call error:', error);
        },
      });
    }
  }

  onCloseHandled() {
    this.display = "none";
  }
  regionOnBlur(event: any) {
    this.region = event.target.value;
  }
  currencyOnBlur(event: any) {
    this.currency = event.target.value;
  }
  yearOnBlur(event: any) {
    this.year = event.target.value;
  }
  forexValueOnBlur(event: any) {
    this.forexValue = event.target.value;
  }
  onSelected(event: any) {
    this.status = event.target.value;
  }
  editModalMethod(rowIndex: any) {
    this.editModal = true;
    this.editRowIndex = rowIndex;
    this.openModal();
  }

  onSaveButton() {
    if (!this.onClickBlankInputValidation()) {
      if (this.editModal) {
        this.dataArr = {
          ForexId: this.editRowIndex.ForexId,
          Location: this.region,
          Currency: this.currency,
          Year: this.year,
          ForexValue: Number(this.forexValue),
          ModifiedBy: this.UserId,
        };
        this.masterService.updateForex(this.dataArr).subscribe({
          next: (_res) => {

            this.getForex();
            this.toastr.success("Data Updated Successfully.");
          },
          error: (error) => {
            console.error('API call error:', error);
          },
        });
      }
      else {

        this.dataArr = {
          Location: this.region,
          currency: this.currency,
          year: this.year,
          ForexValue: Number(this.forexValue),
          createdBy: this.UserId,
        };
        this.masterService.addForex(this.dataArr).subscribe({
          next: (_res) => {
            this.getForex();
            this.toastr.success("Data Added Successfully.");
          },
          error: (error) => {
            console.error('API call error:', error);
          },
        });
      }
      this.editModal = false;
      this.display = "none";
    }
    else {
      console.log('error')
    }
  }



  onClickBlankInputValidation(): boolean {
    if (this.region === '' || this.region === undefined) {
      this.showError1 = true;
      this.renderer.selectRootElement('#region').focus();
      return true;
    }
    else if (this.currency === '' || this.currency === undefined) {
      this.showError2 = true;
      this.renderer.selectRootElement('#currency').focus();
      return true;
    }
    else if (this.year === '' || this.year === undefined) {
      this.showError3 = true;
      this.renderer.selectRootElement('#year').focus();
      return true;
    }
    else if (this.forexValue === '' || this.forexValue === undefined) {
      this.showError4 = true;
      this.renderer.selectRootElement('#forexValue').focus();
      return true;
    }
    else {
      return false;
    }
  }

  backToPreviousPage() {
    this.location.back();
  }


}