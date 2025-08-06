import { Component, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MasterMaintenance } from 'src/app/Model/MasterMaintenance';
import { SupplManuLocation } from 'src/app/Model/suppl-manu-location';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-supplierloaction',
  templateUrl: './supplierloaction.component.html',
  styleUrls: ['./supplierloaction.component.css']
})
export class SupplierloactionComponent {
  constructor(
    public router: Router,
    private masterService: MasterServiceService,
    private toastr: ToastrService, private location: Location, private renderer: Renderer2) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
  }

  MasterMaintenanaceForm!: FormGroup;
  masterManintenance: SupplManuLocation[] = [];
  display = "none";
  header: string = '';
  txt_btn: string = '';
  locName: any;
  localCurr: any;
  status: any;
  date: Date = new Date();
  editModal: boolean = false;
  editRowIndex: any;
  textsearch: string = '';
  dataArr: any = {};
  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };
  showError1: boolean = false;
  showError2: boolean = false;
  userId: any;

  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.userId = localStorage.getItem("userId");

    this.MasterMaintenanaceForm = new FormGroup({
      textsearch: new FormControl(),

    });

    this.getLocationAll();

  }


  openModal() {
    this.display = "block";
    if (this.editModal) {
      this.header = 'Edit Data';
      this.txt_btn = 'Update';
      this.locName = this.editRowIndex.LocationName; // this.masterManintenance[this.editRowIndex].LocationName; 
      this.localCurr = this.editRowIndex.Currency; //this.masterManintenance[this.editRowIndex].Currency;

    } else {
      this.header = 'Add Data';
      this.txt_btn = 'Save';
      this.localCurr = "";
      this.locName = "";
    }
  };
  deleteRow(rowIndex: any) {
    if (confirm("Are you sure you want to delete Location?")) {
      this.dataArr = {
        LocationId: rowIndex,
        ModifiedBy: this.userId
      };
      this.masterService.DeleteSupplierManuLocationData(this.dataArr).subscribe({
        next: (_res) => {
          this.toastr.success("Data Deleted Successfully.");
          this.getLocationAll();
        },
        error: (error) => {
          console.error('DeletingAPI call error:', error);
        },
      });
    }
  }

  onCloseHandled() {
    this.display = "none";
  }
  locationNameOnBlur(event: any) {
    this.locName = event.target.value;
  }
  localCurrencyOnBlur(event: any) {
    this.localCurr = event.target.value;
  }
  onSelected(event: any) {
    this.status = event.target.value;
  }
  editModalMethod(rowIndex: any) {
    this.editModal = true;
    this.editRowIndex = rowIndex;
    this.openModal();
  }
  getLocationAll() {
    this.masterService.GetSupplierManuLocationData().subscribe(_result => {
      this.masterManintenance = _result;
      console.log(this.masterManintenance)
    });
  }
  onSaveButton() {
    if (!this.onClickBlankInputValidation()) {
      if (this.editModal) {
        this.dataArr = {
          LocationId: this.editRowIndex.LocationId,
          LocationName: this.locName,
          Currency: this.localCurr,
          ModifiedBy: this.userId
        };
        this.masterService.UpdateSupplierManuLocationData(this.dataArr).subscribe({
          next: (_res) => {
            this.getLocationAll();
            this.toastr.success("Data Updated Successfully.");
          },
          error: (error) => {
            console.error('Updating API call error:', error);
          },
        });
      }
      else {
        this.dataArr = {
          LocationName: this.locName,
          Currency: this.localCurr,
          CreatedBy: this.userId,

        };
        this.masterService.AddSupplierManuLocationData(this.dataArr).subscribe({
          next: (_res) => {
            this.getLocationAll();
            this.toastr.success("Data Inserted Successfully.");
          },
          error: (error) => {
            console.error('Inserting API call error:', error);
          },
        });
      }
      this.editModal = false;
      this.display = "none";
    }

    else {
      console.log("error")
    }

  }

  onClickBlankInputValidation(): boolean {
    if (this.locName === '' || this.locName === undefined) {
      this.showError1 = true;
      this.renderer.selectRootElement('#locName').focus();
      return true;
    }
    else if (this.localCurr === '' || this.localCurr === undefined) {
      this.showError2 = true;
      this.renderer.selectRootElement('#localCurr').focus();
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




