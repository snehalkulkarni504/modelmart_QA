import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TreeviewConfig, TreeviewItem } from '@charmedme/ngx-treeview';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service'
import { ToastrService } from 'ngx-toastr';
import { MSTUsersDto } from 'src/app/Model/mstusers-dto';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.css'],

})
export class UserAccessComponent implements OnInit {

  formGroup!: FormGroup;
  @ViewChild('Menus') private Menus: any;
  IsActive: boolean = false;
  name: any;

  constructor(public router: Router,
    private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService,
    private adminservice: AdminService,
    private masterservice: MasterServiceService,
    private location: Location,
    private fb: FormBuilder) {
  }


  UserId: any;
  userdetail: any;

  userunitaccessform!: FormGroup;
  adduser: MSTUsersDto[] = [];
  activeUsers: any;
  rolename: any;
  bunames: any;
  dataArr: any = {};


  display = "none";
  editModal: boolean = false;
  header: string = '';
  txt_btn: string = '';
  userSearchText: string = '';
  page: number = 1;
  pageSize: number = 10;
  useraccessform!: FormGroup;


  userUnitName: any;
  user_id: any;
  fullName: any;
  role: any;
  roleid: any;
  role_id: any;
  businessunits: any;
  usernameandBu: any;
  selectedBusinessUnits: string[] = [];
  menus: any;
  menuid: any;

  textsearch: string = '';
  editRowIndex: any;
  showError1: boolean = false;
  showError2: boolean = false;
  showSpinner: boolean = false;
  userexist: boolean = false;

  filterMetadata = {
    count: 0
  };

  dropdownOpen = true;
  Active = "Active";

  items: TreeviewItem[] = [];
  MenuSpecific: TreeviewItem[] = [];

  Menuconfig = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
  });



  ngOnInit() {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.useraccessform = new FormGroup({
      textsearch: new FormControl(),
    });


    this.formGroup = this.fb.group({
      userId: ['', Validators.required],
      roleid: ['', Validators.required],
      businessUnits: this.fb.array([], Validators.required)
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.updateSaveButtonState(); // Call method to update button state
    });

    const roleControl = this.formGroup.get('roleid');
    if (roleControl) {
      roleControl.valueChanges.subscribe(value => {
        const businessUnitsControl = this.formGroup.get('businessUnits');
        if (businessUnitsControl) {
          if (value == 26) {
            businessUnitsControl.enable();
          } else {
            businessUnitsControl.disable();
            businessUnitsControl.setValue([]); // Clear the selected business units when disabled
          }
        }
      });
    }



    this.UserId = localStorage.getItem("userId");

    this.userunitaccessform = new FormGroup({
      textsearch: new FormControl(),
    });

    this.fetchuserBu();

  }

  async fetchActiveUsers() {
    const data = await this.adminservice.getActiveUsersList().toPromise();
    this.activeUsers = data;
    console.log('hello', this.activeUsers);
  }


  async fetchrole() {
    
    const data = await this.adminservice.getRoleList().toPromise();
    this.rolename = data;
    console.log(this.rolename);
  }

  async fetchbu() {
    const data = await this.adminservice.getBusinessUnits().toPromise();
    this.bunames = data;
  }

  async fetchuserBu() {
    try {
      const data = await this.adminservice.getuserandBUdetails().toPromise()
      this.usernameandBu = data;
      console.log(data)
    }

    catch (err) {
      console.error('Error updating user role', err);
    }

  }

  async getmenus(menuid: number) {
    
    try {
      const data = await this.masterservice.Getmenus(menuid).toPromise()
      //this.menus=data;
      console.log('data', this.menus);
      this.MenuSpecific = [];
      this.MenuSpecific = data.map((value: { text: any; value: any; children: any }) => {
        return new TreeviewItem({ text: value.text, value: value.value, children: value.children });
      });
      console.log(this.MenuSpecific);
    }
    catch (err) {
      console.error('Error fetching menus', err);
    }

  }
  
  IsCheckedBox() {

    console.log(this.IsActive)
    if(this.IsActive){
      this.Active = "Active";
    }
    else{
      this.Active= "Inactive";
    }

  }

  updateuserdata(data: MSTUsersDto) {
    // this.adminservice.updateUserRole(data).subscribe({
    //   next: (response: any) => {
    //     this.toastr.success("User access Updated Successfully.");
    //     this.fetchuserBu();
    //   },
    //   error: (err: any) => {
    //     this.toastr.error("User access not Update.");
    //   },
    //   complete: () => {
    //     this.fetchuserBu();

    //   }
    // });
  }

  // insertuserdata(data: MSTUsersDto) {
  //   this.adminservice.updateUserRole(data).subscribe({
  //     next: (response: any) => {
  //       console.log('User role updated successfully', response);
  //       this.fetchuserBu();
  //     },
  //     error: (err: any) => {
  //       console.error('Error updating user role', err);
  //       this.toastr.error("Data Not Inserted.");
  //     },
  //     complete: () => {
  //       console.log('Update user role request completed');
  //       this.toastr.success("Data Inserted Successfully.");
  //       this.fetchuserBu();

  //     }
  //   });
  // }


  openModal() {
    
    this.SpinnerService.show('spinner');

    this.selectedBusinessUnits = [];

    this.fetchActiveUsers()
    this.fetchrole()
    this.fetchbu()
    this.display = "block";

    console.log("Delayed for 1 second.");


    if (this.editModal) {

      setTimeout(() => {

        this.header = 'Edit User Access';
        this.txt_btn = 'Update';
        this.roleid = this.editRowIndex.RoleId;
        //this.UserId = this.editRowIndex.UserId;
        this.IsActive = this.editRowIndex.IsActive;
        if(this.IsActive){
          this.Active = "Active";
        }
        else{
          this.Active = "Inactive";
        }
        this.name = this.editRowIndex.UserId; // this.editRowIndex.FullName+ "("+this.editRowIndex.UserName+")";
        console.log(this.name);
        this.user_id = this.editRowIndex.UserId;
        this.role_id = this.editRowIndex.RoleId;
        this.businessunits = this.editRowIndex.BUID;
        this.menuid = this.role_id;

        this.formGroup.get('userId')?.setValue(this.editRowIndex.FullName);
        this.formGroup.get('roleid')?.setValue(this.editRowIndex.RoleId);
        if (this.role_id == 26) {
          this.dropdownOpen = false;
        }
        else{
          this.dropdownOpen = true;
        }

        console.log(this.businessunits.length);
        var ul = document.getElementById("BusinessUnitUL");
        var li = ul!.getElementsByTagName("li") as any;
        for (var i = 0; i < this.businessunits.split(',').length; i++) {
          var rr = this.businessunits.split(',')[i].trim();
          for (var j = 0; j < li.length; j++) {
            if (rr == li[j].getElementsByTagName('input')[0].value) {
              li[j].getElementsByTagName('input')[0].checked = true;
              break;
            }
          }
        }
        this.getmenus(this.role_id)
        this.SpinnerService.hide('spinner');
      }, 500);

    }
    else {
      this.showError1 = false;
      this.showError2 = false;
      this.header = 'Add User Access';
      this.txt_btn = 'Save';
      this.userUnitName = "";
      this.SpinnerService.hide('spinner');
      this.role = "";
      this.businessunits = 0;
      this.formGroup.get('businessUnits')?.setValue([]);
      this.resetForm()

    }

  }

  async onSaveButton() {
    
    let buids: number[];
    if (this.businessunits == 0 || this.businessunits == "0") {
      buids = []; // or set to some default value if needed
    } else {
      buids = this.businessunits; //this.businessunits.map((unit: any) => Number(unit)).filter((num: number) => !isNaN(num));
    }

    console.log("BU", buids, this.roleid);

    if(this.roleid == 26 && buids.length <= 0 ){
      this.toastr.error("Please select Business Unit");
      return;
    }

    if (this.editModal) {
      // this.dataArr = {
      //   Id: this.user_id,
      //   Created_by: this.UserId,
      //   RoleId: this.roleid,
      //   ModifiedBy: this.UserId,
      //   BUIDs: buids,
      //   IsActive: this.IsActive
      // }
      // this.updateuserdata( this.user_id,this.UserId,this.roleid,buids,this.IsActive);
      const data = await this.adminservice.updateUserRole(this.user_id, this.UserId, this.roleid, buids, this.IsActive).toPromise();
      this.toastr.success("User access Updated Successfully.");
      this.fetchuserBu();

      this.resetForm();
      this.getmenus(0);

    }
    else {
      const arraySize = this.adduser.length;
      this.dataArr = {

        Id: this.user_id,
        Created_by: this.UserId,
        RoleId: this.roleid,
        ModifiedBy: this.UserId,
        BUIDs: buids,
      };
      console.log("data", this.dataArr);
    //  this.insertuserdata(this.dataArr)
      this.resetForm();
      this.getmenus(0);
    }
    this.formGroup.get('businessUnits')?.setValue([]);
    this.editModal = false;
    this.display = "none";
  }

  editModalMethod(rowIndex: any) {
    
    this.editModal = true;
    this.editRowIndex = rowIndex;
    this.openModal();
  }

  resetForm(): void {
    this.formGroup.reset({
      userId: '',
      roleid: '',
      businessUnits: []
    });
    this.selectedBusinessUnits = [];
    this.userUnitName = '';
    this.role = '';
    this.businessunits = 0;
    //this.dropdownOpen = true; // Reset dropdown state if necessary
  }


  onCloseHandled() {
    this.resetForm();
    this.display = "none";
    this.formGroup.reset({
      userId: '' // Reset the userId form control
    });
    this.userexist = false;
    this.getmenus(0);
  }



  onselectUser(event: any) {
    if (!this.editModal) {
      this.user_id = null;
      this.user_id = event; // Set the appropriate value based on the event structure

      for (var i = 0; i < this.usernameandBu.length; i++) {
        if (this.usernameandBu[i].UserId == this.user_id) {
          this.userdetail = this.usernameandBu[i];
          console.log(this.userdetail);
          this.userexist = true;
          break;
        }
      }
      this.roleid = this.userdetail.RoleId;
      //this.UserId = this.userdetail.UserId;

      this.user_id = this.userdetail.UserId;
      this.role_id = this.userdetail.RoleId;
      this.businessunits = this.userdetail.BUID;

      this.formGroup.get('userId')?.setValue(this.userdetail.UserId);
      this.formGroup.get('roleid')?.setValue(this.userdetail.RoleId);
      if (this.roleid == 26) {
       // this.dropdownOpen = false;
      }
      // else{
      //   this.dropdownOpen = false;
      // }



      var ul = document.getElementById("BusinessUnitUL");
      var li = ul!.getElementsByTagName("li") as any;
      for (var j = 0; j < li.length; j++) {
        li[j].getElementsByTagName('input')[0].checked = false;
      }

      for (var i = 0; i < this.businessunits.split(',').length; i++) {
        var rr = this.businessunits.split(',')[i].trim();
        for (var j = 0; j < li.length; j++) {
          if (rr == li[j].getElementsByTagName('input')[0].value) {
            li[j].getElementsByTagName('input')[0].checked = true;
            break;
          }
        }
      }
      
      this.getmenus(this.role_id)
    }

  }

  onselectrole(event: any) {
    // if (this.userexist) 
    this.roleid = null;
    this.roleid = event.target.value;
    if (this.roleid == 26) {
      this.openBusinessUnitDropdown();
      this.dropdownOpen=false;
    }
    else {
      this.closeBusinessUnitDropdown();
      this.businessunits = 0;
     this.dropdownOpen=true;
    }
    this.getmenus(this.roleid);

  }

  openBusinessUnitDropdown() {
    //this.dropdownOpen = true;
    const businessUnitsControl = this.formGroup.get('businessUnits');
    if (businessUnitsControl) {
      businessUnitsControl.enable();
      businessUnitsControl.setValue([]); // Clear the selected business units when disabled
    }
  }
  closeBusinessUnitDropdown() {
    //this.dropdownOpen = false;
    const businessUnitsControl = this.formGroup.get('businessUnits');
    if (businessUnitsControl) {
      businessUnitsControl.disable();
      businessUnitsControl.setValue([]); // Clear the selected business units when disabled
    }
  }

  getBusinessUnitValues() {
    
    this.selectedBusinessUnits = [];
    this.businessunits = [];

    var ul = document.getElementById("BusinessUnitUL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      if (li[i].getElementsByTagName('input')[0].checked) {
        this.selectedBusinessUnits.push(li[i].getElementsByTagName('input')[0].value);
        this.businessunits = this.selectedBusinessUnits;
      }
    }
  }

  updateSaveButtonState() {
    const isUserNameSelected = !!this.formGroup.get('userId')?.value;
    const isRoleSelected = !!this.formGroup.get('roleid')?.value;
    const isBusinessUnitsSelected = !!this.formGroup.get('businessUnits')?.value.length; // Check if any business units are selected

    // Check if role is "EndUser"
    const selectedRole = this.formGroup.get('roleid')?.value;
    const isEndUserRole = selectedRole === 26;

    // Example: Update isValidForm function based on conditions
    const isValidForm = isUserNameSelected && isRoleSelected && (!isEndUserRole || (isEndUserRole && isBusinessUnitsSelected));
  }


  isValidForm() {


    if (this.editModal) {
      return true;
    }

    else {
      const isUserNameSelected = !!this.formGroup.get('userId')?.value;
      const isRoleSelected = !!this.formGroup.get('roleid')?.value;
      const isBusinessUnitsValid = this.formGroup.get('businessUnits')?.valid || !this.formGroup.get('businessUnits')?.enabled;

      // Check if role is "EndUser"
      const selectedRole = this.formGroup.get('roleid')?.value;
      const isEndUserRole = selectedRole === 26;

      return isUserNameSelected && isRoleSelected && (!isEndUserRole || (isEndUserRole && isBusinessUnitsValid));
    }


  }


  backToPreviousPage() {
    this.location.back();
  }

  toggleDropdown() {
    //this.dropdownOpen = !this.dropdownOpen;
  }


}



