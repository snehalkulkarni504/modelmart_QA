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
import * as XLSX from 'xlsx';

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
  selectedSheet = 1;
  ModelTypes: any;
  modelTypesID: any;
  modelexist: boolean = false;
  enableupload: boolean = false;

  @ViewChild('excelFile_lbl')
  excelFile_lbl!: ElementRef;
  id: any;


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
    debugger;

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
                this.modelexist = true;
              }
              else {
                this.modelTypesID = 1;
                this.modelexist = false;
              }
              //console.log("My UpdateArr", this.getUArr)
              if (this.getUArr.length > 0) {
                this.toastr.warning("This Should Cost Model already exist with Model Mart ID " + this.getUArr[0].uniqueId + " and Request ID " + this.getUArr[0].requestHeaderId);

                if (this.getArr[0].iterationsCount > this.getUArr[0].iterationCount) {
                  this.toastr.warning("This is an uploaded model with the next iteration");
                }
              }

            }
          );

          this.SpinnerService.hide('spinner');


        }
      );
    }

  }

  isTechnicalParameterModalOpen = false;
  parameter = '';
  name = '';
  // technicalParameters: { parameter: string; name: string }[] = [];

  technicalParameters = [
    { parameter: 'Length from Groove to Guage Line', name: '114.4' },
    { parameter: 'Length from Tip to Guage Line', name: '45.4' },
    { parameter: 'Diameter of Stem', name: '12.4' }
  ];

  openTechnicalParameterModal() {
    debugger
    this.isTechnicalParameterModalOpen = true;
  }

  closeTechnicalParameterModal() {
    this.isTechnicalParameterModalOpen = false;
  }

  // addTechnicalParameter() {
  //     if (this.parameter && this.name) {
  //         this.technicalParameters.push({ parameter: this.parameter, name: this.name });
  //         this.parameter = '';
  //         this.name = '';
  //     }
  // }



  addTechnicalParameter() {
    this.technicalParameters.push({ parameter: '', name: '' });
  }


  // onChange(event: any, fileType: string) {
  //   const files = event.target.files;
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     if (fileType === 'pdf' || fileType === 'excel' || fileType === 'image') {
  //       this.selectedFiles.push(file);
  //     }
  //   }
  // }


  onUpload() {
    debugger;
    this.check = false;
    if (this.selectedSheet != null || this.selectedSheet != undefined) {
      if (this.selectedFiles === null || this.selectedFiles === undefined) {

        this.toastr.warning("Please upload the file.")
      }

      else if (this.modelTypesID == 2) {
        this.fileUploadService.yellowsheetupload(this.yellowmodeldata).subscribe({
          next: (res) => {
            // this.toastr.success("Excel data Inserted Successfully");
            this.SpinnerService.hide('spinner');
            this.addSuccess = false;
            this.enableupload = false;
            this.selectedPartName = this.getArr[0].partName
            this.selectedPartNumber = this.getArr[0].partNumber

            this.imgName = this.selectedPartName + '-' + this.selectedPartNumber
            this.username = localStorage.getItem("userName");

            this.SpinnerService.show('spinner');
            this.fileUploadService.yellowmodelfileupload(this.selectedFiles, this.getAUID, this.selectedUniqueID, this.userId).subscribe({
              next: (_res) => {
                // debugger;

                this.toastr.success("File uploaded Successfully.");

                this.SpinnerService.hide('spinner');
                this.addSuccess = false;
                this.enableupload = false;
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
                this.enableupload = false;
              },
            });


          },
          error: (error) => {
            console.error('API call error:', error);
            this.SpinnerService.hide('spinner');
            this.toastr.error("Excel data Not uploaded.");
          }
        })

      }
      else if (this.modelTypesID == 5) {
        this.fileUploadService.chinasheetupload(this.chinamodeldata).subscribe({
          next: (res: any) => {
            // this.toastr.success("Excel data Inserted Successfully");
            this.SpinnerService.hide('spinner');
            this.addSuccess = false;
            this.enableupload = false;
            this.selectedPartName = this.getArr[0].partName
            this.selectedPartNumber = this.getArr[0].partNumber

            this.imgName = this.selectedPartName + '-' + this.selectedPartNumber
            this.username = localStorage.getItem("userName");

            this.SpinnerService.show('spinner');
            this.fileUploadService.chinamodelfileupload(this.selectedFiles, this.getAUID, this.selectedUniqueID, this.userId).subscribe({
              next: (_res: any) => {
                // debugger;

                this.toastr.success("File uploaded Successfully.");

                this.SpinnerService.hide('spinner');
                this.addSuccess = false;
                this.enableupload = false;
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
              error: (error: any) => {
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
                this.enableupload = false;
              },
            });


          },
          error: (error: any) => {
            console.error('API call error:', error);
            this.SpinnerService.hide('spinner');
            this.toastr.error("Excel data Not uploaded.");
          }
        })

      }
      else {
        this.selectedPartName = this.getArr[0].partName
        this.selectedPartNumber = this.getArr[0].partNumber

        this.imgName = this.selectedPartName + '-' + this.selectedPartNumber
        this.username = localStorage.getItem("userName");

        this.SpinnerService.show('spinner');
        this.fileUploadService.upload(this.selectedFiles, this.getAUID, this.selectedUniqueID, this.userId, this.selectedSheet).subscribe({
          next: (_res) => {
            // debugger;

            this.toastr.success("File uploaded Successfully.");

            this.SpinnerService.hide('spinner');
            this.addSuccess = false;
            this.enableupload = false;
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
            this.enableupload = false;
            //spinner.style.display = 'none';
          },
        });
      }
    }
    else {
      this.showError1 = true;
    }
  }

  getArr1: any;
  DebriefDate: any;
  Region: any;

  async addModalMethod(rowIndex: any) {
    debugger;
    //  this.AddUploadDataValidation(rowIndex);
    this.getAUID = 0;
    this.addSuccess = false;
    this.enableupload = false;
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

        if (this.getArr1.length >= 0) {
          if (this.getArr1.length > 0 && (this.getArr[0].iterationsCount > this.getArr1[0].iterationCount)) {
            if (confirm("This Model Mart Id already exist for different Request Id. Are you sure to add it against new Request Id?")) {
              IsIteration = true
            }
            else {
              IsIteration = false;
            }
          };
          this.id = this.getArr[this.editRowIndex].requestID;

          if (IsIteration) {
            if (!this.checkBlankInputs()) {
              this.sendRequest = {
                RequestHeaderID: this.getArr[this.editRowIndex].requestID,
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
                IterationCount: this.getArr[this.editRowIndex].iterationsCount,
                AnnualVolume: this.getArr[this.editRowIndex].annualVolume,
                ShoudeCost: Number(this.getArr[this.editRowIndex].shouldCost).toFixed(4),
                SourcingManagerEmail: this.getArr[this.editRowIndex].sourcingManagerEmail,
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

  onLengthInput() {
    this.showError9 = !(this.length && this.length > 0);
  }
  onWidthInput() {
    this.showError10 = !(this.width && this.width > 0);
  }

  onHeightInput() {
    this.showError12 = !(this.height && this.height > 0);
  }

  onPartWeightInput() {
    this.showError13 = !(this.partWeight && this.partWeight > 0);
  }

  onSheetTypeChange(value: any) {
    console.log(this.selectedSheet)
    this.showError2 = value === null || value === undefined || value === '';
  }
  //  onBlurLength(event: any) {
  //     this.length = event.target.value

  //   }
  //   onBlurWidth(event: any) {
  //     this.width = event.target.value

  //   }
  //   onBlurHeight(event: any) {
  //     this.height = event.target.value

  //   }

  //   onBlurPartWeight(event: any) {
  //     this.partWeight = event.target.value
  //   }


  // onBlurCheckValidation(): boolean {
  //   //debugger;
  //   var count = 0;
  //   // for (let i = 0; i < this.partspecification.filterItems.length; i++) {

  //   //   if (this.partspecification.filterItems[i].checked) {
  //   //     count = count + 1;
  //   //   }
  //   // }
  //   if (this.modelTypesID != 2 && this.modelTypesID != 5) {
  //     if (this.length == '' || this.length === undefined) {
  //       this.showError9 = true;
  //       return true;
  //     }
  //     else if (this.width == '' || this.width === undefined) {
  //       this.showError10 = true;
  //       return true;
  //     }
  //     else if (this.height == '' || this.height === undefined) {
  //       this.showError12 = true;
  //       return true;
  //     }
  //     else if (this.partWeight === '' || this.partWeight === null || this.partWeight === undefined) {
  //       this.showError13 = true;
  //       return true;
  //     }

  //     else {
  //       return false;
  //     }
  //   }
  //   else {
  //     return false;
  //   }
  // }


  checkBlankInputs(): boolean {
    let hasError = false;


    if (this.selectedSheet !== 2 && (this.modelTypesID === 2 || this.modelTypesID === 5)) {
      this.showError9 = this.length === '' || this.length === null || this.length === undefined;
      this.showError10 = this.width === '' || this.width === null || this.width === undefined;
      this.showError12 = this.height === '' || this.height === null || this.height === undefined;
      this.showError13 = this.partWeight === '' || this.partWeight === null || this.partWeight === undefined;

      hasError = this.showError9 || this.showError10 || this.showError12 || this.showError13;
    } else {
      this.showError9 = false;
      this.showError10 = false;
      this.showError12 = false;
      this.showError13 = false;
    }

    if (this.id === null || this.id === undefined || this.id === '') {
      this.toastr.warning("Request ID is not present");
      hasError = true;
    }

    return hasError;
  }




  onBlankInputValidation(): boolean {
    let hasError = false;

    if (this.selectedUniqueID === '' || this.selectedUniqueID === null || this.selectedUniqueID === undefined) {
      this.showError1 = true;
      hasError = true;
    } else {
      this.showError1 = false;
    }


    if (this.modelTypesID === '' || this.modelTypesID === null || this.modelTypesID === undefined) {
      this.showError11 = true;
      hasError = true;
    } else {
      this.showError11 = false;
    }
    if (hasError) {
      this.SpinnerService.hide('spinner');
    }

    return hasError;
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

    if (!this.modelTypesID) {
      this.showError11 = true;
      return;
    }


    // if (this.modelTypesID === '' || this.modelTypesID === null || this.modelTypesID === undefined) {
    //   this.showError11 = true;
    //   return
    // }

    if (confirm("Are you sure want to start Bulk Upload?")) {
      if (this.modelTypesID == 2) {

        try {
          this.SpinnerService.show('spinner');
          const response: any = await this.fileUploadService.yellowbulkupload(this.userId, this.modelTypesID).toPromise();

          if (response.failedIds && response.failedIds.length > 0) {
            this.toastr.error(`Bulk Upload Failed for MMIDs: ${response.failedIds.join(", ")}`, '', {
              timeOut: 0,
              progressBar: false,
              closeButton: true
            });
          }
          else {
            this.toastr.success(response.message || "Bulk Upload Completed.");
            this.SpinnerService.hide('spinner');
          }
        } catch (error) {
          console.error('API call error:', error);
          this.toastr.error("Bulk Upload Failed.");
          this.SpinnerService.hide('spinner');
        }
        finally {
          this.SpinnerService.hide('spinner');
        }
      }
      else if (this.modelTypesID == 5) {
        try {
          this.SpinnerService.show('spinner');
          const response: any = await this.fileUploadService.chinabulkupload(this.userId, this.modelTypesID).toPromise();

          if (response.failedIds && response.failedIds.length > 0) {
            this.toastr.error(`Bulk Upload Failed for MMIDs: ${response.failedIds.join(", ")}`, '', {
              timeOut: 0,
              progressBar: false,
              closeButton: true
            });
          }
          else {
            this.toastr.success(response.message || "Bulk Upload Completed.");
            this.SpinnerService.hide('spinner');
          }
        }
        catch (error) {
          console.error('API call error:', error);
          this.toastr.error("Bulk Upload Failed.");
          this.SpinnerService.hide('spinner');
        }
        finally {
          this.SpinnerService.hide('spinner');
        }
      }
      else {
        this.SpinnerService.show('spinner');
        console.log(this.selectedSheet);
        if (this.selectedSheet != null && this.selectedSheet != undefined) {
          const data = await this.fileUploadService.getBulkUpload(this.userId, this.modelTypesID, this.selectedSheet).toPromise();
          if (data == null) {
            this.toastr.success("Bulk Upload Completed.")
            this.SpinnerService.hide('spinner');
          }
          else {
            console.error('API call error:', data);
            this.toastr.error("Bulk Upload Failed.")
            this.SpinnerService.hide('spinner');
          }
        }
        else {
          this.showError2 = true;
          this.SpinnerService.hide('spinner');
        }
        this.SpinnerService.hide('spinner');
      }
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
      ModelTypesID: this.modelTypesID,
      ShoudeCost: Number(this.getArr[this.editRowIndex].shouldCost).toFixed(4),
      SourcingManagerEmail: this.getArr[this.editRowIndex].sourcingManagerEmail

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


  modelMartIdFromExcel: string = '';
  validationMessage: string = '';

  onChange(event: any, fileType: string) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (fileType === 'pdf' || fileType === 'excel' || fileType === 'image') {
        if (fileType === 'excel' && (this.modelTypesID == 2 || this.modelTypesID == 5)) {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              const data = new Uint8Array(e.target.result);
              const workbook = XLSX.read(data, { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const sheet = workbook.Sheets[sheetName];
              debugger;
              const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

              if (jsonData.length > 0) {
                this.modelMartIdFromExcel = jsonData[1][0];
                this.validateModelMartId(jsonData);
              }
            };
            reader.readAsArrayBuffer(file);
          }
        }

        this.enableupload = true;
        this.selectedFiles.push(file);
      }

    }
  }


  yellowmodeldata = {
    MMID: 0,
    CreatedBy: 0,
    CostType: "",
    PartNo: "",
    PartName: "",
    SuppMgfLoc: "",
    DirectMatCost: 0.00,
    BoughtOutFinishCost: 0.00,
    RoughtPartCost: 0.00,
    DirectLabourCost: 0.00,
    ProcessOverheadCost: 0.00,
    SurfaceTreatmentCost: 0.00,
    TotalMgfCost: 0.00,
    SGA: 0.00,
    Profit: 0.00,
    Packaging: 0.00,
    FreightLogistics: 0.00,
    DirectedBuyCost: 0.00,
    HandlingCharges: 0.00,
    ICC: 0.00,
    Rejection: 0.00,
    TotalNonManufacturingCosts: 0.00,
    TotalCost: 0.00,
    Length: 0.00 as number | null,
    Width: 0.00 as number | null,
    Height: 0.00 as number | null,
    Weight: 0.00 as number | null,
    AddInfo: ""
  };

  chinamodeldata = {
    MMID: 0,
    CreatedBy: 0,
    CostType: "",
    PartNo: "",
    PartName: "",
    SuppMgfLoc: "",
    DirectMatCost: 0.00,
    BoughtOutFinishCost: 0.00,
    RoughtPartCost: 0.00,
    DirectLabourCost: 0.00,
    ProcessOverheadCost: 0.00,
    SurfaceTreatmentCost: 0.00,
    TotalMgfCost: 0.00,
    SGA: 0.00,
    Profit: 0.00,
    Packaging: 0.00,
    FreightLogistics: 0.00,
    DirectedBuyCost: 0.00,
    HandlingCharges: 0.00,
    ICC: 0.00,
    Rejection: 0.00,
    TotalNonManufacturingCosts: 0.00,
    TotalCost: 0.00,
    Length: 0.00 as number | null,
    Width: 0.00 as number | null,
    Height: 0.00 as number | null,
    Weight: 0.00 as number | null,
    AddInfo: "",
    DirectMatCostT2: 0.00,
    BoughtOutFinishCostT2: 0.00,
    RoughtPartCostT2: 0.00,
    DirectLabourCostT2: 0.00,
    ProcessOverheadCostT2: 0.00,
    SurfaceTreatmentCostT2: 0.00,
    TotalMgfCostT2: 0.00,
    SGAT2: 0.00,
    ProfitT2: 0.00,
    PackagingT2: 0.00,
    FreightLogisticsT2: 0.00,
    DirectedBuyCostT2: 0.00,
    HandlingChargesT2: 0.00,
    ICCT2: 0.00,
    RejectionT2: 0.00,
    TotalNonManufacturingCostsT2: 0.00,
    TotalCostT2: 0.00,
  };


  demodata = this.yellowmodeldata;

  validateModelMartId(exceldata: any): void {
    debugger;
    if (this.modelMartIdFromExcel && this.selectedUniqueID) {
      if (this.modelMartIdFromExcel.toString() === this.selectedUniqueID) {
        this.validationMessage = 'ModelMart ID Matched';
        this.yellowmodeldata = {
          MMID: exceldata[1][0],
          CreatedBy: this.userId,
          CostType: exceldata[1][1],
          PartNo: exceldata[1][2],
          PartName: exceldata[1][3],
          SuppMgfLoc: exceldata[1][4],
          DirectMatCost: Number(exceldata[1][5].toFixed(4)),
          BoughtOutFinishCost: Number(exceldata[1][6].toFixed(4)),
          RoughtPartCost: Number(exceldata[1][7].toFixed(4)),
          DirectLabourCost: Number(exceldata[1][8].toFixed(4)),
          ProcessOverheadCost: Number(exceldata[1][9].toFixed(4)),
          SurfaceTreatmentCost: Number(exceldata[1][10].toFixed(4)),
          TotalMgfCost: Number(exceldata[1][11].toFixed(4)),
          SGA: Number(exceldata[1][12].toFixed(4)),
          Profit: Number(exceldata[1][13].toFixed(4)),
          Packaging: Number(exceldata[1][14].toFixed(4)),
          FreightLogistics: Number(exceldata[1][15].toFixed(4)),
          DirectedBuyCost: Number(exceldata[1][16].toFixed(4)),
          HandlingCharges: Number(exceldata[1][17].toFixed(4)),
          ICC: Number(exceldata[1][18].toFixed(4)),
          Rejection: Number(exceldata[1][19].toFixed(4)),
          TotalNonManufacturingCosts: Number(exceldata[1][20].toFixed(4)),
          TotalCost: Number(exceldata[1][21].toFixed(4)),
          Length: (exceldata[1][22] === '' || exceldata[1][22] === null || exceldata[1][22] === undefined) ? null : Number(exceldata[1][22].toFixed(4)),
          Width: (exceldata[1][23] === '' || exceldata[1][23] === null || exceldata[1][23] === undefined) ? null : Number(exceldata[1][23].toFixed(4)),
          Height: (exceldata[1][24] === '' || exceldata[1][24] === null || exceldata[1][24] === undefined) ? null : Number(exceldata[1][24].toFixed(4)),
          Weight: (exceldata[1][25] === '' || exceldata[1][25] === null || exceldata[1][25] === undefined) ? null : Number(exceldata[1][25].toFixed(4)),
          AddInfo: exceldata[1][26] || ""
        };
        if (Number(exceldata[1][7].toFixed(4)) > 0) {
          this.chinamodeldata = {
            MMID: exceldata[1][0],
            CreatedBy: this.userId,
            CostType: exceldata[1][1],
            PartNo: exceldata[1][2],
            PartName: exceldata[1][3],
            SuppMgfLoc: exceldata[1][4],
            DirectMatCost: Number(exceldata[1][5].toFixed(4)),
            BoughtOutFinishCost: Number(exceldata[1][6].toFixed(4)),
            RoughtPartCost: Number(exceldata[1][7].toFixed(4)),
            DirectLabourCost: Number(exceldata[1][8].toFixed(4)),
            ProcessOverheadCost: Number(exceldata[1][9].toFixed(4)),
            SurfaceTreatmentCost: Number(exceldata[1][10].toFixed(4)),
            TotalMgfCost: Number(exceldata[1][11].toFixed(4)),
            SGA: Number(exceldata[1][12].toFixed(4)),
            Profit: Number(exceldata[1][13].toFixed(4)),
            Packaging: Number(exceldata[1][14].toFixed(4)),
            FreightLogistics: Number(exceldata[1][15].toFixed(4)),
            DirectedBuyCost: Number(exceldata[1][16].toFixed(4)),
            HandlingCharges: Number(exceldata[1][17].toFixed(4)),
            ICC: Number(exceldata[1][18].toFixed(4)),
            Rejection: Number(exceldata[1][19].toFixed(4)),
            TotalNonManufacturingCosts: Number(exceldata[1][20].toFixed(4)),
            TotalCost: Number(exceldata[1][21].toFixed(4)),
            Length: (exceldata[1][22] === '' || exceldata[1][22] === null || exceldata[1][22] === undefined) ? null : Number(exceldata[1][22].toFixed(4)),
            Width: (exceldata[1][23] === '' || exceldata[1][23] === null || exceldata[1][23] === undefined) ? null : Number(exceldata[1][23].toFixed(4)),
            Height: (exceldata[1][24] === '' || exceldata[1][24] === null || exceldata[1][24] === undefined) ? null : Number(exceldata[1][24].toFixed(4)),
            Weight: (exceldata[1][25] === '' || exceldata[1][25] === null || exceldata[1][25] === undefined) ? null : Number(exceldata[1][25].toFixed(4)),
            AddInfo: exceldata[1][26] || "",
            DirectMatCostT2: Number(exceldata[1][27].toFixed(4)),
            BoughtOutFinishCostT2: Number(exceldata[1][28].toFixed(4)),
            RoughtPartCostT2: Number(exceldata[1][29].toFixed(4)),
            DirectLabourCostT2: Number(exceldata[1][30].toFixed(4)),
            ProcessOverheadCostT2: Number(exceldata[1][31].toFixed(4)),
            SurfaceTreatmentCostT2: Number(exceldata[1][32].toFixed(4)),
            TotalMgfCostT2: Number(exceldata[1][33].toFixed(4)),
            SGAT2: Number(exceldata[1][34].toFixed(4)),
            ProfitT2: Number(exceldata[1][35].toFixed(4)),
            PackagingT2: Number(exceldata[1][36].toFixed(4)),
            FreightLogisticsT2: Number(exceldata[1][37].toFixed(4)),
            DirectedBuyCostT2: Number(exceldata[1][38].toFixed(4)),
            HandlingChargesT2: Number(exceldata[1][39].toFixed(4)),
            ICCT2: Number(exceldata[1][40].toFixed(4)),
            RejectionT2: Number(exceldata[1][41].toFixed(4)),
            TotalNonManufacturingCostsT2: Number(exceldata[1][42].toFixed(4)),
            TotalCostT2: Number(exceldata[1][43].toFixed(4))
          };
        }
        else {
          this.chinamodeldata = {
            MMID: exceldata[1][0],
            CreatedBy: this.userId,
            CostType: exceldata[1][1],
            PartNo: exceldata[1][2],
            PartName: exceldata[1][3],
            SuppMgfLoc: exceldata[1][4],
            DirectMatCost: Number(exceldata[1][5].toFixed(4)),
            BoughtOutFinishCost: Number(exceldata[1][6].toFixed(4)),
            RoughtPartCost: Number(exceldata[1][7].toFixed(4)),
            DirectLabourCost: Number(exceldata[1][8].toFixed(4)),
            ProcessOverheadCost: Number(exceldata[1][9].toFixed(4)),
            SurfaceTreatmentCost: Number(exceldata[1][10].toFixed(4)),
            TotalMgfCost: Number(exceldata[1][11].toFixed(4)),
            SGA: Number(exceldata[1][12].toFixed(4)),
            Profit: Number(exceldata[1][13].toFixed(4)),
            Packaging: Number(exceldata[1][14].toFixed(4)),
            FreightLogistics: Number(exceldata[1][15].toFixed(4)),
            DirectedBuyCost: Number(exceldata[1][16].toFixed(4)),
            HandlingCharges: Number(exceldata[1][17].toFixed(4)),
            ICC: Number(exceldata[1][18].toFixed(4)),
            Rejection: Number(exceldata[1][19].toFixed(4)),
            TotalNonManufacturingCosts: Number(exceldata[1][20].toFixed(4)),
            TotalCost: Number(exceldata[1][21].toFixed(4)),
            Length: (exceldata[1][22] === '' || exceldata[1][22] === null || exceldata[1][22] === undefined) ? null : Number(exceldata[1][22].toFixed(4)),
            Width: (exceldata[1][23] === '' || exceldata[1][23] === null || exceldata[1][23] === undefined) ? null : Number(exceldata[1][23].toFixed(4)),
            Height: (exceldata[1][24] === '' || exceldata[1][24] === null || exceldata[1][24] === undefined) ? null : Number(exceldata[1][24].toFixed(4)),
            Weight: (exceldata[1][25] === '' || exceldata[1][25] === null || exceldata[1][25] === undefined) ? null : Number(exceldata[1][25].toFixed(4)),
            AddInfo: exceldata[1][26] || "",
            DirectMatCostT2: 0,
            BoughtOutFinishCostT2: 0,
            RoughtPartCostT2: 0,
            DirectLabourCostT2: 0,
            ProcessOverheadCostT2: 0,
            SurfaceTreatmentCostT2: 0,
            TotalMgfCostT2: 0,
            SGAT2: 0,
            ProfitT2: 0,
            PackagingT2: 0,
            FreightLogisticsT2: 0,
            DirectedBuyCostT2: 0,
            HandlingChargesT2: 0,
            ICCT2: 0,
            RejectionT2: 0,
            TotalNonManufacturingCostsT2: 0,
            TotalCostT2: 0
          };
        }

        this.enableupload = true;

      } else {
        this.validationMessage = 'ModelMart ID Not Matched';
        alert("ModelMart ID Not Matched");
        setTimeout(() => {

          this.takeInputExcel.nativeElement.value = "";
          this.takeInputPDF.nativeElement.value = "";
          this.takeInputImage.nativeElement.value = "";

        }, 200);
        this.enableupload = false;


      }

    }
  }


}



