import { Observable } from 'rxjs';
import { DatePipe, Location } from '@angular/common';
import { devOnlyGuardedExpression } from '@angular/compiler';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { environment } from 'src/environments/environments';
import { UpdateRequest } from 'src/app/Model/update-request';
import { SearchService } from 'src/app/SharedServices/search.service';

@Component({
  selector: 'app-should-cost-request',
  templateUrl: './should-cost-request.component.html',
  styleUrls: ['./should-cost-request.component.css']
})
export class ShouldCostRequestComponent implements OnInit {
  ShouldCostRequest!: FormGroup;
  fileName: string = "Attach File";
  filesdsdd: File[] = [];
  selectedFiles: File[] = [];
  Comments: any = '';
  RefresModelComments: any = '';
  IsRefresModelComments = false;
  FolderLink: any = '';
  RequesterName: any;
  RequesteDate: any = new Date();
  userName: any;
  userId: any;
  Btn_Text: any;
  UniqueId: any;
  // ProjectName :any;
  RequestUsername: any;
  RequestId: any;
  Status: any;
  CreatedDate: any;
  updateRequest: UpdateRequest[] = [];
  EmailForRequestUpdate: any;
  ResubmitRequest = true;

  @ViewChild('myFile') myInputFile!: ElementRef;

  constructor(public adminservice: AdminService,
    public searchservice: SearchService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private SpinnerService: NgxSpinnerService,
    private renderer: Renderer2,) {
    this.route.params.subscribe(param => {
      this.UniqueId = param['request'];
    });
    this.route.queryParams.subscribe(params => {
      this.RequestId = params['RequestId'];

    });
    console.log(this.RequestId);
  }

  ngOnInit() {
    

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }
    if (this.RequestId === undefined) {
      this.Btn_Text = 'Submit';
      this.ResubmitRequest = true;

    }
    else {
      this.Btn_Text = 'Update';
      this.ResubmitRequest = false;
      this.GetResubmitRequesterData();
    }

    this.userName = localStorage.getItem("userName");
    this.userId = localStorage.getItem("userId");

    this.RequesterName = localStorage.getItem("userFullName");
    this.RequesteDate = new Date();
    this.RequesteDate = this.datePipe.transform(this.RequesteDate, 'MMM dd yyyy');
    
    console.log(this.UniqueId);
    if (this.UniqueId == ':request') {
      this.RefresModelComments = "";
      this.IsRefresModelComments = false;
      //this.Comments = "";
    }
    else {
      this.IsRefresModelComments = true;
      this.RefresModelComments = 'Model refresh for ' + localStorage.getItem("ProjectName");
      //this.Comments = 'Model refresh for ' + localStorage.getItem("ProjectName");
    }
  }

  ResubmitRequesterData: any;

  async GetResubmitRequesterData() {
    
    const data = await this.adminservice.GetResubmitRequesterData(this.RequestId).toPromise();
    this.ResubmitRequesterData = data;
    this.RequestUsername = this.ResubmitRequesterData[0].UserName;
    this.CreatedDate = this.ResubmitRequesterData[0].CreatedOn;
    this.Status = this.ResubmitRequesterData[0].Status;

  }


  async onChange(event: any) {
    this.selectedFiles = [];
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      ///if (fileType === 'pdf' || fileType === 'excel' || fileType === 'image') {
      this.selectedFiles.push(file);
      //}
    }
  }

  cmd: any;
  async upload() {
    console.log("Select File " + this.selectedFiles.length);
    if (this.Status != 'Rejected') {
      if (this.selectedFiles.length <= 0) {
        this.toastr.warning("Please Select File");
        this.renderer.selectRootElement('#myFile').focus();
        return
      }
    }
    if (this.Comments == '' || this.Comments == undefined) {
      this.toastr.warning("Please Enter Comments");
      this.renderer.selectRootElement('#floatingTextarea').focus();
      return
    }

    this.SpinnerService.show('spinner');
    this.cmd = this.RefresModelComments + ' ' + this.Comments;
    if (this.Btn_Text == 'Submit') {
      this.SpinnerService.show('spinner');
      const data = await this.adminservice.SendShouldCostRequest(this.selectedFiles, this.userId, this.cmd, this.FolderLink).toPromise();
      if (data == true) {
        this.toastr.success("Should Cost Request Sent successfully");
        this.SpinnerService.hide('spinner');
      }
      else {
        this.toastr.error("Should Cost Request not Sent");
        this.SpinnerService.hide('spinner');
      }

      console.log(this.FolderLink);

      const da = await this.adminservice.SendMail(this.userId, this.cmd, this.FolderLink).toPromise();
      if (da) {
        this.toastr.success("Mail Sent successfully");
      }
      else {
        this.toastr.error("Mail not Sent");
      }

      this.clear();
      this.SpinnerService.hide('spinner');
    }
    else {
      this.SpinnerService.show('spinner');
      this.updateRequest = [];
      console.log(this.updateRequest)
      const data2 = await this.searchservice.UpdateShouldCostRequest(this.selectedFiles, this.userId, this.cmd, this.FolderLink, this.RequestId, this.Status).toPromise();
      if (data2) {
        this.toastr.success("Request Status Sent successfully");
      }
      else {
        this.toastr.error("Request Can not Sent");
      }

      this.SpinnerService.hide('spinner');

      const da = await this.adminservice.ReSubmittedSendEmail(this.userId, this.cmd, this.FolderLink, this.RequestId).toPromise();
      if (da) {
        this.toastr.success("Mail Sent successfully");
      }
      else {
        this.toastr.error("Mail not Sent");
      }

      this.clear();
      this.SpinnerService.hide('spinner');


    }

  }


  clear() {
    this.selectedFiles = [];
    this.Comments = '';
    this.FolderLink = '';
    this.myInputFile.nativeElement.value = "";
  }

  downloadInputRequestForm() {
    this.toastr.success("Request Form donwloadling start");
    var filename = "Should_Cost_Request_Form.xlsm";
    this.adminservice.DownloadInputRequestForm(filename).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    });

  }


  backToPreviousPage() {
    this.location.back();
  }


}
