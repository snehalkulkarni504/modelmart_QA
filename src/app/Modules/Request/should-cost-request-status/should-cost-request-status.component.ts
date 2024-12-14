import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounce, debounceTime } from 'rxjs';
import * as Data from "../../../Model/tableData.json"
import { SearchService } from 'src/app/SharedServices/search.service';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-should-cost-request-status',
  templateUrl: './should-cost-request-status.component.html',
  styleUrls: ['./should-cost-request-status.component.css']
})
export class ShouldCostRequestStatusComponent {
  ShouldCostStatus!: FormGroup;
  ToDate: any;
  FromDate: any; //  Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  tableData: any = [Data]
  searchText = ""

  filterdata: any = []
  searchForm = new FormControl(" ");
  search_text: any;
  data: any;
  Reportdata: any;
  filteredData: any;
  From_Date: any;
  To_Date: any;
  Status: any = "All";
  
  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };
  textsearch: string = '';
  UserID:any;
  RoleID :any;

  refreshmodel = 'Model refresh';

  constructor(public adminservice: AdminService,
     public router: Router,
      private toastr: ToastrService,
       private location:Location,
    private SpinnerService: NgxSpinnerService,
  ) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
  }

  ngOnInit() {
    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    // this.tableData = this.tableData[0]['Data'];
    // this.data = this.tableData;

    this.ShouldCostStatus = new FormGroup({
      FromDate: new FormControl(),
      ToDate: new FormControl(),
      textsearch: new FormControl()
    });

    this.View();
  }


  async View() {
    this.SpinnerService.show('spinner');
    
    if (this.FromDate == undefined || this.FromDate == "") {
      // this.toastr.warning("Please select From Date");
      // return;
      this.FromDate = 'undefined';
    }
    if (this.ToDate == undefined || this.ToDate == "") {
      // this.toastr.warning("Please select To Date");
      // return;
      this.ToDate = 'undefined';
    }
    // if (this.Status == undefined || this.Status == '') {
    //   this.toastr.warning("Please select Status");
    //   return;
    // }
 

    this.UserID = localStorage.getItem("userId");
    this.RoleID = localStorage.getItem("roleId");

    const data = await this.adminservice.GetRequestGenStatus(this.FromDate, this.ToDate, this.Status,this.UserID,this.RoleID).toPromise();
    this.Reportdata = data;
    if (this.Reportdata.length <= 0) {
      this.SpinnerService.hide('spinner');
      this.toastr.warning("Record Not Found");
      return;
    }

    for(var i= 0 ;  i < this.Reportdata.length ; i++){
      if( String(this.Reportdata[i].SMComments).includes(this.refreshmodel)){
        this.Reportdata[i].IsRefresh = true ;
      }
      else{
        this.Reportdata[i].IsRefresh = false;
      }
    }


    this.SpinnerService.hide('spinner');
    console.log('report data',this.Reportdata);
  }

  GetStatus(e: any) {
    this.Status = e.srcElement.value
    this.View();
  }

  async DownloadExcel(data: any) {
 
    // var id = data.uniqueId;
    var staticUrl = environment.apiUrl_Admin + 'DownloadExcel?fname=' + data.ExcelFileName;
    console.log(staticUrl);
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', staticUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
      if (this.status == 200) {
        var myBlob = this.response;
        var reader = new window.FileReader();
        reader.readAsDataURL(myBlob);
        reader.onloadend = function () {
          const base64data = reader.result;

          var file = new Blob([myBlob], { type: 'application/zip' });
          var fileURL = URL.createObjectURL(file);

          var fileLink = document.createElement('a');
          fileLink.href = fileURL;

          fileLink.download ='Request Id ' + data.RequestHeaderId +' '+ data.UserName;

          fileLink.click();
        }
      }
      else {
         alert("File Not Fount");
      }
    };
    xhr.send();
  }

  backToPreviousPage() {
    this.location.back();
  }
  
  UpdateRequest(RequestId: string){
    
    const Params = {
      RequestId: RequestId
    };
    this.router.navigate(['/home/shouldcostrequest/:request'],{queryParams:Params})
  }

}
