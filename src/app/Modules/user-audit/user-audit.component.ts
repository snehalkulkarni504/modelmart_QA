import { Component,Input} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import { Tab } from '../tabs/tab';
import { SearchData,ProjectData,CompareData } from 'src/app/Model/UserAuditReport';

@Component({
  selector: 'app-user-audit',
  templateUrl: './user-audit.component.html',
  styleUrl: './user-audit.component.css'
})
export class UserAuditComponent {
  useraudit!: FormGroup
  selectedUserName: any;
  getUsers: any = {};
  searchdata: SearchData[]=[];
  projectdata: ProjectData[]=[];
  comparedata: CompareData[]=[];
  tempcomparedata: CompareData[]=[];
  filteredsearchdata: SearchData[]=[];
  filteredprojectdata: ProjectData[]=[];
  //filteredcomparedata: []=[];
  filteredcomparedata: Record<
    string,
    {
      UserId: number;
      CompareId: number;
      CreatedOn: Date;
      Details: { ModelMartId: string; ProgramName: string }[];
    }
  > = {};
  selectedTab: string = 'search';
  selectedFromDate: any;
  selectedToDate: any;
  filterMetadata = { count: 0 };
  filterMetadata1 = { count: 0 };
  textsearch: string = '';
  page: number = 1;
  page1: number = 1;
  pageSize: number = 10;

  constructor(private datePipe: DatePipe,
    public router: Router,private location: Location, private SpinnerService: NgxSpinnerService,
    private adminService: AdminService,private reportservice :ReportServiceService) { }

    ngOnInit(): void {

      this.useraudit = new FormGroup({
        currentDate: new FormControl()
      });

      this.getUsersList();

     
    }

    getUsersList() {
      debugger;
      this.adminService.GetUsersList().subscribe((_result: any) => {
        this.getUsers = _result;
        //console.log('users list', this.getUsers)
      })
    }

    getSearchList() {
      debugger;
      this.reportservice.getUserLogData(this.selectedUserName).subscribe({
        next: (_res:any) => {
        console.log('list', _res)
        this.searchdata = _res.searchdata;
        this.comparedata = _res.comparedata;
        this.filteredsearchdata= [...this.searchdata];
        this.groupItems(this.comparedata);
        console.log('search list', this.filteredsearchdata)
        console.log('compare list', this.filteredcomparedata)
        },
        error: (error: any) => {
          console.error('API call error:', error);
        },
      })
    }

    getProjectList() {
      debugger;
      this.reportservice.getUserProjectData(this.selectedUserName).subscribe((_result: any) => {
        this.projectdata = _result;
        this.filteredprojectdata= [...this.projectdata];
        //console.log('users list', this.getUsers)
      })
    }
    
    changeTab(tabname: string) {
      this.selectedTab = tabname;
    }
	
	serachArray = [
      { Action: 'Search', SearchKey: 'Turkey', ActionDate: '2025-01-18 21:08:37.837' },
      { Action: 'Search', SearchKey: 'Forgings', ActionDate: '2025-01-17 16:59:37.220' },
      { Action: 'Search', SearchKey: 'Mechanical Systems', ActionDate: '2025-01-17 16:28:11.217' },
    ];

  GetUserhistory()
  {
    console.log(this.selectedUserName)
    this.getSearchList();
    this.getProjectList();
  }

  backToPreviousPage() {
    this.location.back();
  }

  filterTableData() {
    console.log(this.selectedUserName)
    if (this.selectedUserName) {
      console.log('123')
      const frompodate = new Date(new Date(String(this.selectedFromDate)).getFullYear(),
      new Date(String(this.selectedFromDate)).getMonth(), new Date(String(this.selectedFromDate)).getDate())
      frompodate.toString(); // Convert back to string format
      const topodate = new Date(new Date(String(this.selectedToDate)).getFullYear(),
      new Date(String(this.selectedToDate)).getMonth(), new Date(String(this.selectedToDate)).getDate())
      topodate.toString(); 
  
      
      console.log('Selected To date:', topodate);
  
      this.filteredsearchdata = this.searchdata.filter(data => {
        const POdate  = new Date(new Date(String(data.CreatedOn)).getFullYear(),
        new Date(String(data.CreatedOn)).getMonth(), new Date(String(data.CreatedOn)).getDate())
        topodate.toString(); 
        return ((!this.selectedFromDate  ||POdate >= frompodate)
         && (!this.selectedToDate  ||POdate <= topodate))
      });

      this.filteredprojectdata = this.projectdata.filter(data => {
        const POdate  = new Date(new Date(String(data.CreatedOn)).getFullYear(),
        new Date(String(data.CreatedOn)).getMonth(), new Date(String(data.CreatedOn)).getDate())
        topodate.toString(); 
        return ((!this.selectedFromDate  ||POdate >= frompodate)
         && (!this.selectedToDate  ||POdate <= topodate))
      });

      
      this.tempcomparedata = this.comparedata.filter(data => {
        const POdate  = new Date(new Date(String(data.CreatedOn)).getFullYear(),
        new Date(String(data.CreatedOn)).getMonth(), new Date(String(data.CreatedOn)).getDate())
        topodate.toString(); 
        return ((!this.selectedFromDate  ||POdate >= frompodate)
         && (!this.selectedToDate  ||POdate <= topodate))
      });
      this.groupItems(this.tempcomparedata);

    } else {
      this.filteredsearchdata= [...this.searchdata];
      this.filteredprojectdata= [...this.projectdata];
    }
    // this.totalPages = Math.ceil(this.filteredTableData.length / this.itemsPerPage);
     //this.updatePagination();
  }

  groupItems(list:CompareData[]=[]) {
    this.filteredcomparedata = list.reduce((acc, item) => {
      const key = `${item.CompareId}`;
      if (!acc[key]) {
        acc[key] = {
          UserId: item.UserId,
          CompareId: item.CompareId,
          CreatedOn: item.CreatedOn,
          Details: [],
        };
      }
      acc[key].Details.push({ ModelMartId: item.ModelMartId, ProgramName: item.ProgramName });
      return acc;
    }, {} as Record<string, { UserId: number; CompareId: number; CreatedOn: Date; Details: { ModelMartId: string; ProgramName: string }[] }>);
    console.log(this.filteredcomparedata)
}

}