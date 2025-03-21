import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TreeviewConfig, TreeviewItem } from '@charmedme/ngx-treeview';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { SearchService } from 'src/app/SharedServices/search.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-cartdetails',
  templateUrl: './cartdetails.component.html',
  styleUrl: './cartdetails.component.css'
})
export class CartdetailsComponent {

  constructor(public router: Router,
    public Searchservice: SearchService,
    public adminService: AdminService,
    public toastr: ToastrService,
    private location: Location,
    public SpinnerService: NgxSpinnerService) {
    // this.myScriptElement = document.createElement("script");
    // this.myScriptElement.src = "assets/slider.js";
    // document.body.appendChild(this.myScriptElement);
  }

  @ViewChild('cat3') public cat3: any;
  selectedFile!: File | undefined;
  uploadfromdate:any
  Cat2: any;
  Cat2Value: any;
  Cat3: any;
  Cat3Value: any;
  Cat4: any;
  Cat4Value: any;
  SearchboxForm!: FormGroup;
  BusinessUnit: any;
  BusinessUnitValue: any;
  Location: any;
  LocationValue: any;
  DebriefFrom_Date: any;
  DebriefTo_Date: any;
  EngineList: any;
  EngineValue: any;
  SearchProductList: any;
  OverrideProductList:any;
  Cat2search: any;
  Cat3search: any;
  Cat4search: any;
  EngineDisplsearch: any;
  BusinessUnitsearch: any;
  Locationsearch: any;
  flag: number = 0;
  CategoryID: string = "0";
  userId:any;
  NA: any = "NA*";
  cartName:any;
  CreateNewCart:boolean=false;
  AddToCart:boolean=true;
  ShowHideNewCartButton:boolean=true;
  cartNameList:any={}
  showError2: boolean = false;
  showError1: boolean = false;
  display = "none";
  header: string = '';
  txt_btn: string = '';
  engineDis: any;
  Cartcategory:any;
  statusValue: boolean = false;
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
   

  });
  engineDisplace:any;
  cartcreate:boolean=false;
  excelU:boolean=false;
  override:boolean=false;
  showError7: boolean=false;
  loginDisplay = false;
  UserList: any;
  settingForm:any;
  filterMetadata = { count: 0 };
  totalScostByParentCategory: { [key: string]: number } = {};
  page: number = 1;
  pageSize: number = 10;
  BUnitMasterForm !: FormGroup;
  textsearch: string = '';
  selectedcatagory:any;
  selectedEngine:any;
  selectedplatform:any;
  exceltemppartno:any=0;
  
  ngOnInit(): void {
    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
     

      
    }

   // this.UserForModelMart(localStorage.getItem("userName"));

   this.userId = localStorage.getItem("userId");
   
    this.SearchboxForm = new FormGroup({
      Cat2List: new FormControl(),
      EngineList: new FormControl(),
      FromDate: new FormControl(),
      ToDate: new FormControl(),
      Cat2search: new FormControl(),
      Cat3search: new FormControl(),
      Cat4search: new FormControl(),
      EngineDisplsearch: new FormControl(),
      BusinessUnitsearch: new FormControl(),
      Locationsearch: new FormControl(),
    });

    this.ShowLandingPage(0, "0");
    this.ShowCagetory3();
    this.BUnitMasterForm = new FormGroup({
      textsearch: new FormControl(),
    });
  }

  

  getCategoryId(e: any) {
    const selectedText = e ? e.text : null;
    const cat3 = document.getElementsByClassName("Cat3Checkbox") as any;
    var param_value = "";

    for (let i = 0; i < e.length; i++) {
      param_value += e[i] + ",";
    }

    param_value = param_value.substring(0, param_value.length - 1);

    if (param_value == "") {
      this.ShowLandingPage(0, "0");
      return;
    }

    this.ShowLandingPage(1, param_value);
  }

  ChekNull(v: any): any {
    if (v == null || v == undefined || v <= 0) {
      return this.NA;
    }
    else {
      return v;
    }
  }

  Override(data:any){

    // alert(data.excelpartno)
    this.CreateNewCart=false;
   this.AddToCart=true;
   this.ShowHideNewCartButton=true;
   this.showError1=false;
   this.display = "none";
   this.excelU=false;
     this.override=true; 
     this.display = "block";
     this.exceltemppartno=0;
     this.exceltemppartno=data.excelpartno;
     this.ShowLandingPage(3,data.excelpartno);
     
  }

  async Replace(data:any){
    
    this.SpinnerService.show('spinner');
      const result = await this.Searchservice.UpdateCart(this.exceltemppartno,data.partNumber,this.userId,'cart1').toPromise();
    if(result>1){
      this.SpinnerService.hide('spinner');
      this.toastr.success("Cart Inserted Successfully.");
      this.onCloseHandled();
    }
    {
      this.SpinnerService.hide('spinner');
      this.onCloseHandled();
    }
    console.log(data);
  }
  
  enginefilter(){
    var displacementvelue = (<HTMLInputElement>document.getElementById("engine")).value
    
    this.ShowLandingPage(4,displacementvelue);
  }
  ReseatFilter(){
    (<HTMLInputElement>document.getElementById("engine")).value="";
    this.ShowLandingPage(0,'0')
  }

  async ShowLandingPage(flag: number, CategoryID: string) {
  
    try {

      this.SpinnerService.show('spinner');
      const data = await this.Searchservice.GetLandingPageForCartView(flag, CategoryID,this.userId).toPromise();
     
      
     
      if(flag!=3){
      
      //this.SearchProductList = data;
      this.SearchProductList = data.map((row: any) => ({ ...row, editable: false }));

      console.log(this.SearchProductList);
      this.calculateTotals();
     console.log(this.totalScostByParentCategory);
      this.SpinnerService.hide('spinner');
      }
      else{
        
        this.OverrideProductList=data;
        this.SpinnerService.hide('spinner');
      }
    }
    catch (e) {
      this.SpinnerService.hide('spinner');
      //console.log(e);
    }

  }

  editRow(row: any) {
    row.editable = true;
  }

  saveRow(row: any) {

    const updatedRow = { ...row };  // Create a copy of the row
  delete updatedRow.editable;  // Remove the editable property

  // Post updated data to the API
  this.Searchservice.UpdateBomFilter(updatedRow,"cart1",this.userId).subscribe(response => {
    console.log('Row updated successfully', response);
    row.editable = false;  // Disable edit mode after successful update
  }, error => {
    console.error('Error updating row', error);
  });
    row.editable = false;
  }

  cancelEdit(row: any) {
    row.editable = false;
  }

  private calculateTotals(): void {
    this.SearchProductList.forEach((item:any) => {
      if (!this.totalScostByParentCategory[item.parentCategory]) {
        this.totalScostByParentCategory[item.parentCategory] = 0;
      }
      if(item.ucost>0){
        this.totalScostByParentCategory[item.parentCategory] += item.ucost;
      }
      else{
      this.totalScostByParentCategory[item.parentCategory] += item.scost;
    }
    });
  }

 async ShowCagetory4() {
    const data = await this.Searchservice.GetCagetory3("0").toPromise();
    this.Cat3 = data.filter((d: { groupCategory: any; }) => d.groupCategory == "Cat3");

    
    this.Cat3 = this.Cat3.map((value: { text: any; value: any; }) => {
      return new TreeviewItem({ text: value.text, value: value.value, checked: false });
    });

  }

  async getCategoryIdcat3() {
 
  this.ShowLandingPage(1, this.selectedcatagory);
 }

  clearCategory3() {
 
    var ul = document.getElementById("CartUL");
    var li = ul!.getElementsByTagName("li") as any;
    for (var i = 0; i < li.length; i++) {
      li[i].getElementsByTagName('input')[0].checked = false;
      const myElement = document.getElementById(li[i].getElementsByTagName('input')[0].value);
      myElement?.classList.remove("selectedCart");
    }
    this.ShowLandingPage(0, "0");
  }


  getCartName() {
    this.Searchservice.getCartName(this.userId).subscribe((_result: any) => {
      this.cartNameList = _result;

    });
  }

  openModal() {
    
      this.getCartName();
      this.showError2 = false;
      this.header = 'Create Cart';
      this.txt_btn = 'CreateCart';
      this.engineDis = ""; 
      this.statusValue ;
      this.display = "block";
  };

  onCloseHandled() {

   this.CreateNewCart=false;
   this.AddToCart=true;
   this.ShowHideNewCartButton=true;
   this.showError1=false;
   this.display = "none";
   this.excelU=false;
   this.override=false;

    
  }

  onCartCreate(){
    this.AddToCart=false;
    this.CreateNewCart=true;
    this.ShowHideNewCartButton=false;
    this.showError1=false;
    this.Cartcategory=undefined;

  }

  async onSaveButton() {

    if(!this.Cartcategory)
    {
      this.showError1=true;
      return;
    }

    
      const matches = this.cartNameList.filter((x:any) => x.cartName.includes(this.Cartcategory)); 
      if(matches.length>0)
      {
        this.showError2=true;
        return;
      }
    
  this.Searchservice.SaveToCart(this.userId, 0,this.Cartcategory,null)
    .subscribe({
      next: (_res) => {
        if(_res==1)
        {
          this.clearCategory3()
         // this.ShowLandingPage(0, "0");
          this.ShowCagetory3();
        //this.getEngineAll();
        this.toastr.success("Cart Inserted Successfully.");
        this.AddToCart=true;
        this.CreateNewCart=false;
        this.ShowHideNewCartButton=true;
        this.showError1=false;
        this.showError2=false;
        this.onCloseHandled();
        this.Cartcategory=undefined;
        this.getCartName();
        }
        if(_res==2)
        {
          this.toastr.warning("Cart name Already exist");
        }
      },
      error: (error) => {
        console.error('Inserting API call error:', error);
        this.AddToCart=true;
        this.CreateNewCart=false;
        this.ShowHideNewCartButton=true;
        this.showError1=false;
        this.showError2=false;
        this.Cartcategory=undefined;
      },
    });
  }

  
  increment(cartname:any,uniqueid:any) {
    this.Searchservice.SaveToCart(this.userId, uniqueid,cartname,null)
    .subscribe({
      next: (_res) => {
        if(_res==1)
        {
        //this.getEngineAll();
        this.toastr.success("Item added Successfully.");
        this.clearCategory3();
        
        }
        if(_res==2)
        {
          
        }
      },
      error: (error) => {
        console.error('Inserting API call error:', error);
        
      },
    });
  }
  
  decrement(flag:any,cartid:any,childCategory:any,csheader_Updated:any,cartname:any) {

    if(flag==0){
    if(csheader_Updated==null)
    {
      csheader_Updated=0
    }
    if(childCategory==null){
      childCategory=0;
    }
  }
    if(flag==1){
      childCategory=0;
      csheader_Updated=0;
    }

    this.Searchservice.ItemDeleteFromCart(this.userId,cartid,childCategory,csheader_Updated,cartname)
    .subscribe({
      next: (_res) => {
        if(_res==1)
        {
        //this.getEngineAll();
        this.toastr.success("Item deleted Successfully.");
        
        this.clearCategory3()
        
        }
        if(_res==2)
        {
          
        }
      },
      error: (error) => {
        console.error('Deleting  API call error:', error);
        
      },
    });
    
  }

  async ShowCagetory3() {
    const data = await this.Searchservice.GetCart(this.userId).toPromise();
    this.Cat3 = data;

    


    this.Cat3 = this.Cat3.map((value: { text: any; value: any; }) => {
      return new TreeviewItem({ text: value.text, value: value.text, checked: false });
    });

  }
  ClearGird(){

  }

  public clearall() {

    for (let i = 0; i < this.cat3.filterItems.length; i++) {
      this.cat3.filterItems[i].checked = false;
    }

    this.ShowLandingPage(0, "0");
  }

  clearFilter() {
    alert("Clear All");
  }

  getShouldeCost(e: any) {
    //debugger;

    localStorage.setItem("ComapredId", e.childCategory);
    if (e.imagePath == null) {
      localStorage.setItem("imagePath", "../../../assets/No-Image.png");
    }
    else {
      localStorage.setItem("imagePath", e.imagePath);
    }
    this.router.navigate(['/home/shouldcost']);
    // this.router.navigate(['/home/viewspreadsheets']);

  }

  Addtocart(e:any){
    localStorage.setItem("cart", e.key);
    this.router.navigate(['/home/search/ ']);
  }

  showProduct(event: any) {
    let ss = event.categoryId;
    this.router.navigate(['/home/search', event.categoryId]);
  }
  public myFunc(e:any) {
    console.log(e);
  }
  
  public async ShowLandingPage_Home(flag: number, CategoryID: string) {
   // debugger;
    try {

      this.ShowCagetory3();

      this.SearchProductList = [];
  
      this.SpinnerService.show('spinner');
      const data = await this.Searchservice.GetLandingPage(flag, CategoryID).toPromise();
      this.SearchProductList = data;
     // console.log(this.SearchProductList);
      this.SpinnerService.hide('spinner');
    }
    catch (e) {
      this.SpinnerService.hide('spinner');
      //console.log(e);
    }

  }

  backToPreviousPage() {
    this.location.back();
  }

  // Function to open the upload modal
 // uploadDisplay = 'none';
  openUploadModal(): void {
    this.selectedFile=undefined;
    //this.uploadDisplay = 'block';
    this.display = "block";
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
    this.uploadfromdate='';
  }

  // Function to close the upload modal
  closeUploadModal(): void {
   this.display = 'none';
  }
  onFileSelected(event: any): void
  {
    debugger
    this.selectedFile = event.target.files[0];
    if(this.selectedFile !==undefined)
    {
      this.showError7=false
    }
  }

  uploadExcel(): void {
    debugger
    
    if (!this.UploadModalInputValidation()){
    let exceldata:any;
    if (this.selectedFile) {
      
      this.sendExcelDataToAPI(this.selectedFile);
      this.closeUploadModal();
      //alert('File Uploaded Successfully');
   
    } else {
      console.error('No file selected.');
      // You can show an error message to the user if needed
    }
  }
  }

  sendExcelDataToAPI(uploadfile: File): void {
    
    
    console.log(this.uploadfromdate)
    //const adjustedDate = new Date(this.uploadfromdate.getTime() - (this.uploadfromdate.getTimezoneOffset() * 60000));
    //const isoString=adjustedDate.toISOString();
    //debugger
    // Implement your API service method to send the data to the API
    // 
    this.SpinnerService.show('spinner');
    this.Searchservice.uploadExcelData(uploadfile,"cart1",this.userId).subscribe(
      { next: (_res: any) => {
        console.log('Excel data uploaded successfully:', _res);
        this.toastr.success("Data Uploaded Successfully.");
        this.closeUploadModal();
        this.ShowLandingPage(0, "0");
        this.SpinnerService.hide('spinner');
      },
      error: (error: any) => {
        console.error('API call error:', error);
      },}
      
    );
  }

  
  exportToExcel(){
    
  }
  UploadModalInputValidation() {
    debugger
    if ( this.selectedFile ===undefined) {
     this.showError7 = true;
     return true;
    }
    
    else{
      return false;
    }
  }

  Downloadtemplate()
  {
    const excelFilePath = 'assets/BomExcel.xlsx';
    this.downloadExcelFile(excelFilePath,'BomExcelTemplate.xlsx');
  }

  downloadExcelFile(filePath : string,filename : string): void {
    // Path to your Excel file in the assets folder
   fetch(filePath)
     .then(response => response.blob())
     .then(blob => {
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = filename; // Set your desired file name
       document.body.appendChild(a);
       a.click();
       window.URL.revokeObjectURL(url);
     });
 }

}

