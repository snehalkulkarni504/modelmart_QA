import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
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
import { utils, writeFileXLSX } from 'xlsx';
import { SearchPipe } from "../../pipe/search.pipe";

@Component({
  selector: 'app-cost-reduction',
  templateUrl: './cost-reduction.component.html',
  styleUrls: ['./cost-reduction.component.css'],
})

export class CostReductionComponent implements OnInit {

  editingIndex: number | null = null;
  commericaltp: any;

  editingIndexRegional: number | null = null;
  showModal: any;
  selectedComment: any;
  selectedFiles: File[] = [];
  selectedFilesRegional: File[]=[];
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
  textsearch: string = '';
  filterMetadata = { count: 0 };
  page: number = 1;
  pageSize: number = 25;
  currentSortColumn: string = '';
  isAscending: boolean = true;

  selectedStatus_commerical: string = '';
  selectedStatus_regional: string = '';
  selectedStatus_mfg: string = '';

  totalAttainment: any;
  totaluserAttainment: any;
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
  calculatedPercentages: any[] = [];

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
  sessionflag:any;
  sessionCategoryID:any;
  Regional: any[] = [];
  opportunities: any[] = [];
  data: any = [];

  dateRanges = [
    { value: '', label: 'Select Range' },
    { value: '3', label: 'Last 3 Months' },
    { value: '6', label: 'Last 6 Months' },
    { value: '12', label: 'Last 1 Year' },
    { value: 'ALL', label: 'Select All' },
    { label: 'Custom', value: 'CUSTOM' }
  ];

  async ngOnInit(): Promise<void> {
    // debugger
    const shouldToggle = sessionStorage.getItem('toggleViewTrigger');
    
    const shouldToggle1 = sessionStorage.getItem('toggleViewTrigger1');
    if (shouldToggle === 'true') {
      const stored = sessionStorage.getItem('costinsightvalues');
      const storedproductlist = sessionStorage.getItem('SearchProductList');

      if (stored) {
        this.test = JSON.parse(stored); // Restores full object
      }
      if(storedproductlist){
        this.SearchProductList=JSON.parse(storedproductlist);
      }
      this.showArbitrage = true;
      this.showCat3Management = !this.showCat3Management;
      this.showContent = false;
      this.showRegionalContent = false;
      this.showmgfprocess = false;
      this.showdesign = false;
      this.showcostinsights = true;

      this.SpinnerService.show('spinner');

      await this.getSelectedPartsString();
      await this.GetCommericalArtibage();
      await this.GetRegionalArbitrage();
      await this.GetMgfProcessArtibage();
      await this.GetDesignArbitrage();
      await  this.GetMgfProcessArtibageComparison();

      this.ShowCagetory3();
      this.SpinnerService.hide('spinner');

      sessionStorage.removeItem('toggleViewTrigger'); // clean up
      sessionStorage.removeItem('costinsights1');
      sessionStorage.removeItem('SearchProductList');

    }
    else if (shouldToggle1 === 'true1') {
      const vavestored = sessionStorage.getItem('vavecostinsightvalues');
      const vavestoredproductlist = sessionStorage.getItem('vaveSearchProductList');

      if (vavestored) {
        this.test = JSON.parse(vavestored); // Restores full object
      }
      if(vavestoredproductlist){
        this.SearchProductList=JSON.parse(vavestoredproductlist);
      }
      this.showArbitrage = true;
      this.showCat3Management = !this.showCat3Management;
      this.showContent = false;
      this.showRegionalContent = false;
      this.showmgfprocess = false;
      this.showdesign = false;
      this.showcostinsights = true;

      this.SpinnerService.show('spinner');

      await this.getSelectedPartsString();
      await this.GetCommericalArtibage();
      await this.GetRegionalArbitrage();
      await this.GetMgfProcessArtibage();
      await this.GetDesignArbitrage();
      await  this.GetMgfProcessArtibageComparison();

      this.ShowCagetory3();
      this.SpinnerService.hide('spinner');

      sessionStorage.removeItem('toggleViewTrigger1'); // clean up
      sessionStorage.removeItem('vavecostinsightvalues');
      sessionStorage.removeItem('vaveSearchProductList');

    }
     else {
      // Regular init logic only if NOT coming from TCO
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
  }


  chartOptions = {

    animationEnabled: true,
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
      labelFormatter: function (e: any) {
        return (e.value / 1000000).toFixed(1) + "M$";
      }
    },
    toolTip: {
      shared: false,
      contentFormatter: function (e: any) {
        let content = "";
        for (let i = 0; i < e.entries.length; i++) {
          const dp = e.entries[i].dataPoint;
          const seriesName = e.entries[i].dataSeries.name;
          const millions = (dp.y / 1000000).toFixed(2);
          content += `${dp.label}: ${millions}M$<br/>`;
        }
        return content;
      }
    },

    dataPointWidth: 20,
    data: [
      {
        type: "column",
        color: "#da291c",
        indexLabelFontColor: "#000",
        name: "Commercial Arbitrage",
        showInLegend: true,
        dataPoints: [] as { label: string; y: any }[],

      },
      {
        type: "column",
        color: "#2fa365",
        indexLabelFontColor: "#000",
        name: "User Calculated Commercial Arbitrage",
        showInLegend: true,
        dataPoints: [] as { label: string; y: any }[],
      },
    ],

  }

  async GetCommericalArtibage() {
    debugger
    try {
      const categoryID = this.test;
      this.opportunities = [];
      this.orginalopportunities = [];

      const Commerical_data = await this.AdminService.GetCommericalArtibage(categoryID).toPromise();

      this.data = Commerical_data;
      this.opportunities = this.data;
      this.orginalopportunities = this.data;

      this.opportunities.forEach(opportunity => {
        if (!opportunity.ProjectStatus) {
          opportunity.ProjectStatus = 'Open'; // Default to "Open" if no value exists
        }
        opportunity.UserSimulatedArbitrage = Number(opportunity.UserSimulatedArbitrage) || 0; // Convert to number
        opportunity.CommercialArbitrage = Number(opportunity.CommercialArbitrage) || 0;
      });

      this.opportunities.sort((a, b) => {
        if (a.ProjectStatus === 'Close' && b.ProjectStatus !== 'Close') return 1;
        if (a.ProjectStatus !== 'Close' && b.ProjectStatus === 'Close') return -1;
        return 0;
      });
      // Process the data for chart
      debugger;
      this.chartOptions.data[0].dataPoints = this.opportunities.map(opportunity => ({

        label: opportunity.PartNumber,
        y: opportunity.CommercialArbitrage,
        // y: Number((opportunity.CommercialArbitrage / 1000000).toFixed(2)),
      }));
      this.chartOptions.data[1].dataPoints = this.opportunities.map(opportunity => ({
        label: opportunity.PartNumber,
        y: opportunity.UserSimulatedArbitrage,
        // y: Number((opportunity.UserSimulatedArbitrage / 1000000).toFixed(2)),
      }));
      this.gettotaloppurtunity();
      this.getGraphstyle();

    }
    catch (error) {
      console.error("Error in GetCommericalArtibage():", error);
      alert("Failed to fetch Commercial Arbitrage data. Please try again later.");
    }
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

  exportToExcel(): void {
    const exportData = this.opportunities.map((opp, index) => ({
      'Sr No': index + 1,
      'Part Number': opp.PartNumber,
      'Part Name': opp.PartName,
      'MMID': opp.MMID,
      'CAT4': opp.CAT4,
      'Supplier Name': opp.SupplierName,
      'Supp Mfg Location': opp.SupplierMfgRegion,
      'Annual Volume': opp.AnnualVolume,
      'Updated Annual Volume': opp.UpdatedAnnualVolume,
      'Should Cost': opp.ShouldCost,
      'User Simulated Cost': opp.UserCalculatedCost,
      'Supplier Quoted/Invoice Price': opp.SupplierQuoted,
      'Delta Should Cost - Invoice Price': opp.InvoicePriceShouldCost,
      'SC Attainment': this.RoundSCAttainment(opp),
      'User SC Attainment': this.calculatePercentage(opp),
      'Commercial Arbitrage': this.formatToMillions(opp.CommercialArbitrage),
      'User Simulated Arbitrage': this.formatToMillions(this.calculateOpportunityValue(opp)),
      'Submitted By': opp.ModifiedBy,
      'Project Status': opp.ProjectStatus,
      'Debrief Date': opp.DebriefDate,
      'Comments': opp.Comments,
    }));
    const worksheet = utils.json_to_sheet(exportData);
    worksheet['A1'].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4F81BD' } }
    };

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Opportunities');
    writeFileXLSX(workbook, `CommericalArbitrage_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }


  onViewClick() {
    debugger;

    if (this.selectedRange === 'ALL') {
      this.opportunities = this.data;
      // Process the data for chart
      // Filter by status if selected
      if (this.selectedStatus_commerical && this.selectedStatus_commerical !== '') {
        this.opportunities = this.opportunities.filter(opportunity =>
          (opportunity.ProjectStatus || '').trim().toLowerCase() === this.selectedStatus_commerical.trim().toLowerCase()
        );
      }
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
    }
    else if (this.fromDate && this.toDate) {
      const filteredData: any[] = [];
      this.opportunities = this.data;
      for (let i = 0; i < this.opportunities.length; i++) {
        const opportunity = this.opportunities[i];

        try {
          const debriefDate = opportunity.DebriefDate;

          if (
            debriefDate >= this.fromDate && debriefDate <= this.toDate) {
            filteredData.push(opportunity);
          }

        } catch (error) {
          console.error('Error parsing DebriefDate:', opportunity.DebriefDate, error);
        }
      }
      this.filteredData = filteredData;
      this.opportunities = this.filteredData;
      // Filter by status if selected
      if (this.selectedStatus_commerical && this.selectedStatus_commerical !== '') {
        this.opportunities = this.opportunities.filter(opportunity =>
          (opportunity.ProjectStatus || '').trim().toLowerCase() === this.selectedStatus_commerical.trim().toLowerCase()
        );
      }

      // Update chart data points based on filtered data
      this.chartOptions = { ...this.chartOptions };
      this.chartOptions.data[0].dataPoints = this.opportunities.map(opportunity => ({
        label: opportunity.PartNumber,
        y: opportunity.CommercialArbitrage,
      }));

      this.chartOptions.data[1].dataPoints = this.opportunities.map(opportunity => ({
        label: opportunity.PartNumber,
        y: opportunity.UserSimulatedArbitrage,
      }));


      console.log('Updated Chart Data:', this.chartOptions);
    } else {
      console.error('Invalid Date Range');

    }

  }
  sortBy(column: string, event: Event) {
    // Determine sorting direction
    if (this.currentSortColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortColumn = column;
      this.isAscending = true;
    }

    // Update sort icon
    const icon = (event.target as HTMLElement).closest('.my-icon')?.querySelector('i');
    if (icon) {
      icon.classList.remove('bi-sort-up', 'bi-sort-down'); // Clear previous state
      icon.classList.add(this.isAscending ? 'bi-sort-up' : 'bi-sort-down');
    }

    // Sort logic
    this.opportunities.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Dates
      const isDate = typeof aVal === 'string' && !isNaN(Date.parse(aVal));
      if (isDate) {
        const aTime = new Date(aVal).getTime();
        const bTime = new Date(bVal).getTime();
        return this.isAscending ? aTime - bTime : bTime - aTime;
      }

      // Numbers
      if (!isNaN(aVal) && !isNaN(bVal)) {
        return this.isAscending ? aVal - bVal : bVal - aVal;
      }

      // Strings
      return this.isAscending
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });
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
      case "ALL":
        fromDate = null;
        break;
      case "CUSTOM":
        // For CUSTOM, allow user to pick manually, so skip setting dates here
        return;
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
    this.selectedStatus_commerical = "";
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
    const r = document.getElementById("chartOptionsId") as any;
    r.getElementsByClassName('canvasjs-chart-credit')[0].style.display = "none";
  }

  backToCat3() {
    debugger
    this.showCat3Management = true;
    this.showcostinsights = false;
    this.showContent = false;
    this.showRegionalContent = false;
    this.showmgfprocess = false;
    this.showdesign = false;
    this.selectedCategoryIds = [];
    this.test = [];
    this.CategoryID = null
    this.activeButton = '';
    this.totalVariation = null;
    this.totalAttainment = null;
    this.totaluserAttainment = null;
    this.selectAllText = 'Select All';

  }

  async setActiveButton(buttonName: string) {
    this.SpinnerService.show('spinner');
    this.activeButton = buttonName;
    // Reset visibility for all sections
    this.showContent = buttonName === 'commercial';
    this.showRegionalContent = buttonName === 'regional';
    this.showmgfprocess = buttonName === 'manufacturing';
    this.showdesign = buttonName === 'design';

    switch (this.activeButton) {
      case 'regional':
        this.totalVariation = this.getTotalRegionalOppurtunity();
        this.totalAttainment = this.RegionalSCAttainment();
        break;
      case 'manufacturing':
        this.totalVariation = this.getTotalMfgOppurtunity();
        this.totalAttainment = this.ManufacturingSCAttainment();
        break;
      case 'design':
        this.totalVariation = this.gettotaloppurtunity();
        this.totalAttainment = this.RegionalSCAttainment();
        break;
      default:
        this.totalVariation = this.gettotaloppurtunity();
        this.totalAttainment = this.calculateWeightedSCAttainment();
        this.totaluserAttainment = this.calculateWeightedUserSCAttainment();
    }

    setTimeout(() => {
      this.hidename();
    }, 200);

    this.SpinnerService.hide('spinner');
  }

  editRow(index: number) {
    this.isEditing = !this.isEditing;
    this.editingIndex = index; // Enable edit mode for the selected row
  }

  async saveChanges(opportunity: CommericalArbitrage) {
    debugger;
    if (!opportunity.UserSimulatedCostAttainment) {
      opportunity.UserSimulatedCostAttainment = "0"; // Default simulated cost attainment value
    }
    if (!opportunity.UserSimulatedArbitrage) {
      opportunity.UserSimulatedArbitrage = "0"; // Default simulated cost attainment value
    }
    if (!opportunity.CommercialArbitrage) {
      opportunity.CommercialArbitrage = "0"; // Default arbitrage value
    }

    if (opportunity.UpdatedAnnualVolume === null || opportunity.UpdatedAnnualVolume === undefined || opportunity.UpdatedAnnualVolume === '') {
      opportunity.UpdatedAnnualVolume = String(opportunity.AnnualVolume || 0); // default we are sending orginal annualvaloume
    }
    
    if (opportunity.UserCalculatedCost === null || opportunity.UserCalculatedCost === undefined || opportunity.UserCalculatedCost === '') {
      opportunity.UserCalculatedCost = String(opportunity.ShouldCost || 0);  // default we are sending orginal shouldcost
    }
    
    opportunity.UserSimulatedCostAttainment = this.calculatePercentage(opportunity) 
    opportunity.UserSimulatedArbitrage = this.calculateOpportunityValue(opportunity) || "0.00";
    opportunity.ModifiedBy = (localStorage.getItem("userFullName"))

    const attainmentValue = parseFloat(opportunity.UserSimulatedCostAttainment);
    if (attainmentValue > 100) {
      this.toastr.warning('User Simulated Cost Attainment cannot exceed 100%', 'Validation Error');
      const proceed = window.confirm('User Simulated Cost Attainment exceeds 100%. Do you want to proceed?');
      if (!proceed) {
        return; // Stop saving
      }
    }

    // Default CommercialArtibageID to 0 if null or undefined
    if (!opportunity.CommericalArtibageID) {
      opportunity.CommericalArtibageID = 0;
    }

    console.log('Updated data:', opportunity);

    this.AdminService.SaveCommericalArtibage(opportunity).subscribe({
      next: (response) => {
        console.log('Record saved successfully:', response);
        this.editingIndex = null; // Exit edit mode
        this.opportunities = this.data;
        this.toastr.success('Opportunity saved successfully');

        setTimeout(async () => {
          debugger
          await this.GetCommericalArtibage();
          this.totaluserAttainment = this.calculateWeightedUserSCAttainment();
          this.chartOptions = { ...this.chartOptions };
        }, 500);
      },
      error: (error) => {
        console.error('Error saving opportunity:', error);
        this.toastr.error('Error while Saving Record');
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

  navigateToDetails(CSHeaderID: string): void {

    // sessionStorage.setItem('CSHeaderID', CSHeaderID);
    localStorage.setItem("ComapredId", CSHeaderID);
    sessionStorage.setItem('vavecostinsightvalues', JSON.stringify(this.test));
    sessionStorage.setItem('vaveSearchProductList', JSON.stringify(this.SearchProductList));
    this.router.navigate(['/home/shouldcost']);
  }

  calculateWeightedSCAttainment(): string {
    let totalWeightedSCAttainment = 0;
    let totalSupplierQuoted = 0;

    this.orginalopportunities.forEach((opportunity: { SupplierQuoted: any; SCAttainment: any }) => {
      const quoted = Number(opportunity.SupplierQuoted) || 0;
      const scAttain = Number(opportunity.SCAttainment) || 0;

      totalWeightedSCAttainment += quoted * (scAttain / 100);
      totalSupplierQuoted += quoted;
    });

    const result = totalSupplierQuoted > 0
      ? (totalWeightedSCAttainment / totalSupplierQuoted) * 100
      : 0;

    return result.toFixed(2) + '%';
  }

  calculateWeightedUserSCAttainment(): string {
    let totalWeightedSCAttainment = 0;
    let totalSupplierQuoted = 0;

    this.orginalopportunities.forEach((opportunity: any) => {
      const quoted = Number(opportunity.SupplierQuoted) || 0;
      const cost = Number(opportunity.UserCalculatedCost) || 0;

      let percentage = 0;
      if (quoted > 0 && cost > 0) {
        percentage = (cost / quoted) * 100;
      }

      totalWeightedSCAttainment += quoted * (percentage / 100);
      totalSupplierQuoted += quoted;
    });

    const result = totalSupplierQuoted > 0
      ? (totalWeightedSCAttainment / totalSupplierQuoted) * 100
      : 0;

    return result.toFixed(2) + '%';
  }

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
    let total = 0;
    // Iterate over the opportunities array and sum up the UserCalculatedCost values
    this.orginalopportunities.forEach((opportunity: { CommercialArbitrage: any; }) => {
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
      return (value / 1000000).toFixed(2) + ' M$';
    }
    return value.toString();
  }

  async uploadTCO(CommericalArtibageID: any, MMID: any, RequestHeaderId: any): Promise<void> {
    this.selectedUniqueId = MMID;
    this.selectedRequestId = RequestHeaderId;

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
      // debugger
      const encryptedUniqueId = btoa(this.selectedUniqueId);
      const encryptedRequestId = btoa(this.selectedRequestId);
      sessionStorage.setItem('costinsightvalues', JSON.stringify(this.test));
      sessionStorage.setItem('SearchProductList', JSON.stringify(this.SearchProductList));

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
    if (!Array.isArray(this.SearchProductList)) {
      return ''; // or return 'No products selected'
    }
    return this.SearchProductList
      .filter((p: { selected: any; }) => p.selected)
      .map((item: { childCategory: any; }) => item.childCategory)
      .join(', ');
  }

  openUploadPopup(CommericalArtibageID: any, MMID: any, RequestHeaderId: any): void {
    if (CommericalArtibageID == null) {
      this.toastr.warning("Please update the record then upload a file");
      return;
    }
    this.selectedCommercialID = CommericalArtibageID;
    this.selectedUniqueId = MMID;
    this.selectedRequestId = RequestHeaderId;
    this.showTcoUploadModal = true;
    this.showFileUpload = true;
  }

  handleFileSelection(event: any): void {
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
          this.toastr.success('Files uploaded successfully!');
          this.selectedFiles = []; // Clear selected files after upload
          this.closeUploadPopup();
        },
        error: (error) => {
          console.error('File upload failed:', error);
          alert('File upload failed!');
          this.toastr.error('File upload Failed');

        },
      });
    } else {
      alert('Please select files to upload.');
      this.toastr.warning('please select files to upload');
    }
  }


  downloadFolderAsZip(CommericalArtibageID: string, PartNumber: any): void {

    if (CommericalArtibageID == null) {
      this.toastr.warning("Please update the record then download a file");
      return;
    }
    const formattedFileName = `${PartNumber}_CommercialArbitrage_${CommericalArtibageID}.zip`;
  
    this.AdminService.downloadZipFile(CommericalArtibageID).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response); // Create a blob URL
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = formattedFileName; // Name the ZIP file with the commercial ID
        anchor.click();
        window.URL.revokeObjectURL(url); // Clean up the URL
        this.toastr.success('File downloaded sucessfully')
      },
      (error) => {
        console.error('Error downloading ZIP file:', error);
        this.toastr.error('Error downloading ZIP file');
      }
    );
  }

  async ShowLandingPage(flag: number, CategoryID: string) {
    debugger
    try {
      this.sessionCategoryID=CategoryID;
      this.sessionflag=flag;
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
    const allSelected = this.SearchProductList.every((group: { selected: boolean }) => group.selected);

    this.SearchProductList.forEach((group: { selected: boolean }) => {
      group.selected = !allSelected;
    });

    if (!allSelected) {
      this.selectedCategoryIds = this.SearchProductList.map((group: { categoryId: any }) => group.categoryId);
      this.selectAllText = 'Unselect All';
    } else {
      this.selectedCategoryIds = [];
      this.selectAllText = 'Select All';
    }

    this.test = this.selectedCategoryIds;
  }

  onCheckboxChange(item: any) {
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
    this.selectAllText = 'Select All';
  }


  public clearall() {
    for (let i = 0; i < this.cat3.filterItems.length; i++) {
      this.cat3.filterItems[i].checked = false;
    }

    this.ShowLandingPage(0, "0");
    this.selectAllText = 'Select All';

  }


  async toggleView() {
    debugger;
   
    if (!this.test || this.test.length === 0) {
      // this.selectAll();
      this.toastr.warning("Please select atleast one Category");
      return;

    }
    else{
      this.SpinnerService.show('spinner');
      this.showcostinsights = true;

    await this.GetCommericalArtibage();
    await this.GetRegionalArbitrage();
    await this.GetMgfProcessArtibage();
    await this.GetDesignArbitrage();
     await  this.GetMgfProcessArtibageComparison();

    this.showArbitrage = true;
    this.showCat3Management = !this.showCat3Management;
    this.showContent = false;
    this.showRegionalContent = false;
    this.showmgfprocess = false;
    this.showdesign = false;
    this.SpinnerService.hide('spinner');
    }

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
  RegionalfromDate: any;
  RegionaltoDate: any;
  RegionData: any = [];
  orgibnalRegional: any = [];
  showregioncomment: boolean = false;
  ShowRegionalUpload: boolean = false;
  selectedRange_Regional: string = ""
  selectedRegional_ArtibageID: any;

  async GetRegionalArbitrage(): Promise<void> {
    debugger
    this.RegionData = [];
    this.orgibnalRegional = [];
    const categoryID = this.test;
    try {
      const response = await this.AdminService.GetRegionalArbitrage(categoryID).toPromise();
      debugger
      this.RegionData = response;
      this.Regional = this.RegionData;
      this.orgibnalRegional = this.RegionData;
      this.Regional.forEach((region) => {
        console.log(region);
      });

      this.RegionchartOptions.data[0].dataPoints = this.Regional.map(region => ({
        label: region.PartNumber,
        y: Math.abs(Number(region.RegionalArbitrage)) || 0,
        // y: Math.abs(Number((Number(region.RegionalArbitrag) / 1000000).toFixed(2))) || 0
        Relation: region.RegionRelation || 'N/A',

      }));
      this.Regional.forEach(Region => {
        if (!Region.ProjectStatus) {
          Region.ProjectStatus = 'Open'; // Default to "Open" if no value exists
        }
      });
      this.Regional.sort((a, b) => {
        if (a.ProjectStatus === 'Close' && b.ProjectStatus !== 'Close') return 1;
        if (a.ProjectStatus !== 'Close' && b.ProjectStatus === 'Close') return -1;
        return 0;
      });

    } catch (err) {
      console.error('Error fetching regional arbitrage:', err);
      this.toastr.error('Error fetching regional arbitrage');
    }
  }

  exportRegionalTableToExcel(): void {
    const exportData = this.Regional.map((region, index) => ({
      'Sr No': index + 1,
      'Part Number': region.PartNumber,
      'Part Name': region.PartName,
      'CAT4': region.CAT4,
      'Supplier Mfg Location': region.MainRegion,
      'Annual Volume': region.AnnualVolume,
      'Supplier Quoted / Invoice Price': region.TotalCost,
      'Supplier Name': region.Supplier,
      'Best Region': region.BestRegion,
      'Best Region Cost': region.BestRegionCost,
      'Region Arbitrage (USD)': region.RegionalArbitrage,
      'Region Relation': region.RegionRelation,
      'Project Status': region.ProjectStatus,
      'Debrief Date': region.DebriefDate,
      'Comments': region.Comments,
    }));

    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'RegionalData');

    writeFileXLSX(workbook, `RegionalArbitrage_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }


  getTotalRegionalOppurtunity(): string {
    debugger
    let total = 0;
    this.orgibnalRegional.forEach((Region: { RegionalArbitrage: any; }) => {
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
      labelFormatter: function (e: any) {
        return `${e.value} $`;
      }
    },

    dataPointWidth: 20,
    data: [{
      indexLabelFontColor: "#000",
      toolTipContent: "{label} : {y}$ | {Relation}",
      type: "column",
      color: "#da291c",
      indexLabel: "{Relation}" || 'N/A',
      indexLabelFontSize: 7,
      indexLabelFontWeight: "bold",
      // indexLabelOrientation: "horizantal",
      dataPoints: [] as { label: string, y: number, Relation: string }[]
    }],

  }

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
      case "ALL":
        RegionalfromDate = null;
        break;
      case "CUSTOM":
        // For CUSTOM, allow user to pick manually, so skip setting dates here
        return;
      default:
        RegionalfromDate = null;
        break;
    }
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
  cancelEditingRegional() {
    this.editingIndexRegional = null;
  }

  RegionUploadTCO(Regional_ArtibageID: string) {
    debugger
    if (Regional_ArtibageID == null) {
      this.toastr.warning("Please update the record then upload a file");
      return;
    }
    this.selectedRegional_ArtibageID = Regional_ArtibageID
    this.ShowRegionalUpload = true;
    this.showFileUpload = true;
  }

  UploadReginalFiles(Regional_ArtibageID: string): void {
    debugger
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.AdminService.RegionalUpload(Regional_ArtibageID, this.selectedFiles).subscribe({
        next: (response) => {
          console.log('Files uploaded successfully:', response);
          alert('Files uploaded successfully!');
          this.toastr.success('Files uploaded successfully!');
          this.selectedFiles = []; // Clear selected files after upload
        },
        error: (error) => {
          console.error('File upload failed:', error);
          alert('File upload failed!');
          this.toastr.error('File upload failed!');
        },
      });
    } else {
      alert('Please select files to upload.');
      this.toastr.error('Please select files to upload.');

    }
  }
  RegionaleditRow(index: number) {
    this.isEditing = !this.isEditing;
    // this.editingIndex = index; 
    this.editingIndexRegional = index;
  }

  closeRegionalupload(): void {
    this.showFileUpload = false;
    this.ShowRegionalUpload = false;
  }

  RegionFileDownloadAsZip(PartNumber: any, Regional_ArtibageID: string): void {
    if (Regional_ArtibageID == null) {
      this.toastr.warning("Please update the record then download a file");
      return;
    }
    //debugger
    const formattedFileName = `${PartNumber}_RegionalArbitrage_${Regional_ArtibageID}.zip`;
    this.AdminService.downloadReginalFileAsZip(Regional_ArtibageID).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response); // Create a blob URL
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = formattedFileName; // Name the ZIP file with the commercial ID
        anchor.click();
        window.URL.revokeObjectURL(url); // Clean up the URL
        this.toastr.success('File Downloaded successfully');
      },
      (error) => {
        console.error('Error downloading ZIP file:', error);
        this.toastr.error('Error downloading ZIP file');
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
        this.toastr.success('Record saved successfully');
        this.editingIndexRegional = null; // Exit edit mode
        this.GetRegionalArbitrage();
        this.chartOptions;
      },
      error: (error) => {
        console.error('Error saving opportunity:', error);
        this.toastr.error('Error while Saving Record"');
      }
    });
  }

  RegionalDateFilter() {
    // debugger;
    if (this.selectedRange_regional === 'ALL') {
      this.Regional = this.RegionData;

      if (this.selectedStatus_regional && this.selectedStatus_regional !== '') {
        this.Regional = this.Regional.filter(Region =>
          (Region.ProjectStatus || '').trim().toLowerCase() === this.selectedStatus_regional.trim().toLowerCase()
        );
      }

      this.RegionchartOptions = { ...this.RegionchartOptions };
      this.RegionchartOptions.data[0].dataPoints = this.Regional.map(region => ({
        label: region.PartNumber,
        y: Math.abs(Number(region.RegionalArbitrage)) || 0,
        Relation: region.RegionRelation || 'N/A',
      }));
    }
    else if (this.RegionalfromDate && this.RegionaltoDate) {
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
          this.toastr.error('Error parsing DebriefDate');

        }
      }
      this.filteredData = filteredData;
      this.Regional = this.filteredData;

      if (this.selectedStatus_regional && this.selectedStatus_regional !== '') {
        this.Regional = this.Regional.filter(Region =>
          (Region.ProjectStatus || '').trim().toLowerCase() === this.selectedStatus_regional.trim().toLowerCase()
        );
      }
      this.RegionchartOptions = { ...this.RegionchartOptions };

      this.RegionchartOptions.data[0].dataPoints = this.Regional.map(region => ({
        label: region.PartNumber,
        y: Math.abs(Number(region.RegionalArbitrage)) || 0,
        Relation: region.RegionRelation || 'N/A',
      }));

      console.log('Updated Chart Data:', this.RegionchartOptions);
    } else {
      console.error('Invalid Date Range');
      this.toastr.error('Invalid Date Range');
    }
  }

  ClearDateFilter(): void {
    this.selectedStatus_regional = "";
    this.selectedRange_regional = ""; // Reset dropdown
    this.RegionalfromDate = null;
    this.RegionaltoDate = null;
    this.filteredData = [];
    this.Regional = this.RegionData;

    this.RegionchartOptions = { ...this.RegionchartOptions };
    this.RegionchartOptions.data[0].dataPoints = this.Regional.map(region => ({
      label: region.PartNumber,
      y: Math.abs(Number(region.RegionalArbitrage)) || 0,
      Relation: region.RegionRelation || 'N/A',
    }));

  }
  RegionalSortBy(column: string, event: Event) {
    // Toggle sorting direction
    if (this.currentSortColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortColumn = column;
      this.isAscending = true;
    }

    // Handle icon toggle
    const icon = (event.target as HTMLElement).closest('.my-icon')?.querySelector('i');
    if (icon) {
      icon.classList.remove('bi-sort-up', 'bi-sort-down');
      icon.classList.add(this.isAscending ? 'bi-sort-up' : 'bi-sort-down');
    }

    // Sorting logic
    this.Regional.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const isDate = typeof aVal === 'string' && !isNaN(Date.parse(aVal));
      if (isDate) {
        const aTime = new Date(aVal).getTime();
        const bTime = new Date(bVal).getTime();
        return this.isAscending ? aTime - bTime : bTime - aTime;
      }

      if (!isNaN(aVal) && !isNaN(bVal)) {
        return this.isAscending ? aVal - bVal : bVal - aVal;
      }

      return this.isAscending
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });
  }

  async RouteToTco(MMID: any, RequestHeaderId: any): Promise<void> {
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
      const encryptedUniqueId = btoa(this.selectedRegionalUniqueId); // Base64 encoding
      const encryptedRequestId = btoa(this.selectedRegionalRequestId); // Base64 encoding
      sessionStorage.setItem('costinsightvalues', JSON.stringify(this.test));
      sessionStorage.setItem('SearchProductList', JSON.stringify(this.SearchProductList));
      
      this.router.navigate(['/home/tcoupload'], {
        queryParams: {
          UniqueId: encryptedUniqueId,
          RequestId: encryptedRequestId
        }
      });
    }
  }

  RegionalSCAttainment(): string {
    debugger;
    let totalShouldCost = 0;
    let totalSupplierQuoted = 0;

    this.orgibnalRegional.forEach((Region: { ShouldCost: any; TargetQuote: any }) => {
      totalShouldCost += Number(Region.ShouldCost) || 0;
      totalSupplierQuoted += Number(Region.TargetQuote) || 0;
    });
    let percentage = (totalShouldCost / totalSupplierQuoted) * 100;
    return percentage.toFixed(2) + '%'; // Ensuring two decimal places in the output
  }

  RegionalFileSelection(event: any): void {
    const files: FileList = event.target.files; // Get selected files
    this.selectedFilesRegional = []; // Clear previous selections

    if (files && files.length > 0) {
      console.log(`Number of files selected: ${files.length}`);
      for (let i = 0; i < files.length; i++) {
        console.log(`File ${i + 1}: ${files[i].name}`);
        this.selectedFilesRegional.push(files[i]); // Store files in an array
      }
    } else {
      console.log('No files selected.');
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
  selectedMfgId: any;
  selectedRequestIdMfg: any;
  minDateMfg: string = '';
  maxDateMfg: string = '';
  filteredDataMfg: any[] = [];
  RegionDataMfg: any = [];
  orginalmfg: any = [];
  opportunitiesMfg: any = [];
  orginalopportunities: any = [];
  showModalMfg: any;
  selectedCommentMfg: any;
  editingIndexMfg: number | null = null;
  showTcoUploadModalMfg: boolean = false;
  showFileUploadMfg: boolean = false;
  mgfprocessComparison: any[] = [];
  pageComparison = 1;
pageSizeComparison = 25;
data2:any = [];
 


  getAbsoluteDifference(col2First: number, col2Second: number): number {
    return Math.abs(col2First - col2Second);
  }


  openUploadPopupMfg(Mfg_ArtibageID: any): void {
    debugger;
    if (Mfg_ArtibageID == null) {
      this.toastr.warning("Please update the record then upload a file");
      return;
    }
    this.selectedMfgId = Mfg_ArtibageID;
    this.showTcoUploadModalMfg = true;
    this.showFileUploadMfg = true;

  }


  getTotalMfgOppurtunity(): string {
    const total = this.orginalmfg.reduce((sum: number, data: { Col2_First: number; Col2_Second: number; }) => {
      const diff = Math.abs(data.Col2_First - data.Col2_Second);
      return sum + diff;
    }, 0);

    return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }


  async GetMgfProcessArtibage() {
    debugger;
    //  Refer This
    this.mgfprocess = [];
    this.orginalmfg = [];
    this.AdminService.GetMgfProcess(this.test).subscribe(
      (response: any) => {
        debugger
        this.data1 = response;
        this.mgfprocess = this.data1;
        this.orginalmfg = this.data1;

        this.mgfprocess.forEach((data) => {
          if (!data.ProjectStatus) {
            data.ProjectStatus = 'Open'; // Default to "Open" if no value exists
          }
        });
        // Process the data for chart
        this.MfgchartOptions.data[0].dataPoints = this.mgfprocess.map(data => ({
          label: data.PartNumber,
          y: Number(data.Col2_First.toFixed(2))
        }));

        this.MfgchartOptions.data[1].dataPoints = this.mgfprocess
          .map(data => ({
            label: data.PartNumber,
            y: Number(data.Col2_Second.toFixed(2))
          }));

        this.mgfprocess.sort((a, b) => {
          if (a.ProjectStatus === 'Close' && b.ProjectStatus !== 'Close') return 1;
          if (a.ProjectStatus !== 'Close' && b.ProjectStatus === 'Close') return -1;
          return 0;
        });
        this.getGraphstyleMfg();

      },

      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );

  }
 
exportMfgTableToExcel(): void {
  const exportData = this.mgfprocess.map((item, index) => ({
    'Sr No': index + 1,
    'Part Number': item.PartNumber,
    'Part Name': item.PartName,
    'Supplier Mfg Location': item.MfgRegion,
    'Process1 Tooling Cost (USD)': item.Process1_ToolingCost ? this.roundToTwoDecimalPlaces(item.Process1_ToolingCost) : '',
    'Process2 Tooling Cost (USD)': item.Process2_ToolingCost ? this.roundToTwoDecimalPlaces(item.Process2_ToolingCost) : '',
    'Process1 Invoice Cost (USD)': item.Process1_InvoiceCost ? this.roundToTwoDecimalPlaces(item.Process1_InvoiceCost) : '',
    'Process2 Invoice Cost (USD)': item.Process2_InvoiceCost ? this.roundToTwoDecimalPlaces(item.Process2_InvoiceCost) : '',
    'Process1 Annual Volume': item.Process1_AnnualVolume ? this.roundToTwoDecimalPlaces(item.Process1_AnnualVolume) : '',
    'Process2 Annual Volume': item.Process2_AnnualVolume ? this.roundToTwoDecimalPlaces(item.Process2_AnnualVolume) : '',
    'Debrief Date': item.DebriefDate ? item.DebriefDate.split('T')[0] : '',
    'Process1 Quote / Should Cost (USD)': item.Col2_First.toFixed(2),
    'Process1 Name': item.HighLevelProcess_First,
    'Process2 Quote / Should Cost (USD)': item.Col2_Second.toFixed(2),
    'Process2 Name': item.HighLevelProcess_Second,
    'Should Cost Variation (USD)': this.getAbsoluteDifferenceMfg(item.Col2_First, item.Col2_Second).toFixed(2),
    'Invoice Cost Variation (USD)': this.getInvoiceCostVariation(item),
    'High Level Process Flow': `${item.Col2_First > item.Col2_Second ? item.HighLevelProcess_First : item.HighLevelProcess_Second} → ${item.Col2_First > item.Col2_Second ? item.HighLevelProcess_Second : item.HighLevelProcess_First}`,
    'Comments': item.Comments,
    'Submitted By': item.ModifiedBy,
    'Project Status': item.ProjectStatus
  }));

  // Use your existing Excel export utility
  const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Manufacturing');
 
    writeFileXLSX(workbook, `ManufacturingArbitrage_${new Date().toISOString().slice(0, 10)}.xlsx`);
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
        this.toastr.success("Record Saved Successfully.");
        this.editingIndexMfg = null; // Exit edit mode
        this.GetMgfProcessArtibage();
        //this.chartOptions;
      },
      error: (error) => {
        console.error('Error saving opportunity:', error);
        this.toastr.error("Error while Saving Record");
      },
    });
  }

  cancelEditingMfg() {
    this.editingIndexMfg = null; // Cancel edit mode without saving
  }
  roundToTwoDecimalPlaces(value: string): string {
    return parseFloat(value).toFixed(2);
  }
  GetMgfProcessArtibageComparison() {
    const categoryID = this.test;
   debugger;
   
 this.mgfprocessComparison = [];
 this.AdminService.GetMgfProcessArtibageComparison(categoryID).subscribe(
   (response: any) => {
     this.data2 = response;
     this.mgfprocessComparison = this.data2;
      this.pageComparison = 1; // Reset page on data load
  
   },
   (error: any) => {
     console.error('Error fetching comparison data:', error);
   }
 );
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
      case "ALL":
        fromDate = null;
        break;
      case "CUSTOM":
        // For CUSTOM, allow user to pick manually, so skip setting dates here
        return;
      default:
        fromDate = null;
        break;
    }
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
      labelFormatter: function (e: any) {
        return `${e.value} $`;
      }
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

    if (this.selectedRangeMfg === 'ALL') {
      this.mgfprocess = this.data1;
      // Process the data for chart
      if (this.selectedStatus_mfg && this.selectedStatus_mfg !== '') {
        this.mgfprocess = this.mgfprocess.filter(mfg =>
          (mfg.ProjectStatus || '').trim().toLowerCase() === this.selectedStatus_mfg.trim().toLowerCase()
        );
      }

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
    }

    else if (this.fromDateMfg && this.toDateMfg) {
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
          this.toastr.error('Error parsing DebriefDate');
        }
      }
      this.filteredDataMfg = filteredData;
      this.mgfprocess = this.filteredDataMfg;

      if (this.selectedStatus_mfg && this.selectedStatus_mfg !== '') {
        this.mgfprocess = this.mgfprocess.filter(mfg =>
          (mfg.ProjectStatus || '').trim().toLowerCase() === this.selectedStatus_mfg.trim().toLowerCase()
        );
      }

      // Update chart data points based on filtered data
      this.MfgchartOptions = { ...this.MfgchartOptions };

      this.MfgchartOptions.data[0].dataPoints = this.filteredDataMfg.map(data => ({
        label: data.PartNumber,
        y: Number(data.Col2_First)
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
    this.selectedStatus_mfg = "";
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
  }

  getAbsoluteDifferenceMfg(col2First: number, col2Second: number): number {
    return Math.abs(col2First - col2Second);
  }

  downloadFolderAsZipMfg(Mfg_ArtibageID: string, PartNumber: any): void {
    //debugger

    if (Mfg_ArtibageID == null) {
      this.toastr.warning("Please update the record then upload a file");
      return;
    }
    const formattedFileName = `${PartNumber}_RegionalArbitrage_${Mfg_ArtibageID}.zip`;
    this.AdminService.downloadZipFile_mfg(Mfg_ArtibageID).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response); // Create a blob URL
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = formattedFileName; // Name the ZIP file with the commercial ID
        anchor.click();
        window.URL.revokeObjectURL(url); // Clean up the URL
        this.toastr.success("File Downloaded Successfully");
      },
      (error: any) => {
        console.error('Error downloading ZIP file:', error);
        this.toastr.error("Error Downloading ZIP file");
      }
    );
  }


  openCommentsPopupMfg(comment: string, index: number): void {
    if (this.editingIndexMfg === index) {
      this.selectedCommentMfg = comment;
      this.showModalMfg = true;
    }
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

  uploadFilesMfg(mfgid: any): void {
    if (this.selectedFilesMfg && this.selectedFilesMfg.length > 0) {
      this.AdminService.Uploadfiles_mfg(mfgid, this.selectedFilesMfg).subscribe({
        next: (response: any) => {
          console.log('Files uploaded successfully:', response);
          alert('Files uploaded successfully!');
          this.selectedFilesMfg = []; // Clear selected files after upload
          this.toastr.success("Files uploaded successfully.");
        },
        error: (error: any) => {
          console.error('File upload failed:', error);
          alert('File upload failed!');
          this.toastr.error("File upload Failed")
        },
      });
    } else {
      alert('Please select files to upload.');
    }
  }


  ManufacturingSCAttainment(): string {
    debugger;
    let totalShouldCost = 0;
    let totalSupplierQuoted = 0;
    if (!this.mgfprocess || this.mgfprocess.length === 0) {
      return '0.00%';
    }

    this.orginalmfg.forEach((Mfg: { ShouldCost: any; TargetQuote: any }) => {
      totalShouldCost += Number(Mfg.ShouldCost) || 0;
      totalSupplierQuoted += Number(Mfg.TargetQuote) || 0;
    });
    let percentage = (totalShouldCost / totalSupplierQuoted) * 100;
    return percentage.toFixed(2) + '%'; // Ensuring two decimal places in the output
  }


  GetMfgGraphStyle() {

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
  MfgSortBy(column: string, event: Event) {
    // Toggle sorting direction
    if (this.currentSortColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortColumn = column;
      this.isAscending = true;
    }

    // Update sort icon
    const icon = (event.target as HTMLElement).closest('.my-icon')?.querySelector('i');
    if (icon) {
      icon.classList.remove('bi-sort-up', 'bi-sort-down');
      icon.classList.add(this.isAscending ? 'bi-sort-up' : 'bi-sort-down');
    }

    // Sorting logic
    this.mgfprocess.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const isDate = typeof aVal === 'string' && !isNaN(Date.parse(aVal));
      if (isDate) {
        const aTime = new Date(aVal).getTime();
        const bTime = new Date(bVal).getTime();
        return this.isAscending ? aTime - bTime : bTime - aTime;
      }

      if (!isNaN(aVal) && !isNaN(bVal)) {
        return this.isAscending ? aVal - bVal : bVal - aVal;
      }

      return this.isAscending
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });
  }
  getInvoiceCostProcess1(data: any): number {
    if (!data.Process1_ToolingCost || !data.Process1_AnnualVolume) {
      return 0;
    }
    return (data.Process1_ToolingCost / data.Process1_AnnualVolume) + data.Col2_First;
  }
  
  getInvoiceCostProcess2(data: any): number {
    if (!data.Process2_ToolingCost || !data.Process2_AnnualVolume) {
      return 0;
    }
    return (data.Process2_ToolingCost / data.Process2_AnnualVolume) + data.Col2_Second;
  }
  
  getInvoiceCostVariation(data: any): string {
    // Check for missing or invalid values
    if (!data.Process1_ToolingCost || !data.Process2_ToolingCost ||
        !data.Process1_InvoiceCost || !data.Process2_InvoiceCost) {
      return 'NA';
    }
   
    const annualVolume1 = data.Process1_AnnualVolume || 1;
    const annualVolume2 = data.Process2_AnnualVolume || 1;
   
    const process1 = (data.Process1_ToolingCost / annualVolume1) + data.Process1_InvoiceCost;
    const process2 = (data.Process2_ToolingCost / annualVolume2) + data.Process2_InvoiceCost;
   
    return '$' + Math.abs(process1 - process2).toFixed(2);
  }

  //-------------------------------------end mfg process Arbitrage --------------------------------------------//

  //------------------------------------------- start of Design Arbitrage--------------------------------------//


  designdata: any = [];
  design: any[] = [];
  orginaldesign: any = [];


  async GetDesignArbitrage() {
    debugger
    try {
      const categoryID = this.test;
      this.design = [];
      this.orginaldesign = [];

      const Design_data = await this.AdminService.GetDesignArbitrage(categoryID).toPromise();
      debugger;
      this.designdata = Design_data;
      this.design = this.designdata;
      this.orginaldesign = this.data;

      this.design.forEach(designarbitragedata => {
        if (!designarbitragedata.ProjectStatus) {
          designarbitragedata.ProjectStatus = 'Open'; // Default to "Open" if no value exists

        } designarbitragedata.DesignWeight = Number(designarbitragedata.DesignWeight) || 0; // Convert to number
        designarbitragedata.MainWeight = Number(designarbitragedata.MainWeight) || 0;
      });
      // Process the data for chart
      debugger;
      this.Designchartoptions.data[0].dataPoints = this.design.map(designarbitragedata => ({

        label: designarbitragedata.PartNumber,
        y: designarbitragedata.DesignWeight,
      }));
      this.Designchartoptions.data[1].dataPoints = this.design.map(designarbitragedata => ({
        label: designarbitragedata.PartNumber,
        y: designarbitragedata.MainWeight,
      }));

      this.DesignGraphStyle();

    }
    catch (error) {
      console.error("Error in GetDesignArbitrage ", error);
      alert("Failed to fetch Design Arbitrage data. Please try again later.");
    }
  }





  Designchartoptions = {

    animationEnabled: true,

    title: {
      text: "Part Number vs Design Arbitrage ($)",
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

      title: "Design Arbitrage",
    },
    toolTip: {
      shared: false,
      contentFormatter: function (e: any) {
        let content = "";
        for (let i = 0; i < e.entries.length; i++) {
          const dp = e.entries[i].dataPoint;
          const seriesName = e.entries[i].dataSeries.name;
          const millions = (dp.y / 1000000).toFixed(2);
          content += `${dp.label}: ${millions}M$<br/>`;
        }
        return content;
      }
    },
    dataPointWidth: 20,
    data: [
      {
        type: "column",
        color: "#da291c",
        indexLabelFontColor: "#000",
        // toolTipContent: "{label} : {y}$",
        name: "Design Weight",
        showInLegend: true,
        dataPoints: [] as { label: string; y: any }[],
      },
      {
        type: "column",
        color: "#2fa365",
        indexLabelFontColor: "#000",
        // toolTipContent: "{label} : {y}$",
        name: "Main Weight",
        showInLegend: true,
        dataPoints: [] as { label: string; y: any }[],
      },
    ],
  }

  DesignGraphStyle() {
    const baseBarWidth = 70; // pixels per bar
    const minWidth = '100%';
    if (!this.designdata || this.designdata.length <= 20) {
      return { height: '375px', width: minWidth };
    }
    return {
      height: '375px',
      width: `${this.designdata.length * baseBarWidth}px`
    };
  }


  downloadArbitrageZip( arbitrageID: string, partNumber: string ,type: 'commercial' | 'regional' | 'mfg'): void {
    if (!arbitrageID) {
      this.toastr.warning("Please update the record then download a file");
      return;
    }
  
    let label = '';
  
    switch (type) {
      case 'commercial':
        label = 'CommercialArbitrage';
        break;
      case 'regional':
        label = 'RegionalArbitrage';
        break;
      case 'mfg':
        label = 'ManufacturingArbitrage'; // You can update this to "MfgArbitrage" if preferred
        break;
      default:
        this.toastr.error("Invalid arbitrage type");
        return;
    }
  
    const formattedFileName = `${partNumber}_${label}_${arbitrageID}.zip`;
  
    this.AdminService.downloadArbitrageZipFile(type, arbitrageID).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = formattedFileName;
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success(`${label} file downloaded successfully`);
      },
      (error) => {
        console.error(`Error downloading ${label} ZIP file:`, error);
        this.toastr.error(`Error downloading ${label} ZIP file`);
      }
    );
  }
  handleUpload(type: 'commercial' | 'mfg' | 'regional', arbitrageId: string): void {
    let files: File[] = [];
  
    switch (type) {
      case 'commercial':
        files = this.selectedFiles;
        break;
      case 'regional':
        files = this.selectedFilesRegional;
        break;
      case 'mfg':
        files = this.selectedFilesMfg;
        break;
      default:
        this.toastr.error('Invalid arbitrage type.');
        return;
    }
  
    if (!files || files.length === 0) {
      this.toastr.warning('Please select files to upload');
      alert('Please select files to upload.');
      return;
    }
  
    this.AdminService.uploadArbitrageFiles(type, arbitrageId, files).subscribe({
      next: (response) => {
        console.log(`${type} files uploaded:`, response);
        this.toastr.success('Files uploaded successfully!');
        alert('Files uploaded successfully!');
  
        // Clear the selected files based on type
        switch (type) {
          case 'commercial':
            this.selectedFiles = [];
            this.closeUploadPopup(); // optional: only for commercial
            break;
          case 'regional':
            this.selectedFilesRegional = [];
            this.closeRegionalupload();
            break;
          case 'mfg':
            this.selectedFilesMfg = [];
            this.closeUploadPopupMfg();
            break;
        }
      },
      error: (error) => {
        console.error(`Upload failed for ${type}:`, error);
        this.toastr.error('File upload failed');
        alert('File upload failed!');
      }
    });
  }
  

  


}
