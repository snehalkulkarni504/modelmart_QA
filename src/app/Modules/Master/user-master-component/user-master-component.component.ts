import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserMaster } from 'src/app/Model/user-master';
import { Location } from '@angular/common';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { ToastrService } from 'ngx-toastr';
 
@Component({
  selector: 'app-user-master-component',
  templateUrl: './user-master-component.component.html',
  styleUrls: ['./user-master-component.component.css']
})
export class UserMasterComponentComponent implements OnInit {
  config: any;
  page: number = 1;
  pageSize: number = 10;

  constructor(
    public router: Router,
    private masterService: MasterServiceService,
    private toastr: ToastrService, private location: Location, private renderer: Renderer2) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
  }

  userUnitMasterForm !: FormGroup;
  userUnitMaster: UserMaster[] = [];
  data: any = {};
  dataArr: any = {};
  display = "none";
  editModal: boolean = false;
  header: string = '';
  txt_btn: string = '';
  userUnitName: any;
  role: any;
  newArr: any = {};
  roleName!: string[];
  selectedroleName!: string;
  firstName: any;
  lastName: any;
  emailId: any;
  status: any;
  Team: any;
  OrganizationName: any;
  FullName: any;
  textsearch: string = '';
  editRowIndex: any;
  showError1: boolean = false;
  showError2: boolean = false;
  showError3: boolean = false;
  showError4: boolean = false;
  showError5: boolean = false;
  filterMetadata = {
    count: 0
  };


  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
    }

    this.GetRoleData()

    this.userUnitMasterForm = new FormGroup({
      textsearch: new FormControl(),

    });

    //  this.dataArr = {
    //    id: "1",
    //    userUnitName: "UID",
    //    role: "CTT",
    //    firstName : "priyanka",
    //    lastName: "L",
    //    emailId :"priyaamol@gmail.com",
    //    status: "Active",
    //    createdBy: "priyanka_ttl",
    //    createdDate: new Date().toLocaleDateString()

    //  };
    //  this.userUnitMaster.push(this.dataArr);
    this.GetUserData();
  }

  async GetUserData() {

    const data = await this.masterService.GetUserData().toPromise();
    this.userUnitMaster = data;
    //console.log('userUnitMaster', this.userUnitMaster)
  }

  async GetRoleData() {

    this.masterService.getRole().subscribe(_result => {
      this.data = _result;
      console.log('data', this.data);
      //       console.log('roleName', this.data['roleName']);
      //       this.roleName = this.data['roleName'];
      //       console.log('after', this.roleName);

      // let RoleNAme: any[] = []

      // this.data.forEach((element: any) => {
      // RoleNAme.push(element["roleName"])
    },

      (error) => {
        console.error('Error in fetching', error);
      }

    )
  };

  openModal() {
    debugger;
    this.display = "block";
    console.log('flag', this.editModal)
    if (this.editModal) {

      this.header = 'Edit User';
      this.txt_btn = 'Update';
      this.userUnitName = this.editRowIndex.UserName; // this.userUnitMaster[this.editRowIndex].UserName;
      this.FullName = this.editRowIndex.FullName;
      this.Team = this.editRowIndex.Team;
      this.emailId = this.editRowIndex.EmailId;
      this.OrganizationName = this.editRowIndex.OrganizationName;

    }
    else {
      this.showError1 = false;
      this.showError2 = false;
      this.showError3 = false;
      this.showError4 = false;
      this.showError5 = false;

      this.header = 'Add User';
      this.txt_btn = 'Save';
      this.userUnitName = '';
      this.FullName = '';
      this.Team = '';
      this.OrganizationName = '';
      this.emailId = '';
    }
  };

  // deleteRow(rowIndex: any) {
  //   this.newArr = {
  //     Id: rowIndex,
  //     ModifiedBy: localStorage.getItem("userName")
  //   };
  //   this.masterService.deleteUserData(this.newArr).subscribe({
  //     next: (_res: any) => {
  //       this.GetUserData();
  //       this.toastr.success("Data Deleted Successfully.");
  //     },
  //     error: (error: any) => {
  //       console.error('API call error:', error);
  //     },
  //   });
  // }


  //  deleteRow(rowIndex: any) {
  //    this.userUnitMaster.splice(rowIndex, 1);
  //  }

  onCloseHandled() {
    this.display = "none";
  }
  onselectUser(event: any) {
    this.userUnitName = event.target.value;
  }
  OrgNameOnBlur(event: any) {
    this.OrganizationName = event.target.value;
  }
  FullNameOnBlur(event: any) {
    this.FullName = event.target.value;
  }
  TeamOnBlur(event: any) {
    this.Team = event.target.value;
  }
  emailOnBlur(event: any) {
    this.emailId = event.target.value;
  }

  userNameOnBlur(event: any) {
    this.userUnitName = event.target.value;
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
          Id: this.editRowIndex.Id,
          UserName: this.userUnitName,
          FullName: this.FullName,
          EmailId: this.userUnitName + "@cummins.com",
          Team: this.Team,
          OrganizationName: this.OrganizationName,
          ModifiedBy: Number(localStorage.getItem("userId"))
        };
        console.log('update', this.dataArr)
        this.masterService.updateUserData(this.dataArr).subscribe({
          next: (_res: any) => {

            this.GetUserData();
            this.toastr.success("Data Updated Successfully.");
          },
          error: (error: any) => {
            console.error('API call error:', error);
          },
        });
      }
      else {

        this.dataArr = {
          UserName: this.userUnitName,
          FullName: this.FullName,
          EmailId: this.userUnitName + "@cummins.com",
          Team: this.Team,
          OrganizationName: this.OrganizationName,
          CreatedBy: Number(localStorage.getItem("userId"))


        };
        console.log('add', this.dataArr)
        this.masterService.addUserData(this.dataArr).subscribe({
          next: (_res: any) => {
            this.GetUserData();
            this.toastr.success("Data Added Successfully.");
          },
          error: (error: any) => {
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

  backToPreviousPage() {
    this.location.back();
  }

  onClickBlankInputValidation() {

   
    if (this.userUnitName === '' || this.userUnitName === undefined) {
      this.showError1 = true;
      return true;
    }
    else  if (this.FullName === '' || this.FullName === undefined) {
      this.showError2 = true;
      return true;
    }
    else if (this.Team === '' || this.Team === undefined) {
      this.showError3 = true;
      return true;
    }
    else if (this.OrganizationName === '' || this.OrganizationName === undefined) {
      this.showError4 = true;
      return true;
    }
    else {
      return false;
    }
  }
}
