import { AdminService } from 'src/app/SharedServices/admin.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Engine } from 'src/app/Model/Engine';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { Location } from '@angular/common';
import { Authclass } from 'src/app/Model/authclass';

@Component({
  selector: 'app-enginedisplacement',
  templateUrl: './enginedisplacement.component.html',
  styleUrls: ['./enginedisplacement.component.css']
})
export class EnginedisplacementComponent implements OnInit {
  showError2: boolean = false;
  showError1: boolean = false;


  constructor(
    public router: Router,
    private masterService: MasterServiceService,
    private adminService: AdminService,
    private toastr: ToastrService, private location: Location, private renderer: Renderer2) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
  }


  engineDis: any;

  display = "none";
  header: string = '';
  txt_btn: string = '';
  date: Date = new Date();
  engine: Engine[] = [];
  newArr: any = {};
  isErrorEngDis: boolean = false;
  statusValue: boolean = false;
  editModal: boolean = false;
  editRowIndex: any;
  textsearch: string = '';

  EngineFrom!: FormGroup;

  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };
  username: any;
  userId: any;

  ngOnInit() {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.username = localStorage.getItem("userName");
    this.userId = localStorage.getItem("userId");

    this.EngineFrom = new FormGroup({
      textsearch: new FormControl(),

    });
    this.getEngineAll();

  }

  openModal() {
    this.display = "block";
    if (this.editModal) {
      this.showError2 = false;
      this.header = 'Edit Engine';
      this.txt_btn = 'Update';
      this.engineDis = this.editRowIndex.Value;  //this.engine[this.editRowIndex.Value].Value;
      this.statusValue = this.editRowIndex.IsActive; // this.engine[this.editRowIndex.IsActive].IsActive;
    } else {
      this.showError2 = false;
      this.header = 'Add Engine';
      this.txt_btn = 'Save';
      this.engineDis = "";
      this.statusValue;
    }
  };

  deleteRow(rowIndex: any) {
    if (confirm("Are you sure you want to delete?")) {
      console.log(rowIndex)
      //const rowIndex=this.engine[this.editRowIndex].edId
      // this.engine.splice(rowIndex, 1);

      this.newArr = {
        EDId: rowIndex,
        modifiedBy: this.userId
      };
      this.masterService.deleteEngine(this.newArr).subscribe({
        next: (_res: any) => {
          // this.engine[this.editRowIndex] = this.newArr;
          this.toastr.success("Data Deleted Successfully.");
          this.getEngineAll();
        },
        error: (error: any) => {
          console.error('API call error:', error);
        },
      });
    }
  }

  editModalMethod(rowIndex: any) {
    this.editModal = true;
    this.editRowIndex = rowIndex;
    this.openModal();
  }

  onCloseHandled() {
    this.display = "none";
  }

  engDisplacementOnBlur(event: any) {
    this.engineDis = event.target.value;
  }

  onSelected(event: any) {
    this.statusValue = event.target.value;
  }



  // mSTUsers = {
  //   Token: '', RefreshToken: "", RefreshTokenExpires: ""
  // }
  mSTUsers: Authclass[] = [];


  getEngineAll() {

    this.masterService.getEngine().subscribe((_result: any[]) => {
      this.engine = _result;
    })
    debugger;

    // this.mSTUsers.Token = String(localStorage.getItem("accessToken"));
    // this.mSTUsers.RefreshToken = String(localStorage.getItem("refreshToken"));
    // this.mSTUsers.RefreshTokenExpires = String(localStorage.getItem("refreshTokenExpires"));


    // this.mSTUsers =[{
    //   "Token" : localStorage.getItem("accessToken"),
    //   "RefreshToken" : localStorage.getItem("refreshToken"),
    //   "RefreshTokenExpires": localStorage.getItem("refreshTokenExpires")
    // }];

    // this.adminService.RenewAccessTOken(this.mSTUsers).subscribe((_result: any[]) => {
    //   console.log("refresh " + _result);
    // })

    //this.masterService.getEngine();

  }


  onSaveButton() {
    //debugger;
    const lastChar = this.engineDis.charAt(this.engineDis.length - 1);
    if (lastChar === 'L') {
      this.engineDis = this.engineDis;
    }
    else {
      this.engineDis = this.engineDis + 'L';
    }

    if (!this.onClickBlankInputValidation()) {
      if (this.editModal) {
        this.newArr = {
          modifiedBy: this.userId,
          modifiedOn: "2023-09-12T14:33:18.937",
          description: this.engineDis,
          value: this.engineDis,
          EDId: this.editRowIndex.EDId
        };
        this.masterService.updateEngine(this.newArr).subscribe({
          next: (_res) => {
            this.engine[this.editRowIndex] = this.newArr;
            this.getEngineAll();
            this.toastr.success("Data Updated Successfully.");
          },
          error: (error) => {
            console.error('API call error:', error);
          },
        });
        // this.engine[this.editRowIndex].isActive = this.statusValue;
      } else {
        this.newArr = {
          createdBy: this.userId,
          createdOn: "2023-09-12T14:33:18.937",
          description: this.engineDis,
          value: this.engineDis,
        };

        this.masterService.addEngine(this.newArr).subscribe({
          next: (_res) => {
            this.getEngineAll();
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
      console.log("Error")
    }

  }


  keyPressDecimal(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
      return false;
    }
    else {
      return true;
    }
  }

  blurCheckBlankInputValidation(inputName: string) {
    const inputElement = document.getElementsByName(inputName)[0] as HTMLInputElement
    if (inputName === 'engDis') {
      this.showError1 = inputElement.value.trim() === '';
      this.engineDis = inputElement.value;
    }
    if (inputName === 'status') {
      this.showError2 = inputElement.value.trim() === '';
      // this.statusValue = inputElement.defaultValue
    }
  }

  onClickBlankInputValidation(): boolean {
    if (this.engineDis === '') {
      this.renderer.selectRootElement('#engDis').focus();
      this.showError1 = true;
      return true;
    }
    // else if (this.statusValue === '') {
    //   this.showError2 = true;
    //   return true;
    // }
    else {
      return false;
    }

  }


  backToPreviousPage() {
    this.location.back();
  }

  Ishide1 = false;
  colspanhide1 = 2;

  Ishide2 = false;
  colspanhide2 = 2;

  Ishide3 = false;
  colspanhide3 = 3;

  hide1() {
    debugger;
    if (!this.Ishide1) {
      this.Ishide1 = true;
      this.colspanhide1 = 1;
    }
    else {
      this.Ishide1 = false;
      this.colspanhide1 = 2;
    }

  }
  hide2() {
    debugger;
    if (!this.Ishide2) {
      this.Ishide2 = true;
      this.colspanhide2 = 1;
    }
    else {
      this.Ishide2 = false;
      this.colspanhide2 = 2;
    }

  }
  hide3() {
    debugger;
    if (!this.Ishide3) {
      this.Ishide3 = true;
      this.colspanhide3 = 1;
    }
    else {
      this.Ishide3 = false;
      this.colspanhide3 = 3;
    }

  }

}