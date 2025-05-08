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

@Component({
  // standalone : true,
  selector: 'app-cost-reduction',
  templateUrl: './cost-reduction.component.html',
  styleUrls: ['./cost-reduction.component.css'],
  // imports:[CommonModule,NgbModule,],
})

export class CostReductionComponent implements OnInit {

  editingIndex: number | null = null;
  showModal: any;
  selectedComment: any;
  selectedFiles: File[] = [];
  showTcoUploadModal: boolean = false;
  showDocumentUploadModal: boolean = false;
  showcostinsights: boolean = false;
  showFileUpload: boolean = false;
  showregioncomment: boolean = false;
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
  RegionData: any = [];
  fromDate: any;
  toDate: any;
  selectedRange: string = "";
  datefilter!: FormGroup
  isEditing = false;
  ShowRegionalUpload: boolean = false;



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
  selectedRegional_ArtibageID: any;


  constructor(public router: Router,
    private cdr: ChangeDetectorRef,
    private AdminService: AdminService,
    private toastr: ToastrService,
    private actroute: ActivatedRoute,
    private SpinnerService: NgxSpinnerService, private Searchservice: SearchService) {

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
    debugger
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
      text: "Part Number vs Commerical Artibage ($)",
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

      title: "Commerical Artibage",
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
    debugger
    const r = document.getElementById("chartOptionsId") as any;
    r.getElementsByClassName('canvasjs-chart-credit')[0].style.display = "none";
  }


  setActiveButton(buttonName: string) {
    this.activeButton = buttonName;
    // Reset visibility for all sections
    this.showContent = buttonName === 'commercial';
    this.showRegionalContent = buttonName === 'regional';
    this.showmgfprocess = buttonName === 'manufacturing';
    this.showdesign = buttonName === 'design';

    setTimeout(() => {

      this.hidename();
      // this.RegionalDateFilter();
    }, 200);
  }
  editRow(index: number) {
    this.isEditing = !this.isEditing;
    this.editingIndex = index; // Enable edit mode for the selected row
  }

  saveChanges(opportunity: CommericalArbitrage) {
    debugger;
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

  saveComment(): void {
    if (this.editingIndex !== null && this.editingIndex >= 0) {
      this.opportunities[this.editingIndex].Comments = this.selectedComment;
    }
    this.closeCommentsPopup();
  }


  gettotaloppurtunity(): string {
    let total = 0;
    // Iterate over the opportunities array and sum up the UserCalculatedCost values
    this.opportunities.forEach(opportunity => {
      total += opportunity.CommercialArbitrage || 0;
    });
    return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  }

  calculatePercentage(opportunity: any): string {
    if (opportunity.SupplierQuoted && opportunity.UserCalculatedCost > 0 && opportunity.SupplierQuoted > 0) {
      const percentage = ((opportunity.UserCalculatedCost / (opportunity.SupplierQuoted) * 100))
      return percentage.toFixed(2) + '%'; // Format to 2 decimal places and append '%'
    }
    return ''; // Return an empty string if conditions are not met
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
      return (value / 1000000).toFixed(2) + 'm';
    }
    return value.toString();
  }

  async uploadTCO(CommericalArtibageID: any, MMID: any, RequestHeaderId: any): Promise<void> {
    this.selectedUniqueId = MMID;
    this.selectedRequestId = RequestHeaderId;


    debugger
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
      const encryptedUniqueId = btoa(this.selectedUniqueId); // Base64 encoding
      const encryptedRequestId = btoa(this.selectedRequestId); // Base64 encoding
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


  openUploadPopup(CommericalArtibageID: any, MMID: any, RequestHeaderId: any): void {

    debugger
    this.selectedCommercialID = CommericalArtibageID;
    this.selectedUniqueId = MMID;
    this.selectedRequestId = RequestHeaderId;

    this.showTcoUploadModal = true;

  }

  savedoc(): void {

  }


  handleFileSelection(event: any): void {
    debugger
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
    debugger
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
    debugger
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
    debugger
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
    debugger;

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
    debugger;
    this.router.navigate(['/home/costinsights1', CategoryID]);
  }


  getCategoryId(e: any) {
    debugger
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

    if (this.showArbitrage === false) {
      this.GetCommericalArtibage();
      this.GetRegionalArbitrage();
    }
    
    this.showArbitrage = !this.showArbitrage;
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

  async GetRegionalArbitrage(): Promise<void> {
    debugger

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

  getChartStyles() {
    debugger
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
      text: "Part Number vs Regional Artibage ($)",
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

      title: "Regional Artibage",
      labelFontSize: 10,
      showInLegend: true,
      indexLabelFontColor: "#000",
      interval: 1000,
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

  openregioncomment(comment: string, index: number): void {
    this.showregioncomment = true;
    this.selectedComment = comment || '';
    this.editingIndex = index;
  }

  closeregioncomment(): void {
    this.selectedComment = '';
    this.showregioncomment = false;
  }

  saveRegionalComment(): void {
    if (this.editingIndex !== null && this.editingIndex >= 0) {
      this.Regional[this.editingIndex].Comments = this.selectedComment;
    }
    this.closeregioncomment();
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
    debugger
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

  closeRegionalupload(): void {
    this.showFileUpload = false;
    this.ShowRegionalUpload = false;
  }


  RegionFileDownloadAsZip(Regional_ArtibageID: string): void {
    debugger
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
        this.editingIndex = null; // Exit edit mode
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
    if (this.fromDate && this.toDate) {
      const filteredData: any[] = [];
      this.Regional = this.RegionData;
      for (let i = 0; i < this.Regional.length; i++) {
        const Region = this.Regional[i];

        try {
          const debriefDate = Region.DebriefDate;

          if (
            debriefDate >= this.fromDate &&
            debriefDate <= this.toDate
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
    this.fromDate = null;    // Clear 'From Date'
    this.toDate = null;      // Clear 'To Date'
    this.filteredData = [];
    this.Regional = this.RegionData;

    this.RegionchartOptions = { ...this.RegionchartOptions };
    this.RegionchartOptions.data[0].dataPoints = this.Regional.map(region => ({
      label: region.PartNumber,
      y: Math.abs(Number(region.RegionalArbitrage)) || 0,
    }));

  }
RouteToTco(MMID:any,RequestHeaderId:any){
  
}
  //-------------------------------------End of Regional --------------------------------------------//



  mgfprocess = [
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5374631,
      "suppmanilocation": "BELGIUM",
      "supplierQuotedInvoicePrice": 747.73,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 3640750,
      "suppmanilocation": "BELGIUM",
      "supplierQuotedInvoicePrice": 396.11,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 3641592,
      "suppmanilocation": "BELGIUM",
      "supplierQuotedInvoicePrice": 336.86,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 3641593,
      "suppmanilocation": "BELGIUM",
      "supplierQuotedInvoicePrice": 335.42,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5374639,
      "suppmanilocation": "BELGIUM",
      "supplierQuotedInvoicePrice": 892.24,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5374635,
      "suppmanilocation": "BELGIUM",
      "supplierQuotedInvoicePrice": 885.50,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 3641635,
      "suppmanilocation": "BELGIUM",
      "supplierQuotedInvoicePrice": 125.92,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 3642647,
      "suppmanilocation": "GERMANY",
      "supplierQuotedInvoicePrice": 502.10,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 3642661,
      "suppmanilocation": "GERMANY",
      "supplierQuotedInvoicePrice": 411.53,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 3640464,
      "suppmanilocation": "BELGIUM",
      "supplierQuotedInvoicePrice": 2315.56,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 4100732,
      "suppmanilocation": "BELGIUM",
      "supplierQuotedInvoicePrice": 1675.00,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 4100728,
      "suppmanilocation": "BELGIUM",
      "supplierQuotedInvoicePrice": 2560.45,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5450589,
      "suppmanilocation": "CHINA",
      "supplierQuotedInvoicePrice": 53.12,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5672644,
      "suppmanilocation": "UK",
      "supplierQuotedInvoicePrice": 1046.65,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5672644,
      "suppmanilocation": "CHINA",
      "supplierQuotedInvoicePrice": 950.98,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5674972,
      "suppmanilocation": "CHINA",
      "supplierQuotedInvoicePrice": 65.69,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5674974,
      "suppmanilocation": "CHINA",
      "supplierQuotedInvoicePrice": 44.09,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5675361,
      "suppmanilocation": "CHINA",
      "supplierQuotedInvoicePrice": 42.98,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5674977,
      "suppmanilocation": "CHINA",
      "supplierQuotedInvoicePrice": 222.14,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 3642655,
      "suppmanilocation": "GERMANY",
      "supplierQuotedInvoicePrice": 170.18,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 3642655,
      "suppmanilocation": "CHINA",
      "supplierQuotedInvoicePrice": 81.37,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 3642655,
      "suppmanilocation": "INDIA",
      "supplierQuotedInvoicePrice": 57.12,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 6382128,
      "suppmanilocation": "CHINA",
      "supplierQuotedInvoicePrice": 19.20,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 6382132,
      "suppmanilocation": "CHINA",
      "supplierQuotedInvoicePrice": 26.69,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 6382128,
      "suppmanilocation": "INDIA",
      "supplierQuotedInvoicePrice": 20.11,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 6382132,
      "suppmanilocation": "INDIA",
      "supplierQuotedInvoicePrice": 30.90,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 6409902,
      "suppmanilocation": "INDIA",
      "supplierQuotedInvoicePrice": 53.68,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 6409902,
      "suppmanilocation": "CHINA",
      "supplierQuotedInvoicePrice": 38.59,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5374631,
      "suppmanilocation": "UK",
      "supplierQuotedInvoicePrice": 881.32,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5374631,
      "suppmanilocation": "WESTERN EUROPE",
      "supplierQuotedInvoicePrice": 896.69,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 3642647,
      "suppmanilocation": "WESTERN EUROPE",
      "supplierQuotedInvoicePrice": 482.42,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5374631,
      "suppmanilocation": "EASTERN EUROPE",
      "supplierQuotedInvoicePrice": 641.55,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 3642647,
      "suppmanilocation": "EASTERN EUROPE",
      "supplierQuotedInvoicePrice": 456.98,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5714523,
      "suppmanilocation": "INDIA",
      "supplierQuotedInvoicePrice": 26.48,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5714523,
      "suppmanilocation": "CHINA",
      "supplierQuotedInvoicePrice": 25.53,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5714523,
      "suppmanilocation": "UK",
      "supplierQuotedInvoicePrice": 42.31,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 5717637,
      "suppmanilocation": "INDIA",
      "supplierQuotedInvoicePrice": 26.18,
      "highlevelprocess": "Sand Casting & Machining"
    },
    {
      "partname": "MANIFOLD, EXHAUST",
      "partno": 6377526,
      "suppmanilocation": "INDIA",
      "supplierQuotedInvoicePrice": 18.05,
      "highlevelprocess": "Sand Casting & Machining"
    }
  ]


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

}
