import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
declare var bootstrap: any;
// import { NgModelGroup } from '@angular/forms';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cost-reduction',
  templateUrl: './cost-reduction.component.html',
  styleUrls: ['./cost-reduction.component.css'],
})
export class CostReductionComponent {
  showRegionalContent = false;


  imagePath: string = 'assets/image1.jpg'; // path to your image
  showContent: boolean = false;


  opportunities = [{
    // SrNo: 1,
    PartNumber: '5450589',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'CHINA',
    TotalShouldCost: 154000,
    AnnualVolume: 53.119,
    SupplierQuoted_InvoicePrice: 15.03,
    SupplierName: 'FEILONG AUTO COMPONENTS CO., LTD.',
    Invoice: 2314466,
    ShouldCostOpportunity: 2314466,
    SCAttainment: 72
  },
  {
    // SrNo: 2,
    PartNumber: '6409902',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'INDIA',
    TotalShouldCost: 65000,
    AnnualVolume: 53.68,
    SupplierQuoted_InvoicePrice: 28.40,
    SupplierName: 'SPM AUTO- INDIA',
    Invoice: 1846000,
    ShouldCostOpportunity: 1846000,
    SCAttainment: 47
  },
  {
    // SrNo: 3,
    PartNumber: '6409902',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'INDIA',
    TotalShouldCost: 33500,
    AnnualVolume: 53.68,
    SupplierQuoted_InvoicePrice: 27.36,
    SupplierName: 'SPM AUTO- INDIA',
    Invoice: 916560,
    ShouldCostOpportunity: 916560,
    SCAttainment: 49
  },
  {
    // SrNo: 4,
    PartNumber: '6382132',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'INDIA',
    TotalShouldCost: 65000,
    AnnualVolume: 30.9,
    SupplierQuoted_InvoicePrice: 13.48,
    SupplierName: 'SPM AUTO- INDIA',
    Invoice: 876200,
    ShouldCostOpportunity: 876200,
    SCAttainment: 56
  },
  {
    // SrNo: 5,
    PartNumber: '5672644',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'CHINA',
    TotalShouldCost: 800,
    AnnualVolume: 950.98,
    SupplierQuoted_InvoicePrice: 632.51,
    SupplierName: 'China Foundry',
    Invoice: 506008,
    ShouldCostOpportunity: 506008,
    SCAttainment: 33
  },
  {
    // SrNo: 6,
    PartNumber: '5672644',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'UK',
    TotalShouldCost: 800,
    AnnualVolume: 1046.65,
    SupplierQuoted_InvoicePrice: 629.18,
    SupplierName: 'UK Foundry',
    Invoice: 503344,
    ShouldCostOpportunity: 503344,
    SCAttainment: 40
  },
  {
    // SrNo: 7,
    PartNumber: '6382128',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'INDIA',
    TotalShouldCost: 65000,
    AnnualVolume: 20.11,
    SupplierQuoted_InvoicePrice: 7.70,
    SupplierName: 'SPM AUTO- INDIA',
    Invoice: 500500,
    ShouldCostOpportunity: 500500,
    SCAttainment: 62
  },
  {
    // SrNo: 8,
    PartNumber: '6382132',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'INDIA',
    TotalShouldCost: 33500,
    AnnualVolume: 30.9,
    SupplierQuoted_InvoicePrice: 13.18,
    SupplierName: 'SPM AUTO- INDIA',
    Invoice: 441530,
    ShouldCostOpportunity: 441530,
    SCAttainment: 57
  },
  {
    // SrNo: 9,
    PartNumber: '3640750',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'EUROPE',
    TotalShouldCost: 1211,
    AnnualVolume: 396.11,
    SupplierQuoted_InvoicePrice: 289.19,
    SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
    Invoice: 350209,
    ShouldCostOpportunity: 350209,
    SCAttainment: 27
  },
  {
    // SrNo: 10,
    PartNumber: '3641592',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'EUROPE',
    TotalShouldCost: 1254,
    AnnualVolume: 336.8565517,
    SupplierQuoted_InvoicePrice: 222.11,
    SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
    Invoice: 278522,
    ShouldCostOpportunity: 278522,
    SCAttainment: 34
  },
  // Additional rows with updated ShouldCostOpportunity
  {
    // SrNo: 11,
    PartNumber: '3640740',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'EUROPE',
    TotalShouldCost: 1890,
    AnnualVolume: 550.23,
    SupplierQuoted_InvoicePrice: 321.85,
    SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
    Invoice: 423130,
    ShouldCostOpportunity: 423130,
    SCAttainment: 40
  },
  {
    // SrNo: 12,
    PartNumber: '3640730',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'EUROPE',
    TotalShouldCost: 1450,
    AnnualVolume: 396.11,
    SupplierQuoted_InvoicePrice: 309.75,
    SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
    Invoice: 375000,
    ShouldCostOpportunity: 375000,
    SCAttainment: 35
  },
  {
    // SrNo: 13,
    PartNumber: '3640720',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'USA',
    TotalShouldCost: 3500,
    AnnualVolume: 780.23,
    SupplierQuoted_InvoicePrice: 505.25,
    SupplierName: 'USA Foundry',
    Invoice: 550000,
    ShouldCostOpportunity: 550000,
    SCAttainment: 55
  },
  {
    // SrNo: 14,
    PartNumber: '3640710',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'INDIA',
    TotalShouldCost: 1200,
    AnnualVolume: 500.76,
    SupplierQuoted_InvoicePrice: 325.50,
    SupplierName: 'INDIA Foundry',
    Invoice: 400000,
    ShouldCostOpportunity: 400000,
    SCAttainment: 60
  },
  {
    // SrNo: 15,
    PartNumber: '3640700',
    PartName: 'MANIFOLD,EXHAUST',
    SuppManfLoc: 'CHINA',
    TotalShouldCost: 2200,
    AnnualVolume: 601.12,
    SupplierQuoted_InvoicePrice: 455.40,
    SupplierName: 'China Foundry',
    Invoice: 485000,
    ShouldCostOpportunity: 485000,
    SCAttainment: 50
  }
  ];

  Regional=[
    {
      srNo: 1,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 5450589,
      suppManfLocation: "CHINA",
      annualVolume: 154000,
      supplierQuotedInvoicePrice: 53.119,
      supplierName: "FEILONG AUTO COMPONENTS CO., LTD.",
      bestRegionCost: 53.12,
      bestRegion: "CHINA",
      regionArbitrage: "$-",
      regionArbitrageValue: "$-",
      fromTo: ""
    },
    {
      srNo: 2,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 6409902,
      suppManfLocation: "INDIA",
      annualVolume: 65000,
      supplierQuotedInvoicePrice: 53.68,
      supplierName: "SPM AUTO- INDIA",
      bestRegionCost: 38.59,
      bestRegion: "CHINA",
      regionArbitrage: "$9,80,850",
      regionArbitrageValue: "$15.09",
      fromTo: "INDIA->CHINA"
    },
    {
      srNo: 3,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 6409902,
      suppManfLocation: "INDIA",
      annualVolume: 33500,
      supplierQuotedInvoicePrice: 53.68,
      supplierName: "SPM AUTO- INDIA",
      bestRegionCost: 38.59,
      bestRegion: "CHINA",
      regionArbitrage: "$5,05,515",
      regionArbitrageValue: "$15.09",
      fromTo: "INDIA->CHINA"
    },
    {
      srNo: 4,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 6382132,
      suppManfLocation: "INDIA",
      annualVolume: 65000,
      supplierQuotedInvoicePrice: 30.9,
      supplierName: "SPM AUTO- INDIA",
      bestRegionCost: 26.69,
      bestRegion: "CHINA",
      regionArbitrage: "$2,73,650",
      regionArbitrageValue: "$4.21",
      fromTo: "INDIA->CHINA"
    },
    {
      srNo: 5,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 5672644,
      suppManfLocation: "CHINA",
      annualVolume: 800,
      supplierQuotedInvoicePrice: 950.98,
      supplierName: "China Foundry",
      bestRegionCost: 950.98,
      bestRegion: "CHINA",
      regionArbitrage: "$-",
      regionArbitrageValue: "$-",
      fromTo: ""
    },
    {
      srNo: 6,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 5672644,
      suppManfLocation: "UK",
      annualVolume: 800,
      supplierQuotedInvoicePrice: 1046.65,
      supplierName: "UK Foundry",
      bestRegionCost: 950.98,
      bestRegion: "CHINA",
      regionArbitrage: "$76,536",
      regionArbitrageValue: "$95.67",
      fromTo: "UK->CHINA"
    },
    {
      srNo: 7,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 6382128,
      suppManfLocation: "INDIA",
      annualVolume: 65000,
      supplierQuotedInvoicePrice: 20.11,
      supplierName: "SPM AUTO- INDIA",
      bestRegionCost: 19.20,
      bestRegion: "CHINA",
      regionArbitrage: "$59,150",
      regionArbitrageValue: "$0.91",
      fromTo: "INDIA->CHINA"
    },
    {
      srNo: 8,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 6382132,
      suppManfLocation: "INDIA",
      annualVolume: 33500,
      supplierQuotedInvoicePrice: 30.9,
      supplierName: "SPM AUTO- INDIA",
      bestRegionCost: 26.69,
      bestRegion: "CHINA",
      regionArbitrage: "$1,41,035",
      regionArbitrageValue: "$4.21",
      fromTo: "INDIA->CHINA"
    },
    {
      srNo: 9,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 3640750,
      suppManfLocation: "EUROPE",
      annualVolume: 1211,
      supplierQuotedInvoicePrice: 396.11,
      supplierName: "OMCO INTERNATIONAL NV- Belgium",
      bestRegionCost: 396.11,
      bestRegion: "EUROPE",
      regionArbitrage: "$-",
      regionArbitrageValue: "$-",
      fromTo: ""
    },
    {
      srNo: 10,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 3641592,
      suppManfLocation: "EUROPE",
      annualVolume: 1254,
      supplierQuotedInvoicePrice: 336.8565517,
      supplierName: "OMCO INTERNATIONAL NV- Belgium",
      bestRegionCost: 336.86,
      bestRegion: "EUROPE",
      regionArbitrage: "$-",
      regionArbitrageValue: "$-",
      fromTo: ""
    },
    {
      srNo: 11,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 6382128,
      suppManfLocation: "INDIA",
      annualVolume: 33500,
      supplierQuotedInvoicePrice: 21.2629087,
      supplierName: "SPM AUTO- INDIA",
      bestRegionCost: 19.20,
      bestRegion: "CHINA",
      regionArbitrage: "$69,107",
      regionArbitrageValue: "$2.06",
      fromTo: "INDIA->CHINA"
    },
    {
      srNo: 12,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 6382132,
      suppManfLocation: "CHINA",
      annualVolume: 65000,
      supplierQuotedInvoicePrice: 26.69,
      supplierName: "FEILONG AUTO COMPONENTS CO., LTD.",
      bestRegionCost: 26.69,
      bestRegion: "CHINA",
      regionArbitrage: "$-",
      regionArbitrageValue: "$-",
      fromTo: ""
    },
    {
      srNo: 13,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 3641593,
      suppManfLocation: "EUROPE",
      annualVolume: 1100,
      supplierQuotedInvoicePrice: 335.4201959,
      supplierName: "OMCO INTERNATIONAL NV- Belgium",
      bestRegionCost: 335.42,
      bestRegion: "EUROPE",
      regionArbitrage: "$-",
      regionArbitrageValue: "$-",
      fromTo: ""
    },
    {
      srNo: 14,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 5374631,
      suppManfLocation: "EUROPE",
      annualVolume: 723,
      supplierQuotedInvoicePrice: 747.73,
      supplierName: "OMCO INTERNATIONAL NV- Belgium",
      bestRegionCost: 747.73,
      bestRegion: "EUROPE",
      regionArbitrage: "$-",
      regionArbitrageValue: "$-",
      fromTo: ""
    },
    {
      srNo: 15,
      partName: "MANIFOLD,EXHAUST",
      partNumber: 6382128,
      suppManfLocation: "CHINA",
      annualVolume: 65000,
      supplierQuotedInvoicePrice: 19.2,
      supplierName: "FEILONG AUTO COMPONENTS CO., LTD.",
      bestRegionCost: 19.20,
      bestRegion: "CHINA",
      regionArbitrage: "$-",
      regionArbitrageValue: "$-",
      fromTo: ""
    }
  ];

  // openModal(): void {
  //   const modalElement = document.getElementById('exampleModal');
  //   if (modalElement) {
  //     const modal = new bootstrap.Modal(modalElement);
  //     modal.show();
  //   }
  // }

}
