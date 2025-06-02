import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
// declare var bootstrap: any;
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SearchService } from 'src/app/SharedServices/search.service';
import Swal from 'sweetalert2';
import { AdminService } from 'src/app/SharedServices/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeviewConfig, TreeviewItem } from '@charmedme/ngx-treeview';
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';
import { style } from '@angular/animations';
import { ChangeDetectorRef } from '@angular/core';
import { GroupByPipe } from "../group-by.pipe";
import { CommericalArbitrage } from 'src/app/Model/CommericalArbitrage';
import { RegionalArbitrage } from 'src/app/Model/RegionalArbitrage';
import { GetMgfProcessArtibage } from 'src/app/Model/GetMgfProcessArtibage';
import { TcoUploadComponent } from '../Request/tco-upload/tco-upload.component';

@Component({
  // standalone : true,
  selector: 'app-cost-reduction',
  templateUrl: './cost-reduction.component.html',
  styleUrls: ['./cost-reduction.component.css'],
  // imports:[CommonModule,NgbModule,],
})

export class CostReductionComponent implements OnInit {

  editingIndex: number | null = null;

  editingIndexRegional: number | null = null;
  showModal: any;
  selectedComment: any;
  selectedFiles: File[] = [];
  showTcoUploadModal: boolean = false;
  showDocumentUploadModal: boolean = false;
  showcostinsights: boolean = false;
  showFileUpload: boolean = false;

  selectedCommercialID: any;
  selectedUniqueId: any;
  selectedRequestId: any;
  Cat3: any;
  showdesign = false;
  CategoryId: any;
  filters = {
    year: null
  };
  selectdates = ['Last 3 Months', 'Last 6 Months', 'Last 1 Year'];

  minDate: string = '';
  maxDate: string = '';
  filteredData: any[] = [];

  fromDate: any;
  toDate: any;
  selectedRange: string = "";
  selectedRange_regional: string = "";
  datefilter!: FormGroup
  isEditing = false;



  totalVariation: any;
  data1: any = [];
  selectedCategoryIds: number[] = [];
  cat4: any = [116];
  test: any = [];
  selectAllText: string = 'Select All';
  showCat3Management: boolean = true;
  showArbitrage: boolean = false;
  SearchboxForm!: FormGroup;
  @ViewChild('cat3') private cat3: any;
  SearchProductList: any;
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
  });
  availableYears: number[] = [];
  selectedYear: string = '';
  chart: any;



  constructor(public router: Router,
    private cdr: ChangeDetectorRef,
    private AdminService: AdminService,
    private toastr: ToastrService,
    private actroute: ActivatedRoute,
    private SpinnerService: NgxSpinnerService, 
    private Searchservice: SearchService) {

  }

  activeButton: string = '';
  showRegionalContent = false;
  showContent: boolean = false;
  showmgfprocess: boolean = false;
  CategoryID: any;
  Regional: any[] = [];
  opportunities: any[] = [];
  data: any = [];

  dateRanges = [
    { value: '', label: 'Select Range' },
    { value: '3', label: 'Last 3 Months' },
    { value: '6', label: 'Last 6 Months' },
    { value: '12', label: 'Last 1 Year' }
  ];


  ngOnInit(): void {
    //debugger
    this.SearchboxForm = new FormGroup({
      Cat2List: new FormControl(),
      EngineList: new FormControl(),
      FromDate: new FormControl(),
      ToDate: new FormControl(),
      Cat2search: new FormControl(),
      Cat3search: new FormControl(),
      Cat4search: new FormControl(),
      EngineDisplsearch: new FormControl(),
      BusinessUnitsearch: new FormControl(),
      Locationsearch: new FormControl(),
    });

    this.ShowLandingPage(0, "0");
    this.ShowCagetory3();
  }

  chartOptions = {

    animationEnabled: true,

    title: {
      text: "Part Number vs Commerical Arbitrage ($)",
      fontFamily: "Trebuchet MS, Helvetica, sans-serif",

    },
    axisX: {
      title: "Part Number",
      interval: 1,
      labelFontSize: 9,
      showInLegend: true,
      indexLabelFontColor: "#000",

      labelAngle: -240,

    },
    axisY: {

      title: "Commerical Arbitrage",
      labelFontSize: 10,
      showInLegend: true,
      indexLabelFontColor: "#000",
      interval: 1000000,
    },
    dataPointWidth: 20,
    data: [
      {
        type: "column",
        color: "#da291c",
        indexLabelFontColor: "#000",
        toolTipContent: "{label} : {y}$",
        name: "Commercial Arbitrage",
        showInLegend: true,
        dataPoints: [] as { label: string; y: any }[],
      },
      {
        type: "column",
        color: "#2fa365",
        indexLabelFontColor: "#000",
        toolTipContent: "{label} : {y}$",
        name: "User Calculated Commercial Arbitrage",
        showInLegend: true,
        dataPoints: [] as { label: string; y: any }[],
      },
    ],

  }


  async GetCommericalArtibage() {
    debugger

    const categoryID = this.test;
    this.opportunities=[];
    this.AdminService.GetCommericalArtibage(categoryID).subscribe(
      (response) => {
        debugger
        this.data = response;
        this.opportunities = this.data;

        this.opportunities.forEach(opportunity => {
          if (!opportunity.ProjectStatus) {
            opportunity.ProjectStatus = 'Open'; // Default to "Open" if no value exists
          }
          opportunity.UserSimulatedArbitrage = Number(opportunity.UserSimulatedArbitrage) || 0; // Convert to number
          opportunity.CommercialArbitrage = Number(opportunity.CommercialArbitrage) || 0;
        });
        // Process the data for chart
        this.chartOptions.data[0].dataPoints = this.opportunities.map(opportunity => ({
          label: opportunity.PartNumber,
          y: opportunity.CommercialArbitrage,
        }));
        this.chartOptions.data[1].dataPoints = this.opportunities.map(opportunity => ({
          label: opportunity.PartNumber,
          y: opportunity.UserSimulatedArbitrage,
        }));
        this.gettotaloppurtunity();
        this.getGraphstyle();


      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );

  }
  getGraphstyle() {

    const baseBarWidth = 50; // pixels per bar
    const minWidth = '100%';

    if (!this.data || this.data.length <= 20) {
      return { height: '375px', width: minWidth };
    }

    return {
      height: '375px',
      width: `${this.data.length * baseBarWidth}px`
    };
  }


  onViewClick() {
    debugger;
    if (this.fromDate && this.toDate) {
      const filteredData: any[] = [];
      this.opportunities = this.data;
      for (let i = 0; i < this.opportunities.length; i++) {
        const opportunity = this.opportunities[i];
 
        try {
          const debriefDate = opportunity.DebriefDate;
 
          if (
            debriefDate >= this.fromDate &&
            debriefDate <= this.toDate
          ) {
            filteredData.push(opportunity);
          }
        } catch (error) {
          console.error('Error parsing DebriefDate:', opportunity.DebriefDate, error);
        }
      }
      this.filteredData = filteredData;
      this.opportunities = this.filteredData;
 
      // Update chart data points based on filtered data
      this.chartOptions = { ...this.chartOptions };
 
      this.chartOptions.data[0].dataPoints = this.filteredData.map(opportunity => ({
        label: opportunity.PartNumber,
        y: opportunity.CommercialArbitrage,
      }));
 
      this.chartOptions.data[1].dataPoints = this.filteredData.map(opportunity => ({
        label: opportunity.PartNumber,
        y: opportunity.UserSimulatedArbitrage,
      }));
 
      console.log('Updated Chart Data:', this.chartOptions);
    } else {
      console.error('Invalid Date Range');
 
    }
 
  }

  onDateRangeChange(): void {
    const today = new Date();
    let fromDate: Date | null = null;;
    // Calculate the 'From Date' based on the selected range
    switch (this.selectedRange) {
      case "3":
        fromDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
        break;
      case "6":
        fromDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
        break;
      case "12":
        fromDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        break;
        // case "24":
        //   fromDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
        //   break;
      default:
        fromDate = null;
        break;
    }

    // Update the bound variables
    if (fromDate) {
      this.fromDate = fromDate.toISOString().split('T')[0]; // Format 'From Date' as 'YYYY-MM-DD'
      this.toDate = today.toISOString().split('T')[0];      // Format 'To Date' as 'YYYY-MM-DD'
    } else {
      this.fromDate = null;
      this.toDate = null;
    }
  }
 




  ClearAll(): void {
    this.selectedRange = ""; // Reset dropdown
    this.fromDate = null;    // Clear 'From Date'
    this.toDate = null;      // Clear 'To Date'
    this.filteredData = [];
    this.opportunities = this.data;

    // Process the data for chart
    this.chartOptions = { ...this.chartOptions };

    this.chartOptions.data[0].dataPoints = this.opportunities.map(opportunity => ({
      label: opportunity.PartNumber,
      y: opportunity.CommercialArbitrage,

    }));

    this.chartOptions.data[1].dataPoints = this.opportunities
      .map(opportunity => ({
        label: opportunity.PartNumber,
        y: opportunity.UserSimulatedArbitrage,

      }));
    this.gettotaloppurtunity();

  }




  hidename() {
    //debugger
    const r = document.getElementById("chartOptionsId") as any;
    r.getElementsByClassName('canvasjs-chart-credit')[0].style.display = "none";
  }


  async setActiveButton(buttonName: string) {

    debugger
    this.activeButton = buttonName;
   
    // Reset visibility for all sections
    this.showContent = buttonName === 'commercial';
    this.showRegionalContent = buttonName === 'regional';
    this.showmgfprocess = buttonName === 'manufacturing';
    this.showdesign = buttonName === 'design';

    switch (this.activeButton) {

      // case 'commercial':
      //   this.totalVariation = this.gettotaloppurtunity();
      case 'regional':
        this.totalVariation = this.getTotalRegionalOppurtunity();
        break;
      case 'manufacturing':
        this.totalVariation = this.getTotalMfgOppurtunity();
        break;
      case 'design':
        this.totalVariation = this.gettotaloppurtunity();
        break;
      // case 'commercial':
      //        this.totalVariation = this.gettotaloppurtunity();
      default:
          this.totalVariation = this.gettotaloppurtunity();
    }

    setTimeout(() => {
      debugger

      this.hidename();
    }, 200);
   

  }

  editRow(index: number) {
    this.isEditing = !this.isEditing;
    this.editingIndex = index; // Enable edit mode for the selected row
  }

  saveChanges(opportunity: CommericalArbitrage) {
    //debugger;
    // Default values for nullable columns
    if (!opportunity.UserSimulatedCostAttainment) {
      opportunity.UserSimulatedCostAttainment = "0"; // Default simulated cost attainment value
    }
    if (!opportunity.CommercialArbitrage) {
      opportunity.CommercialArbitrage = "0"; // Default arbitrage value
    }
    opportunity.UserSimulatedArbitrage = this.calculateOpportunityValue(opportunity) || "0.00";
    opportunity.ModifiedBy = (localStorage.getItem("userFullName"))

    // Default CommercialArtibageID to 0 if null or undefined
    if (!opportunity.CommericalArtibageID) {
      opportunity.CommericalArtibageID = 0;
    }

    console.log('Updated data:', opportunity);

    this.AdminService.SaveCommericalArtibage(opportunity).subscribe({
      next: (response) => {
        console.log('Opportunity saved successfully:', response);
        this.editingIndex = null; // Exit edit mode
        this.GetCommericalArtibage();
        this.chartOptions;
      },
      error: (error) => {
        console.error('Error saving opportunity:', error);
      }
    });
  }


  cancelEditing() {
    this.editingIndex = null; // Cancel edit mode without saving
  }
 

  openCommentsPopup(comment: string, index: number): void {
    this.showModal = true;
    this.selectedComment = comment || '';
    this.editingIndex = index;
  }
  closeCommentsPopup(): void {
    this.showModal = false;
    this.selectedComment = '';

  }

  // saveComment(): void {
  //   if (this.editingIndex !== null && this.editingIndex >= 0) {
  //     this.opportunities[this.editingIndex].Comments = this.selectedComment;
  //   }
  //   this.closeCommentsPopup();
  // }

  // getRoundedAttainment(opportunity: any): string {
  //   if (!this.opportunity.SCAttainment){
  //     return '';

  //   } 
  //   const roundedValue = Math.round(Number(this.opportunity.SCAttainment));
  //   return `${roundedValue}%`;
  // }

  RoundSCAttainment(opportunity: any): string {
    if (opportunity.SCAttainment) {
      const roundedValue = (Math.round(Number(opportunity.SCAttainment)));
    return `${roundedValue}%`;
    }
    return ''; // Return an empty string if conditions are not met
  }

  validateDecimal(event: any) {
    let value = event.target.value;
    if (!/^\d+(\.\d{0,2})?$/.test(value)) {
      event.target.value = value.slice(0, -1);
    }
  }
  


  gettotaloppurtunity(): string {
    debugger
    
    let total = 0;
    // Iterate over the opportunities array and sum up the UserCalculatedCost values
    this.opportunities.forEach((opportunity: { CommercialArbitrage: any; }) => {
      total += opportunity.CommercialArbitrage || 0;
    });
    return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  }

  calculatePercentage(opportunity: any): string {
    if (opportunity.SupplierQuoted && opportunity.UserCalculatedCost > 0 && opportunity.SupplierQuoted > 0) {
      const percentage = ((opportunity.UserCalculatedCost / (opportunity.SupplierQuoted) * 100))
      return Math.round(percentage) + '%'; 
    }
    return ''; 
  }


  calculateOpportunityValue(opportunity: any): string {
    if (opportunity.UpdatedAnnualVolume && opportunity.SupplierQuoted && opportunity.UserCalculatedCost) {
      const value = opportunity.UpdatedAnnualVolume * (opportunity.SupplierQuoted - opportunity.UserCalculatedCost);
      return value.toFixed(2);
    }
    return '';
  }


  formatToMillions(value: any): string {
    if (value > 0) {
      return (value / 1000000).toFixed(2) + 'M';
    }
    return value.toString();
  }

  async uploadTCO(CommericalArtibageID: any, MMID: any, RequestHeaderId: any): Promise<void> {
    this.selectedUniqueId = MMID;
    this.selectedRequestId = RequestHeaderId;


    //debugger
    const result = await Swal.fire({
      title: 'TCO Upload is opening. Do you want to proceed?',
      showCancelButton: true,
      confirmButtonColor: '#28a745', // Green color for OK button
      cancelButtonColor: '#d33', // Red color for Cancel button
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'custom-swal-popup', // Class for customizing the popup
      },
    });


    if (result.isConfirmed) {
      debugger
      // const UniqueId = this.selectedUniqueId;
      // const RequestId = this.selectedRequestId;
      const encryptedUniqueId = btoa(this.selectedUniqueId); 
      const encryptedRequestId = btoa(this.selectedRequestId); 
      this.router.navigate(['/home/tcoupload'], {
        queryParams: {
          UniqueId: encryptedUniqueId,
          RequestId: encryptedRequestId
        }
      });
    }
  }


  closeUploadPopup(): void {
    this.showFileUpload = false;
    this.showTcoUploadModal = false;
  }
 

getSelectedPartsString(): string {
  return this.SearchProductList
    .filter((p: { selected: any; }) => p.selected)
    .map((item: { childCategory: any; }) => item.childCategory)
    .join(', ');
}



  openUploadPopup(CommericalArtibageID: any, MMID: any, RequestHeaderId: any): void {

    //debugger
    this.selectedCommercialID = CommericalArtibageID;
    this.selectedUniqueId = MMID;
    this.selectedRequestId = RequestHeaderId;

    this.showTcoUploadModal = true;

  }



  handleFileSelection(event: any): void {
    //debugger
    const files: FileList = event.target.files; // Get selected files
    this.selectedFiles = []; // Clear previous selections

    if (files && files.length > 0) {
      console.log(`Number of files selected: ${files.length}`);
      for (let i = 0; i < files.length; i++) {
        console.log(`File ${i + 1}: ${files[i].name}`);
        this.selectedFiles.push(files[i]); // Store files in an array
      }
    } else {
      console.log('No files selected.');
    }
  }

  uploadFiles(commercialId: string): void {
    //debugger
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.AdminService.Uploadfiles(commercialId, this.selectedFiles).subscribe({
        next: (response) => {
          console.log('Files uploaded successfully:', response);
          alert('Files uploaded successfully!');
          this.selectedFiles = []; // Clear selected files after upload
        },
        error: (error) => {
          console.error('File upload failed:', error);
          alert('File upload failed!');
        },
      });
    } else {
      alert('Please select files to upload.');
    }
  }


  downloadFolderAsZip(CommericalArtibageID: string): void {
    //debugger
    this.AdminService.downloadZipFile(CommericalArtibageID).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response); // Create a blob URL
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${CommericalArtibageID}.zip`; // Name the ZIP file with the commercial ID
        anchor.click();
        window.URL.revokeObjectURL(url); // Clean up the URL
      },
      (error) => {
        console.error('Error downloading ZIP file:', error);
      }
    );
  }

  async ShowLandingPage(flag: number, CategoryID: string) {
    try {
      this.SpinnerService.show('spinner');
      const data = await this.Searchservice.GetLandingPage(flag, CategoryID).toPromise();
      this.SearchProductList = data;
      console.log(this.SearchProductList);

      this.SearchProductList = data.map((item: any) => ({
        ...item,
        selected: false // Initialize each item as unselected
      }));

      this.SpinnerService.hide('spinner');
    } catch (e) {
      this.SpinnerService.hide('spinner');
      console.error(e);
    }
  }



  selectAll(): void {
    //debugger
    const allSelected = this.SearchProductList.every((group: { selected: boolean; }) => group.selected);
    this.SearchProductList.forEach((group: { selected: boolean; }) => group.selected = !allSelected);

    if (!allSelected) {
      this.selectedCategoryIds = this.SearchProductList.map((group: { categoryId: any; }) => group.categoryId);
    } else {
      this.selectedCategoryIds = [];
    }
    this.test = this.selectedCategoryIds
  }


  onCheckboxChange(item: any) {
    //debugger;

    if (item.selected) {
      if (!this.selectedCategoryIds.includes(item.categoryId)) {
        this.selectedCategoryIds.push(item.categoryId);
      }
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== item.categoryId);
    }
    this.test = this.selectedCategoryIds
  }


  navigateToCostInsight(CategoryID: number) {
    //debugger;
    this.router.navigate(['/home/costinsights1', CategoryID]);
  }


  getCategoryId(e: any) {
    //debugger
    const cat3 = document.getElementsByClassName("Cat3Checkbox") as any;
    var param_value = "";

    for (let i = 0; i < e.length; i++) {
      param_value += e[i] + ",";
    }

    param_value = param_value.substring(0, param_value.length - 1);

    if (param_value == "") {
      this.ShowLandingPage(0, "0");
      return;
    }

    this.ShowLandingPage(1, param_value);
  }


  public clearall() {
    for (let i = 0; i < this.cat3.filterItems.length; i++) {
      this.cat3.filterItems[i].checked = false;
    }

    this.ShowLandingPage(0, "0");
  }


  toggleView() {
    debugger;
    this.showcostinsights = true;
    if (!this.test || this.test.length === 0) {
      this.selectAll();
    }

    // if (this.showArbitrage === false) {
      this.GetCommericalArtibage();
      this.GetRegionalArbitrage();
      this.GetMgfProcessArtibage();

    // }

    this.showArbitrage = true;
    this.showCat3Management = !this.showCat3Management;
    this.showContent = false;

    this.showRegionalContent = false;
    this.showmgfprocess = false;
    this.showdesign = false;
  }

  async ShowCagetory3() {
    const data = await this.Searchservice.GetCagetory3("0").toPromise();
    this.Cat3 = data.filter((d: { groupCategory: any; }) => d.groupCategory == "Cat3");
    this.Cat3 = this.Cat3.map((value: { text: any; value: any; }) => {
      return new TreeviewItem({ text: value.text, value: value.value, checked: false });
    });

  }



  //--------------------------------------------End of commerical Arbitrage----------------------------------------------------------------------------//

  selectedRegionalUniqueId: any;
  selectedRegionalRequestId: any;
  RegionalfromDate:any;
  RegionaltoDate:any;
  RegionData: any = [];
  showregioncomment: boolean = false;
  ShowRegionalUpload: boolean = false;
  selectedRange_Regional:string=""
  selectedRegional_ArtibageID: any;
 
  async GetRegionalArbitrage(): Promise<void> {
    debugger
    this.RegionData=[];
    const categoryID = this.test;
    try {
      const response = await this.AdminService.GetRegionalArbitrage(categoryID).toPromise();
      this.RegionData = response;
      this.Regional = this.RegionData;
      this.Regional.forEach((region) => {
        console.log(region);
      });
      this.RegionchartOptions.data[0].dataPoints = this.Regional.map(region => ({
        label: region.PartNumber,
        y: Math.abs(Number(region.RegionalArbitrage)) || 0,
        // y: Number(region.bestRegionCost)
      }));
      this.Regional.forEach(Region => {
        if (!Region.ProjectStatus) {
          Region.ProjectStatus = 'Open'; // Default to "Open" if no value exists
        }
      });



    } catch (err) {
      console.error('Error fetching regional arbitrage:', err);
    }
  }

  getTotalRegionalOppurtunity(): string {
    debugger
    let total = 0;
    // Iterate over the opportunities array and sum up the UserCalculatedCost values
    this.Regional.forEach((Region: { RegionalArbitrage: any; }) => {
      total += parseFloat(Region.RegionalArbitrage) || 0;
    });
    return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  }

  getChartStyles() {
    //debugger
    const baseBarWidth = 30;
    const minWidth = '100%';

    if (!this.Regional || this.Regional.length <= 30) {
      return { height: '375px', width: minWidth };
    }

    return {
      height: '375px',
      width: `${this.Regional.length * baseBarWidth}px`
    };
  }

  RegionchartOptions = {

    animationEnabled: true,

    title: {
      text: "Part Number vs Regional Arbitrage ($)",
      fontFamily: "Trebuchet MS, Helvetica, sans-serif",

    },
    axisX: {
      title: "Part Number",
      interval: 1,
      labelFontSize: 9,
      showInLegend: true,
      indexLabelFontColor: "#000",
      labelAutoFit: false,

      labelAngle: -240,

    },
    axisY: {

      title: "Regional Arbitrage",
      labelFontSize: 10,
      showInLegend: true,
      indexLabelFontColor: "#000",
      interval: 100,
    },
    dataPointWidth: 20,
    data: [{
      indexLabelFontColor: "#000",
      toolTipContent: "{label} : {y}$ ",

      type: "column",
      color: "#da291c",
      dataPoints: [] as { label: string, y: number }[]

    }],


  }
  // onDateRangeChange_regional(): void {
  //   const today = new Date();
  //   let fromDate: Date | null = null;;
  //   // Calculate the 'From Date' based on the selected range
  //   switch (this.selectedRange_regional) {
  //     case "3":
  //       fromDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
  //       break;
  //     case "6":
  //       fromDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
  //       break;
  //     case "12":
  //       fromDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  //       break;
  //       // case "24":
  //       //   fromDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
  //       //   break;
  //     default:
  //       fromDate = null;
  //       break;
  //   }

  //   // Update the bound variables
  //   if (fromDate) {
  //     this.fromDate = fromDate.toISOString().split('T')[0]; // Format 'From Date' as 'YYYY-MM-DD'
  //     this.toDate = today.toISOString().split('T')[0];      // Format 'To Date' as 'YYYY-MM-DD'
  //   } else {
  //     this.fromDate = null;
  //     this.toDate = null;
  //   }
  // }
  onDateRangeChange_regional(): void {
    const today = new Date();
    let RegionalfromDate: Date | null = null;;
    // Calculate the 'From Date' based on the selected range
    switch (this.selectedRange_regional) {
      case "3":
        RegionalfromDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
        break;
      case "6":
        RegionalfromDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
        break;
      case "12":
        RegionalfromDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        break;
      default:
        RegionalfromDate = null;
        break;
    }
 
    // Update the bound variables
    if (RegionalfromDate) {
      this.RegionalfromDate = RegionalfromDate.toISOString().split('T')[0]; // Format 'From Date' as 'YYYY-MM-DD'
      this.RegionaltoDate = today.toISOString().split('T')[0];      // Format 'To Date' as 'YYYY-MM-DD'
    } else {
      this.fromDate = null;
      this.RegionaltoDate = null;
    }
  }

  openregioncomment(comment: string, index: number): void {
    this.showregioncomment = true;
    this.selectedComment = comment || '';
    this.editingIndexRegional = index;
  }

  closeregioncomment(): void {
    this.selectedComment = '';
    this.showregioncomment = false;
  }

  saveRegionalComment(): void {
    debugger;
    if (this.editingIndexRegional !== null && this.editingIndexRegional >= 0) {
      this.Regional[this.editingIndexRegional].Comments = this.selectedComment;
    }
    this.closeregioncomment();
  }
  cancelEditingRegional(){
    this.editingIndexRegional=null;
  }

  RegionUploadTCO(Regional_ArtibageID: string) {

    this.selectedRegional_ArtibageID = Regional_ArtibageID
    this.ShowRegionalUpload = true;
  }
  SaveRegional(Region: any) {
    // Default values for nullable columns
    if (!Region.ProjectStatus) {
      Region.ProjectStatus = "Open"; // Default simulated cost attainment value
    }

  }

  UploadReginalFiles(Regional_ArtibageID: string): void {
    //debugger
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.AdminService.RegionalUpload(Regional_ArtibageID, this.selectedFiles).subscribe({
        next: (response) => {
          console.log('Files uploaded successfully:', response);
          alert('Files uploaded successfully!');
          this.selectedFiles = []; // Clear selected files after upload
        },
        error: (error) => {
          console.error('File upload failed:', error);
          alert('File upload failed!');
        },
      });
    } else {
      alert('Please select files to upload.');
    }
  }
  RegionaleditRow(index: number) {
    this.isEditing = !this.isEditing;
    // this.editingIndex = index; 
    this.editingIndexRegional= index;
  }


  closeRegionalupload(): void {
    this.showFileUpload = false;
    this.ShowRegionalUpload = false;
  }


  RegionFileDownloadAsZip(Regional_ArtibageID: string): void {
    //debugger
    this.AdminService.downloadReginalFileAsZip(Regional_ArtibageID).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response); // Create a blob URL
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${Regional_ArtibageID}.zip`; // Name the ZIP file with the commercial ID
        anchor.click();
        window.URL.revokeObjectURL(url); // Clean up the URL
      },
      (error) => {
        console.error('Error downloading ZIP file:', error);
      }
    );
  }

  SaveRegionChanges(Region: RegionalArbitrage) {
    debugger;
    Region.ModifiedBy = (localStorage.getItem("userFullName"))

    // Default CommercialArtibageID to 0 if null or undefined
    if (!Region.Regional_ArbitrageID) {
      Region.Regional_ArbitrageID = 0;
    }

    this.AdminService.SaveRegionalArtibage(Region).subscribe({
      next: (response) => {
        console.log('Opportunity saved successfully:', response);
        this.editingIndexRegional = null; // Exit edit mode
        this.GetRegionalArbitrage
        this.chartOptions;
      },
      error: (error) => {
        console.error('Error saving opportunity:', error);
      }
    });
  }

  RegionalDateFilter() {
    debugger;
    if (this.RegionalfromDate && this.RegionaltoDate) {
      const filteredData: any[] = [];
      this.Regional = this.RegionData;
      for (let i = 0; i < this.Regional.length; i++) {
        const Region = this.Regional[i];
 
        try {
          const debriefDate = Region.DebriefDate;
 
          if (
            debriefDate >= this.RegionalfromDate &&
            debriefDate <= this.RegionaltoDate
          ) {
            filteredData.push(Region);
          }
        } catch (error) {
          console.error('Error parsing DebriefDate:', Region.DebriefDate, error);
        }
      }
      this.filteredData = filteredData;
      this.Regional = this.filteredData;
      this.RegionchartOptions = { ...this.RegionchartOptions };
 
      this.RegionchartOptions.data[0].dataPoints = this.Regional.map(region => ({
        label: region.PartNumber,
        y: Math.abs(Number(region.RegionalArbitrage)) || 0,
        // y: Number(region.bestRegionCost)
      }));
 
      console.log('Updated Chart Data:', this.RegionchartOptions);
    } else {
      console.error('Invalid Date Range');
 
    }
 
  }


  ClearDateFilter(): void {
    this.selectedRange = ""; // Reset dropdown
    // this.fromDate = null;    // Clear 'From Date'
    this.RegionalfromDate = null;  
    // this.toDate = null;      // Clear 'To Date'
    this.RegionaltoDate = null;    
    this.filteredData = [];
    this.Regional = this.RegionData;

    this.RegionchartOptions = { ...this.RegionchartOptions };
    this.RegionchartOptions.data[0].dataPoints = this.Regional.map(region => ({
      label: region.PartNumber,
      y: Math.abs(Number(region.RegionalArbitrage)) || 0,
    }));

  }
  // RouteToTco(MMID: any, RequestHeaderId: any) {

  // }

  async RouteToTco( MMID: any, RequestHeaderId: any): Promise<void> {
    debugger
    this.selectedRegionalUniqueId = MMID;
    this.selectedRegionalRequestId = RequestHeaderId;


    //debugger
    const result = await Swal.fire({
      title: 'TCO Upload is opening. Do you want to proceed?',
      showCancelButton: true,
      confirmButtonColor: '#28a745', // Green color for OK button
      cancelButtonColor: '#d33', // Red color for Cancel button
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'custom-swal-popup', // Class for customizing the popup
      },
    });


    if (result.isConfirmed) {
      // const UniqueId = this.selectedUniqueId;
      // const RequestId = this.selectedRequestId;
      const encryptedUniqueId = btoa(this.selectedRegionalUniqueId); // Base64 encoding
      const encryptedRequestId = btoa(this.selectedRegionalRequestId); // Base64 encoding
      this.router.navigate(['/home/tcoupload'], {
        queryParams: {
          UniqueId: encryptedUniqueId,
          RequestId: encryptedRequestId
        }
      });
    }
  }
  //-------------------------------------End of Regional --------------------------------------------//


  //-------------------------------------start mfg process Arbitrage --------------------------------------------//

  selectedFilesMfg: File[] = [];
  mgfprocess: any[] = [];
  selectedRangeMfg: string = "";
  fromDateMfg: any;
  toDateMfg: any;
  datefilterMfg!: FormGroup
  isEditingMfg = false;
  ShowRegionalUploadMfg: boolean = false;
   selectedUniqueIdMfg: any;
  selectedRequestIdMfg: any;
  

  minDateMfg: string = '';
  maxDateMfg: string = '';

  filteredDataMfg: any[] = [];
  RegionDataMfg: any = [];
  opportunitiesMfg: any = [];
  showModalMfg: any;
  selectedCommentMfg: any;
  editingIndexMfg: number | null = null;
  showTcoUploadModalMfg: boolean = false;
  showFileUploadMfg: boolean = false;

  //chart optons
  chartOptionsMfg = {

    animationEnabled: true,

    title: {
      text: "Part Number vs Manufacturing Artibage ($)",
      fontFamily: "Trebuchet MS, Helvetica, sans-serif",

    },
    axisX: {
      title: "Part Number",
      interval: 1,
      labelFontSize: 9,
      showInLegend: true,
      indexLabelFontColor: "#000",

      labelAngle: -240,

    },
    axisY: {

      title: "Manufacturing Artibage",
      labelFontSize: 10,
      showInLegend: true,
      indexLabelFontColor: "#000",
      interval: 100,
    },
    dataPointWidth: 20,
    data: [
      {
        type: "column",
        color: "#da291c",
        indexLabelFontColor: "#000",
        toolTipContent: "{label} : {y}$",
        name: "HighLevel Process1",
        showInLegend: true,
        dataPoints: [] as { label: string; y: any }[],
      },
      {
        type: "column",
        color: "#2fa365",
        indexLabelFontColor: "#000",
        toolTipContent: "{label} : {y}$",
        name: "HighLevel Process2",
        showInLegend: true,
        dataPoints: [] as { label: string; y: any }[],
      },
    ],
  }


  getAbsoluteDifference(col2First: number, col2Second: number): number {
    return Math.abs(col2First - col2Second);
  }


  openUploadPopupMfg(UniqueId: any): void {
    debugger;
    this.selectedUniqueIdMfg = UniqueId;

    this.showTcoUploadModalMfg = true;

  }
//Total Variation 

//  getTotalMfgOppurtunity(): number {
//   return this.mgfprocess.reduce((sum, data) => {
//     const diff = Math.abs(data.Col2_First - data.Col2_Second);
//     return sum + diff;
    
//   }, 0);
// }

getTotalMfgOppurtunity(): string {
  const total = this.mgfprocess.reduce((sum, data) => {
    const diff = Math.abs(data.Col2_First - data.Col2_Second);
    return sum + diff;
  }, 0);

  return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


  async GetMgfProcessArtibage() {
    debugger;
    //  Refer This
    this.mgfprocess = [];
    this.AdminService.GetMgfProcess(this.test).subscribe(
      (response: any) => {
        this.data1 = response;
        this.mgfprocess =  this.data1;

        this.mgfprocess.forEach((data) => {
          if (!data.ProjectStatus) {
            data.ProjectStatus = 'Open'; // Default to "Open" if no value exists
          }
        });
        // Process the data for chart
        this.MfgchartOptions.data[0].dataPoints = this.mgfprocess.map(data => ({
          label: data.PartNumber,
          y: Number(data.Col2_First)
        }));
        this.MfgchartOptions.data[1].dataPoints = this.mgfprocess
          .map(data => ({
            label: data.PartNumber,
            y: Number(data.Col2_Second)
          }));
        this.getGraphstyleMfg();
        // this.calculateTop80Variation();

      },

      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );

  }

  saveComment(): void {
    debugger;
    if (this.editingIndex !== null && this.editingIndex >= 0) {
      this.opportunities[this.editingIndex].Comments = this.selectedComment;
    }
    this.closeCommentsPopup();
  }

   getGraphstyleMfg() {

    const baseBarWidth = 50; // pixels per bar
    const minWidth = '100%';

    if (!this.data1 || this.data1.length <= 20) {
      return { height: '375px', width: minWidth };
    }

    return {
      height: '375px',
      width: `${this.data1.length * baseBarWidth}px`
    };
  }

  calculateTop80Variation() {
    const variationData = this.mgfprocess
      .map((item) => ({
        ...item,
        variation: Math.abs(item.Col2_First - item.Col2_Second)
      }))
      .sort((a, b) => b.variation - a.variation);

    const totalVariation = variationData.reduce((sum, item) => sum + item.variation, 0);
    let cumulative = 0;
    const top80 = [];

    for (const item of variationData) {
      cumulative += item.variation;
      top80.push(item);
      if (cumulative / totalVariation >= 0.8) break;
    }


    this.mgfprocess = top80;
  }


  saveChangesMfg(data: GetMgfProcessArtibage) {
    //debugger;
    data.ModifiedBy = localStorage.getItem('userFullName');
    if (!data.Mfg_ArtibageID) {
      data.Mfg_ArtibageID = 0;
    }

    if (!data.TargetQuote) {
      data.TargetQuote = "0";

    }

    console.log('Updated data:', data);
    this.AdminService.SaveMfgArtibage(data).subscribe({
      next: (response) => {
        //debugger
        console.log('Opportunity saved successfully:', response);
        this.editingIndexMfg = null; // Exit edit mode
        this.GetMgfProcessArtibage();
        //this.chartOptions;
      },
      error: (error) => {
        console.error('Error saving opportunity:', error);
        alert('Error: ' + error.message);
      },
    });
  }

  cancelEditingMfg() {
    this.editingIndexMfg = null; // Cancel edit mode without saving
  }


  onDateRangeChangeMfg(): void {
    debugger;
    const today = new Date();
    let fromDate: Date | null = null;;
    switch (this.selectedRangeMfg) {
      case "3":
        fromDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
        break;
      case "6":
        fromDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
        break;
      case "12":
        fromDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        break;
        case "24":
          fromDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
          break;
      default:
        fromDate = null;
        break;
    }
     // Update the bound variables
    if (fromDate) {
      this.fromDateMfg = fromDate.toISOString().split('T')[0]; // Format 'From Date' as 'YYYY-MM-DD'
      this.toDateMfg = today.toISOString().split('T')[0];      // Format 'To Date' as 'YYYY-MM-DD'
    } else {
      this.fromDateMfg = null;
      this.toDateMfg = null;
    }

  }
  MfgchartOptions = {
 
    animationEnabled: true,
 
    title: {
      text: "Part Number vs Manufacturing Arbitrage ($)",
      fontFamily: "Trebuchet MS, Helvetica, sans-serif",
 
    },
    axisX: {
      title: "Part Number",
      interval: 1,
      labelFontSize: 9,
      showInLegend: true,
      indexLabelFontColor: "#000",
 
      labelAngle: -240,
 
    },
    axisY: {
 
      title: "Manufacturing Arbitrage",
      labelFontSize: 10,
      showInLegend: true,
      indexLabelFontColor: "#000",
      interval: 100,
    },
    dataPointWidth: 20,
    data: [
      {
        type: "column",
        color: "#da291c",
        indexLabelFontColor: "#000",
        toolTipContent: "{label} : {y}$",
        name: "HighLevel Process1",
        showInLegend: true,
        dataPoints: [] as { label: string; y: any }[],
      },
      {
        type: "column",
        color: "#2fa365",
        indexLabelFontColor: "#000",
        toolTipContent: "{label} : {y}$",
        name: "HighLevel Process2",
        showInLegend: true,
        dataPoints: [] as { label: string; y: any }[],
      },
    ],
   
 
  }

  onViewClickMfg() {
    debugger;
    // if (this.fromDate && this.toDate) {
    //   const filteredData: any[] = [];
    //   this.mgfprocess = this.data1;
    //   for (let i = 0; i < this.mgfprocess.length; i++) {
    //     const opportunity = this.mgfprocess[i];
  
    //     try {
    //       // const debriefDate = opportunity.DebriefDate;
    //       const debriefDate = opportunity.DebriefDate.split('T')[0];
  
    //       if (
    //         debriefDate >= this.fromDate &&
    //         debriefDate <= this.toDate
    //       ) {
    //         filteredData.push(opportunity);
    //       }
    //     } catch (error) {
    //       console.error('Error parsing DebriefDate:', opportunity.DebriefDate, error);
    //     }
    //   }
    //   this.filteredData = filteredData;
    //   this.mgfprocess = this.filteredData;
     
    //   // Update chart data points based on filtered data
    //   this.chartOptions = { ...this.chartOptions };
    //   this.chartOptions.data[0].dataPoints = this.filteredData.map(data => ({
    //     label: data.PartNumber,
    //     y:Number(data.Col2_First)
    //   }));
    //   this.chartOptions.data[1].dataPoints = this.filteredData
    //     .map(data => ({
    //       label: data.PartNumber,
    //       y: data.Col2_Second
    //     }));
  
    //   console.log('Updated Chart Data:', this.chartOptions);
    // } else {
    //   console.error('Invalid Date Range');
  
    // }
  
    if (this.fromDateMfg && this.toDateMfg) {
      const filteredData: any[] = [];
      this.mgfprocess = this.data1;
      for (let i = 0; i < this.mgfprocess.length; i++) {
        const opportunity = this.mgfprocess[i];

        try {
          const debriefDate = opportunity.DebriefDate;
          if (
            debriefDate >= this.fromDateMfg &&
            debriefDate <= this.toDateMfg
          ) {
            filteredData.push(opportunity);
          }
        } catch (error) {
          console.error('Error parsing DebriefDate:', opportunity.DebriefDate, error);
        }
      }
      this.filteredDataMfg = filteredData;
      this.mgfprocess = this.filteredDataMfg;

      // Update chart data points based on filtered data
      this.MfgchartOptions = { ...this.MfgchartOptions };

      this.MfgchartOptions.data[0].dataPoints = this.filteredDataMfg.map(data => ({
        label: data.PartNumber,
      y:Number(data.Col2_First)
      }));

      this.MfgchartOptions.data[1].dataPoints = this.filteredDataMfg.map(data => ({
        label: data.PartNumber,
        y: data.Col2_Second
      }));

      console.log('Updated Chart Data:', this.MfgchartOptions);
    } else {
      console.error('Invalid Date Range');

    }

  }


  ClearAllMfg(): void {
    this.selectedRangeMfg = ""; // Reset dropdown
    this.fromDateMfg = null;    // Clear 'From Date'
    this.toDateMfg = null;      // Clear 'To Date'
    this.filteredDataMfg = [];
    //this.opportunitiesMfg = this.data;
    this.mgfprocess = this.data1;
    // Process the data for chart
    this.MfgchartOptions = { ...this.MfgchartOptions };

    this.MfgchartOptions.data[0].dataPoints = this.mgfprocess.map(data => ({
      label: data.PartNumber,
      y: Number(data.Col2_First),

    }));

    this.MfgchartOptions.data[1].dataPoints = this.mgfprocess
    .map(data => ({
      label: data.PartNumber,
      y: data.Col2_Second
    }));
   // this.gettotaloppurtunity();
  }

  getAbsoluteDifferenceMfg(col2First: number, col2Second: number): number {
    return Math.abs(col2First - col2Second);
  }

  downloadFolderAsZipMfg(UniqueId: string): void {
    //debugger
    this.AdminService.downloadZipFile_mfg(UniqueId).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response); // Create a blob URL
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${UniqueId}.zip`; // Name the ZIP file with the commercial ID
        anchor.click();
        window.URL.revokeObjectURL(url); // Clean up the URL
      },
      (error:any) => {
        console.error('Error downloading ZIP file:', error);
      }
    );
  }


  openCommentsPopupMfg(comment: string, index: number): void {
    debugger;
    this.showModalMfg = true;
    this.selectedCommentMfg = comment || '';
  }


  editRowMfg(index: number) {
    debugger;
    this.isEditingMfg = !this.isEditingMfg;
    this.editingIndexMfg = index; // Enable edit mode for the selected row
  }

  closeCommentsPopupMfg(): void {
    this.selectedCommentMfg = '';
    this.showModalMfg = false;
  

  }

  saveCommentMfg(): void {
    debugger;
    if (this.editingIndexMfg !== null && this.editingIndexMfg >= 0) {
      // this.opportunitiesMfg[this.editingIndexMfg].Comments = this.selectedCommentMfg;
      this.mgfprocess[this.editingIndexMfg].Comments = this.selectedCommentMfg;
    }
    this.closeCommentsPopupMfg();
  }

  closeUploadPopupMfg(): void {
    this.showFileUploadMfg = false;
    this.showTcoUploadModalMfg = false;
  }

  saveComment_mfg(): void {
    if (this.editingIndex !== null && this.editingIndex >= 0) {
      this.mgfprocess[this.editingIndex].Comments = this.selectedComment;
    }
    this.closeCommentsPopup();
  }
  closeComment(): void {
    this.saveComment(); 
  }

  handleFileSelectionMfg(event: any): void {
    debugger
    const files: FileList = event.target.files; // Get selected files
    this.selectedFilesMfg = []; // Clear previous selections

    if (files && files.length > 0) {
      console.log(`Number of files selected: ${files.length}`);
      for (let i = 0; i < files.length; i++) {
        console.log(`File ${i + 1}: ${files[i].name}`);
        this.selectedFilesMfg.push(files[i]); // Store files in an array
      }
    } else {
      console.log('No files selected.');
    }
  }

  uploadFilesMfg(UniqueId: any): void {
    debugger
    if (this.selectedFilesMfg && this.selectedFilesMfg.length > 0) {
      this.AdminService.Uploadfiles_mfg(UniqueId, this.selectedFilesMfg).subscribe({
        next: (response:any) => {
          console.log('Files uploaded successfully:', response);
          alert('Files uploaded successfully!');
          this.selectedFilesMfg = []; // Clear selected files after upload
        },
        error: (error:any) => {
          console.error('File upload failed:', error);
          alert('File upload failed!');
        },
      });
    } else {
      alert('Please select files to upload.');
    }
  }


  //-------------------------------------end mfg process Arbitrage --------------------------------------------//

  design = [
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '5374631',
      'suppmanilocation': 'BELGIUM',
      'annualvol': 723,
      'material': '41103 - Ductile Cast Iron (ASTM A439, Grade D5S)',
      'matrate': 1.03,
      'avgwall': 12.35,
      'rmgrade': 41103,
      'matratee': 1.03,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 2.62,
      'fromtotechspec': '41103->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '5450589',
      'suppmanilocation': 'CHINA',
      'annualvol': 154000,
      'material': '41118-IRON,FERRITIC DUCTILE-high silicon - high molybdenum - SiMo5-1',
      'matrate': 1.06,
      'avgwall': 8.63,
      'rmgrade': 41118,
      'matratee': 1.06,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 1.69,
      'fromtotechspec': '41118->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '5672644',
      'suppmanilocation': 'UK',
      'annualvol': 800,
      'material': '41081 IRON,FERRITIC DUCTILE (SILICON-MOLYBDENUM)',
      'matrate': 1.17,
      'avgwall': 8.00,
      'rmgrade': 41081,
      'matratee': 1.17,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 15.58,
      'fromtotechspec': '41081->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '5674972',
      'suppmanilocation': 'CHINA',
      'annualvol': 1000,
      'material': '41081 IRON,FERRITIC DUCTILE (SILICON-MOLYBDENUM)',
      'matrate': 1.22,
      'avgwall': 9.50,
      'rmgrade': 41081,
      'matratee': 1.22,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 3.27,
      'fromtotechspec': '41081->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '5674974',
      'suppmanilocation': 'CHINA',
      'annualvol': 1800,
      'material': '41081 IRON,FERRITIC DUCTILE (SILICON-MOLYBDENUM)',
      'matrate': 1.22,
      'avgwall': 10.92,
      'rmgrade': 41081,
      'matratee': 1.22,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 1.98,
      'fromtotechspec': '41081->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '5675361',
      'suppmanilocation': 'CHINA',
      'annualvol': 1000,
      'material': '41081 IRON,FERRITIC DUCTILE (SILICON-MOLYBDENUM)',
      'matrate': 1.22,
      'avgwall': 10.92,
      'rmgrade': 41081,
      'matratee': 1.22,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 1.98,
      'fromtotechspec': '41081->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '5674977',
      'suppmanilocation': 'CHINA',
      'annualvol': 500,
      'material': '41081 IRON,FERRITIC DUCTILE (SILICON-MOLYBDENUM)',
      'matrate': 1.10,
      'avgwall': 11.20,
      'rmgrade': 41081,
      'matratee': 1.10,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 5.51,
      'fromtotechspec': '41081->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '3642655',
      'suppmanilocation': 'CHINA',
      'annualvol': 1280,
      'material': '41081 IRON,FERRITIC DUCTILE (SILICON-MOLYBDENUM)',
      'matrate': 1.15,
      'avgwall': 11.40,
      'rmgrade': 41081,
      'matratee': 1.15,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 3.45,
      'fromtotechspec': '41081->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '6409902',
      'suppmanilocation': 'INDIA',
      'annualvol': 33500,
      'material': '41081 IRON,FERRITIC DUCTILE (SILICON-MOLYBDENUM)',
      'matrate': 1.23,
      'avgwall': 9.15,
      'rmgrade': 41081,
      'matratee': 1.23,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 2.57,
      'fromtotechspec': '41081->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '5374631',
      'suppmanilocation': 'UK',
      'annualvol': 251,
      'material': '41103 - Ductile Cast Iron (ASTM A439, Grade D5S)',
      'matrate': 8.36,
      'avgwall': 12.35,
      'rmgrade': 41103,
      'matratee': 8.36,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 177.30,
      'fromtotechspec': '41103->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '5374631',
      'suppmanilocation': 'WESTERN EUROPE',
      'annualvol': 251,
      'material': '41103 - Ductile Cast Iron (ASTM A439, Grade D5S)',
      'matrate': 8.42,
      'avgwall': 12.35,
      'rmgrade': 41103,
      'matratee': 8.42,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 178.73,
      'fromtotechspec': '41103->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '5374631',
      'suppmanilocation': 'EASTERN EUROPE',
      'annualvol': 251,
      'material': '41103 - Ductile Cast Iron (ASTM A439, Grade D5S)',
      'matrate': 8.42,
      'avgwall': 12.35,
      'rmgrade': 41103,
      'matratee': 8.42,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 178.73,
      'fromtotechspec': '41103->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '5714523',
      'suppmanilocation': 'UK',
      'annualvol': 2000,
      'material': '41081 IRON,FERRITIC DUCTILE (SILICON-MOLYBDENUM)',
      'matrate': 1.38,
      'avgwall': 6.70,
      'rmgrade': 41081,
      'matratee': 1.38,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 2.10,
      'fromtotechspec': '41081->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '5717637',
      'suppmanilocation': 'INDIA',
      'annualvol': 1500,
      'material': '41118-IRON,FERRITIC DUCTILE-high silicon - high molybdenum - SiMo5-1',
      'matrate': 1.39,
      'avgwall': 7.50,
      'rmgrade': 41118,
      'matratee': 1.39,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 2.55,
      'fromtotechspec': '41118->41081'
    },
    {
      'partname': 'MANIFOLD EXHAUST',
      'partnumber': '6377526',
      'suppmanilocation': 'INDIA',
      'annualvol': 1500,
      'material': '41118-IRON,FERRITIC DUCTILE-high silicon - high molybdenum - SiMo5-1',
      'matrate': 1.43,
      'avgwall': 8.51,
      'rmgrade': 41118,
      'matratee': 1.43,
      'mincostgrade': 41081,
      'mincostrmrate': 0.92,
      'techcostarbitage': 1.22,
      'fromtotechspec': '41118->41081'
    }
  ]
  highlightedRow: number | null = null;

  highlightRow(index: number) {
    this.highlightedRow = index;
  }

  

  backToCat3() {
    
    this.showCat3Management = true;

      this.showcostinsights = false;
      this.showContent = false;
      this.showRegionalContent = false;
      this.showmgfprocess = false;
      this.showdesign = false;
      this.selectedCategoryIds = [];
      this.test=[];
      this.CategoryID=null
      this.activeButton = '';

    //  window.location.reload();
    
      
     
      
  }


}
