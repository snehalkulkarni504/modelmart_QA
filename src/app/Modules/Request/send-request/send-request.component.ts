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

  }

  onSelected() {

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
          const UData: UpdateSendRequest = {
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
              if (this.getUArr.length > 0) {
                this.toastr.warning("This Should Cost Model already exist with Model Mart ID " + this.getUArr[0].uniqueId + " and Request ID " + this.getUArr[0].requestHeaderId);
                if (this.getArr[0].iterationsCount > this.getUArr[0].iterationCount) {
                  this.toastr.warning("This Should Cost Model Iterations");
                }
              }

            }
          );

          this.SpinnerService.hide('spinner');
          console.log('modeltype id=' + this.modelTypesID);
        }
      );
    }



  }


  modelMartIdFromExcel: string = '';
  validationMessage: string = '';

  onChange(event: any, fileType: string) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (fileType === 'pdf' || fileType === 'excel' || fileType === 'image') {
        if (fileType === 'excel') {
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
        this.selectedFiles.push(file);
        this.addSuccess = true;
      }
    }
  }






  yellowmodeldata = {
    MMID: 0,
    requestid: 0,
    createdby: 0,
    modelmarttypeid: 0,
    cat2: "",
    cat3: "",
    cat4: "",
    estimatespend: "",
    businessunit: "",
    projecttype: "",
    costtype: "",
    partno: "",
    partname: "",

    programname: "",
    enginedisplacement: "",
    sourcingmanager: "",
    targetquote: "",
    shouldcostmodeller: "",
    toolingcostmodeller: "",
    materialgrade: "",
    debriefdate: "",

    suppmgfloc: "",
    directmatcost: 0.00,
    boughtoutfinishcost: 0.00,
    roughtpartcost: 0.00,
    directlabourcost: 0.00,
    processoverheadcost: 0.00,
    surfacetreatmentcost: 0.00,
    totalmgfcost: 0.00,
    SGA: 0.00,
    profit: 0.00,
    packaging: 0.00,
    freightlogistics: 0.00,
    directedbuycost: 0.00,
    handlingcharges: 0.00,
    icc: 0.00,
    rejection: 0.00,
    totalnonmanufacturingcosts: 0.00,
    totalcost: 0.00,
    length: 0.00,
    width: 0.00,
    height: 0.00,
    weight: 0.00,
    addinfo: ""
  };

  demodata = this.yellowmodeldata;


  validateModelMartId(exceldata: any): void {
    debugger;
    if (this.modelMartIdFromExcel && this.selectedUniqueID) {
      if (this.modelMartIdFromExcel.toString() === this.selectedUniqueID) {
        this.validationMessage = 'ModelMart ID Matched';
        alert("Modelmart Id matched");

        this.yellowmodeldata = {
          MMID: exceldata[1][0],
          requestid: this.selectedID,
          createdby: this.userId,
          modelmarttypeid: this.modelTypesID,
          cat2: this.getArr[0].cat2,
          cat3: this.getArr[0].cat3,
          cat4: this.getArr[0].cat4,
          estimatespend: this.getArr[0].estimatedSpend,
          businessunit: this.getArr[0].businessUnit,
          projecttype: this.getArr[0].projectType,
          programname: this.getArr[0].programName,
          enginedisplacement: this.getArr[0].engineDisplacement,
          sourcingmanager: this.getArr[0].engineDisplacement,
          targetquote: this.getArr[0].targetQuote,
          shouldcostmodeller: this.getArr[0].shouldCostModeller,
          toolingcostmodeller: this.getArr[0].toolingCostModeller,
          materialgrade: this.getArr[0].materialGrade,
          debriefdate: this.getArr[0].debriefDate,


          costtype: exceldata[1][1],
          partno: exceldata[1][2],
          partname: exceldata[1][3],
          suppmgfloc: exceldata[1][4],
          directmatcost: exceldata[1][5],
          boughtoutfinishcost: exceldata[1][6],
          roughtpartcost: exceldata[1][7], // Rough part cost
          directlabourcost: exceldata[1][8], // Direct Labour Cost
          processoverheadcost: exceldata[1][9], // Process Overhead Cost
          surfacetreatmentcost: exceldata[1][10], // Surface Treatments Cost
          totalmgfcost: exceldata[1][11], // Total Manufacturing Cost
          SGA: exceldata[1][12], // SG&A (5% of Mfg. cost)
          profit: exceldata[1][13], // Profit (8% of Mfg. cost)
          packaging: exceldata[1][14],
          freightlogistics: exceldata[1][15], // Freight/Logistics
          directedbuycost: exceldata[1][16], // Directed Buy Cost
          handlingcharges: exceldata[1][17], // Handling Charges
          icc: exceldata[1][18],
          rejection: exceldata[1][19],
          totalnonmanufacturingcosts: exceldata[1][20], // Total Non-Manufacturing Costs
          totalcost: exceldata[1][21], // Total Cost
          length: exceldata[1][22],
          width: exceldata[1][23],
          height: exceldata[1][24],
          weight: exceldata[1][25],
          addinfo: exceldata[1][26] || ""
        };

      } else {
        this.validationMessage = 'ModelMart ID Not Matched';
        alert("ModelMart ID Not Matched");
      }

    }
  }


  onUpload() {
    this.check = false;
    debugger;
    if (this.selectedFiles === null || this.selectedFiles === undefined) {

      this.toastr.warning("Please upload the file.")
    }
    else if (this.modelTypesID == 2) {
      this.fileUploadService.uploadexceldata(this.yellowmodeldata).subscribe({
        next: (res) => {
          this.toastr.success("Excel data Inserted Successfully");
          this.SpinnerService.hide('spinner');
          this.addSuccess = false;
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

        },
      });
    }

    this.yellowmodeldata = this.demodata

  }

  getArr1: any;
  DebriefDate: any;
  Region: any;


  async addModalMethod(rowIndex: any) {
    debugger;
    this.getAUID = 0;
    this.addSuccess = false;
    this.editRowIndex = rowIndex;
    this.imagePath = this.getArr[this.editRowIndex].partName + "-" + this.getArr[this.editRowIndex].partNumber;

    this.DebriefDate = this.getArr[rowIndex].debriefDate
    this.Region = this.getArr[rowIndex].suppManuLoc
    this.selectedPartName = this.getArr[rowIndex].partName
    this.selectedPartNumber = this.getArr[rowIndex].partNumber
    console.log(this.getArr)
    this.getArr1 = [];

    this.fileUploadService.AddUploadDataValidation(this.DebriefDate, this.Region, this.selectedPartName, this.selectedPartNumber).subscribe(
      (_result: any) => {
        this.getArr1 = _result;
        console.log("view added data", this.getArr1)
        console.log(this.getArr);
        var IsIteration = true;

        if (this.getArr1.length >= 0) {
          if (this.getArr1.length > 0 && (this.getArr[0].iterationsCount > this.getArr1[0].iterationCount)) {
            if (confirm("This Model Mart Id ahve Iteration. Are you sure you want to Add Iteration.")) {
              IsIteration = true
            }
            else {
              IsIteration = false;
            }
          }

          if (IsIteration)
            if (this.modelTypesID == 2) {
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
              this.fileUploadService.addSendRequest(this.sendRequest).subscribe({
                next: (_res) => {
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

            else if (!this.onBlurCheckValidation()) {
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

              this.fileUploadService.addSendRequest(this.sendRequest).subscribe({
                next: (_res) => {
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

    this.SpinnerService.show('spinner');

    const data = await this.fileUploadService.ReadHoppercolumns().toPromise();
    this.HopperColumns = data;
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

    if (e.length == 1) {
      this.selectedPartSpecific = e[0];
      return;
    }
    if (e.length > 1) {
      this.toastr.warning("Please select only one Part Secification");
      this.selectedPartSpecific = '';
      return;
    }

  }
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


  async BulkUpload() {

    //     if (this.modelTypesID === '' || this.modelTypesID === null || this.modelTypesID === undefined) {
    //       this.showError11 = true;
    //       return
    //     }
    // debugger
    //     if (this.modelTypesID == 2) 
    //     {
    //       console.log(this.modelTypesID);
    //       if (confirm("Are you sure want to start Bulk Upload"))
    //       {

    //         this.SpinnerService.show('spinner');
    //         const data = await this.fileUploadService.yellowbulkupload(this.userId, this.modelTypesID).toPromise();
    //         debugger;
    //         if (data == null) {
    //           this.toastr.success("Bulk Upload Completed.")
    //           this.SpinnerService.hide('spinner');
    //         }
    //         if(data!=null)
    //         {
    //           this.toastr.error("Failed MMID")
    //           this.SpinnerService.hide('spinner');

    //         }
    //         else {
    //           console.error('API call error:', data);
    //           this.toastr.error("Bulk Upload Failed.")
    //           this.SpinnerService.hide('spinner');
    //         }
    //         this.SpinnerService.hide('spinner');
    //       }
    //     }


    if (!this.modelTypesID) {
      this.showError11 = true;
      return;
    }

    if (this.modelTypesID == 2) {
      if (confirm("Are you sure you want to start Bulk Upload?")) {
        this.SpinnerService.show('spinner');

        try {
          const response: any = await this.fileUploadService.yellowbulkupload(this.userId, this.modelTypesID).toPromise();

          if (response.failedIds && response.failedIds.length > 0) {
            this.toastr.error(`Bulk Upload Failed for MMIDs: ${response.failedIds.join(", ")}`,'',{
              timeOut:0,
              progressBar:false,
              closeButton:true
            });
          } else {
            this.toastr.success(response.message || "Bulk Upload Completed.");
          }
        } catch (error) {
          console.error('API call error:', error);
          this.toastr.error("Bulk Upload Failed.");
        } finally {
          this.SpinnerService.hide('spinner');
        }
      }
    }

    else {
      if (confirm("Are you sure want to start Bulk Upload")) {

        this.SpinnerService.show('spinner');
        const data = await this.fileUploadService.getBulkUpload(this.userId, this.modelTypesID).toPromise();

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
    this.modelTypesID=null;

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


