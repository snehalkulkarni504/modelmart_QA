import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output, output, Pipe, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';
import { pipe } from 'rxjs';
import { SearchService } from 'src/app/SharedServices/search.service';
import * as XLSX from 'xlsx';


interface TableRow {
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
  imports: [CommonModule, FormsModule,NgSelectModule, NgbPagination, NgxPaginationModule],
  templateUrl: './design-to-cost.component.html',
  styleUrls: ['./design-to-cost.component.css']
})

export class DesignToCostComponent {

  @Input() PartNumber:any;
  @Input() ProgramName:any;
  @Input() NounName:any;
  @Input() table_Data=[];
  @Output() saveTrigger: EventEmitter<any> = new EventEmitter();


  config: any;
  page: number=1;
  pageSize: number=5;
  page2: number=1;
  page3:number=1;
  itemonperpage: number=5;

  FilterData:any[]=[];
  selectedFilteredData: [] = [];

  constructor(public searchservice: SearchService){
    this.config={
      currentPage:1,
      itemsPerPage:10
    }
  }

  columnNames: string[] = [];
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


  

  async ngOnInit(){
    // // console.log("ucProgramName",this.ProgramName);
    // // console.log("ucPartNumber",this.PartNumber);
    // // console.log("ucNounName",this.NounName);

    // this.columnNames = Object.keys(this.tableData[0]);
    // console.log("this.columnNames",this.columnNames);

    // // if(changes["ProgramName"]){
    //   if(this.tableData.length <=0){  
    //     //call api -- 
    //   //  console.log("SucProgramName",this.ProgramName);
    //   //  console.log("SucPartNumber",this.PartNumber);
    //   //  console.log("SucNounName",this.NounName);

    //   // console.log("we are waiting");
    //   // const data = await this.searchservice.GetDesignToCostDetails(this.ProgramName).toPromise();
    //   // console.log("data",data);

    //   }
    //   else
    //   {
    //     this.columnNames = Object.keys(this.tableData[0]);
    //     console.log("we are waiting");
    //     const data = await this.searchservice.GetDesignToCostDetails(this.ProgramName).toPromise();
    //     console.log("data",data);
    //   }

    //    // Initialize filteredTableData with all data
    // // this.filteredTableData = [...this.tableData];
    // this.filteredPartNumberTableData_original = this.tableData.filter(row => row.PartNumber === this.PartNumber);
    // this.filteredNounNameTableData_original = this.tableData2.filter(row => row.NounName === this.NounName);
    // this.filteredNonunProgramTableData_original = this.tableData3.filter(row => row.NounName === this.NounName && row.Program === row.Program);


    // this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
    // this.filteredNounNameTableData =[...this.filteredNounNameTableData_original];
    // this.filteredNonunProgramTableData = [...this.filteredNonunProgramTableData_original];
    // // } 
  }

  onValueChange(): void {
    // Filter the tableData based on the selected column and value
   
    if (this.selectedColumn && this.selectedValue) {
      this.filteredPartNumberTableData = this.filteredPartNumberTableData_original.filter(row => row[this.selectedColumn as keyof TableRow] === this.selectedValue);
    } else {
      // If no value is selected, show all data
      this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
    }
  }


  onValueChange2(): void {
    // Filter the tableData based on the selected column and value
    if (this.selectedColumn2 && this.selectedValue2) {
      this.filteredNounNameTableData = this.filteredNounNameTableData_original.filter(row => row[this.selectedColumn2 as keyof TableRow] === this.selectedValue2);
    } else {
      // If no value is selected, show all data
      this.filteredNounNameTableData = [...this.filteredNounNameTableData_original];
    }
  }

  onValueChange3(): void {
    // Filter the tableData based on the selected column and value
    if (this.selectedColumn3 && this.selectedValue3) {
      this.filteredNonunProgramTableData = this.filteredNonunProgramTableData_original.filter(row => row[this.selectedColumn3 as keyof TableRow] === this.selectedValue3);
    } else {
      // If no value is selected, show all data
      this.filteredNonunProgramTableData = [...this.filteredNonunProgramTableData_original];
    }
  }

  async ngOnChanges(changes: SimpleChanges){
    console.log("ucProgramName",this.ProgramName);
    console.log("ucPartNumber",this.PartNumber);
    console.log("ucNounName",this.NounName);


    if(this.PartNumber!=undefined && this.NounName!=undefined && this.ProgramName !=undefined){
    // if(changes["ProgramName"]){
      if(this.filteredPartNumberTableData_original.length <=0 || this.filteredNonunProgramTableData_original.length <=0 || this.filteredNounNameTableData_original.length <=0){  
         if(this.PartNumber != undefined){
          this.getTabeleDataForPartNumber(this.PartNumber);
         }
         if(this.NounName != undefined){
          this.getTableDataforNoun(this.NounName);
         }
         if(this.NounName!= undefined && this.ProgramName!= undefined){
          this.getTableDataforNounProgram(this.NounName, this.ProgramName);
         }
          // this.columnNames = Object.keys(this.tableData[0]);

      }
      // else
      // {
      //   // this.columnNames = Object.keys(this.tableData[0]);
      //   // console.log("we are waiting");
      //   // const data = await this.searchservice.GetDesignToCostDetails(this.ProgramName).toPromise();
      //   // console.log("data",data);
      // }

      debugger;
       // Initialize filteredTableData with all data
    // this.filteredTableData = [...this.tableData];
    // console.log("this.tableData",this.tableData);
    // this.filteredPartNumberTableData_original = this.tableData;
    // // this.tableData.filter(row => row.PartNumber === this.PartNumber);
    // this.filteredNounNameTableData_original = this.tableData.filter(row => row.NounName === this.NounName);
    // this.filteredNonunProgramTableData_original = this.tableData.filter(row => row.NounName === this.NounName && row.Program === row.Program);


    // this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
    // this.filteredNounNameTableData =[...this.filteredNounNameTableData_original];
    // this.filteredNonunProgramTableData = [...this.filteredNonunProgramTableData_original];


    // console.log("this.filteredPartNumberTableData",this.filteredPartNumberTableData);
   
    }

  }

  getTabeleDataForPartNumber(PartNumber: any){
    this.searchservice.GetDesignToCostPart(PartNumber)
    .subscribe({
      next: (response) => {
        console.log('get data for part number:', response);
        this.filteredPartNumberTableData_original= response;

        this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
      },
      error: (error) => {
        console.error('get data for part number failed:', error);
        alert(error);
      },
      complete: () => {
        if(this.filteredPartNumberTableData.length>0){
          this.columnNames = Object.keys(this.filteredPartNumberTableData[0]);
        }
      },
    });
  }

  getTableDataforNoun(NounName: any){
    this.searchservice.GetDesignToCostNoun(NounName)
    .subscribe({
      next: (response) => {
        console.log('get data for Noun Name:', response);
        this.filteredNounNameTableData_original= response;
        this.filteredNounNameTableData =[...this.filteredNounNameTableData_original];
      },
      error: (error) => {
        console.error('get data for Noun Name failed:', error);
        alert(error);
      },
      complete: () => {
        if(this.filteredNounNameTableData.length>0){
          this.columnNames = Object.keys(this.filteredNounNameTableData[0]);
        }
      },
    });
  }

  getTableDataforNounProgram(NounName: any, Porgram: any){
    this.searchservice.GetDesignToCostNounProgram(NounName, Porgram)
    .subscribe({
      next: (response) => {
        console.log('get data for Noun Name:', response);
        this.filteredNonunProgramTableData_original= response;
        this.filteredNonunProgramTableData = [...this.filteredNonunProgramTableData_original];
      },
      error: (error) => {
        console.error('get data for NounName & Program failed:', error);
        alert(error);
      },
      complete: () => {
        if(this.filteredNonunProgramTableData.length>0){
          this.columnNames = Object.keys(this.filteredNonunProgramTableData[0]);
        }
      },
    });
  }

  onColumnChange(): void {
    // Reset the selected value and filtered table
    
    this.columnValues = [];
    this.isSecondDropdownDisabled = true;
    debugger;
    console.log("this.selectedColumn",this.selectedColumn);
    this.selectedValue = '';
    this.filteredPartNumberTableData = [...this.filteredPartNumberTableData_original];
    if (this.selectedColumn) {
      this.isSecondDropdownDisabled = false;
      this.columnValues = [
        ...new Set(
          this.filteredPartNumberTableData_original
            .map(row => row[this.selectedColumn as keyof TableRow])
            .filter(value => value !== null && value !== undefined) // Filter out null and undefined values
        )
      ];
    } else {
      this.isSecondDropdownDisabled = true;
      this.columnValues = [];
    }
  }
  onColumnChange2(): void {
    this.selectedValue2 = '';
    this.filteredNounNameTableData = [...this.filteredNounNameTableData_original];

    // Enable the second dropdown and populate it with values of the selected column
    if (this.selectedColumn2) {
      this.isSecondDropdownDisabled2 = false;
      this.columnValues2 = [...new Set(this.filteredNounNameTableData_original.map(row => row[this.selectedColumn2 as keyof TableRow]))];
    } else {
      // If no column is selected, disable the second dropdown
      this.isSecondDropdownDisabled2 = true;
      this.columnValues2 = [];
    }
  }

  onColumnChange3(): void {
    // Reset the selected value and filtered table
    this.selectedValue2 = '';
    this.filteredNonunProgramTableData = [...this.filteredNonunProgramTableData_original];
    // Enable the second dropdown and populate it with values of the selected column
    if (this.selectedColumn3) {
      this.isSecondDropdownDisabled3 = false;
      this.columnValues3 = [...new Set(this.filteredNonunProgramTableData_original.map(row => row[this.selectedColumn3 as keyof TableRow]))];
    } else {
      // If no column is selected, disable the second dropdown
      this.isSecondDropdownDisabled3 = true;
      this.columnValues3 = [];
    }
  }

  ngOnDestroy(){
    // this.TableData[];
    console.log("destroyed");
    // this.saveTrigger.emit("test");   
  }

  // ngAfterViewInit(){

  // }

  selectedRow: TableRow | null = null;
  searchText: string = '';  // Search term

  headers: string[] = [
    'Idea', 'Noun Name', 'Program', 'BU', 'Mfg Location', 'Comments', 
    'Potential Savings PP', 'Feasibility', 'Idea Owner', 'Idea Generated On', 
    'Current Status', 'Engg Comment', 'Final Solution'
  ];

  // tableKeys: (keyof TableRow)[] = [
  //   'Idea', 'NounName', 'Program',  
  //   'PotentialSavingsPerPieceMDO', 'Feasibility', 'IdeaOwner', 
  //   'CurrentStatus'
  // ];

  // tableData: TableRow[] = [
  //   { Idea: 'New Innovation', NounName: 'Tech Upgrade', Program: 'AI Initiative', PartNumber: 'IT',  PotentialSavingsPP: '$10K', Feasibility: 'High', IdeaOwner: 'John Doe',  CurrentStatus: 'Approved' },
  //   { Idea: 'Process Optimization', NounName: 'Workflow', Program: 'Lean Six Sigma', PartNumber: 'Manufacturing',  PotentialSavingsPP: '$20K', Feasibility: 'Medium', IdeaOwner: 'Jane Smith',  CurrentStatus: 'Under Review' }
  // ];
  // tableData: TableRow[]=[];

  // tableData: TableRow[] = [
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector Allied connectors as an alternate manufacturer for Amphenol', NounName: 'HARNESS,WIRING', Program: 'Barracuda', PartNumber: '123456',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' },
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'HOUSING,FLYWHEEL', Program: 'Olympus', PartNumber: '12345',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' }
  // ];

  // tableData2: TableRow[] = [
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'Crankshaft', Program: 'Olympus', PartNumber: 'EBU',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector', NounName: 'Crankshaft', Program: 'Barracuda', PartNumber: 'EBU',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' }
  // ];

  // tableData3: TableRow[] = [
  //   { Idea: 'Can we reduce wall thicknesss for the part to make it suitable for HPDC ?', NounName: 'Crankshaft', Program: 'baracudda', PartNumber: 'EBU',   PotentialSavingsPerPieceMDO: '4.06', Feasibility: 'Need further investigation', IdeaOwner: 'Rupesh A Solanke', CurrentStatus: 'Idea Submitted' },
  //   { Idea: 'Allied connectors as an alternate manufacturer for Amphenol AHDP06-18-21SN-WTA – 21 Pos circular connector', NounName: 'Crankshaft', Program: 'baracudda', PartNumber: 'EBU',  PotentialSavingsPerPieceMDO: '1.32', Feasibility: 'Not-Feasible', IdeaOwner: 'Anshul Arora',  CurrentStatus: 'Need further investigation' }
  // ];
  selectRow(row: TableRow) {
    this.selectedRow = row; // Store selected row
  }

  async toggleSupplierSelection() {
    // const isChecked = (event.target as HTMLInputElement).checked;
    // if (isChecked) {
    //   this.selectedsuppliers.push(supp);
    // } else {
    //   const index = this.selectedsuppliers.indexOf(supp);
    //   if (index > -1) {
    //     this.selectedsuppliers.splice(index, 1);
    //   }
    // }
    // console.log('onchange',this.selectedsuppliers)
    // await this.FillPODropdown();
    // await this.filterTableData();
  }

  // Filter data for each table
  // get filteredData1() {
  //   return this.tableData.filter(row => 
  //     row.Idea.toLowerCase().includes(this.searchText.toLowerCase()) || 
  //     row.NounName.toLowerCase().includes(this.searchText.toLowerCase()) || 
  //     row.Program.toLowerCase().includes(this.searchText.toLowerCase())
  //   );
  // }

  // get filteredData2() {
  //   return this.tableData.filter(row => 
  //     row.NounName.toLowerCase().includes(this.searchText.toLowerCase()) || 
  //     row.Program.toLowerCase().includes(this.searchText.toLowerCase())
  //   );
  // }

  // get filteredData3() {
  //   return this.tableData.filter(row => 
  //     row.NounName.toLowerCase().includes(this.searchText.toLowerCase()) && 
  //     row.Program.toLowerCase().includes(this.searchText.toLowerCase())
  //   );
  // }

  // Export function (add your own export logic here)
  exportToExcel(data: any[], fileName: string): void {
    if (!data || data.length === 0) {
      alert('No data provided to export.');
      return;
    }

    // Convert the array to a worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Create a workbook and add the worksheet
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, fileName);
  }
}
