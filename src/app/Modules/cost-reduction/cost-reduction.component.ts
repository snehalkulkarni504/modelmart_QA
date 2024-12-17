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
  activeButton: string = '';
  showRegionalContent = false;
  showContent: boolean = false;
  showmgfprocess:boolean = false;
  showdesign=false;


  setActiveButton(buttonName: string) {
    this.activeButton = buttonName;
    // Reset visibility for all sections
    this.showContent = buttonName === 'commercial';
    this.showRegionalContent = buttonName === 'regional';
    this.showmgfprocess = buttonName === 'manufacturing';
    this.showdesign = buttonName === 'design';
  }


  //imagePath: string = 'assets/image1.jpg'; // path to your image

  opportunities = [
    {
      PartNumber: '5674974',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'CHINA',
      TotalShouldCost: 31.54,
      AnnualVolume: 1800,
      SupplierQuoted_InvoicePrice: 44.09,
      SupplierName: 'FEILONG AUTO COMPONENTS CO., LTD.',
      Invoice: 12.55,
      ShouldCostOpportunity: 22595,
      SCAttainment: 72
    },
    {
      PartNumber: '5675361',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'CHINA',
      TotalShouldCost: 30.31,
      AnnualVolume: 1000,
      SupplierQuoted_InvoicePrice: 42.98,
      SupplierName: 'FEILONG AUTO COMPONENTS CO., LTD.',
      Invoice: 12.67,
      ShouldCostOpportunity: 12670,
      SCAttainment: 71
    },
    {
      PartNumber: '6382128',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'CHINA',
      TotalShouldCost: 15.70,
      AnnualVolume: 65000,
      SupplierQuoted_InvoicePrice: 19.20,
      SupplierName: 'FEILONG AUTO COMPONENTS CO., LTD.',
      Invoice: 3.50,
      ShouldCostOpportunity: 227500,
      SCAttainment: 82
    },
    {
      PartNumber: '6382132',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'CHINA',
      TotalShouldCost: 22.58,
      AnnualVolume: 65000,
      SupplierQuoted_InvoicePrice: 26.69,
      SupplierName: 'FEILONG AUTO COMPONENTS CO., LTD.',
      Invoice: 4.11,
      ShouldCostOpportunity: 267150,
      SCAttainment: 85
    },
    {
      PartNumber: '6382132',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'INDIA',
      TotalShouldCost: 17.42,
      AnnualVolume: 65000,
      SupplierQuoted_InvoicePrice: 30.90,
      SupplierName: 'SPM AUTO- INDIA',
      Invoice: 13.48,
      ShouldCostOpportunity: 876200,
      SCAttainment: 56
    },
    {
      PartNumber: '6409902',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'INDIA',
      TotalShouldCost: 26.32,
      AnnualVolume: 33500,
      SupplierQuoted_InvoicePrice: 53.68,
      SupplierName: 'SPM AUTO- INDIA',
      Invoice: 27.36,
      ShouldCostOpportunity: 916560,
      SCAttainment: 49
    },
    {
      PartNumber: '3640464',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'BELGIUM',
      TotalShouldCost: 681.87,
      AnnualVolume: 3,
      SupplierQuoted_InvoicePrice: 2315.56,
      SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
      Invoice: 1633.69,
      ShouldCostOpportunity: 4901,
      SCAttainment: 29
    },
    {
      PartNumber: '3640750',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'BELGIUM',
      TotalShouldCost: 106.92,
      AnnualVolume: 1211,
      SupplierQuoted_InvoicePrice: 396.11,
      SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
      Invoice: 289.19,
      ShouldCostOpportunity: 350209,
      SCAttainment: 27
    },
    {
      PartNumber: '3641592',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'BELGIUM',
      TotalShouldCost: 114.75,
      AnnualVolume: 1254,
      SupplierQuoted_InvoicePrice: 336.86,
      SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
      Invoice: 222.11,
      ShouldCostOpportunity: 278522,
      SCAttainment: 34
    },
    {
      PartNumber: '3641593',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'BELGIUM',
      TotalShouldCost: 108.69,
      AnnualVolume: 1100,
      SupplierQuoted_InvoicePrice: 335.42,
      SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
      Invoice: 226.73,
      ShouldCostOpportunity: 249403,
      SCAttainment: 32
    },
    {
      PartNumber: '3641635',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'BELGIUM',
      TotalShouldCost: 56.46,
      AnnualVolume: 1521,
      SupplierQuoted_InvoicePrice: 125.92,
      SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
      Invoice: 69.46,
      ShouldCostOpportunity: 105649,
      SCAttainment: 45
    },
    {
      PartNumber: '3642647',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'GERMANY',
      TotalShouldCost: 346.42,
      AnnualVolume: 257,
      SupplierQuoted_InvoicePrice: 502.10,
      SupplierName: 'HARZ GUSS ZORGE GMBH - Germany',
      Invoice: 155.68,
      ShouldCostOpportunity: 40010,
      SCAttainment: 69
    },
    {
      PartNumber: '3642647',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'WESTERN EUROPE',
      TotalShouldCost: 331.82,
      AnnualVolume: 352,
      SupplierQuoted_InvoicePrice: 482.42,
      SupplierName: 'NA',
      Invoice: 150.60,
      ShouldCostOpportunity: 53011,
      SCAttainment: 69
    },
    {
      PartNumber: '3642647',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'EASTERN EUROPE',
      TotalShouldCost: 295.48,
      AnnualVolume: 352,
      SupplierQuoted_InvoicePrice: 456.98,
      SupplierName: 'NA',
      Invoice: 161.50,
      ShouldCostOpportunity: 56847,
      SCAttainment: 65
    },
    {
      PartNumber: '3642655',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'GERMANY',
      TotalShouldCost: 136.61,
      AnnualVolume: 800,
      SupplierQuoted_InvoicePrice: 170.18,
      SupplierName: 'HARZ GUSS ZORGE GMBH- Germany',
      Invoice: 33.57,
      ShouldCostOpportunity: 26856,
      SCAttainment: 80
    },
    {
      PartNumber: '3642655',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'CHINA',
      TotalShouldCost: 59.62,
      AnnualVolume: 1280,
      SupplierQuoted_InvoicePrice: 81.37,
      SupplierName: 'IMPRO Industries LTD',
      Invoice: 21.75,
      ShouldCostOpportunity: 27840,
      SCAttainment: 73
    },
    {
      PartNumber: '3642655',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'INDIA',
      TotalShouldCost: 53.62,
      AnnualVolume: 800,
      SupplierQuoted_InvoicePrice: 57.12,
      SupplierName: 'SPM AUTO- INDIA',
      Invoice: 3.50,
      ShouldCostOpportunity: 2800,
      SCAttainment: 94
    },
    {
      PartNumber: '3642661',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'GERMANY',
      TotalShouldCost: 317.29,
      AnnualVolume: 232,
      SupplierQuoted_InvoicePrice: 411.53,
      SupplierName: 'HARZ GUSS ZORGE GMBH - Germany',
      Invoice: 94.24,
      ShouldCostOpportunity: 21863,
      SCAttainment: 77
    },
    {
      PartNumber: '4100728',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'BELGIUM',
      TotalShouldCost: 508.68,
      AnnualVolume: 4,
      SupplierQuoted_InvoicePrice: 2560.45,
      SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
      Invoice: 2051.77,
      ShouldCostOpportunity: 8207,
      SCAttainment: 20
    },
    {
      PartNumber: '4100732',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'BELGIUM',
      TotalShouldCost: 538.97,
      AnnualVolume: 10,
      SupplierQuoted_InvoicePrice: 1675.00,
      SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
      Invoice: 1136.03,
      ShouldCostOpportunity: 11360,
      SCAttainment: 32
    },
    {
      PartNumber: '5374631',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'BELGIUM',
      TotalShouldCost: 422.74,
      AnnualVolume: 723,
      SupplierQuoted_InvoicePrice: 747.73,
      SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
      Invoice: 324.99,
      ShouldCostOpportunity: 234968,
      SCAttainment: 57
    },
    {
      PartNumber: '5374631',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'UK',
      TotalShouldCost: 438.82,
      AnnualVolume: 251,
      SupplierQuoted_InvoicePrice: 881.32,
      SupplierName: 'OMCO INTERNATIONAL',
      Invoice: 442.50,
      ShouldCostOpportunity: 111067,
      SCAttainment: 50
    },
    {
      PartNumber: '5374631',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'WESTERN EUROPE',
      TotalShouldCost: 456.05,
      AnnualVolume: 251,
      SupplierQuoted_InvoicePrice: 896.69,
      SupplierName: 'NA',
      Invoice: 440.64,
      ShouldCostOpportunity: 110602,
      SCAttainment: 51
    },
    {
      PartNumber: '5374631',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'EASTERN EUROPE',
      TotalShouldCost: 405.53,
      AnnualVolume: 251,
      SupplierQuoted_InvoicePrice: 641.55,
      SupplierName: 'NA',
      Invoice: 236.02,
      ShouldCostOpportunity: 59242,
      SCAttainment: 63
    },
    {
      PartNumber: '5374635',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'BELGIUM',
      TotalShouldCost: 529.57,
      AnnualVolume: 147,
      SupplierQuoted_InvoicePrice: 885.50,
      SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
      Invoice: 355.93,
      ShouldCostOpportunity: 52322,
      SCAttainment: 60
    },
    {
      PartNumber: '5374639',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'BELGIUM',
      TotalShouldCost: 528.48,
      AnnualVolume: 174,
      SupplierQuoted_InvoicePrice: 892.24,
      SupplierName: 'OMCO INTERNATIONAL NV- Belgium',
      Invoice: 363.76,
      ShouldCostOpportunity: 63294,
      SCAttainment: 59
    },
    {
      PartNumber: '5450589',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'CHINA',
      TotalShouldCost: 38.09,
      AnnualVolume: 154000,
      SupplierQuoted_InvoicePrice: 53.12,
      SupplierName: 'FEILONG AUTO COMPONENTS CO., LTD.',
      Invoice: 15.03,
      ShouldCostOpportunity: 2314466,
      SCAttainment: 72
    },
    {
      PartNumber: '5672644',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'UK',
      TotalShouldCost: 417.47,
      AnnualVolume: 800,
      SupplierQuoted_InvoicePrice: 1046.65,
      SupplierName: 'NA',
      Invoice: 629.18,
      ShouldCostOpportunity: 503344,
      SCAttainment: 40
    },
    {
      PartNumber: '5672644',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'CHINA',
      TotalShouldCost: 318.47,
      AnnualVolume: 800,
      SupplierQuoted_InvoicePrice: 950.98,
      SupplierName: 'NA',
      Invoice: 632.51,
      ShouldCostOpportunity: 506008,
      SCAttainment: 33
    },
    {
      PartNumber: '5674972',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'CHINA',
      TotalShouldCost: 55.99,
      AnnualVolume: 1000,
      SupplierQuoted_InvoicePrice: 65.69,
      SupplierName: 'FEILONG AUTO COMPONENTS CO., LTD.',
      Invoice: 9.70,
      ShouldCostOpportunity: 9700,
      SCAttainment: 85
    },
    {
      PartNumber: '5674977',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'CHINA',
      TotalShouldCost: 116.72,
      AnnualVolume: 500,
      SupplierQuoted_InvoicePrice: 222.14,
      SupplierName: 'FEILONG AUTO COMPONENTS CO., LTD.',
      Invoice: 105.42,
      ShouldCostOpportunity: 52710,
      SCAttainment: 53
    },
    {
      PartNumber: '5714523',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'INDIA',
      TotalShouldCost: 15.45,
      AnnualVolume: 2000,
      SupplierQuoted_InvoicePrice: 26.48,
      SupplierName: 'NA',
      Invoice: 11.03,
      ShouldCostOpportunity: 22050,
      SCAttainment: 58
    },
    {
      PartNumber: '5714523',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'CHINA',
      TotalShouldCost: 16.85,
      AnnualVolume: 2000,
      SupplierQuoted_InvoicePrice: 25.53,
      SupplierName: 'NA',
      Invoice: 8.68,
      ShouldCostOpportunity: 17351,
      SCAttainment: 66
    },
    {
      PartNumber: '5714523',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'UK',
      TotalShouldCost: 26.82,
      AnnualVolume: 2000,
      SupplierQuoted_InvoicePrice: 42.31,
      SupplierName: 'NA',
      Invoice: 15.49,
      ShouldCostOpportunity: 30979,
      SCAttainment: 63
    },
    {
      PartNumber: '5717637',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'INDIA',
      TotalShouldCost: 16.30,
      AnnualVolume: 1500,
      SupplierQuoted_InvoicePrice: 26.18,
      SupplierName: 'NA',
      Invoice: 9.88,
      ShouldCostOpportunity: 14818,
      SCAttainment: 62
    },
    {
      PartNumber: '6377526',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'INDIA',
      TotalShouldCost: 8.08,
      AnnualVolume: 1500,
      SupplierQuoted_InvoicePrice: 18.05,
      SupplierName: 'NA',
      Invoice: 9.97,
      ShouldCostOpportunity: 14955,
      SCAttainment: 45
    },
    {
      PartNumber: '6382128',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'INDIA',
      TotalShouldCost: 12.41,
      AnnualVolume: 65000,
      SupplierQuoted_InvoicePrice: 20.11,
      SupplierName: 'SPM AUTO- INDIA',
      Invoice: 7.70,
      ShouldCostOpportunity: 500500,
      SCAttainment: 62
    },
    {
      PartNumber: '6409902',
      PartName: 'MANIFOLD,EXHAUST',
      SuppManfLoc: 'CHINA',
      TotalShouldCost: 32.68,
      AnnualVolume: 33500,
      SupplierQuoted_InvoicePrice: 38.59,
      SupplierName: 'FEILONG AUTO COMPONENTS CO., LTD.',
      Invoice: 5.91,
      ShouldCostOpportunity: 197985,
      SCAttainment: 85
    }
  ]
  
  Regional = [
    {
        'srNo': 1,
        'partName': "MANIFOLD,EXHAUST",
        'partNumber': 5374631,
        'suppManfLocation': "BELGIUM",
        'annualVolume': 723,
        'supplierQuotedInvoicePrice': 747.73,
        'supplierName': "OMCO INTERNATIONAL NV- Belgium",
        'bestRegionCost': 641.55,
        'bestRegion': "EASTERN EUROPE",
        'regionArbitrage': "76,765",
        'regionArbitrageValue': "106.18",
        'fromTo': "BELGIUM->EASTERN EUROPE"
    },
    {
        'srNo': 2,
        'partName': "MANIFOLD,EXHAUST",
        'partNumber': 3642647,
        'suppManfLocation': "GERMANY",
        'annualVolume': 257,
        'supplierQuotedInvoicePrice': 502.10,
        'supplierName': "HARZ GUSS ZORGE GMBH - Germany",
        'bestRegionCost': 456.98,
        'bestRegion': "EASTERN EUROPE",
        'regionArbitrage': "11,596",
        'regionArbitrageValue': "45.12",
        'fromTo': "GERMANY->EASTERN EUROPE"
    },
    {
        'srNo': 3,
        'partName': "MANIFOLD,EXHAUST",
        'partNumber': 5672644,
        'suppManfLocation': "UK",
        'annualVolume': 800,
        'supplierQuotedInvoicePrice': 1046.65,
        'supplierName': "NA",
        'bestRegionCost': 950.98,
        'bestRegion': "CHINA",
        'regionArbitrage': "76,536",
        'regionArbitrageValue': "95.67",
        'fromTo': "UK->CHINA"
    },
    {
        'srNo': 4,
        'partName': "MANIFOLD,EXHAUST",
        'partNumber': 3642655,
        'suppManfLocation': "GERMANY",
        'annualVolume': 800,
        'supplierQuotedInvoicePrice': 170.18,
        'supplierName': "HARZ GUSS ZORGE GMBH- Germany",
        'bestRegionCost': 57.12,
        'bestRegion': "INDIA",
        'regionArbitrage': "90,448",
        'regionArbitrageValue': "113.06",
        'fromTo': "GERMANY->INDIA"
    },
    {
        'srNo': 5,
        'partName': "MANIFOLD,EXHAUST",
        'partNumber': 3642655,
        'suppManfLocation': "CHINA",
        'annualVolume': 1280,
        'supplierQuotedInvoicePrice': 81.37,
        'supplierName': "IMPRO Indutries LTD",
        'bestRegionCost': 57.12,
        'bestRegion': "INDIA",
        'regionArbitrage': "31,040",
        'regionArbitrageValue': "24.25",
        'fromTo': "CHINA->INDIA"
    },
    {
        'srNo': 6,
        'partName': "MANIFOLD,EXHAUST",
        'partNumber': 6382132,
        'suppManfLocation': "INDIA",
        'annualVolume': 65000,
        'supplierQuotedInvoicePrice': 30.90,
        'supplierName': "SPM AUTO- INDIA",
        'bestRegionCost': 26.69,
        'bestRegion': "CHINA",
        'regionArbitrage': "273,650",
        'regionArbitrageValue': "4.21",
        'fromTo': "INDIA->CHINA"
    },
    {
        'srNo': 7,
        'partName': "MANIFOLD,EXHAUST",
        'partNumber': 5374631,
        'suppManfLocation': "UK",
        'annualVolume': 251,
        'supplierQuotedInvoicePrice': 881.32,
        'supplierName': "OMCO INTERNATIONAL",
        'bestRegionCost': 641.55,
        'bestRegion': "EASTERN EUROPE",
        'regionArbitrage': "60,180",
        'regionArbitrageValue': "239.76",
        'fromTo': "UK->EASTERN EUROPE"
    },
    {
        'srNo': 8,
        'partName': "MANIFOLD,EXHAUST",
        'partNumber': 5374631,
        'suppManfLocation': "WESTERN EUROPE",
        'annualVolume': 251,
        'supplierQuotedInvoicePrice': 896.69,
        'supplierName': "NA",
        'bestRegionCost': 641.55,
        'bestRegion': "EASTERN EUROPE",
        'regionArbitrage': "64,040",
        'regionArbitrageValue': "255.14",
        'fromTo': "WESTERN EUROPE->EASTERN EUROPE"
    },
    {
        'srNo': 9,
        'partName': "MANIFOLD,EXHAUST",
        'partNumber': 3642647,
        'suppManfLocation': "WESTERN EUROPE",
        'annualVolume': 352,
        'supplierQuotedInvoicePrice': 482.42,
        'supplierName': "NA",
        'bestRegionCost': 456.98,
        'bestRegion': "EASTERN EUROPE",
        'regionArbitrage': "8,955",
        'regionArbitrageValue': "25.44",
        'fromTo': "WESTERN EUROPE->EASTERN EUROPE"
    },
    {
        'srNo': 10,
        'partName': "MANIFOLD,EXHAUST",
        'partNumber': 5714523,
        'suppManfLocation': "INDIA",
        'annualVolume': 2000,
        'supplierQuotedInvoicePrice': 26.48,
        'supplierName': "NA",
        'bestRegionCost': 25.53,
        'bestRegion': "CHINA",
        'regionArbitrage': "1,899",
        'regionArbitrageValue': "0.95",
        'fromTo': "INDIA->CHINA"
    },
    {
        'srNo': 11,
        'partName': "MANIFOLD,EXHAUST",
        'partNumber': 5714523,
        'suppManfLocation': "UK",
        'annualVolume': 2000,
        'supplierQuotedInvoicePrice': 42.31,
        'supplierName': "NA",
        'bestRegionCost': 25.53,
        'bestRegion': "CHINA",
        'regionArbitrage': "33,568",
        'regionArbitrageValue': "16.78",
        'fromTo': "UK->CHINA"
    }
]

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
  // openModal(): void {
  //   const modalElement = document.getElementById('exampleModal');
  //   if (modalElement) {
  //     const modal = new bootstrap.Modal(modalElement);
  //     modal.show();
  //   }
  // }


  highlightedRow: number | null = null;

  highlightRow(index: number) {
    this.highlightedRow = index;
  }

}
