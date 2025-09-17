import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, input, Output, output, Pipe, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';
import { pipe } from 'rxjs';
import { SearchService } from 'src/app/SharedServices/search.service';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environments';


interface TableRow {
  sharepoint_ID: string;
  idea: string;
  nounName: string;
  program: string;
  partNumber: string;
  potentialSavingsPerPieceMDO: string;
  feasibility: string;
  ideaOwner: string;
  currentStatus: string;
}

@Component({
  selector: 'app-design-to-cost',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, NgbPagination, NgxPaginationModule],
  templateUrl: './design-to-cost.component.html',
  styleUrls: ['./design-to-cost.component.css']
})

export class DesignToCostComponent {

  @Input() PartNumber: any;
  @Input() ProgramName: any;
  @Input() NounName: any;
  @Input() table_Data = [];
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();

  message: any = "| No Ideas found...";
  config: any;
  page: number = 1;
  pageSize: number = 10;
  page2: number = 1;
  page3: number = 1;
  itemonperpage: number = 10;

  FilterData: any[] = [];
  selectedFilteredData: [] = [];

  constructor(public searchservice: SearchService) {
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
  userId: any;

  async ngOnInit() {
    debugger;
    this.userId = localStorage.getItem("userId");
  }

  onValueChange(): void {
    let column: any;
    if (this.selectedColumn && this.selectedValue) {
      column = this.getUpdatedColumnname(this.selectedColumn);
      this.filteredPartNumberTableData = this.filteredPartNumberTableData_original.filter(row => row[column as keyof TableRow] === this.selectedValue);
    } else {
      this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    //console.log("ucProgramName",this.ProgramName);
    //console.log("ucPartNumber",this.PartNumber);
    //console.log("ucNounName",this.NounName);

    debugger;
    this.gettabledata();

  }



  // gettabledata() {
  //   this.searchservice.GetDesignToCostAvailableDetail(this.NounName, this.ProgramName, this.PartNumber,this.userId)
  //     .subscribe({
  //       next: (response) => {
  //         debugger;
  //         //console.log('get data :', response);
  //         this.filteredPartNumberTableData_original = response;

  //         //console.log("response",response);
  //         if (this.filteredPartNumberTableData_original.length > 0) {
  //           this.filteredPartNumberTableData_original.forEach((element, index) => {
  //             this.filteredPartNumberTableData_original[index].sharepoint_ID = element.sharepoint_ID.toString();
  //           })

  //           this.IsNoData = false;
  //         }
  //         else{
  //           this.IsNoData = true;
  //         }
  //         //console.log("this.filteredPartNumberTableData_original",this.filteredPartNumberTableData_original);

  //         this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
  //         this.filteredData = [...this.filteredPartNumberTableData];
  //       },
  //       error: (error) => {
  //         //console.error('get data for part number failed:', error);
  //         //alert(error);
  //         this.IsNoData = true;
  //       },
  //       complete: () => {
  //         this.selectedColumn = "---Select Filter---";
  //       },
  //     });
  // }

  gettabledata() {
    //debugger;
    this.searchservice.GetDesignToCostDataAccordignUser(this.NounName, this.ProgramName, this.PartNumber, this.userId)
      .subscribe({
        next: (response: any) => {
         // debugger;
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
    this.searchservice.GetDesignToCostPart(PartNumber)
      .subscribe({
        next: (response) => {
          //console.log('get data for part number:', response);
          this.filteredPartNumberTableData_original = response;

          this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
        },
        error: (error) => {
          //console.error('get data for part number failed:', error);
          //alert(error);
        },
        complete: () => {
          this.selectedColumn = "---Select Filter---";
        },
      });
  }

  getTableDataforNoun(NounName: any) {
    this.searchservice.GetDesignToCostNoun(NounName)
      .subscribe({
        next: (response) => {
          //console.log('get data for Noun Name:', response);
          this.filteredNounNameTableData_original = response;
          this.filteredNounNameTableData = [...this.filteredNounNameTableData_original];
        },
        error: (error) => {
          //console.error('get data for Noun Name failed:', error);
          //alert(error);
        },
        complete: () => {
          this.selectedColumn2 = "---Select Filter---";

        },
      });
  }

  getTableDataforNounProgram(NounName: any, Porgram: any) {
    this.searchservice.GetDesignToCostNounProgram(NounName, Porgram)
      .subscribe({
        next: (response) => {
          //console.log('get data for Noun Name:', response);
          this.filteredNonunProgramTableData_original = response;
          this.filteredNonunProgramTableData = [...this.filteredNonunProgramTableData_original];
        },
        error: (error) => {
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

  // onColumnChange(): void {
  //   let column: any;
  //   this.columnValues = [];
  //   this.isSecondDropdownDisabled = true;
  //   debugger;
  //   //console.log("this.selectedColumn",this.selectedColumn);
  //   this.selectedValue = '';
  //   this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
  //   if (this.selectedColumn) {
  //     column = this.getUpdatedColumnname(this.selectedColumn);
  //     this.isSecondDropdownDisabled = false;
  //     this.columnValues = [
  //       ...new Set(
  //         this.filteredPartNumberTableData_original
  //           .map(row => row[column as keyof TableRow])
  //           .filter(value => value !== null && value !== undefined)
  //       )
  //     ];
  //     this.selectedValue = "---Select Value---";
  //   } else {
  //     this.isSecondDropdownDisabled = true;
  //     this.columnValues = [];
  //   }
  // }

  onColumnChange(): void {
    let column: any;
    this.columnValues = [];
    this.isSecondDropdownDisabled = true;
    //debugger;
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
            .map(value => String(value))
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
    let fileName = "VAVE Ideas for Part No - " + this.NounName + ".xlsx";
    if (!data || data.length === 0) {
      //alert('No data provided to export.');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };

    XLSX.writeFile(workbook, fileName);
  }

OpenVBD(BusinessUnit: string): void {
    debugger;
    let link = '';
  
    switch (BusinessUnit) {
      case 'EBU':
        link = environment.VBDLink_EBU;
        break;
      case 'PSBU':
        link = environment.VBDLink_PSBU;
        break;
      case 'Accelera':
        link = environment.VBDLink_Accelera;
        break;
       case 'CBU-CTT':
        link = environment.VBDLink_CBUCTT;
        break;
      case 'CBU-CES':
        link = environment.VBDLink_CES;
        break;
      case 'CBU-CE':
        link = environment.VBDLink_CE;
        break;
      case 'CBU-CEC':
        link = environment.VBDLink_CEC;
        break;
      case null:
        link = environment.VBDLinkHopper; // Optional fallback for null or blank
        break;
      case '':
        link = environment.VBDLinkHopper; // Optional fallback for null or blank
        break;
      default:
        link = environment.VBDLinkHopper; // Catch-all fallback
        break;
    }
  
    if (link) {
      window.open(link, '_blank');
    } else {
      console.warn('No link found for BusinessUnit:', BusinessUnit);
    }
  }


  filteredData: any[] = [];
  searchFilters: any = {
    idea: '',
    sharepoint_ID: '',
    program: '',
    partNumber: '',
    potentialSavingsPerPieceMDO: '',
    ideaOwner: ''
  };



  applyFilter() {
    this.filteredData = this.filteredPartNumberTableData.filter(item => {
      return Object.keys(this.searchFilters).every(key => {
        if (!this.searchFilters[key]) return true;

        // Type assertion
        const itemValue = String((item as any)[key] || '').toLowerCase();
        const filterValue = (this.searchFilters as any)[key].toLowerCase();

        return itemValue.includes(filterValue);
      });
    });

    this.page = 1;
  }

}
