import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { SearchService } from 'src/app/SharedServices/search.service';
import { environment } from 'src/environments/environments';
import * as XLSX from 'xlsx';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

interface TableRow {
  id: string;
  sharepoint_ID: string;
  idea: string;
  nounName: string;
  program: string;
  partNumber: string;
  potentialSavingsPerPieceMDO: string;
  feasibility: string;
  ideaOwner: string;
  currentStatus: string;
  ideaSelected: string;
}

@Component({
  selector: 'app-designtocost-step3',
  standalone: false,
  // imports: [],
  templateUrl: './designtocost-step3.component.html',
  styleUrl: './designtocost-step3.component.css'
})

export class DesigntocostStep3Component {

  PartNumber: any;
  ProgramName: any;
  NounName: any;

  filteredData: any[] = [];
  searchFilters: any = {
    Idea: '',
    Sharepoint_ID: '',
    program: '',
    partNumber: '',
    potentialSavingsPerPieceMDO: '',
    ideaOwner: ''
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

  FilterData: any[] = [];
  selectedFilteredData: [] = [];

  constructor(private searchService: SearchService, private location: Location, public router: Router) {
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

    this.PartNumber = localStorage.getItem("DTCPartNumber");
    this.ProgramName = localStorage.getItem("DTCProgramName");
    this.NounName = localStorage.getItem("DTCNounName");

    // this.PartNumber = '6326107';
    // this.ProgramName = 'Beagle';
    // this.NounName = 'HOUSING,TURBINE';

    this.gettabledata();
  }

  // onValueChange(): void {
  //   let column: any;
  //   if (this.selectedColumn && this.selectedValue) {
  //     column = this.getUpdatedColumnname(this.selectedColumn);
  //     this.filteredPartNumberTableData = this.filteredPartNumberTableData_original.filter(row => row[column as keyof TableRow] === this.selectedValue);
  //   } else {
  //     this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
  //   }
  // }

  // async ngOnChanges(changes: SimpleChanges) {
  //   debugger;
  //   this.gettabledata();
  // }

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


  getTabeleDataForPartNumber(PartNumber: any) {
    this.searchService.GetDesignToCostPart(PartNumber)
      .subscribe({
        next: (response: any) => {
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

  checkall = "Select All";
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

    const allch = document.getElementsByClassName('select-checkboxAll') as any;
    if (this.selectedIdeaIds.length == this.filteredPartNumberTableData_original.length) {
      allch[0].checked = true;
      this.checkall = "Unselect All";

    }
    else {
      allch[0].checked = false;
      this.checkall = "Select All";
    }

  }

  SelectedAll(event: any) {
    debugger;
    this.selectedIdeaIds = [];
    const checkall = document.getElementsByClassName('select-checkbox') as any;
    for (var value of checkall) {
      if (event.target.checked) {
        value.checked = true
        this.selectedIdeaIds.push(parseInt(value.id));
        this.checkall = "Unselect All";
      } else {
        value.checked = false;
        this.selectedIdeaIds = this.selectedIdeaIds.filter(selectedId => selectedId !== parseInt(value.id));
        this.checkall = "Select All";
      }
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

    this.filteredData = this.filteredPartNumberTableData.filter(item => {
      return Object.keys(this.searchFilters).every(key => {
        if (!this.searchFilters[key]) return true;

        // Type assertion
        const itemValue = String((item as any)[key] || '').toLowerCase();
        const filterValue = (this.searchFilters as any)[key].toLowerCase();

        return itemValue.includes(filterValue);
      });
    });

    this.filteredPartNumberTableData_original = this.filteredData;

    this.page = 1;
  }

  backToPreviousPage() {
    this.location.back();
  }

}
