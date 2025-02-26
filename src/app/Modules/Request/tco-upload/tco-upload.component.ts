// import { Component } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgSelectModule } from '@ng-select/ng-select';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { TcoService } from 'src/app/SharedServices/tco.service';


@Component({
  selector: 'app-tco-upload',
  standalone: true,
  imports: [NgSelectModule,NgbModule,FormsModule,CommonModule],
  templateUrl: './tco-upload.component.html',
  styleUrl: './tco-upload.component.css'
})
export class TcoUploadComponent {
  requestID: any;
  UniqueID: any;
  uniqueId: any;
  // TCO_Version: any;

  ngOnInit() {
    debugger
    this.gettcodetails();
  }
  
  UserList: any;
  TCO_Number:any=1;
  TCOID:any=1;
  TCO_Version:any=1;
  Status:any='Insert';
  

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


  validateFields() {
    this.showError0 = !this.selectedRequestID;
    this.showError1 = !this.selectedModelMartID;
  }
  constructor( public TcoService: TcoService) { }

 
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

BulkUpload() {
  this.enableUpload = true;
  this.isBulkUpload = !this.isBulkUpload;

  this.selectedFiles = [];
}

async getMenusUserInfo(username: any) {
  debugger;

  if (this.UserList.length > 0) {;
    this.userFullname = this.UserList[0].FullName;
    localStorage.setItem("userFullName", this.userFullname);
    // this.usernm = this.UserList[0].UserName;
    console.log("userId " + localStorage.getItem("userId"));

    //this.router.navigate(['/home/search/ ']);
  }
  else {
    localStorage.removeItem("userName");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userEmailId");
    localStorage.removeItem("userId");

    // this.router.navigate(['/invaliduser']);

  }

}
Logout() {
  if (confirm("Are you sure? Do you want to Logout?")) {
    localStorage.removeItem("userName");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userEmailId");
    localStorage.removeItem("userId");
    localStorage.removeItem("HopperColumns");
    localStorage.removeItem("Historysearch");
    // this.router.navigate(['/welcome']);

  }
}

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

  // console.log(this.modelMartIDList); 
  // const uniqueRequestIDs = new Set(tcodata.map((item: { RequestHeaderId: any; }) => item.RequestHeaderId));
  // this.requestIDList = tcodata.map((item: { RequestHeaderId: any; }) => {
  //   return {
  //     value: item.RequestHeaderId,  
  //     label: item.RequestHeaderId   
  //   };
  // });

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
  this.showError0 = !this.selectedRequestID;
  this.showError1 = !this.selectedModelMartID;

  try {
    const [filteredTcoDetails, filteredSupplierDetails] = await Promise.all([
      this.TcoService.GetFilteredTcoDetails(this.selectedRequestID, this.selectedModelMartID).toPromise(),
      this.TcoService.GetFilteredSupplierdetails(this.selectedRequestID, this.selectedModelMartID).toPromise()
    ]);
  
    this.tableData = filteredTcoDetails.filter((item: { RequestHeaderId: any; UniqueId: any; }) => 
      item.RequestHeaderId === this.selectedRequestID && item.UniqueId === this.selectedModelMartID
    );
  
    this.SupllierData = filteredSupplierDetails.filter((item: { Request_Id: any; UniqueID: any; }) => 
      item.Request_Id === this.selectedRequestID && item.UniqueID === this.selectedModelMartID
    );
    this.isTableVisible=true;
    
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

uploadFile(): void {
  if (this.selectedFiles.length > 0 && this.SupllierData.length == 0) {
    this.isUploading = true;

    this.TcoService.uploadFile(this.selectedFiles[0], this.TCOID, this.TCO_Version,this.TCO_Number,this.selectedRequestID,this.selectedModelMartID,this.Status)
      .subscribe({
        next: (response) => {
          console.log('File uploaded successfully:', response);
          alert('File uploaded successfully!');
          this.isUploading = false;
          this.clearFileInput();
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
        }
      });
  } else if (this.selectedFiles.length > 0 && this.SupllierData.length > 0) {
    this.SupllierData.forEach(row => {
      // row.isEditing = !row.isEditing;

      this.TcoService.uploadFile(this.selectedFiles[0], row.TCOID, row.TCO_Number, row.TCO_Version,this.selectedRequestID,this.selectedModelMartID,this.Status)
        .subscribe({
          next: (response) => {
            console.log('File uploaded successfully:', response);
            alert('File uploaded successfully!');
            this.isUploading = false;
            this.clearFileInput();
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
          }
        });
    });
  } else {
    alert('Please attach a file and provide necessary details.');
  }
}

editSupplierData(response: any): void {
  // Add your logic here to edit the supplier data based on the response from the server.
  console.log('Editing supplier data:', response);
  // Implement the supplier data edit logic
}


// uploadFile(): void {
//   if (this.selectedFiles.length > 0 && this.SupllierData.length ==0){
//     this.isUploading = true;

//     this.TcoService.uploadFile(this.selectedFiles[0],this.TCO_ID,this.Tco_Number,this.Version)
//       .subscribe({
//         next: (response) => {
//           console.log('File uploaded successfully:', response);
//           alert('File uploaded successfully!');
//           this.isUploading = false;
//           this.clearFileInput();
//         },
//         error: (error) => {
//           console.error('File upload failed:', error);
//           // alert('File upload failed!');
//           if (error.status === 409) {
//             alert('A file with the same name already exists.');
//           } else {
//             alert('File upload failed!');
//           }
//           this.isUploading = false;
//           this.clearFileInput();
//         }
//       });
//   }

//   else if (this.selectedFiles.length > 0 && this.SupllierData.length >0 &&){
//     this.SupllierData.forEach(row => {
//       row.isEditing = !row.isEditing;

//       this.TcoService.uploadFile(this.selectedFiles[0],row.TCO_ID,row.Tco_Number,row.Version)
//       .subscribe({
//         next: (response) => {
//           console.log('File uploaded successfully:', response);
//           alert('File uploaded successfully!');
//           this.isUploading = false;
//           this.clearFileInput();
//         },
//         error: (error) => {
//           console.error('File upload failed:', error);
//           // alert('File upload failed!');
//           if (error.status === 409) {
//             alert('A file with the same name already exists.');
//           } else {
//             alert('File upload failed!');
//           }
//           this.isUploading = false;
//           this.clearFileInput();
//         }
//     });

//   }else{

//     alert('Please attach a file and provide necessary details.');
//   }
// }
// uploadFile(): void {
//   if (this.selectedFiles.length > 0) {
//     this.isUploading = true;

//     if (this.isBulkUpload) {
//       this.TcoService.bulkUpload(this.selectedFiles).subscribe({
//         next: (response) => {
//           console.log('Files uploaded successfully:', response);
//           alert('Files uploaded successfully!');
//           this.isUploading = true;
//           this.clearFileInput();
//         },
//         error: (error) => {
//           console.error('File upload failed:', error);
//           if (error.status === 409) {
//             alert('A file with the same name already exists.');
//           } else {
//             alert('File upload failed!');
//           }
//           this.isUploading = true;
//           this.clearFileInput();
//         }
//       });
//     } else {
//       this.TcoService.uploadFile(this.selectedFiles[0],this.TCO_ID,this.Tco_Number,this.Version).subscribe({
//         next: (response) => {
//           console.log('File uploaded successfully:', response);
//           alert('File uploaded successfully!');
//           this.isUploading = true;
//           this.clearFileInput();
//         },
//         error: (error) => {
//           console.error('File upload failed:', error);
//           if (error.status === 409) {
//             alert('A file with the same name already exists.');
//           } else {
//             alert('File upload failed!');
//           }
//           this.isUploading = true;
//           this.clearFileInput();
//         }
//       });
//     }
//   } else {
//     alert('Please attach a file and provide necessary details.');
//   }
// }

editRow(row: any) {
  // throw new Error('Method not implemented.');
    // row.isEditing = !row.isEditing; // Toggle the editing mode
    // this.enableUpload = row.isEditing; // Enable the upload button when editing

    this.enableUpload =true;
    this.TCO_Version=row.TCO_Version;
    this.TCOID=row.TCOID;
    this.TCO_Number=row.TCO_Number;
    this.requestID=this.selectedRequestID;
    this.uniqueId=this.selectedModelMartID;
    this.Status="change_version";

  
  }
  
  
  addRow(row: any) { 
// Toggle the editing mode
    // this.isUploading=true;
    this.enableUpload =true;

    this.TCO_Version=row.TCO_Version;
    this.TCOID=row.TCOID;
    this.TCO_Number=row.TCO_Number;
    this.requestID=this.selectedRequestID;
    this.uniqueId=this.selectedModelMartID;
    this.Status="update";
  }

  backToPreviousPage() {
    throw new Error('Method not implemented.');
    }

}
