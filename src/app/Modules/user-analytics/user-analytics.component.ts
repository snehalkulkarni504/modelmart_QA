import { Component } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-analytics',
  templateUrl: './user-analytics.component.html',
  styleUrl: './user-analytics.component.css'
})
export class UserAnalyticsComponent {
  useranalytics!: FormGroup

  constructor(private datePipe: DatePipe,private location: Location) { }

  chartDataPoints = [
    { label: 'Tech Purchasing', y: 19 },
    { label: 'Direct Sourcing', y: 24 },
    { label: 'Category Sourcing Manager', y: 9 },
    { label: 'Catgeory Access', y: 12 },
    { label: 'Tech Sourcing CGT', y: 32 },
  ];

  chartModulePoints = [
    { label: 'Search', y: 54 },
    { label: 'Reports', y: 29 },
    { label: 'Simulation', y: 36 }  
  ];
  TeamcountArray = [
    { Team: 'Tech Purchasing', Count: 19 },
    { Team: 'Direct Sourcing', Count: 24 },
    { Team: 'Category Sourcing Manager', Count: 9 },
    { Team: 'Catgeory Access', Count: 12 },
    { Team: 'Tech Sourcing CGT', Count: 32 },
  ];

  ngOnInit(): void {
    // this.chartDataPoints = this.TeamcountArray.map(item => ({
    //   label: item.Team, 
    //   y: item.Count 
    // }));
    // console.log(this.chartDataPoints)

  }

  UserData=[
    { UsageStats: 'Active Users', Count: 19 },
    { UsageStats: 'Application Logins', Count: 24 },
    { UsageStats: 'Average Usage time per user', Count: 9 },
    { UsageStats: 'Unique User Logins', Count: 32 },
  ];

  

  PagecountArray = [
    { Page: 'Search', Count: '54' },
    { Page: 'Reports', Count: '29' },
    { Page: 'Simulation', Count: '36' }  
  ];

  PagetimeArray = [
    { Page: 'Search', Count: 5 },
    { Page: 'Project', Count: 3.5 },
    { Page: 'Simulation', Count: 2 },
    { Page: 'Cat Management', Count: 2 } ,
    { Page: 'Request', Count: 1.5 }  
  ];

  chartPagetimePoints = [
    { label: 'Search', y: 5 },
    { label: 'Project', y: 3.5 },
    { label: 'Simulation', y: 2 },
    { label: 'Cat Management', y: 2 } ,
    { label: 'Request', y: 1.5 }  
  ];

  


  columnChartOptions = {
    animationEnabled: true,
    title: {
      text: 'Usage by Roles',
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: 'column',
        dataPoints: this.chartDataPoints
      },  
    ],
  };

  columnModuleOptions = {
    animationEnabled: true,
    title: {
      text: 'Usage by Module',
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: 'pie',
        dataPoints: this.chartModulePoints
      },  
    ],
  };

  columnpagetimeOptions = {
    animationEnabled: true,
    title: {
      text: 'Average time spent per page',
    },
    axisX: {
      title: "Time in Hrs",
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: 'column',
        dataPoints: this.chartPagetimePoints
      },  
    ],
  };

  

 

  backToPreviousPage() {
    this.location.back();
  }

  exportToExcel(): void {

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.UserData);

       // Apply formatting to header (first row)
  const headerCells = Object.keys(this.UserData[0]).map((_, index) =>
  XLSX.utils.encode_cell({ c: index, r: 0 })  // Get cell address like A1, B1, C1
);

headerCells.forEach(cell => {
  if (!ws[cell]) return;
  ws[cell].s = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },   // Bold, white text
    fill: { fgColor: { rgb: '4CAF50' } },            // Green background
    alignment: { horizontal: 'center' }              // Center align text
  };
});
      
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const currentDate = new Date();
      const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
      const fileName = `ModelMart_Stats_${formattedDate}.xlsx`;
      XLSX.writeFile(wb, fileName, { bookType: 'xlsx', cellStyles: true });


    }


}
