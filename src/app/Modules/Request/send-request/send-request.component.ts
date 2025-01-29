import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeviewConfig, TreeviewItem } from '@charmedme/ngx-treeview';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ExcelData } from 'src/app/Model/excel-data';
import { UpdateSendRequest } from 'src/app/Model/update-send-request';
//import { UploadSendRequestFile } from 'src/app/Model/upload-send-request-file';
import { RequestFileUploadService } from 'src/app/SharedServices/request-file-upload.service';
import { SearchService } from 'src/app/SharedServices/search.service';
import { Location } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-send-request',
  templateUrl: './send-request.component.html',
  styleUrls: ['./send-request.component.css']
})
export class SendRequestComponent implements OnInit {


  @ViewChild("takeInputExcel", { static: false }) takeInputExcel!: ElementRef;
  @ViewChild("takeInputPDF", { static: false }) takeInputPDF!: ElementRef;
  @ViewChild("takeInputImage", { static: false }) takeInputImage!: ElementRef;
  @ViewChild('ngModelTypeID') ngModelTypeID!: NgSelectComponent;

  RequestForm!: FormGroup;
  selectedFiles: File[] = [];
  items: any = {};
  data: any = {};
  getArr: any[] = [];
  getUArr: any[] = [];
  getCat4: any[] = [];
  getID: any[] = [];
  projectType!: string[];
  projectName!: string[];
  businessUnit!: string[];
  programName!: string[];
  suppManuLoc!: string[];
  partName!: string[];
  partNumber!: string[];
  materialGrade!: string[];
  selectedID!: number;
  selectedProjectName!: string;
  selectedProjectType!: string;
  selectedBusinessUnit!: string;
  selectedProgramName!: string;
  selectedSuppManuLoc!: string;
  selectedPartName!: string;
  selectedPartNumber!: string;
  selectedMaterialGrade!: string;
  selectedCat4!: string;
  excelData: ExcelData[] = [];
  UData: UpdateSendRequest[] = [];
  HopperColumns: any = {};
  //uploadSendRequest: UploadSendRequestFile[] = [];
  //UploadSendRequest: any = {};
  showError1: boolean = false;
  showError2!: boolean;
  showError3!: boolean;
  showError4!: boolean;
  showError5!: boolean;
  showError6!: boolean;
  showError7!: boolean;
  showError8!: boolean;
  selectedPartSpecific: any;
  editModal!: boolean;
  editRowIndex: any;
  sendRequest: any = {};
  UpdateSendRequest: any = {};
  addSuccess: boolean = false;
  showSpinner!: boolean;
  display!: string;
  @ViewChild("myForm") myForm: NgForm | undefined;
  getAUID!: number;
  imageName: any;
  showError0!: boolean;
  showIcon: boolean = true;
  username: string | null | undefined;
  PartSpecific: TreeviewItem[] = [];
  private isFirstLoad = true;
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false
  });

  length: any;
  width: any;
  volume: any;
  height: any;
  partWeight: any;

  showError9!: boolean;
  showError10!: boolean;
  showError11!: boolean;
  showError12!: boolean;
  showError13!: boolean;
  @ViewChild('partSpec') private partSpec: any;
  imgName: string = '';
  imagePath: string = '';
  selectedUniqueID!: string;
  uniqueIDList!: string[];
  userId: any;
  CSHeaderID: any;
  loading = true;
  check = false;

  IsNullDebriefDate = false;
  IsNullCostType = false;
  IsNullShouldCostModeller = false;
  IsHopperValide = true;

  ModelTypes: any;
  modelTypesID: any;

  @ViewChild('excelFile_lbl')
  excelFile_lbl!: ElementRef;

  constructor(
    private fileUploadService: RequestFileUploadService, public searchservice: SearchService,
    private toastr: ToastrService, private SpinnerService: NgxSpinnerService, public router: Router, private location: Location) { }

  async ngOnInit() {

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }
    this.SpinnerService.show('spinner');

    this.userId = localStorage.getItem("userId");

    this.fileUploadService.getSendRequest().subscribe(_result => {
      this.getID = _result;

    });

    this.fileUploadService.getCat4().subscribe(_result => {
      this.getCat4 = _result;

    })

    //debugger;

    let value = localStorage.getItem("HopperColumns");

    if (value != '' && value != null && typeof value != "undefined") {
      this.HopperColumns = JSON.parse(value!);
      this.loading = false;
    }
    else {
      const data = await this.fileUploadService.ReadHoppercolumns().toPromise();
      this.HopperColumns = data;
      localStorage.setItem("HopperColumns", JSON.stringify(this.HopperColumns));
      this.loading = false;
    }

    this.fileUploadService.getModelTypes().subscribe(_result => {
      this.ModelTypes = _result;
      if (this.ModelTypes.length > 0) {
        this.modelTypesID = this.ModelTypes[0].id;
      }
    });

    this.SpinnerService.hide('spinner');

  }
  getMaterialGrade(event: any) {
    this.selectedMaterialGrade = event.target.value;
    // console.log(this.selectedMaterialGrade)

  }

  onSelected() {
    //debugger;

    this.length = '';
    this.width = '';
    this.height = '';
    this.partWeight = '';

    this.takeInputExcel.nativeElement.value = "";
    this.takeInputPDF.nativeElement.value = "";
    this.takeInputImage.nativeElement.value = "";

    this.SpinnerService.show('spinner');
    if (!this.onBlankInputValidation()) {

      const excelData: ExcelData = {
        UniqueID: this.selectedUniqueID
      };

      this.fileUploadService.GetFilteredHopperData(excelData).subscribe(
        (_result: any[]) => {
          this.getArr = _result;
          //console.log("view data", this.getArr)
          const UData: UpdateSendRequest = {
            // requestHeaderID: this.selectedID,
            uniqueID: this.selectedUniqueID
          };

          if (this.getArr[0].debriefDate == null) {
            this.toastr.error("Debrief Date should not be blank");
            this.IsNullDebriefDate = true;
            this.IsHopperValide = false;
          }
          if (this.getArr[0].costType == null) {
            this.toastr.error("Cost Type should not be blank");
            this.IsNullCostType = true;
            this.IsHopperValide = false;
          }
          if (this.getArr[0].shouldCostModeller == null) {
            this.toastr.error("Should Cost Modeller should not be blank");
            this.IsNullShouldCostModeller = true;
            this.IsHopperValide = false;
          }

          this.fileUploadService.getUpdateSendRequest(UData).subscribe(
            _result => {
              this.getUArr = _result;
              if (_result.length > 0) {
                this.length = this.getUArr[0].length
                this.width = this.getUArr[0].width
                this.height = this.getUArr[0].height
                this.partWeight = this.getUArr[0].finishWeight
                this.modelTypesID = this.getUArr[0].modelTypes_Id
              }
              else {
                this.modelTypesID = 1;
              }
              //console.log("My UpdateArr", this.getUArr)
              if (this.getUArr.length > 0) {
                this.toastr.warning("This Should Cost Model already exist with Model Mart ID " + this.getUArr[0].uniqueId + " and Request ID " + this.getUArr[0].requestHeaderId);

                if (this.getArr[0].iterationsCount > this.getUArr[0].iterationCount) {
                  this.toastr.warning("This Should Cost Model Iterations");
                }
              }
              
            }
          );

          this.SpinnerService.hide('spinner');


        }
      );
    }

  }

  onChange(event: any, fileType: string) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (fileType === 'pdf' || fileType === 'excel' || fileType === 'image') {
        this.selectedFiles.push(file);
      }
    }
  }


  onUpload() {
    this.check = false;

    if (this.selectedFiles === null || this.selectedFiles === undefined) {

      this.toastr.warning("Please upload the file.")
    }
    else {
      this.selectedPartName = this.getArr[0].partName
      this.selectedPartNumber = this.getArr[0].partNumber

      this.imgName = this.selectedPartName + '-' + this.selectedPartNumber
      this.username = localStorage.getItem("userName");

      this.SpinnerService.show('spinner');
      this.fileUploadService.upload(this.selectedFiles, this.getAUID, this.selectedUniqueID, this.userId).subscribe({
        next: (_res) => {
          // debugger;

          this.toastr.success("File uploaded Successfully.");

          this.SpinnerService.hide('spinner');
          this.addSuccess = false;

          let element: HTMLElement = document.getElementById('testbtn') as HTMLElement;
          element.click();
          setTimeout(() => {

            this.clearALLData();

            let element2: HTMLElement = document.getElementById('excelFile') as HTMLElement;
            element2.innerText = '';

          }, 200);

          this.takeInputExcel.nativeElement.value = "";
          this.takeInputPDF.nativeElement.value = "";
          this.takeInputImage.nativeElement.value = "";

          this.check = true;

        },
        error: (error) => {
          console.error('API call error:', error);
          this.SpinnerService.hide('spinner');
          this.toastr.error("File Not uploaded.");
          this.selectedFiles = [];

          let element: HTMLElement = document.getElementById('testbtn') as HTMLElement;
          element.click();
          setTimeout(() => {

            this.clearALLData();

            let element2: HTMLElement = document.getElementById('excelFile') as HTMLElement;
            element2.innerText = '';

          }, 200);

          this.takeInputExcel.nativeElement.value = "";
          this.takeInputPDF.nativeElement.value = "";
          this.takeInputImage.nativeElement.value = "";

          this.check = true;
          this.addSuccess = false;

          //spinner.style.display = 'none';
        },
      });
    }

  }

  getArr1: any;
  DebriefDate: any;
  Region: any;


  // AddUploadDataValidation(RowIndex: any) {
  //   this.DebriefDate = this.getArr[RowIndex].debriefDate
  //   this.Region = this.getArr[RowIndex].suppManuLoc
  //   this.selectedPartName = this.getArr[RowIndex].partName
  //   this.selectedPartNumber = this.getArr[RowIndex].partNumber

  //   this.getArr1 = [];

  //   this.fileUploadService.AddUploadDataValidation(this.DebriefDate, this.Region, this.selectedPartName, this.selectedPartNumber).subscribe(
  //     (_result: any) => {
  //       this.getArr1 = _result;
  //       console.log("view added data", this.getArr1)

  //     })

  // }

  async addModalMethod(rowIndex: any) {
    debugger;
    //  this.AddUploadDataValidation(rowIndex);
    this.getAUID = 0;
    this.addSuccess = false;
    this.editRowIndex = rowIndex;
    this.imagePath = this.getArr[this.editRowIndex].partName + "-" + this.getArr[this.editRowIndex].partNumber;

    this.DebriefDate = this.getArr[rowIndex].debriefDate
    this.Region = this.getArr[rowIndex].suppManuLoc
    this.selectedPartName = this.getArr[rowIndex].partName
    this.selectedPartNumber = this.getArr[rowIndex].partNumber

    this.getArr1 = [];

    // const data  = await this.fileUploadService.AddUploadDataValidation(this.DebriefDate, this.Region, this.selectedPartName, this.selectedPartNumber).toPromise();
    // this.getArr1 = data;

    this.fileUploadService.AddUploadDataValidation(this.DebriefDate, this.Region, this.selectedPartName, this.selectedPartNumber).subscribe(
      (_result: any) => {
        this.getArr1 = _result;
        console.log("view added data", this.getArr1)
        console.log(this.getArr);
        var IsIteration = true;

        if (this.getArr1.length >= 0 ) {
          if (this.getArr1.length > 0  && (this.getArr[0].iterationsCount > this.getArr1[0].iterationCount)) {
            if(confirm("This Model Mart Id ahve Iteration. Are you sure you want to Add Iteration.")){
              IsIteration =  true
            }
            else{
              IsIteration = false;
            }
          }

          if(IsIteration)
          if (!this.onBlurCheckValidation()) {
            this.sendRequest = {
              RequestHeaderID: this.selectedID,
              Cat2: this.getArr[this.editRowIndex].cat2,
              Cat3: this.getArr[this.editRowIndex].cat3,
              Cat4: this.getArr[this.editRowIndex].cat4,
              EstimatedSpend: this.getArr[this.editRowIndex].estimatedSpend === null ? 0 : this.getArr[this.editRowIndex].estimatedSpend,
              BusinessUnit: this.getArr[this.editRowIndex].businessUnit,
              ProjectType: this.getArr[this.editRowIndex].projectType,
              EngineDisplacement: this.getArr[this.editRowIndex].engineDisplacement === null ? '' : this.getArr[this.editRowIndex].engineDisplacement,
              MaterialGrade: this.getArr[this.editRowIndex].materialGrade,
              DebriefDate: this.getArr[this.editRowIndex].debriefDate,
              SourcingManager: this.getArr[this.editRowIndex].sourcingManager,
              TargetQuote: this.getArr[this.editRowIndex].targetQuote === null ? '' : this.getArr[this.editRowIndex].targetQuote,
              ShouldCostModeller: this.getArr[this.editRowIndex].shouldCostModeller,
              ToolingCostModeller: this.getArr[this.editRowIndex].toolingCostModeller,
              ProgramName: this.getArr[this.editRowIndex].programName,
              ToolingShouldCost: this.getArr[this.editRowIndex].toolingShouldCost === '' ? 0 : this.getArr[this.editRowIndex].toolingShouldCost,
              CostType: this.getArr[this.editRowIndex].costType,
              PartSpecificId: this.selectedPartSpecific,
              Length: this.length,
              Width: this.width,
              Height: this.height,
              UniqueID: this.getArr[this.editRowIndex].uniqueID,
              ImagePath: "C:\\inetpub\\wwwroot\\modelmart\\img\\" + this.getArr[this.editRowIndex].uniqueID,
              CreatedBy: this.userId,
              PartWeight: this.partWeight,
              ModelTypes: this.modelTypesID,
              IterationCount: this.getArr[this.editRowIndex].iterationsCount
            }

            //console.log('insert array', this.sendRequest);
            this.fileUploadService.addSendRequest(this.sendRequest).subscribe({
              next: (_res) => {
               // console.log('API call completed successfully');
                const addicon = document.getElementById("plus-icon") as HTMLElement;
                addicon.style.display = 'none';
                this.myForm!.resetForm();
                this.addSuccess = true;
              },
              error: (error) => {
                console.error('API call error:', error);
              },
            });
          }
        }
        else {
          this.toastr.warning("Model already uploaded.")
        }
      })


  }

  // onUpdateSelected() {

  //   const UData: UpdateSendRequest = {
  //     requestHeaderID: this.selectedID,
  //     uniqueID:
  //   };
  //   this.fileUploadService.getUpdateSendRequest(UData).subscribe(
  //     _result => {
  //       this.getUArr = _result;
  //       console.log("My UpdateArr", this.getUArr)
  //     }
  //   );
  // }

  editModalMethod(rowIndex: any) {
    if (this.modelTypesID === '' || this.modelTypesID === null || this.modelTypesID === undefined) {
      this.showError11 = true;
      return
    }

    this.editRowIndex = rowIndex;
    this.getAUID = this.getUArr[this.editRowIndex].csHeaderID;
    this.addSuccess = true;

    this.UpdateLWHandPW();
  }



  async ReadHopperColumns() {
    // this.fileUploadService.ReadHoppercolumns().subscribe(
    //   (data: any) => {
    //     this.HopperColumns = data;
    //     console.log("ReadHopperColumns",this.HopperColumns);


    //   },
    //   (error: any) => {
    //     console.error('Error fetching hopper columns:', error);
    //     this.SpinnerService.hide('spinner');
    //   }
    // );
    //debugger;
    this.SpinnerService.show('spinner');

    const data = await this.fileUploadService.ReadHoppercolumns().toPromise();
    this.HopperColumns = data;
    //console.log("ReadHopperColumns", this.HopperColumns);
    this.loading = false;
    this.SpinnerService.hide('spinner');


  }

  onBlurLength(event: any) {
    this.length = event.target.value
  }
  onBlurWidth(event: any) {
    this.width = event.target.value
  }
  onBlurHeight(event: any) {
    this.height = event.target.value
  }
  onBlurVolume(event: any) {
    this.volume = event.target.value
  }
  onBlurPartWeight(event: any) {
    this.partWeight = event.target.value
  }

  onBlurCheckValidation(): boolean {
    //debugger;
    var count = 0;
    // for (let i = 0; i < this.partspecification.filterItems.length; i++) {

    //   if (this.partspecification.filterItems[i].checked) {
    //     count = count + 1;
    //   }
    // }

    if (this.length == '' || this.length === undefined) {
      this.showError9 = true;
      return true;
    }
    else if (this.width == '' || this.width === undefined) {
      this.showError10 = true;
      return true;
    }
    else if (this.height == '' || this.height === undefined) {
      this.showError12 = true;
      return true;
    }
    else if (this.partWeight === '' || this.partWeight === null || this.partWeight === undefined) {
      this.showError13 = true;
      return true;
    }
    // else if (this.selectedPartSpecific === '' || this.selectedPartSpecific === null || this.selectedPartSpecific === undefined) {
    //   this.showError8 = true;
    //   return true;
    // }
    else {
      return false;
    }

  }


  onBlankInputValidation(): boolean {
    if (this.selectedID === null || this.selectedID === undefined) {
      this.showError0 = true;
      this.SpinnerService.hide('spinner');
      return true;
    }
    else if (this.selectedUniqueID === '' || this.selectedUniqueID === null || this.selectedUniqueID === undefined) {
      this.showError1 = true;
      this.SpinnerService.hide('spinner');
      return true;
    }
    else if (this.modelTypesID === '' || this.modelTypesID === null || this.modelTypesID === undefined) {
      this.showError11 = true;
      this.SpinnerService.hide('spinner');
      return true;
    }

    else {
      return false;
    }
  }

  onSelectedChangePartSpec(e: any) {
    //debugger;
    // if (this.isFirstLoad) {
    if (e.length == 1) {
      this.selectedPartSpecific = e[0];
      //this.isFirstLoad = false;
      return;
    }
    if (e.length > 1) {
      this.toastr.warning("Please select only one Part Secification");
      this.selectedPartSpecific = '';
      //this.isFirstLoad = false;
      return;
    }
    // }
    // else if (e.length != 1) {
    //   this.toastr.warning("Please select only one Part Secification");
    //   this.selectedPartSpecific = '';
    // }
    // else {
    //   this.selectedPartSpecific = e[0];
    // }


  }
  //// click on cat4 checkbox
  async getCategoryIdcat4() {
    const e = this.selectedCat4;

    const data = await this.searchservice.PartSpecificationFilters(e).toPromise();
    this.PartSpecific = data.map((value: { text: any; value: any; children: any, checked: boolean }) => {
      return new TreeviewItem({ text: value.text, value: value.value, children: value.children, checked: true });

    });
  }


  backToPreviousPage() {
    this.location.back();
  }

  deleteUploadedData(rowIndex: any) {
    this.editRowIndex = rowIndex;
    this.getAUID = this.getUArr[this.editRowIndex].csHeaderID;
    if (confirm("Are you sure? You want to permanently delete the uploaded the Model?")) {
      this.fileUploadService.DeleteUploadedData(this.getAUID).subscribe({
        next: (_res: any) => {
          this.toastr.success("Model deleted Successfully.");
          this.addSuccess = true;
          this.clearALLData();
        },
        error: (error: any) => {
          console.error('API call error:', error);
        },
      });
    }
  }

  clearALLData() {
    this.length = '';
    this.width = '';
    this.height = '';
    this.partWeight = '';
    this.getArr = [];
    this.selectedFiles = [];
  }


  //ng-value ng-star-inserted
  async BulkUpload() {

    if (this.modelTypesID === '' || this.modelTypesID === null || this.modelTypesID === undefined) {
      this.showError11 = true;
      return
    }
    // let element = document.getElementById('ngModelTypeID') as HTMLElement ;

    if (confirm("Are you sure want to start Bulk Upload")) {

      this.SpinnerService.show('spinner');
      const data = await this.fileUploadService.getBulkUpload(this.userId, this.modelTypesID).toPromise();
      //console.log('Bulk Upload', data);
      //debugger;
      if (data == null) {
        this.toastr.success("Bulk Upload Completed.")
        this.SpinnerService.hide('spinner');
      }
      else {
        console.error('API call error:', data);
        this.toastr.error("Bulk Upload Failed.")
        this.SpinnerService.hide('spinner');
      }
      this.SpinnerService.hide('spinner');
    }

  }



  UpdateLWHandPW() {
    this.UpdateSendRequest = {
      CSHeaderID: this.getUArr[0].csHeaderID,
      Length: this.length,
      Width: this.width,
      Height: this.height,
      PartWeight: this.partWeight,
      Cat2: this.getArr[this.editRowIndex].cat2,
      Cat3: this.getArr[this.editRowIndex].cat3,
      Cat4: this.getArr[this.editRowIndex].cat4,
      EstimatedSpend: this.getArr[this.editRowIndex].estimatedSpend === null ? 0 : this.getArr[this.editRowIndex].estimatedSpend,
      BusinessUnit: this.getArr[this.editRowIndex].businessUnit,
      ProjectType: this.getArr[this.editRowIndex].projectType,
      EngineDisplacement: this.getArr[this.editRowIndex].engineDisplacement === null ? '' : this.getArr[this.editRowIndex].engineDisplacement,
      MaterialGrade: this.getArr[this.editRowIndex].materialGrade,
      DebriefDate: this.getArr[this.editRowIndex].debriefDate,
      SourcingManager: this.getArr[this.editRowIndex].sourcingManager,
      TargetQuote: this.getArr[this.editRowIndex].targetQuote === null ? '' : this.getArr[this.editRowIndex].targetQuote,
      ShouldCostModeller: this.getArr[this.editRowIndex].shouldCostModeller,
      ToolingCostModeller: this.getArr[this.editRowIndex].toolingCostModeller,
      ProgramName: this.getArr[this.editRowIndex].programName,
      ToolingShouldCost: this.getArr[this.editRowIndex].toolingShouldCost === '' ? 0 : this.getArr[this.editRowIndex].toolingShouldCost,
      CostType: this.getArr[this.editRowIndex].costType,
      UniqueID: this.getArr[this.editRowIndex].uniqueID,
      ModifiedBy: this.userId,
      ModelTypesID: this.modelTypesID

    }

    this.fileUploadService.UpdateLWHandPW(this.UpdateSendRequest).subscribe({
      next: (_res) => {
        //console.log('API call successful');
      },
      error: (error) => {
        console.error('API call error:', error);
      },
    });

  }

}


