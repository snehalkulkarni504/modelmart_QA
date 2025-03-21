import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterServiceService } from 'src/app/SharedServices/master-service.service';
import { Location } from '@angular/common';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import { firstValueFrom } from 'rxjs';
import { Cartlist } from 'src/app/Model/cartlist';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/SharedServices/search.service';

@Component({
  selector: 'app-userhistory',
  templateUrl: './userhistory.component.html',
  styleUrls: ['./userhistory.component.css']
})
export class UserhistoryComponent implements OnInit {

  constructor(
    public router: Router,
    private reportService: ReportServiceService,
    public searchservice: SearchService,
    private location: Location,
    public toastr: ToastrService,
    private route: ActivatedRoute) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };


  }

  
  NA: any = "NA*";
  UserHistory!: FormGroup;
  getData: any;
  textsearch: string = '';
  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };
  userId: any;
  param_CSHeaderId: any;
  param_userId: any;
  param_SCReportId: any;
  cartdetailslist:Cartlist[]=[];

  CreateNewCart:boolean=false;
  AddToCart:boolean=true;
  ShowHideNewCartButton:boolean=true;
  cartNameList:any=[];
  showError2: boolean = false;
  showError1: boolean = false;
  showError4:boolean=false;
  display = "none";
  header: string = '';
  txt_btn: string = '';
  statusValue: boolean = false;
  uniquevalue: any = [];
  cartinserted: any=[];
  cartExist:any=[];
  editModal: boolean = false;
  editRowIndex: any;
  engineDis: any;
  Cartcategory:any;



  ngOnInit(): void {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.userId = localStorage.getItem("userId");

    this.UserHistory = new FormGroup({
      textsearch: new FormControl(),
    });

    this.GetUserHistoryDetails();
  }

  backToPreviousPage() {
    this.location.back();
  }

  getPartId(e: any) {

    this.cartdetailslist=[];
    this.uniquevalue=[];
    const Comparecheckbox = document.getElementsByClassName("SearchCheckbox") as any;
    for (let i = 0; i < Comparecheckbox.length; i++) {
      if (Comparecheckbox[i].checked) {
        
        this.cartdetailslist.push({'chHeaderId':Comparecheckbox[i].id,'Uniqueid':Comparecheckbox[i].value});
        this.uniquevalue.push(Comparecheckbox[i].value);
        console.log(this.cartdetailslist);
      }
    }


  }
  ChekNull(v: any): any {
    if (v == null || v == undefined || v <= 0) {
      return this.NA;
    }
    else {
      return v;
    }
  }
openModal() {
   // this.getCartName();
   
   
    this.searchservice.getCartName(this.userId).subscribe((_result: any) => {
      this.cartNameList = _result;
     
    
    
    if(this.cartNameList.length<=0)
    {
      this.onCartCreate();
    }
  
    this.display = "block";
    if (this.CreateNewCart) {
      this.showError2 = false;
      this.header = 'Create Cart and Save To Add Item';
      this.txt_btn = 'Create New Cart';
      this.engineDis = ""; 
      this.statusValue ;
    } else {
      this.showError2 = false;
      this.header = 'Add To Cart';
      this.txt_btn = 'Save';
      this.engineDis = "";
      this.statusValue;
    }
  });

  };

  onCloseHandled() {

   this.CreateNewCart=false;
   this.AddToCart=true;
   this.ShowHideNewCartButton=true;
   this.showError1=false;
   const comparecheckbox = document.getElementsByClassName("SearchCheckbox") as any;
   let checkcount = 0;

   
   
    for (let i = 0; i < comparecheckbox.length; i++) {
     comparecheckbox[i].checked = false;
     
        // return
     }
     this.cartExist=[];
    this.cartinserted=[];
    this.uniquevalue=[];
    this.cartdetailslist=[];
    this.cartdetailslist.splice(0, this.cartdetailslist.length);
   this.display = "none";

    
  }
  Addcart(){
    console.log(this.uniquevalue);
    //console.log(this.Productvalue);
  }

  getCartName() {
    //this.cartNameList=[];
    this.searchservice.getCartName(this.userId).subscribe((_result: any) => {
      this.cartNameList = _result;

    });
  }

  onCartCreate(){
    this.AddToCart=false;
    this.CreateNewCart=true;
    this.ShowHideNewCartButton=false;
    this.showError1=false;
    this.Cartcategory=undefined;
    this.cartExist=[];
    this.cartinserted=[];

  }

  async onSaveButton() {

    this.cartExist=[];
    this.cartinserted=[];
    if(this.uniquevalue.length<=0){
      this.toastr.error("Model Mart ID should not be blank please select model.");
      this.onCloseHandled();
      return;
    }
    if(!this.Cartcategory)
    {
      this.showError1=true;
      return;
    }

    if(this.CreateNewCart)
    {
      const matches = this.cartNameList.filter((x:any) => x.cartName.toLowerCase().includes(this.Cartcategory.toLowerCase())); 
      if(matches.length>0)
      {
        this.showError2=true;
        return;
      }
    }
    // const resp
    this.display = "none"; 
      const _res=await firstValueFrom(this.searchservice.SaveToCartList(this.cartdetailslist,this.Cartcategory,this.userId));
      if(_res==1)
        {
          console.log(_res);
          
          this.cartdetailslist=[];
            this.uniquevalue=[];
            this.AddToCart=true;
            this.CreateNewCart=false;
            this.ShowHideNewCartButton=true;
            this.showError1=false;
            this.showError2=false;
            this.toastr.success("Item inserted successfully");
            this.onCloseHandled();
            
          
          
        
      
      }
    
        if(_res==2){

        }
        
          
        
  
}

  PushCartDetails(){
    for(let j=0; j<this.cartExist.length;j++ ){
      //alert("ok");
      //alert(this.cartExist[j])

      if(this.uniquevalue.indexOf(this.cartExist[j])===-1){
      this.uniquevalue.push(this.cartExist[j]);
      }
  }
}









  async GetUserHistoryDetails() {
    this.getData = [];
    const data = await this.reportService.GetUserHistoryDetails(this.userId).toPromise();
    this.getData = data;
  }

  viewReport(val: any) {
    
    const Params = {
      param_CSHeaderId: val.CSHeaderID,
      param_SCReportId: val.SCReportId
    };

    this.router.navigate(['/home/shouldcostuserhistory/:data'], { queryParams: Params });
  }



}
