import { Component, OnInit, ViewChild } from '@angular/core';
import {  FormGroup } from '@angular/forms';
import { Router} from '@angular/router';
import { TreeviewConfig } from '@charmedme/ngx-treeview';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { SearchService } from 'src/app/SharedServices/search.service';
import { Location } from '@angular/common'
import {  ToastrService } from 'ngx-toastr';
import { BomService } from 'src/app/SharedServices/bom.service';
import { Filters } from '../../Model/filters';


@Component({
  selector: 'app-bomdetails',
  standalone: false,
  // imports: [],
  templateUrl: './bomdetails.component.html',
  styleUrl: './bomdetails.component.css'
})

export class BomdetailsComponent {

  constructor(public router: Router,
    public Searchservice: SearchService,
    public adminService: AdminService,
    public bomservice:BomService,
    public SpinnerService: NgxSpinnerService,
    private location: Location,
    private toastr:ToastrService) {
    
  }

  ngOnInit(): void {
    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }
    this.userId = localStorage.getItem("userId");
    this.fetchprogramnames();

  }

  //-----------------------------------------------------------------------------------------------------------------------
  userId: any;
  SearchboxForm!: FormGroup;
  newprogramname:any;
  modalprogram = false;
  allprogramdata:any;
  programdata:any;
  cartname:any
  modalcart = false;


async addnewprogram()
{
  debugger;
  if(this.newprogramname)
  {
    try
    {
      const data = await this.bomservice.addprgramname(this.newprogramname,parseInt(this.userId,10)).toPromise();
      if(data==1)
      {
        this.modalprogram=false;
        this.newprogramname=null;
        this.toastr.success("Program Added Successfully")
        this.fetchprogramnames();
      }
      else if(data==0)
      {
        this.toastr.warning("Program name already exist")
      }
      else
      {
        this.toastr.error("Failed to add Programm name")
      }
    }
    catch
    {
      console.log("error connecting to api")
    }
  }
  else 
  {
    console.log("enter program name");
  }
}
openModal1() {
  debugger;
  this.modalprogram = true;
}
closeModal1() {
  this.modalprogram = false;
}



openModal2() {
  debugger;
  this.modalcart = true;
  //this.fetchprogramnames();
  this.onaddcartprogram()
  
}
closeModal2() 
{
  this.modalcart = false;
  this.cartname='';

}

async fetchprogramnames()
{
  debugger;
  const data=await this.bomservice.fetchprogramname(parseInt(this.userId)).toPromise();
  this.allprogramdata=data;
}

addcartprogram:any;
onaddcartprogram()
{
  debugger;
  this.addcartprogram = this.allprogramdata
    .filter((i: any) => i.createdby == parseInt(this.userId))
    .map((i: any) => ({programname:i.programname, programid:i.programid})
    );
}

selectprogram(event:any)
{
  debugger;
  this.programdata=event;
}

async addcartname()
{
  debugger;
  const data= await this.bomservice.addcartame(this.programdata.programid,this.cartname,parseInt(this.userId)).toPromise();
  if(data==1)
  {
    this.modalcart=false;
    this.toastr.success("Cart added Successfully");
    this.getcartname(this.programdata.programid);
  }
  else if(data==0)
  {
    this.toastr.warning("Cart already exist");
  }
  else
  {
    this.toastr.error("Failed to add Cart");
  }

  this.cartname='';

}

//---------------------------------------------------------------------------

cartlists: { [key: string]: any[] } = {}; 
visiblecartlist: { [key: string]: boolean } = {}; 
selectedcheckbox:string | null = null
cartdetailshead:any
toggleviewchild(event:any)
{
  this.cartdetailshead='( '+event.programname+' )';
  if(this.selectedcheckbox===event.programid)
  {
    this.selectedcheckbox=null;
    this.visiblecartlist[event.programid]=false;
    this.cartlist=null;
  }
  else
  {
    this.selectedcheckbox=event.programid;
    this.visiblecartlist={};
    this.visiblecartlist[event.programid]=true;
    this.getcartname(event.programid);
  }

}

cartlist:any;
selectedprogramid:any;
async getcartname(programId: string) {
    this.selectedprogramid=programId;
    try {
        const data = await this.bomservice.getcartlist(programId).toPromise();
        this.cartlists[programId] = data;
        this.cartlist = data;
    } catch (error) {
        console.error("Error fetching cart names:", error);
    }
}

copycartmodal=false;
copycartlist:any;
fromcopycartid:any
tocopycartid:any
async copycart()
{
  debugger;
  const formdata = new FormData();
  formdata.append("programid",this.selectedprogramid);
  formdata.append("fromcartid",this.fromcopycartid);
  formdata.append("tocartid",this.tocopycartid);
  formdata.append("createdby",this.userId)
  const data =await this.bomservice.copycart(formdata).toPromise();
  debugger;
  console.log("CopcartID:-", this.fromcopycartid,this.selectedprogramid);
  this.fromcopycartid=null;
  this.tocopycartid=null;
  this.copycartmodal=false;
  if(data==0)
  {
    this.toastr.error("Failed to copy cart");
  }
  else
  {
    this.toastr.success("Cart Copied Sucessfully");
    this.getcartname(this.selectedprogramid);
  }
}

tocopycart:any;
opencopycart(cartIdToExclude: string | number,cartname:any) {
  this.tocopycart=cartname
  this.copycartmodal = true;
  this.tocopycartid = cartIdToExclude;
  this.copycartlist = this.cartlist
    .filter((i: any) => i.cartId != cartIdToExclude)
    .map((i: any) => ({cartName:i.cartName, cartId:i.cartId})
    );

  console.log("opencopycart:-", this.copycartlist);
}


closecopycart()
{
  this.copycartmodal=false;
  this.fromcopycartid=null;
  this.tocopycartid=null;
}



onroute(cart:any) {
  const Params = {
    cartid: cart.cartId,
    cartname: cart.cartName
  };

  this.router.navigate(['/home/cartdetails'], { queryParams: Params });
}

backToPreviousPage() {
  this.location.back();
}

}

