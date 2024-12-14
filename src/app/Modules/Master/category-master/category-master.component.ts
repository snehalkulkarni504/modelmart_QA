import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.css']
})
export class CategoryMasterComponent implements OnInit {

  CategoryxMasterForm !: FormGroup;
  CategoryTree: any = [];
  GetChildList: any = [];
  textsearch: string = '';
  filterMetadata = { count: 0 };
  display = "none";
  distinctCat2List: any = [];
  distinctChildList: any = [];
  selectedCat2: any;
  selectedGroupCategory: any;
  selectedChild: any;
  catgroup: any;

  userId: any;
  newArr: any = {};

  // listOfGroupCat:a;
  ListGroupCat = [
    { id: 1, name: 'Cat2', Desc: 'Category 2' },
    { id: 2, name: 'Cat3', Desc: 'Category 3' },
    { id: 3, name: 'Cat4', Desc: 'Category 4' }]

  constructor(public router: Router,
    private masterService: MasterServiceService,
    private toastr: ToastrService,
    private location: Location,
    private renderer: Renderer2,
    private SpinnerService: NgxSpinnerService) {

  }

  ngOnInit() {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.CategoryxMasterForm = new FormGroup({
      textsearch: new FormControl(),
    });

    this.getCategoryTree();
    this.userId = localStorage.getItem("userId");
    // this.GetChildCategory();

  }
  onCloseHandled() {
    this.display = "none";
  }

  selectCategory() {
    //  debugger;

    if (this.selectedGroupCategory == 'Cat2') {
      this.catgroup = 'Cat2';
    }
    else if (this.selectedGroupCategory == 'Cat3') {
      this.catgroup = 'Cat2';
    }
    else {
      this.catgroup = 'Cat3';
    }

    console.log('category ', this.catgroup);
    this.GetChildCategory(this.catgroup)
    this.selectedCat2 = '';
  }

  GetChildCategory(category: string) {

    this.GetChildList = [];

    this.masterService.GetChildCategory(category).subscribe({
      next: (res: any) => {
        this.GetChildList = res;
        this.GetChildList = [...new Set(this.GetChildList.map((obj: { ChildCategory: any; }) => obj.ChildCategory))]
        console.log('child list', this.GetChildList);


      },
      error: (error: any) => {
        console.error('Inserting API call error:', error);
      },
    });

  }

  getCategoryTree() {
   
    this.CategoryTree = [];
    this.SpinnerService.show('spinner');

    this.masterService.getCategoryTree().subscribe({
      next: (res: any) => {
        this.CategoryTree = res;
        console.log(this.CategoryTree);

      },
      error: (error: any) => {
        console.error('Inserting API call error:', error);
      },
    });

  }



  onSaveButton() {
    //debugger;
    if (this.selectedGroupCategory == null || this.selectedGroupCategory == undefined || this.selectedGroupCategory == "") {
      this.toastr.warning("Please select Group Category");
      return
    }

    if (this.selectedGroupCategory != 'Cat2') {
      if (this.selectedCat2 == null || this.selectedCat2 == undefined || this.selectedCat2 == "") {
        this.toastr.warning("Please select Parent Category");
        return
      }

    }

    if (this.selectedChild == null || this.selectedChild == undefined || this.selectedChild == "") {
      this.toastr.warning("Please Enter Category Name");
      return
    }

    console.log(this.selectedCat2)

    this.newArr = {
      ParentCategory: this.selectedCat2,
      ChildCategory: this.selectedChild,
      GroupCategory: this.selectedGroupCategory,
      CreatedBy: this.userId
    };

    this.masterService.AddCategoryMaster(this.newArr).subscribe({
      next: (_res) => {
        this.getCategoryTree();
        this.toastr.success("Data Inserted Successfully.");

      },
      error: (error) => {
        console.error('Inserting API call error:', error);
        this.toastr.error("Data Insertion failed.");

      },
    });
    this.display = "none";
  }

  openModal() {
    this.display = "block";
    // this.GetChildCategory();
    // this.selectedCat2='';
    this.selectedChild = '';

  }
  backToPreviousPage() {
    this.location.back();
  }

  handleRowClick(row: any, id: any) {
    console.log(row);

    if (id == 1) {
      console.log('Value of column1:', row.CategoryIdCat2);
    }
    else if (id == 2) {
      console.log('Value of column2:', row.value[0].CategoryIdCat3);
    }
    else {
      console.log('Value of column3:', row.value[0].CategoryIdCat4);
    }

  }
}
