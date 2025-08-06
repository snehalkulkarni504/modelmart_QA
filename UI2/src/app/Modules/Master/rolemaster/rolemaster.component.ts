
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoleUnitMaster } from 'src/app/Model/role-unit-master';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { Location } from '@angular/common';
import { TreeviewConfig, TreeviewItem } from '@charmedme/ngx-treeview';

@Component({
  selector: 'app-rolemaster',
  templateUrl: './rolemaster.component.html',
  styleUrls: ['./rolemaster.component.css']
})
export class RolemasterComponent implements OnInit {

  constructor(public router: Router,
    private masterService: MasterServiceService,
    private toastr: ToastrService, private location: Location) {
    this.configp = {
      currentPage: 1,
      itemsPerPage: 10
    };
  }


  page: number = 1;
  pageSize: number = 10;
  configp: any;
  filterMetadata = { count: 0 };

  rollMasterForm!: FormGroup
  roleUnitMaster: RoleUnitMaster[] = [];
  getMenu: any = {};
  getRole: any = {};

  display = "none";
  header: string = '';
  txt_btn: string = '';
  roleName: any;
  RoleId: any;
  menu: any = {};
  description: any;
  status: any;
  date: Date = new Date();
  editModal: boolean = false;
  editRowIndex: number = 0;
  textsearch: string = '';
  dataArr: any = {};

  showError1: boolean = false;
  showError2: boolean = false;
  showError3: boolean = false;
  dropdownButton: any
  dropdownMenu: any
  list: any[] = []

  selectedItems: any[] = []
  checkedList: any[] = []
  menuList: any[] = []
  currentSelected: {} = {}
  roleData: any = {};
  showDropDown: boolean = false
  // shareIndividualCheckedList :{}={}
  // shareCheckedList :any[]=[]
  IsActive: boolean = false;
  items: any = {};
  MenuSpecific: TreeviewItem[] = [];
  DummyMenuSpecific: TreeviewItem[] = [];

  Active = "Active";



  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false
  });
  ngOnInit(): void {

    // this.getmenus();

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }


    const dropdownButton = document.getElementById('multiSelectDropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    this.rollMasterForm = new FormGroup({
      textsearch: new FormControl(),

    });

    this.getRoleData();
    //console.log('menu list', this.getMenuList())

    const chBoxes = document.querySelectorAll('.dropdown-menu input[type="checkbox"]');
    const dpBtn = document.getElementById('multiSelectDropdown');

    let mySelectedListItems = [];
  }

  // onCheckboxChange(item: any): void {
  //   if (item.checked) {
  //     // Add the selected item to the selectedItems array
  //     this.selectedItems.push(item);
  //     //console.log(this.selectedItems)
  //   } else {
  //     // Remove the item from the selectedItems array
  //     this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem.id !== item.id);

  //   }

  // }
  IsCheckedBox() {

    //console.log(this.IsActive)
    if (this.IsActive) {
      this.Active = "Active";
    }
    else {
      this.Active = "Deactive";
    }

  }
  async openModal() {
    //  this.getmenus();
    this.display = "block";
    if (this.editModal) {
      this.header = 'Edit Data';
      this.txt_btn = 'Update';
      this.roleName = this.getRole[this.editRowIndex].RoleName;
      this.RoleId = this.getRole[this.editRowIndex].RoleId;
      //this.description = this.getRole[this.editRowIndex].Description;
      this.status = this.getRole[this.editRowIndex].status;
      // console.log('edit array', this.menu, this.getRole[this.editRowIndex].MenuId)

    } else {
      //  this.getMenuList();
      this.header = 'Add Data';
      this.txt_btn = 'Save';
      this.roleName = "";
      this.menu = this.getMenu;
      this.description = "";
      this.status = "";
      this.checkedList = [];
      this.menuList = [];


    }
  };


  // async getMenuList() {
  //   const data = await this.masterService.getMenuList().toPromise();
  //   this.getMenu = data;

  //   this.updatelist = this.getMenu.map((d: any) => ({ ...d, checked: false }));
  //   //console.log('menu', this.updatelist)
  // }

  getRoleData() {
    this.masterService.getRole().subscribe(_result => {
      this.getRole = _result;
      console.log('ssssss', this.getRole)
    })
  }

  // deleteRow(rowIndex: any) {

  //   if (confirm("Are you sure you want to delete Role?")) {

  //     this.dataArr = {
  //       RoleId: rowIndex,
  //       ModifiedBy: Number(localStorage.getItem("userId"))
  //     };
  //     this.masterService.deleteRole(this.dataArr).subscribe({
  //       next: (_res) => {

  //         this.toastr.success("Data Deleted Successfully.");
  //         this.getRoleData();
  //       },
  //       error: (error) => {
  //         console.error('API call error:', error);
  //       },
  //     });
  //   }
  // }

  onCloseHandled() {
    this.display = "none";
    this.editModal = false;

  }
  onroleSelected(event: any) {
    this.roleName = event.target.value;
  }
  onItemChange(item: { text: string, selected: boolean }): void {
    // this.menu = event.target.value;

    if (item.selected) {
      this.checkedList.push(item.text);
    } else {

      const index = this.checkedList.indexOf(item.text)
      if (index !== -1) {
        this.checkedList.splice(index, 1)
      }

    }

  }

  descriOnBlur(event: any) {
    this.description = event.target.value;
  }
  roleOnBlur(event: any) {
    this.roleName = event?.target.value;
  }
  onSelected(event: any) {
    this.status = event.target.value;
  }

  updatelist: any;

  async editModalMethod(rowIndex: any, item: any) {

    //const data = await this.masterService.getMenuList().toPromise();
    //this.updatelist = data;
    debugger;
    if (1 > 0) {
      this.menuList = [];
      this.editModal = true;
      this.editRowIndex = rowIndex;
      this.openModal();

      // this.getRole

      const data = await this.masterService.Getmenus(8).toPromise()
      // console.log('data', data);
      this.MenuSpecific = data;

      // this.MenuSpecific = data.map((value: { text: any; value: any; children: any, checked:boolean; }) => {
      //   return new TreeviewItem({ text: value.text, value: value.value, children: value.children,checked:false });
      // });

      debugger;
      console.log(this.getRole);
      console.log(this.MenuSpecific);
      console.log(item);

      for (let i = 0; i < item.MenuId.split(',').length; i++) {
        for (let j = 0; j < this.MenuSpecific.length; j++) {
          // console.log('his.MenuSpecific[j].children.length : ', this.MenuSpecific[j].children.length);
          // console.log('item.MenuId.split(', ')[i] : ', item.MenuId.split(',')[i]);
          // console.log('MenuSpecific[j].value : ', this.MenuSpecific[j].value);
          if (item.MenuId.split(',')[i] == this.MenuSpecific[j].value) {
            this.MenuSpecific[j].checked = true
          }
          for (let k = 0; k < this.MenuSpecific[j].children.length; k++) {
           // console.log("this.MenuSpecific[j].children[k].value : ", this.MenuSpecific[j].children[k].value);
            if (item.MenuId.split(',')[i] == this.MenuSpecific[j].children[k].value) {
              this.MenuSpecific[j].children[k].checked = true
            }
          }

        }
      }
      console.log('my menu checked ', this.MenuSpecific);
    }
  }

  onSaveButton() {
    if (!this.onClickBlankInputValidation()) {
      if (this.editModal) {
        // console.log('edit called array', this.getRole)
        this.getRole[this.editRowIndex].RoleId = this.RoleId
        this.getRole[this.editRowIndex].RoleName = this.roleName
        this.getRole[this.editRowIndex].Description = this.description
        //this.roleUnitMaster[this.editRowIndex].MenuId=this.list
        let list = this.checkedList.join(',')
        //console.log(this.checkedList)
        // console.log(list)
        this.roleData = {
          RoleId: this.RoleId,
          RoleName: this.roleName,
          Description: this.description,
          MenuId: list,
          ModifiedBy: Number(localStorage.getItem("userId"))
        }
        this.masterService.updateRole(this.roleData).subscribe(
          response => {
            //console.log('Record updated successfully:', response);
            this.getRoleData();
            this.toastr.success("Data Updated Successfully.");
          },
          error => {
            console.error('Error inserting record:', error);

          }
        );

        // console.log('saved role data', this.roleData)
      }
      else {
        let list = this.checkedList.join(',')
        // console.log(list)
        this.dataArr = {
          RoleName: this.roleName,
          MenuId: list,
          CreatedBy: Number(localStorage.getItem("userId"))
        };



        this.masterService.addRole(this.dataArr).subscribe(
          response => {
            // console.log('Record inserted successfully:', response);
            this.getRoleData();
            this.toastr.success("Data Inserted Successfully.");
          },
          error => {
            console.error('Error inserting record:', error);

          }
        );

      }
      this.editModal = false;
      this.display = "none";
    }
  }
  onSelectedChange(e: any) {
    //console.log('checked',e)
    this.checkedList = e;
    //console.log('updated menu specific',this.MenuSpecific)

  }
  async getmenus() {
    debugger;
    try {
      const data = await this.masterService.Getmenus(8).toPromise()
      //this.menus=data;
      console.log('data', data);
      this.MenuSpecific = [];
      this.MenuSpecific = data.map((value: {
        text: any; value: any; children: any,
        checked: boolean;
      }) => {
        return new TreeviewItem({ text: value.text, value: value.value, children: value.children, checked: value.checked });
      });
      //console.log('menu specific',this.MenuSpecific);
    }
    catch (err) {
      console.error('Error fetching menus', err);
    }

  }
  onClickBlankInputValidation(): boolean {
    if (this.roleName === '') {
      this.showError1 = true;
      return true;
    }
    else if (this.checkedList.length <= 0) {
      this.showError2 = true;
      return true;
    }
    else {
      return false;
    }
  }


  backToPreviousPage() {
    this.location.back();
  }

  SelectAllManus(menuid: any, evt: any) {
    debugger;
    console.log(menuid)

    if (menuid.children.length > 0) {
      let checkbox = document.getElementById(evt.target.id) as any;
      if (checkbox.checked) {
        for (let i = 0; i < this.MenuSpecific.length; i++) {
          for (let j = 0; j < this.MenuSpecific[i].children.length; j++) {
            for (var k = 0; k < menuid.children.length; k++) {
              if (this.MenuSpecific[i].value == menuid.value) {
                this.MenuSpecific[i].children[j].checked = true
              }
            }
          }
        }
      }
      else {
        for (let i = 0; i < this.MenuSpecific.length; i++) {
          for (let j = 0; j < this.MenuSpecific[i].children.length; j++) {
            for (var k = 0; k < menuid.children.length; k++) {
              if (this.MenuSpecific[i].value == menuid.value) {
                this.MenuSpecific[i].children[j].checked = false
              }
            }
          }
        }
      }
    }
  }

}


