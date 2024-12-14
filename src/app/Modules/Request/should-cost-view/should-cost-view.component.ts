import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Data from "../../../Model/tableData.json"
import { SearchService } from 'src/app/SharedServices/search.service';
import { UpdateRequest, UpdateRequestbyAdmin } from 'src/app/Model/update-request';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { EmailForRequestUpdate } from 'src/app/Model/email-for-request-update'
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-should-cost-view',
  templateUrl: './should-cost-view.component.html',
  styleUrls: ['./should-cost-view.component.css']
})

export class ShouldCostViewComponent implements OnInit {
  usedData: any = []
  filtertableData: any
  requestId: any;
  requestHeaderId: any;
  data: any;
  tableData: any = [Data]
  statusData: any = [];
  updateRequest: UpdateRequest[] = [];
  UpdateRequestbyAdmin: UpdateRequestbyAdmin[] = [];
  EmailForRequestUpdate: any;
  ModifiedBy: any;
  comments: any;
  ShouldCostView!: FormGroup;
  Status: any = "Open";

  @ViewChild('selectStatus') searchElement!: ElementRef;

  constructor(private route: ActivatedRoute,
    public searchservice: SearchService,
    public router: Router,
    public adminservice: AdminService,
    private toastr: ToastrService,
    private location: Location, private renderer: Renderer2) {
    this.route.params.subscribe(param => {
      this.requestHeaderId = param['data']

    })
  }
  ngOnInit(): void {
    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.ModifiedBy = localStorage.getItem("userId")
    //this.requestHeaderId=this.route.snapshot.paramMap.get('data')
    // console.log('data ',this.data)


    this.ShouldCostView = new FormGroup({
      comments: new FormControl()
    });

    this.getStatusDetails();
    //this.tableData = this.tableData[0]['Data'];
    //this.filter()

  }
  // filter() {
  //   var filter_array = this.tableData.filter((x: any) => x.RequestHeaderId == this.data);
  //   this.array = [...filter_array]
  //   //console.log("filter_array", filter_array);
  // }

  GetStatus(e: any) {
    if (e.srcElement.value == "") {
      this.toastr.warning("Please Select Status");
      this.Status = "";
      return
    }
    this.Status = e.srcElement.value
  }


  async getStatusDetails() {
    const data = await this.searchservice.GetRequestGenDataById(this.requestHeaderId).toPromise();
    this.data = data;

    console.log('data :', this.data)
    //   this.status.nativeElement.value = this.statusData[0].status;
  }

  async submit() {

    if (this.Status === "" || this.Status === "Open") {
      this.toastr.warning("Please Select Status");
      this.searchElement.nativeElement.focus();
      //this.renderer.selectRootElement('#dropdown1').focus();
      return
    }

    if (this.comments == undefined || this.comments == "") {
      this.toastr.warning("Please Enter Comments");
      this.renderer.selectRootElement('#commentss').focus();
      return
    }

    this.UpdateRequestbyAdmin = [];
    this.UpdateRequestbyAdmin.push({
      Status: this.Status,
      RequestHeaderId: this.requestHeaderId,
      ModifiedBy: this.ModifiedBy,
      SCTeamComments: this.comments,
    })
    console.log(this.UpdateRequestbyAdmin)
    const data2 = await this.searchservice.updateRequestGenerationData(this.UpdateRequestbyAdmin).toPromise();
    if (data2) {
      this.toastr.success("Request Status Sent successfully");
    }
    else {
      this.toastr.error("Request Can not Sent");
    }

    this.EmailForRequestUpdate = {
      RequesterId: this.requestHeaderId,
      Comments: this.comments,
      PreviousStatus: this.data[0].status,
      Status: this.Status,
      RequestDate: this.data[0].createdOn,
      RequesterName: this.ModifiedBy
    };

    const data1 = await this.adminservice.SendEmailForRequestUpdate(this.ModifiedBy, this.requestHeaderId).toPromise()
    if (data1) {
      this.toastr.success("Mail Sent successfully");
    }
    else {
      this.toastr.error("Mail not Sent");
    }

    this.comments = "";


  }

  backToPreviousPage() {
    this.location.back();
  }

}
