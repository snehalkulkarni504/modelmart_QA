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

  mgfprocess = [
      {
          partname: 'MANIFOLD, EXHAUST',
          partno: 5926742,
          suppmanilocation: 'INDIA',
          supplierQuotedInvoicePrice: 19.5,
          highlevelprocess: 'Sand, Casting & Machining'
      },
      {
          partname: 'GASKET, CYLINDER HEAD',
          partno: 5926743,
          suppmanilocation: 'CHINA',
          supplierQuotedInvoicePrice: 5.2,
          highlevelprocess: 'Stamping'
      },
      {
          partname: 'VALVE, INTAKE',
          partno: 5926744,
          suppmanilocation: 'GERMANY',
          supplierQuotedInvoicePrice: 12.3,
          highlevelprocess: 'Forging & Machining'
      },
      {
          partname: 'PISTON, ENGINE',
          partno: 5926745,
          suppmanilocation: 'JAPAN',
          supplierQuotedInvoicePrice: 25.0,
          highlevelprocess: 'Casting & Machining'
      },
      {
          partname: 'CRANKSHAFT, ENGINE',
          partno: 5926746,
          suppmanilocation: 'USA',
          supplierQuotedInvoicePrice: 45.0,
          highlevelprocess: 'Forging & Machining'
      },
      {
          partname: 'CAMSHAFT, ENGINE',
          partno: 5926747,
          suppmanilocation: 'UK',
          supplierQuotedInvoicePrice: 30.0,
          highlevelprocess: 'Casting & Machining'
      },
      {
          partname: 'CONNECTING ROD, ENGINE',
          partno: 5926748,
          suppmanilocation: 'FRANCE',
          supplierQuotedInvoicePrice: 15.0,
          highlevelprocess: 'Forging & Machining'
      },
      {
          partname: 'OIL PUMP, ENGINE',
          partno: 5926749,
          suppmanilocation: 'ITALY',
          supplierQuotedInvoicePrice: 20.0,
          highlevelprocess: 'Casting & Machining'
      },
      {
          partname: 'WATER PUMP, ENGINE',
          partno: 5926750,
          suppmanilocation: 'SPAIN',
          supplierQuotedInvoicePrice: 18.0,
          highlevelprocess: 'Casting & Machining'
      },
      {
          partname: 'FUEL INJECTOR, ENGINE',
          partno: 5926751,
          suppmanilocation: 'BRAZIL',
          supplierQuotedInvoicePrice: 22.0,
          highlevelprocess: 'Machining'
      },
      {
          partname: 'TURBOCHARGER, ENGINE',
          partno: 5926752,
          suppmanilocation: 'SOUTH KOREA',
          supplierQuotedInvoicePrice: 50.0,
          highlevelprocess: 'Casting & Machining'
      },
      {
          partname: 'ALTERNATOR, ENGINE',
          partno: 5926753,
          suppmanilocation: 'MEXICO',
          supplierQuotedInvoicePrice: 35.0,
          highlevelprocess: 'Machining & Assembly'
      },
      {
          partname: 'STARTER MOTOR, ENGINE',
          partno: 5926754,
          suppmanilocation: 'CANADA',
          supplierQuotedInvoicePrice: 28.0,
          highlevelprocess: 'Machining & Assembly'
      },
      {
          partname: 'BATTERY, ENGINE',
          partno: 5926755,
          suppmanilocation: 'AUSTRALIA',
          supplierQuotedInvoicePrice: 40.0,
          highlevelprocess: 'Assembly'
      },
      {
          partname: 'RADIATOR, ENGINE',
          partno: 5926756,
          suppmanilocation: 'RUSSIA',
          supplierQuotedInvoicePrice: 32.0,
          highlevelprocess: 'Casting & Machining'
      },
      {
          partname: 'THERMOSTAT, ENGINE',
          partno: 5926757,
          suppmanilocation: 'TURKEY',
          supplierQuotedInvoicePrice: 10.0,
          highlevelprocess: 'Machining'
      },
      {
          partname: 'SPARK PLUG, ENGINE',
          partno: 5926758,
          suppmanilocation: 'THAILAND',
          supplierQuotedInvoicePrice: 3.0,
          highlevelprocess: 'Machining'
      },
      {
          partname: 'TIMING BELT, ENGINE',
          partno: 5926759,
          suppmanilocation: 'VIETNAM',
          supplierQuotedInvoicePrice: 8.0,
          highlevelprocess: 'Assembly'
      },
      {
          partname: 'AIR FILTER, ENGINE',
          partno: 5926760,
          suppmanilocation: 'MALAYSIA',
          supplierQuotedInvoicePrice: 6.0,
          highlevelprocess: 'Assembly'
      },
      {
          partname: 'OIL FILTER, ENGINE',
          partno: 5926761,
          suppmanilocation: 'INDONESIA',
          supplierQuotedInvoicePrice: 4.0,
          highlevelprocess: 'Assembly'
      },
      {
          partname: 'FUEL FILTER, ENGINE',
          partno: 5926762,
          suppmanilocation: 'PHILIPPINES',
          supplierQuotedInvoicePrice: 5.0,
          highlevelprocess: 'Assembly'
      },
      {
          partname: 'ENGINE MOUNT, ENGINE',
          partno: 5926763,
          suppmanilocation: 'EGYPT',
          supplierQuotedInvoicePrice: 12.0,
          highlevelprocess: 'Machining'
      },
      {
          partname: 'EXHAUST PIPE, ENGINE',
          partno: 5926764,
          suppmanilocation: 'SOUTH AFRICA',
          supplierQuotedInvoicePrice: 14.0,
          highlevelprocess: 'Machining'
      },
      {
          partname: 'MUFFLER, EXHAUST',
          partno: 5926765,
          suppmanilocation: 'ARGENTINA',
          supplierQuotedInvoicePrice: 16.0,
          highlevelprocess: 'Machining'
      },
      {
          partname: 'CATALYTIC CONVERTER, EXHAUST',
          partno: 5926766,
          suppmanilocation: 'CHILE',
          supplierQuotedInvoicePrice: 45.0,
          highlevelprocess: 'Machining'
      }
  ];

design = [
    {
        partname: 'MANIFOLD EXHAUST',
        partnumber: '3582945',
        suppmanilocation: 'EGYPT',
        annualvol: 154000,
        material: '41118-IRON, FERRITIC DUCTILE-high silicon - high molybde',
        matrate: 1.37,
        avgwall: 8.63,
        rmgrade: 41118,
        matratee: 1.37,
        mincostgrade: 41081,
        mincostrmrate: 0.92,
        techcostarbitage: 5.43,
        fromtotechspec: '41118->41081'
    },
    {
        partname: 'GASKET CYLINDER HEAD',
        partnumber: '3582946',
        suppmanilocation: 'INDIA',
        annualvol: 200000,
        material: '304-STAINLESS STEEL',
        matrate: 2.50,
        avgwall: 1.5,
        rmgrade: 304,
        matratee: 2.50,
        mincostgrade: 303,
        mincostrmrate: 2.00,
        techcostarbitage: 3.00,
        fromtotechspec: '304->303'
    },
    {
        partname: 'VALVE INTAKE',
        partnumber: '3582947',
        suppmanilocation: 'CHINA',
        annualvol: 180000,
        material: '316-STAINLESS STEEL',
        matrate: 3.00,
        avgwall: 2.0,
        rmgrade: 316,
        matratee: 3.00,
        mincostgrade: 304,
        mincostrmrate: 2.50,
        techcostarbitage: 4.00,
        fromtotechspec: '316->304'
    },
    {
        partname: 'PISTON ENGINE',
        partnumber: '3582948',
        suppmanilocation: 'JAPAN',
        annualvol: 120000,
        material: '6061-ALUMINUM ALLOY',
        matrate: 4.00,
        avgwall: 3.0,
        rmgrade: 6061,
        matratee: 4.00,
        mincostgrade: 5052,
        mincostrmrate: 3.50,
        techcostarbitage: 2.50,
        fromtotechspec: '6061->5052'
    },
    {
        partname: 'CRANKSHAFT ENGINE',
        partnumber: '3582949',
        suppmanilocation: 'USA',
        annualvol: 100000,
        material: '4340-ALLOY STEEL',
        matrate: 5.00,
        avgwall: 4.0,
        rmgrade: 4340,
        matratee: 5.00,
        mincostgrade: 4140,
        mincostrmrate: 4.50,
        techcostarbitage: 3.50,
        fromtotechspec: '4340->4140'
    },
    {
        partname: 'CAMSHAFT ENGINE',
        partnumber: '3582950',
        suppmanilocation: 'UK',
        annualvol: 95000,
        material: '8620-ALLOY STEEL',
        matrate: 4.50,
        avgwall: 3.5,
        rmgrade: 8620,
        matratee: 4.50,
        mincostgrade: 4140,
        mincostrmrate: 4.00,
        techcostarbitage: 3.00,
        fromtotechspec: '8620->4140'
    },
    {
        partname: 'CONNECTING ROD ENGINE',
        partnumber: '3582951',
        suppmanilocation: 'FRANCE',
        annualvol: 110000,
        material: '1045-CARBON STEEL',
        matrate: 2.00,
        avgwall: 2.5,
        rmgrade: 1045,
        matratee: 2.00,
        mincostgrade: 1018,
        mincostrmrate: 1.80,
        techcostarbitage: 1.50,
        fromtotechspec: '1045->1018'
    },
    {
        partname: 'OIL PUMP ENGINE',
        partnumber: '3582952',
        suppmanilocation: 'ITALY',
        annualvol: 130000,
        material: 'A356-ALUMINUM ALLOY',
        matrate: 3.50,
        avgwall: 2.8,
        rmgrade: 356,
        matratee: 3.50,
        mincostgrade: 6061,
        mincostrmrate: 3.00,
        techcostarbitage: 2.00,
        fromtotechspec: 'A356->6061'
    },
    {
        partname: 'WATER PUMP ENGINE',
        partnumber: '3582953',
        suppmanilocation: 'SPAIN',
        annualvol: 125000,
        material: 'A380-ALUMINUM ALLOY',
        matrate: 3.00,
        avgwall: 2.5,
        rmgrade: 380,
        matratee: 3.00,
        mincostgrade: 6061,
        mincostrmrate: 2.80,
        techcostarbitage: 1.80,
        fromtotechspec: 'A380->6061'
    },
    {
        partname: 'FUEL INJECTOR ENGINE',
        partnumber: '3582954',
        suppmanilocation: 'BRAZIL',
        annualvol: 140000,
        material: '304-STAINLESS STEEL',
        matrate: 2.50,
        avgwall: 1.8,
        rmgrade: 304,
        matratee: 2.50,
        mincostgrade: 303,
        mincostrmrate: 2.00,
        techcostarbitage: 3.00,
        fromtotechspec: '304->303'
    },
    {
        partname: 'TURBOCHARGER ENGINE',
        partnumber: '3582955',
        suppmanilocation: 'SOUTH KOREA',
        annualvol: 115000,
        material: 'INCONEL 718',
        matrate: 10.00,
        avgwall: 3.0,
        rmgrade: 718,
        matratee: 10.00,
        mincostgrade: 6.25,
        mincostrmrate: 9.00,
        techcostarbitage: 5.00,
        fromtotechspec: 'IN718->IN625'
    },
    {
        partname: 'ALTERNATOR ENGINE',
        partnumber: '3582956',
        suppmanilocation: 'MEXICO',
        annualvol: 105000,
        material: '6061-ALUMINUM ALLOY',
        matrate: 4.00,
        avgwall: 2.5,
        rmgrade: 6061,
        matratee: 4.00,
        mincostgrade: 5052,
        mincostrmrate: 3.50,
        techcostarbitage: 2.50,
        fromtotechspec: '6061->5052'
    },
    {
        partname: 'STARTER MOTOR ENGINE',
        partnumber: '3582957',
        suppmanilocation: 'CANADA',
        annualvol: 95000,
        material: '304-STAINLESS STEEL',
        matrate: 2.50,
        avgwall: 2.0,
        rmgrade: 304,
        matratee: 2.50,
        mincostgrade: 303,
        mincostrmrate: 2.00,
        techcostarbitage: 3.00,
        fromtotechspec: '304->303'
    },
    {
        partname: 'BATTERY ENGINE',
        partnumber: '3582958',
        suppmanilocation: 'AUSTRALIA',
        annualvol: 90000,
        material: 'LEAD-ACID',
        matrate: 1.50,
        avgwall: 5.0,
        rmgrade: 325,
        matratee: 1.50,
        mincostgrade: 3.0,
        mincostrmrate: 1.20,
        techcostarbitage: 0.50,
        fromtotechspec: 'LEAD->LEAD'
    },
    {
        partname: 'RADIATOR ENGINE',
        partnumber: '3582959',
        suppmanilocation: 'RUSSIA',
        annualvol: 85000,
        material: '6061-ALUMINUM ALLOY',
        matrate: 4.00,
        avgwall: 2.0,
        rmgrade: 6061,
        matratee: 4.00,
        mincostgrade: 5052,
        mincostrmrate: 3.50,
        techcostarbitage: 2.50,
        fromtotechspec: '6061->5052'
    },
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
