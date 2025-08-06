import { Component, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BUnitMaster } from 'src/app/Model/BUnitMaster';
import { ToastrService } from 'ngx-toastr';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-businessunitmaster',
  templateUrl: './businessunitmaster.component.html',
  styleUrls: ['./businessunitmaster.component.css']
})
export class BusinessunitmasterComponent {

  constructor(public router: Router, public masterService: MasterServiceService,
    private toastr: ToastrService, private location: Location, private renderer: Renderer2) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
  }

  BUnitMasterForm !: FormGroup;
  BUnitMaster: BUnitMaster[] = [];
  display = "none";
  header: string = '';
  txt_btn: string = '';
  bUName: any;
  subUName: any;
  BUId: any;
  status: any;
  date: Date = new Date();
  editModal: boolean = false;
  editRowIndex: any;
  newArr: any = {};
  textsearch: string = '';
  dataArr: any = {};
  UserId: any;
  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };
  showError1: boolean = false;
  showError2: boolean = false;
  Businessdata: any;


  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }


    this.UserId = localStorage.getItem("userId");

    this.BUnitMasterForm = new FormGroup({
      textsearch: new FormControl(),
    });

    this.GetBusinessUnitData();
  }

  async GetBusinessUnitData() {
    const data = await this.masterService.GetBusinessUnitData().toPromise();
    this.BUnitMaster = data;
  }

  openModal() {
    this.display = "block";
    if (this.editModal) {
      this.header = 'Edit Data';
      this.txt_btn = 'Update';
      this.bUName = this.editRowIndex.Name; // this.BUnitMaster[this.editRowIndex].Name;
      this.subUName = this.editRowIndex.SubUnit; // this.BUnitMaster[this.editRowIndex].SubUnit;
      this.BUId = this.editRowIndex.BUId;  // this.BUnitMaster[this.editRowIndex].BUId;
    }
    else {
      this.showError1 = false;
      this.showError2 = false;
      this.header = 'Add Data';
      this.txt_btn = 'Save';
      this.bUName = '';
      this.subUName = '';
    }
  };

  deleteRow(rowIndex: any) {
    if (confirm("Are you sure you want to delete Business Unit?")) {
      this.newArr = {
        BUId: rowIndex,
        modifiedBy: this.UserId
      };
      this.masterService.DeleteBusinessUnitData(this.newArr).subscribe({
        next: (_res: any) => {
          this.GetBusinessUnitData();
          this.toastr.success("Data Deleted Successfully.");
        },
        error: (error: any) => {
          console.error('API call error:', error);
        },
      });
    }
  }

  onCloseHandled() {
    this.display = "none";
    this.editModal = false;
  }

  bUNameOnBlur(event: any) {
    this.bUName = event.target.value;
  }

  subUNameOnBlur(event: any) {
    this.subUName = event.target.value;
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

        this.newArr = {
          Name: this.bUName,
          Description: this.bUName,
          SubUnit: this.subUName,
          ModifiedBy: this.UserId,
          BUId: this.editRowIndex.BUId
        };
        this.masterService.UpdateBusinessUnitData(this.newArr).subscribe({
          next: (_res: any) => {

            this.GetBusinessUnitData();
            this.toastr.success("Data Updated Successfully.");
          },
          error: (error: any) => {
            console.error('API call error:', error);
          },
        });
      }
      else {
        this.dataArr = {
          Name: this.bUName,
          Description: this.bUName,
          SubUnit: this.subUName,
          CreatedBy: this.UserId
        };
        this.masterService.AddBusinessUnitData(this.dataArr).subscribe({
          next: (_res: any) => {

            this.GetBusinessUnitData();
            this.toastr.success("Data Inserted Successfully.");
          },
          error: (error: any) => {
            console.error('Inserting API call error:', error);
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
    if (this.bUName === '' || this.bUName === undefined) {
      this.showError1 = true;
      this.renderer.selectRootElement('#bUName').focus();
      return true;
    }
    else if (this.subUName === '' || this.subUName === undefined) {
      this.showError2 = true;
      this.renderer.selectRootElement('#subUName').focus();
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