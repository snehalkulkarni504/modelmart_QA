// import { Component } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { TcoService } from 'src/app/SharedServices/tco.service';
import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
// import { Chart } from 'chart.js';



@Component({
  selector: 'app-tco-upload',
  standalone: true,
  imports: [NgSelectModule,NgbModule,FormsModule,CommonModule,NgxSpinnerModule],
  templateUrl: './tco-upload.component.html',
  styleUrl: './tco-upload.component.css'
})
export class TcoUploadComponent {
  requestID: any;
  UniqueID: any;
  uniqueId: any;
  userId: any;
  // TCO_Version: any;

  // ngOnInit() {
  //   debugger
  //   this.userId = localStorage.getItem("userId");
  //   this.gettcodetails();
  // }
  
  UserList: any;
  TCO_Number:any=1;
  TCOID:any=1;
  TCO_Version:any=1;
  Status:any='Insert';
  selectedSheetType: string = 'default';

  selectedRequestID: any;
  selectedModelMartID: any;

  tableData: any[] = [];
  SupllierData: any[] = [];
  tcodata: any;

  requestIDList :any;
  modelMartIDList:any;

  selectedFile: File | null = null;
  selectedFiles: File[] = [];
  @ViewChild('fileInput') fileInput: any;

  showError0 = false;
  showError1 = false;
  showError11 = false;
  selectedID: any;
  userFullname:any;

  enableUpload: boolean = false;
  isUploading: boolean = false;
  isTableVisible: boolean = false;
  isBulkUpload: boolean = false;
  showDetails: boolean = false;
row: any;

showModal = false;
  selectedSheet: string = 'old';
 
 
  SheetType = [
    { value: '', label: 'Select' },
    { value: 'OldSheet', label: 'Old Sheet' },
    { value: 'NewSheet', label: 'New Sheet' }
  ];


  validateFields() {
    this.showError0 = !this.selectedRequestID;
    this.showError1 = !this.selectedModelMartID;
  }
  constructor( public TcoService: TcoService ,
    private location : Location ,
    private SpinnerService: NgxSpinnerService,
    private actroute:ActivatedRoute,
    private toaster:ToastrService ) { }

  ngOnInit() {
    debugger;
    this.gettcodetails();
 
    this.actroute.queryParams.subscribe(params => {
      // const UniqueId = params['UniqueId'] || null; 
      // const RequestId = params['RequestId'] || null;
      const UniqueId = params['UniqueId'] ? atob(params['UniqueId']) : null; // Base64 decoding
      const RequestId = params['RequestId'] ? atob(params['RequestId']) : null;

        if (UniqueId && RequestId) {
          this.handleRoutingFlow(UniqueId, RequestId);
          this.userId = localStorage.getItem('userId');
          this.gettcodetails();
        }

    });
  }


  async handleRoutingFlow(uniqueId: any, requestId: any) {
    this.SpinnerService.show('spinner');
    debugger;
    this.selectedRequestID= requestId;
    this.selectedModelMartID = uniqueId;

  
    this.showError0 = !uniqueId;
    this.showError1 = !requestId;
  
  
    if (this.showError0) {
      console.error('UniqueId is missing');
      return;
    }
  
    try {
   
      const [filteredTcoDetails, filteredSupplierDetails] = await Promise.all([
        this.TcoService.GetFilteredTcoDetails(this.selectedModelMartID, this.selectedRequestID).toPromise(),
        this.TcoService.GetFilteredSupplierdetails(this.selectedModelMartID, this.selectedRequestID).toPromise()
      ]);
  
      this.tableData = filteredTcoDetails.filter((item: { UniqueId: any; }) => 
        item.UniqueId === this.selectedModelMartID
      );
      
  
      this.SupllierData = filteredSupplierDetails.filter((item: { UniqueID: any; }) => 
        item.UniqueID === this.selectedModelMartID
      );
      this.SpinnerService.hide('spinner');
  
   
      this.isTableVisible = true;
      this.showDetails = true;
  
      console.log('TCO Details:', this.tableData);
      console.log('Supplier Details:', this.SupllierData);
  
    } catch (error) {
      console.error('Error handling routing flow:', error);
    }

    console.log("route req id:- ",this.selectedRequestID)
  }

 
onFileSelected(event: any) {
  // const file = event.target.files[0];
  const files: FileList = event.target.files;
  if (!files) return;

  const allowedTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  ];

  this.selectedFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid Excel file (.xls or .xlsx)");
        return;
    }     
      this.selectedFiles.push(files[i]);
    }
}

// BulkUpload() {
//   debugger
//   this.isBulkUpload = !this.isBulkUpload;
//   if (confirm("Are you sure want to start Bulk Upload")) {
//   this.TcoService.Bulkupload(this.userId) .subscribe({
//         next: (response) => {
//           alert('Bulk Files uploaded successfully!');
//           // window.location.reload();
//         },
//         error: (error) => {
//           if (error.status === 409) {
//             alert('A Bulk File with the same name already exists.');
//           } else {
//             alert('Bulk Files upload failed!');
//           }

//           // window.location.reload();
//         }
//       });
//     }
// }
async gettcodetails() {
  debugger;
  const tcodata = await this.TcoService.GetTcoDetails().toPromise();

  // Assuming tcodata is an array of objects with a property MMID
  this.modelMartIDList = tcodata.map((item: { UniqueId: any; }) => {
    return {
      value: item.UniqueId,  // or whatever unique identifier you want to use
      label: item.UniqueId   // or whatever you want to display in the dropdown
    };
  });


const uniqueRequestIDs = new Set(tcodata.map((item: { RequestHeaderId: any; }) => item.RequestHeaderId));

this.requestIDList = Array.from(uniqueRequestIDs).map((requestId) => {
    return {
        value: requestId,
        label: requestId
    };
});


}


async submitForm() {

  debugger
  this.userId = localStorage.getItem("userId");
  this.showError0 = !this.selectedRequestID;
  this.showError1 = !this.selectedModelMartID;

  console.log("Selected Request ID:", this.selectedRequestID);
  console.log("Selected ModelMart ID:", this.selectedModelMartID);

  try {
    const [filteredTcoDetails, filteredSupplierDetails] = await Promise.all([
      this.TcoService.GetFilteredTcoDetails(this.selectedRequestID, this.selectedModelMartID).toPromise(),
      this.TcoService.GetFilteredSupplierdetails(this.selectedRequestID, this.selectedModelMartID).toPromise()
    ]);
    console.log("Filtered TCO Details (before filtering):", filteredTcoDetails);
    console.log("Filtered Supplier Details (before filtering):", filteredSupplierDetails);

    
    this.tableData = filteredTcoDetails.filter((item: { RequestHeaderId: any; UniqueId: any; }) => 
      item.RequestHeaderId === this.selectedRequestID.value && item.UniqueId === this.selectedModelMartID.value
      
    );
  
    this.SupllierData = filteredSupplierDetails.filter((item: { Request_Id: any; UniqueID: any; }) => 
      item.Request_Id === this.selectedRequestID.value && item.UniqueID === this.selectedModelMartID.value
    );

    
    this.isTableVisible=true;
    this.showDetails = true;
    
    console.log('TCO Details:', this.tableData);
    console.log('Supplier Details:', this.SupllierData);
  } catch (error) {
    console.error('Error fetching filtered data:', error);
  }
  
  
  
}
clearFileInput(): void {
  // this.selectedFile = null;
  this.selectedFiles = [];
  this.fileInput.nativeElement.value = ''; // Step 2: Clear the file input element
}


upload(): void {
  debugger;
  if (!this.selectedSheetType) {
    alert('Please select a sheet type.');
    return;
  }

  switch (this.selectedSheetType) {
    case 'type1':
      this.uploadFile();
      break;
    case 'type2':
      this.uploadNewFile();
      break;
    default:
      alert('Please select a correct sheet type.');
  }
}

uploadFile(): void {
  debugger;


  if (this.selectedFiles.length > 0 && this.SupllierData.length == 0) {
    this.isUploading = true;
    this.SpinnerService.show('spinner');

    this.TcoService.uploadFile(this.selectedFiles[0], this.TCOID, this.TCO_Version,this.TCO_Number,this.selectedRequestID.value,this.selectedModelMartID.value,this.Status)
      .subscribe({
        next: (response) => {
          console.log('File uploaded successfully:', response);
          //alert('File uploaded successfully!');
          this.isUploading = false;
          this.clearFileInput();
          this.SpinnerService.hide('spinner');
          this.toaster.success("TCO Sheet Uploaded Successfully")
          this.submitForm();
          // window.location.reload();
        },
        error: (error) => {
          console.error('File upload failed:', error);
          if (error.status === 409) {
            alert('A file with the same name already exists.');
          } else {
            //alert('File upload failed!');
            this.toaster.error("File upload failed!")
          }
          this.isUploading = false;
          this.clearFileInput();
          this.SpinnerService.hide('spinner');
          //this.toaster.error("Error while uploading TCO Sheet")
          // window.location.reload();
        }
      });
  } else if (this.selectedFiles.length > 0 && this.SupllierData.length > 0) {
    
      this.SpinnerService.show('spinner');
      // row.isEditing = !row.isEditing;

      this.TcoService.uploadFile(this.selectedFiles[0], this.TCOID, this.TCO_Number, this.TCO_Version,this.selectedRequestID.value,this.selectedModelMartID.value,this.Status)
        .subscribe({
          next: (response) => {
            console.log('File uploaded successfully:', response);
           this.toaster.success("Tco sheet UPloaded Successfully")
            this.isUploading = false;
            this.clearFileInput();
            this.submitForm();
            this.SpinnerService.hide('spinner');

          },
          error: (error) => {
            console.error('File upload failed:', error);
            if (error.status === 409) {
              this.toaster.warning('A file with the same name already exists')
            } else {
              this.toaster.error('File upload failed!')
            }
            this.isUploading = false;
            this.clearFileInput();
            this.SpinnerService.hide('spinner');
          }
        });
   
  } 
  else {
    alert('Please attach a file and provide necessary details.');
    window.location.reload();
  }
}




uploadNewFile(): void {
  debugger;

  if (this.selectedFiles.length > 0 && this.SupllierData.length == 0) {
    this.isUploading = true;
    this.SpinnerService.show('spinner');

    this.TcoService.uploadNewFile(this.selectedFiles[0], this.TCOID, this.TCO_Version,this.TCO_Number,this.selectedRequestID.value,this.selectedModelMartID.value,this.Status)
      .subscribe({
        next: (response) => {
          console.log('File uploaded successfully:', response);
          this.toaster.success("File uploaded successfully!")
          //alert('File uploaded successfully!');
          this.isUploading = false;
          this.clearFileInput();
          this.submitForm();
          this.SpinnerService.hide('spinner');
          // window.location.reload();
        },
        error: (error) => {
          console.error('File upload failed:', error);
          if (error.status === 409) {
            alert('A file with the same name already exists.');
          } else {
            alert('File upload failed!');
          }
          this.isUploading = false;
          this.clearFileInput();
          this.SpinnerService.hide('spinner');
          // window.location.reload();
        }
      });
  } else if (this.selectedFiles.length > 0 && this.SupllierData.length > 0) {
    this.SupllierData.forEach(row => {
      this.SpinnerService.show('spinner');
      // row.isEditing = !row.isEditing;

      this.TcoService.uploadNewFile(this.selectedFiles[0], row.TCOID, row.TCO_Number, row.TCO_Version,this.selectedRequestID.value,this.selectedModelMartID.value,this.Status)
        .subscribe({
          next: (response) => {
            console.log('File uploaded successfully:', response);
            //alert('File uploaded successfully!');
            this.toaster.success("File uploaded successfully!")
            this.isUploading = false;
            this.clearFileInput();
            this.submitForm();
            this.SpinnerService.hide('spinner');
            // window.location.reload();
          },
          error: (error) => {
            console.error('File upload failed:', error);
            if (error.status === 409) {
              alert('A file with the same name already exists.');
            } else {
              alert('File upload failed!');
            }
            this.isUploading = false;
            this.clearFileInput();
            this.SpinnerService.hide('spinner');
            // window.location.reload();
          }
        });
    });
  } else {
    alert('Please attach a file and provide necessary details.');
    window.location.reload();
  }
}
// editSupplierData(response: any): void {
//   // Add your logic here to edit the supplier data based on the response from the server.
//   console.log('Editing supplier data:', response);
//   // Implement the supplier data edit logic
// }


editRow(row: any) {
  // throw new Error('Method not implemented.');
    // row.isEditing = !row.isEditing; // Toggle the editing mode
    // this.enableUpload = row.isEditing; // Enable the upload button when editing
  
    this.enableUpload =true;
    this.TCO_Version=row.TCO_Version;
    this.TCOID=row.TCOID;
    this.TCO_Number=row.TCO_Number;
    this.requestID=this.selectedRequestID.value;
    this.uniqueId=this.selectedModelMartID.value;
    this.Status="change_version";
  }
  
  
  addRow(row: any) { 
// Toggle the editing mode
    // this.isUploading=true;
    this.enableUpload =true;

    this.TCO_Version=row.TCO_Version+1;
    this.TCOID=row.TCOID;
    this.TCO_Number=row.TCO_Number;
    this.requestID=this.selectedRequestID.value;
    this.uniqueId=this.selectedModelMartID.value;
    this.Status="update";
  }
  
  newaddRow() { 
    // Toggle the editing mode
        // this.isUploading=true;
        this.enableUpload =true;
        this.requestID=this.selectedRequestID.value;
        this.uniqueId=this.selectedModelMartID.value;
        this.Status="Insert";
      }

  backToPreviousPage() {
    this.location.back();
  }

  closePopup() {
    this.showModal= false;
  }

  BulkUpload() {
    debugger
    this.showModal=true;
    this.enableUpload = true;
   
  }
   
  BulkFileUpload() {
    debugger;
    this.showModal=true;
    if (confirm("Are you sure want to start Bulk Upload")) {
    this.SpinnerService.show('spinner');
    let uploadService;
   
      if (this.selectedSheet === "OldSheet") 
      {
        uploadService = this.TcoService.OldSheetBulkupload(this.userId)
        .subscribe({
          next: (response) => {
            console.log('File uploaded successfully:', response);
            //alert('File uploaded successfully!');
            this.toaster.success("File uploaded successfully!")
            this.isUploading = false;
            this.clearFileInput();
            this.SpinnerService.hide('spinner');
          },
          error: (error) => {
            console.error('File upload failed:', error);
            if (error.status === 409) {
              alert('A file with the same name already exists.');
            } else {
              alert('File upload failed!');
            }
            this.isUploading = false;
            this.clearFileInput();
            this.SpinnerService.hide('spinner');
          }
        });

      } 
      else if (this.selectedSheet === "NewSheet") 
      {
        uploadService = this.TcoService.NewSheetBulkupload(this.userId)
        .subscribe({
          next: (response) => {
            console.log('File uploaded successfully:', response);
            //alert('File uploaded successfully!');
            this.toaster.success("File uploaded successfully!")
            this.isUploading = false;
            this.clearFileInput();
            this.SpinnerService.hide('spinner');
          },
          error: (error) => {
            console.error('File upload failed:', error);
            if (error.status === 409) {
              alert('A file with the same name already exists.');
            } else {
              alert('File upload failed!');
            }
            this.isUploading = false;
            this.clearFileInput();
            this.SpinnerService.hide('spinner');
            // window.location.reload();
          }
        });
      } 
      else 
      {
        alert("Bulk Files upload failed!");
        return;
      }
   
       
      }
  }
   
  



}
