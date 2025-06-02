import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { SearchService } from 'src/app/SharedServices/search.service';
import { environment } from 'src/environments/environments';
import * as XLSX from 'xlsx';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { vaveIdeas } from 'src/app/Model/vaveIdeas';
import { AdminService } from 'src/app/SharedServices/admin.service';

interface TableRow {
  idea: string;
  nounName: string;
  program: string;
  partNumber: string;
  potentialSavingsPerPieceMDO: string;
  feasibility: string;
  ideaOwner: string;
  currentStatus: string;
  sharepoint_ID: number | null;
  id: number;
  created: Date | null;
  ideaSelected?: boolean;
  createdBy: string;
}

@Component({
  selector: 'app-designtocost-step3',
  standalone: false,
  // imports: [],
  templateUrl: './designtocost-step3.component.html',
  styleUrl: './designtocost-step3.component.css'
})

export class DesigntocostStep3Component {

  newIdea: TableRow = {
    sharepoint_ID: null,
    idea: '',
    nounName: '',
    program: '',
    partNumber: '',
    potentialSavingsPerPieceMDO: '',
    feasibility: '',
    ideaOwner: '',
    currentStatus: '',
    id: 0,
    created: null,
    createdBy: '',

  };



  PartNumber: any;
  ProgramName: any;
  NounName: any;

  filteredData: any[] = [];
  showIdeaModal: boolean = false;
  searchFilters: any = {
    Idea: '',
    Program: '',
    PartNumber: '',
    PotentialSavingsPerPieceMDO: '',
    IdeaOwner: ''
  };



  @Input() table_Data = [];
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();

  message: any = "| No Ideas found...";
  selectedIdeaIds: number[] = [];
  config: any;
  page: number = 1;
  pageSize: number = 10;
  page2: number = 1;
  page3: number = 1;
  itemonperpage: number = 10;
  showError1: boolean = false;
  showError2: boolean = false;
  showError3: boolean = false;
  FilterData: any[] = [];
  selectedFilteredData: [] = [];

  constructor(private searchService: SearchService,
    private location: Location,
    public router: Router,
    private toastr: ToastrService,
    private adminService: AdminService) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    }
  }

  columnNames: string[] = ['Idea', 'Program', 'Part Number', 'Potential Savings Per Piece', 'Idea Owner'];
  columnValues: string[] = [];
  selectedColumn: string = '';
  selectedValue: string = '';
  filteredPartNumberTableData: TableRow[] = [];
  filteredNounNameTableData: TableRow[] = [];
  filteredNonunProgramTableData: TableRow[] = [];


  filteredPartNumberTableData_original: TableRow[] = [];
  filteredNounNameTableData_original: TableRow[] = [];
  filteredNonunProgramTableData_original: TableRow[] = [];

  isSecondDropdownDisabled: boolean = true;


  selectedColumn2: string = '';
  selectedValue2: string = '';
  columnValues2: string[] = [];
  filteredTableData2: TableRow[] = [];
  isSecondDropdownDisabled2: boolean = true;

  selectedColumn3: string = '';
  selectedValue3: string = '';
  columnValues3: string[] = [];
  filteredTableData3: TableRow[] = [];
  isSecondDropdownDisabled3: boolean = true;
  IsNoData = true;


  async ngOnInit() {
    debugger;
    this.PartNumber = 'LLO90';
    this.ProgramName = 'engine';
    this.NounName = 'HOUSING,TURBINE';

    this.gettabledata();
  }
  gettabledata() {
    debugger;
    this.searchService.GetDesignToCostAvailableDetail(this.NounName, this.ProgramName, this.PartNumber)
      .subscribe({
        next: (response: any) => {
          debugger;
          //console.log('get data :', response);
          this.filteredPartNumberTableData_original = response;

          //console.log("response",response);
          if (this.filteredPartNumberTableData_original.length > 0) {
            this.filteredPartNumberTableData_original.forEach((element, index) => {
              // this.filteredPartNumberTableData_original[index].sharepoint_ID = element.sharepoint_ID.toString();
              this.filteredPartNumberTableData_original[index].sharepoint_ID = element.sharepoint_ID;
            })

            this.IsNoData = false;
          }
          else {
            this.IsNoData = true;
          }
          //console.log("this.filteredPartNumberTableData_original",this.filteredPartNumberTableData_original);

          this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
          this.filteredData = [...this.filteredPartNumberTableData];
          console.log(this.filteredPartNumberTableData_original);
        },
        error: (error: any) => {
          //console.error('get data for part number failed:', error);
          //alert(error);
          this.IsNoData = true;
        },
        complete: () => {
          this.selectedColumn = "---Select Filter---";
        },
      });
  }

  formSubmitted = false;

  onSubmitIdeaForm(form: NgForm) {
    this.formSubmitted = true;
    if (form.valid) {
      // Proceed with form logic
      console.log('Form submitted:', this.newIdea);
    } else {
      console.warn('Form invalid');
    }
  }


  keyPressDecimal(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
      return false;
    }
    else {
      return true;
    }
  }

  //testing method 
  submitIdea(newIdea: any) {
    debugger;
    // Default values for nullable columns
    newIdea.ideaOwner = (localStorage.getItem("userFullName"))
    newIdea.nounName = this.NounName
    newIdea.createdBy = (localStorage.getItem("userId"))
    // newIdea.sharepoint_ID = newIdea.id;


    console.log('Updated data:', newIdea);
    if (!newIdea.sharepoint_ID) {
      newIdea.sharepoint_ID = 0;
    }




    this.adminService.addDesignToCostEntry(newIdea).subscribe({
      next: (response) => {
        console.log('Opportunity saved successfully:', response);
        // alert('Idea added successfully!');
        this.toastr.success("Data Updated Successfully.");

        this.showIdeaModal = false;
        this.gettabledata();


      },
      error: (error) => {
        console.error('Error adding idea:', error);
        //  alert('Failed to add idea.');
        this.toastr.error("Error");

      }
    });
  }
  //


  getTabeleDataForPartNumber(PartNumber: any) {
    this.searchService.GetDesignToCostPart(PartNumber)
      .subscribe({
        next: (response: any) => {
          debugger
          //console.log('get data for part number:', response);
          this.filteredPartNumberTableData_original = response;

          this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
        },
        error: (error: any) => {
          //console.error('get data for part number failed:', error);
          //alert(error);
        },
        complete: () => {
          this.selectedColumn = "---Select Filter---";
        },
      });
  }

  onIdeaSelectedChange(row: any): void {
    debugger;
    const id = row.id; // or row.Sharepoint_ID if needed
    if (row.ideaSelected) {
      if (!this.selectedIdeaIds.includes(id)) {
        this.selectedIdeaIds.push(id);
      }
    } else {
      this.selectedIdeaIds = this.selectedIdeaIds.filter(selectedId => selectedId !== id);
    }
  }

  onNext(): void {
    debugger;
    console.log('Selected IDs:', this.selectedIdeaIds);
    localStorage.setItem("DTCVaveIdea", JSON.stringify(this.selectedIdeaIds));
    this.router.navigate(['/home/designtocost/step4']);
  }

  getTableDataforNoun(NounName: any) {
    this.searchService.GetDesignToCostNoun(NounName)
      .subscribe({
        next: (response: any) => {
          //console.log('get data for Noun Name:', response);
          this.filteredNounNameTableData_original = response;
          this.filteredNounNameTableData = [...this.filteredNounNameTableData_original];
        },
        error: (error: any) => {
          //console.error('get data for Noun Name failed:', error);
          //alert(error);
        },
        complete: () => {
          this.selectedColumn2 = "---Select Filter---";

        },
      });
  }

  getTableDataforNounProgram(NounName: any, Porgram: any) {
    this.searchService.GetDesignToCostNounProgram(NounName, Porgram)
      .subscribe({
        next: (response: any) => {
          //console.log('get data for Noun Name:', response);
          this.filteredNonunProgramTableData_original = response;
          this.filteredNonunProgramTableData = [...this.filteredNonunProgramTableData_original];
        },
        error: (error: any) => {
          //console.error('get data for NounName & Program failed:', error);
          //alert(error);
        },
        complete: () => {
          if (this.filteredNonunProgramTableData.length > 0) {
            this.columnNames = Object.keys(this.filteredNonunProgramTableData[0]);
            this.selectedColumn3 = "---Select Filter---";
          }
        },
      });
  }

  getUpdatedColumnname(column: string) {
    if (column == "Idea") {
      return column = "idea";
    }
    // else if(column=="Noun Name"){
    //   return column="nounName";
    // }
    else if (column == "Program") {
      return column = "program";
    }
    else if (column == "Part Number") {
      return column = "partNumber";
    }
    else if (column == "Potential Savings Per Piece") {
      return column = "potentialSavingsPerPieceMDO";
    }
    else if (column == "Idea Owner") {
      return column = "ideaOwner"
    }
    return null;
  }

  onColumnChange(): void {
    let column: any;
    this.columnValues = [];
    this.isSecondDropdownDisabled = true;
    debugger;
    //console.log("this.selectedColumn",this.selectedColumn);
    this.selectedValue = '';
    this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
    if (this.selectedColumn) {
      column = this.getUpdatedColumnname(this.selectedColumn);
      this.isSecondDropdownDisabled = false;
      this.columnValues = [
        ...new Set(
          this.filteredPartNumberTableData_original
            .map(row => row[column as keyof TableRow])
            .filter(value => value !== null && value !== undefined)
            .map(value => String(value)) // 💡 Convert to string
        )
      ];
      this.selectedValue = "---Select Value---";
    } else {
      this.isSecondDropdownDisabled = true;
      this.columnValues = [];
    }
  }

  ngOnDestroy() {
    //console.log("destroyed"); 
  }


  selectedRow: TableRow | null = null;
  searchText: string = '';

  selectRow(row: TableRow) {
    this.selectedRow = row;
  }

  exportToExcel(data: any[]): void {
    let fileName = "VAVE Ideas for Part Name - " + this.NounName + ".xlsx";
    if (!data || data.length === 0) {
      //alert('No data provided to export.');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };

    XLSX.writeFile(workbook, fileName);
  }
  //LINE NUM 281 IS COMMENTED 

  OpenVBD() {
    window.open(environment.VBDLinkHopper);
  }



  applyFilter() {
    debugger;

    if (!this.filteredPartNumberTableData || this.filteredPartNumberTableData.length === 0) {
      console.error('Data array is empty or not initialized.');
      return;
    }

    this.filteredData = this.filteredPartNumberTableData.filter((item: Record<string, any>) => {
      return Object.entries(this.searchFilters).every(([key, filterValue]) => {
        if (!filterValue) return true; // Skip empty filters

        const itemValue = (item[key] ?? '').toString().toLowerCase();
        return itemValue.includes(filterValue.toString().toLowerCase());
      });
    });

    this.filteredPartNumberTableData_original = [...this.filteredData]; // Ensure Angular detects changes
    this.page = 1;

    console.log('Filtered Data:', this.filteredData);
  }




  //Add new Idea
  openIdeaModal(): void {
    console.log('Add Idea button clicked');

    this.newIdea = {

      sharepoint_ID: null,
      idea: '',
      nounName: '',
      program: '',
      partNumber: '',
      potentialSavingsPerPieceMDO: '',
      feasibility: '',
      ideaOwner: localStorage.getItem('loggedInUserName') || '',
      currentStatus: '',
      id: 0, // default value
      created: null,
      createdBy: '',
    };

    this.showIdeaModal = true;
    this.newIdea.created = new Date();
  }

  backToPreviousPage() {
    this.location.back();
  }

}
