import { DatePipe } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import autoTable from 'jspdf-autotable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import { SearchService } from 'src/app/SharedServices/search.service';
import { Location } from '@angular/common';
import jsPDF from 'jspdf';
import { UpdateRequest } from 'src/app/Model/update-request';
import { AdminService } from 'src/app/SharedServices/admin.service';

@Component({
  selector: 'app-designtocost-step4',
  standalone: false,
  // imports: [],
  templateUrl: './designtocost-step4.component.html',
  styleUrls: ['./designtocost-step4.component.css']
})
export class DesigntocostStep4Component {

  varr: any;
  DebriefDateFormated: any;
  ForexRegion: any;
  locale: any;
  showConfirmationPopup: boolean = false

  constructor(private route: ActivatedRoute,
    public searchservice: SearchService,
    public reportservice: ReportServiceService,
    public router: Router,
    public adminservice: AdminService,
    private renderer: Renderer2,
    private datePipe: DatePipe, private location: Location, private SpinnerService: NgxSpinnerService, public toastr: ToastrService) {
    this.route.params.subscribe(param => {
      this.IsUserLog = param['data']
    })
  }

  ProductDetail: any;
  MaterailGrade: any;
  MaterailGradeT2: any;
  NonManufacturingCost: any;
  Vavedetails: any;
  TierData: any; Tier2Data: any;
  CSHeaderId: any;
  SM_Id: number = 0;

  TotalInUSD: number = 0; TotalInUSDSM: number = 0;
  TotalInLocal: number = 0; TotalInLocalSM: number = 0;
  TotalInPer: number = 0; TotalInPerSM: number = 0;

  Manu_TotalInUSD: number = 0; Manu_TotalInUSDSM: number = 0;
  Manu_TotalInLocal: number = 0; Manu_TotalInLocalSM: number = 0;
  Manu_TotalInPer: number = 0; Manu_TotalInPerSM: number = 0;

  Non_TotalInUSD: number = 0; Non_TotalInUSDSM: number = 0;
  Non_TotalInLocal: number = 0; Non_TotalInLocalSM: number = 0;
  Non_TotalInPer: number = 0; Non_TotalInPerSM: number = 0;
  CurruntDate: any;
  UserName: any;
  userId: any;
  totalcost: number = 0;
  totalvavecost: number = 0;
  //IsCastingSheet: any;
  SCReportId: any;
  IsUserLog: any;
  ProjectName: any;
  userFullName: any;
  VaveIdea: number[] = [];
  VaveIdeaSession: any;

  T2NotPresent = true;
  ProjectTitle: any;
  UniqueId: any;
  NA: any = "NA";

  fixsubheader = false;
  shouldcostreport = false;
  shouldcostrequets = true;
  showthankyou = true;


  ngOnInit(): void {

    debugger;

    this.router.events.subscribe((event) => {
      window.scrollTo(0, 0)
    });

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.VaveIdeaSession = localStorage.getItem("DTCVaveIdea");
    // var result = yourString.substring(1, yourString.length-1);
    this.VaveIdea = JSON.parse(this.VaveIdeaSession); // [137, 191, 272]

    this.userId = localStorage.getItem("userId");
    this.ForexRegion = localStorage.getItem("DTCForexRegion");

    this.UserName = localStorage.getItem("userName");
    this.userFullName = localStorage.getItem("userFullName");

    this.CSHeaderId = localStorage.getItem("DTCComapredId"); // ---  CSHeaderId 
    this.SCReportId = localStorage.getItem("DTCSCReportId");
    this.ProjectName = localStorage.getItem("DTCProjectName");
    this.ProjectTitle = localStorage.getItem("DTCProjecttitle");
    this.UniqueId = localStorage.getItem("DTCUniqueId");

    // if (this.IsUserLog == 1) {
    this.GetReportData();

    this.CurruntDate = this.datePipe.transform(new Date(), 'MMM dd yyyy');

    this.DebriefDateFormated = localStorage.getItem("DTCDebriefDateFormated");

    setTimeout(() => {
      const myElement = document.getElementById("printsection");
      myElement?.classList.add("SetFontSizeONPrint");
    }, 2000);
  }


  async GetReportData() {
    try {
      debugger
      this.SpinnerService.show('spinner');
      const data = await this.searchservice.GetSourcingManagerReport(this.CSHeaderId, this.userId, '1').toPromise();

      this.ProductDetail = data.productDetail;
      this.MaterailGrade = data.materailGrade;
      this.NonManufacturingCost = data.nonManufacturingCost;
      this.TierData = data.tierData;
      this.Tier2Data = data.tierDataT2;

      if (this.ProductDetail[0].hasParentValue == 1) {
        const pd = this.ProductDetail[0];

        this.ProjectTitle =
          (pd.projectType != null ? pd.projectType : pd.par_ProjectType) + '-' +
          (pd.businessUnit != null ? pd.businessUnit : pd.par_BusinessUnit) + '-' +
          (pd.programName != null ? pd.programName : pd.par_ProgramName) + '-' +
          pd.mfgRegion + '-' +
          (pd.partName != null ? pd.partName : pd.par_PartName) + '-' +
          (pd.partNumber != null ? pd.partNumber : pd.par_PartNumber);
      }

      try {
        debugger;
        const data2 = await this.reportservice.GetDTCVavedata(this.VaveIdea).toPromise();
        this.Vavedetails = data2;

      } catch (error) {
        console.error('Error fetching data:', error);
      }

      this.totalcost = this.TierData[this.TierData.length - 1].smUSDValue;

      setTimeout(() => {
        this.onvaveChange();
      }, 500);


      this.ContributionInTotal(data.tierData);

      setTimeout(() => {
        this.GetSGA_InPer();
      }, 500);

      if (this.Tier2Data.length <= 0) {
        this.T2NotPresent = true;
      }
      else {
        this.T2NotPresent = false;
        setTimeout(() => {
          this.GetSGA_InPer_T2();
        }, 500);
      }

      this.SpinnerService.hide('spinner');
    }
    catch (e) {
      this.SpinnerService.hide('spinner');
    }


  }


  ContributionInTotal(data: any) {

    for (let i = 0; i < data.length; i++) {
      this.Manu_TotalInUSD += data[i].usdValue;
      this.Manu_TotalInLocal += data[i].localValue;

      this.Manu_TotalInUSDSM += data[i].smUSDValue;
      this.Manu_TotalInLocalSM += data[i].smlocalValue;
    }


    this.TotalInUSD = data[data.length - 1].usdValue;
    this.TotalInLocal = data[data.length - 1].localValue;

    this.TotalInUSDSM = data[data.length - 1].smUSDValue;
    this.TotalInLocalSM = data[data.length - 1].smlocalValue;

    for (let i = 0; i < data.length; i++) {
      this.TierData[i].totalCostPer = data[i].usdValue / this.TotalInUSD * 100;
      this.TierData[i].totalCostPerSM = data[i].smUSDValue / this.TotalInUSDSM * 100;
    }



    for (let i = 0; i < this.TierData.length; i++) {
      this.Manu_TotalInPer += this.TierData[i].totalCostPer;
      this.Manu_TotalInPerSM += this.TierData[i].totalCostPerSM;
    }


  }

  SGA_per: any;
  Profit_per: any;
  Packaging_per: any;
  FreightLogistics_per: any;
  DirectedBuyCost_per: any;
  HandlingCharges_per: any;
  ICC_per: any;
  Rejection_per: any;
  Tariff_Per: any

  GetSGA_InPer() {

    for (let i = 0; i < this.TierData.length; i++) {
      if (this.TierData[i].particular.toLowerCase().includes('sg&a')) {
        if (this.TierData[i].percent_updated == 0) {
          this.SGA_per = this.ProductDetail[0].sgA_T1;
        }
        else {
          this.SGA_per = this.TierData[i].percent_updated;
        }
      }

      if (this.TierData[i].particular.toLowerCase().includes('profit')) {
        if (this.TierData[i].percent_updated == 0) {
          this.Profit_per = this.ProductDetail[0].profit_T1;
        }
        else {
          this.Profit_per = this.TierData[i].percent_updated;
        }
      }

      if (this.TierData[i].particular.toLowerCase().includes('packaging')) {
        if (this.TierData[i].percent_updated == 0) {
          this.Packaging_per = this.ProductDetail[0].packaging_T1;
        }
        else {
          this.Packaging_per = this.TierData[i].percent_updated;
        }
      }

      if (this.TierData[i].particular.toLowerCase().includes('logistics')) {
        if (this.TierData[i].percent_updated == 0) {
          this.FreightLogistics_per = this.ProductDetail[0].freight_T1;
        }
        else {
          this.FreightLogistics_per = this.TierData[i].percent_updated;
        }
      }
      if (this.TierData[i].particular.toLowerCase().includes('tariff')) {
        if (this.TierData[i].percent_updated == 0) {
          this.Tariff_Per = 0;
        }
        else {
          this.Tariff_Per = this.TierData[i].percent_updated;
        }
      }
    }
  }


  SGA_per_T2: any;
  Profit_per_T2: any;
  Packaging_per_T2: any;
  FreightLogistics_per_T2: any;
  Tariff_Per_T2: any;

  GetSGA_InPer_T2() {

    if (this.Tier2Data.length > 0) {

      for (let i = 0; i < this.Tier2Data.length; i++) {
        if (this.Tier2Data[i].particular.toLowerCase().includes('sg&a')) {
          if (this.Tier2Data[i].percent_updated == 0) {
            this.SGA_per_T2 = this.ProductDetail[0].sgA_T2;
          }
          else {
            this.SGA_per_T2 = this.Tier2Data[i].percent_updated;
          }
        }

        if (this.Tier2Data[i].particular.toLowerCase().includes('profit')) {
          if (this.Tier2Data[i].percent_updated == 0) {
            this.Profit_per_T2 = this.ProductDetail[0].profit_T2;
          }
          else {
            this.Profit_per_T2 = this.Tier2Data[i].percent_updated;
          }
        }

        if (this.Tier2Data[i].particular.toLowerCase().includes('packaging')) {
          if (this.Tier2Data[i].percent_updated == 0) {
            this.Packaging_per_T2 = this.ProductDetail[0].packaging_T2;
          }
          else {
            this.Packaging_per_T2 = this.Tier2Data[i].percent_updated;
          }
        }

        if (this.Tier2Data[i].particular.toLowerCase().includes('logistics')) {
          if (this.Tier2Data[i].percent_updated == 0) {
            this.FreightLogistics_per_T2 = this.ProductDetail[0].freight_T2;
          }
          else {
            this.FreightLogistics_per_T2 = this.Tier2Data[i].percent_updated;
          }
        }
        if (this.Tier2Data[i].particular.toLowerCase().includes('tariff')) {
          if (this.Tier2Data[i].percent_updated == 0) {
            this.Tariff_Per_T2 = 0;
          }
          else {
            this.Tariff_Per_T2 = this.Tier2Data[i].percent_updated;
          }
        }

      }

      this.SGA_per_T2 = this.Tier2Data[7].percent_updated;
      this.Profit_per_T2 = this.Tier2Data[7].percent_updated;
      this.Packaging_per_T2 = this.Tier2Data[7].percent_updated;
      this.FreightLogistics_per_T2 = this.Tier2Data[7].percent_updated;

    }

  }

  RoundNumber(number: number) {
    let roundedNumber: number = parseFloat(number.toFixed(2));
    let integerPart: number = Math.floor(roundedNumber);
    let decimalPart: number = Math.round((roundedNumber - integerPart) * 10);

    // Check if the decimal part is zero, if yes, return the integer part as a string
    if (decimalPart === 0) {
      return integerPart;
    }
    else if (decimalPart === 10) {
      return integerPart + 1;
    }

    else {
      // Otherwise, return the rounded number with one decimal place
      return roundedNumber.toFixed(1);
    }
  }

  ChekNull(v: any): any {
    if (v == null || v == undefined || v <= 0) {
      return this.NA;
    }
    else {
      return v;
    }
  }

  projectRows: any = [];
  newPDF() {
    debugger;

    let totalPages = 2;
    var doc = new jsPDF('p', 'mm', 'a4');

    var fileWidth = 210;
    doc.addPage();

    var pagecount = doc.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      // var currentPage = doc.getCurrentPageInfo().pageNumber;
      /// header
      const headerlogo1 = '../../../../assets/welcome/Model Mart_Final Logo_130325.png';
      doc.addImage(headerlogo1, 4, 3, 34, 20);
      const headerlogo2 = '../../../../assets/newCumminslogo.jpg';
      doc.addImage(headerlogo2, 185, 2, 24, 22);

      if (i == 1) {
        doc.setFontSize(20);
        doc.text('Updated Should Cost Model Report: ', fileWidth / 2, 70, { align: 'center' });

        doc.setFontSize(15);
        var line = 10;
        var splitText = doc.splitTextToSize(this.ProjectTitle, fileWidth)
        for (var j = 0, length = splitText.length; j < length; j++) {
          doc.text(splitText[j], fileWidth / 2, 80 + line, { align: 'center' });
          line = line + 10;
        }
        // debugger;
        this.hh = localStorage.getItem("DTCimagePath")?.toString();
        //'../../../assets/CRANKSHAFT,ENGINE-5714721/ISO.JPG' ;

        if (this.hh == undefined || this.hh == '') {
          const partImg = '../../../../assets/No-Image.png';
          doc.addImage(partImg, 70, 120, 70, 70);
        }
        else {
          //const partImgNew = '../.../../../assets/2021000001/ISO.jpg';
          //const partImg = '../../../../assets/No-Image.png';
          const partImg = this.hh;
          doc.addImage(partImg, 70, 120, 70, 70);
        }

        doc.setTextColor("#da291c");
        doc.setFontSize(15);
        doc.text('Cummins Confidential - Not to be shared with supplier or outside the organization!', fileWidth / 2, 240, { align: 'center' });
      }

      doc.setTextColor("#da291c");
      doc.setFontSize(10);
      doc.text('This report is an electronically generated simulation by Model Mart based on user inputs.', fileWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });


      doc.setFontSize(8);
      doc.setTextColor("#000000");
      doc.text('Page ' + i + ' of ' + totalPages, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 5);

    }

    ////  Project  Details
    let Projectcolumns = [['Updated Cost Model Report for ' + this.ProjectTitle]];
    autoTable(doc, {
      head: Projectcolumns,
      body: [],
      startY: 30,
      theme: 'grid',
      headStyles: { fontSize: 9, fillColor: [217, 217, 217], textColor: [0, 0, 0], halign: 'center' },
      bodyStyles: { fillColor: [255, 255, 255] },
      margin: 10,

    });

    let finalYDetails = (doc as any).lastAutoTable.finalY;

    debugger;

    var forex = this.ProductDetail[0].forex.toFixed(2);
    var currentForex = this.ProductDetail[0].currentYearForex.toFixed(2);
    var businessunit = this.ProductDetail[0].businessUnit == null ? "" : this.ProductDetail[0].businessUnit;
    var Per_businessunit = this.ProductDetail[0].par_BusinessUnit == null ? "" : this.ProductDetail[0].par_BusinessUnit;
    var engineDispalcement = this.ProductDetail[0].engineDisplacement == null ? " " : this.ProductDetail[0].engineDisplacement;
    var Per_engineDispalcement = this.ProductDetail[0].par_EngineDisplacement == null ? " " : this.ProductDetail[0].par_EngineDisplacement;

    if (this.ProductDetail[0].hasParentValue == 1) {
      this.projectRows = [
        [
          ['Model Edited By : ' + this.userFullName],
          ['Part Name : ' + this.ProductDetail[0].partName],
          ['Supplier Quote/Invoice Price : ' + this.ProductDetail[0].supplier],
          ['Base Model Details']

        ],
        [
          ['Model Edit Date : ' + this.CurruntDate],
          ['Part Number : ' + this.ProductDetail[0].partNumber],
          ['Business Unit : ' + businessunit],
          ['Model Mart ID : ' + this.ProductDetail[0].uniqueId],
        ],
        [
          ['Model Created Date : ' + this.DebriefDateFormated],
          ['Annual Volume : ' + this.ProductDetail[0].annualVolume],
          ['Engine Displacement : ' + engineDispalcement],
          ['Part Number : ' + this.ProductDetail[0].par_PartNumber],
        ],
        [
          ['Location : ' + this.ProductDetail[0].mfgRegion],
          ['Project Type : ' + this.ProductDetail[0].projectType],
          [],
          ['Program Name  : ' + this.ProductDetail[0].par_ProgramName],
        ],
        [
          ['Old Forex : ' + forex],
          ['Current Year Forex : ' + currentForex],
          [],
          ['Engine Displacement : ' + Per_engineDispalcement],
        ],
        [
          [],
          [],
          [],
          ['Business Unit : ' + Per_businessunit],
        ]
      ];
    }
    else {
      this.projectRows = [
        [
          ['Model Edited By : ' + this.userFullName],
          ['Part Name : ' + this.ProductDetail[0].partName],
          ['Supplier Quote/Invoice Price : ' + this.ProductDetail[0].supplier],
        ],
        [
          ['Model Edit Date : ' + this.CurruntDate],
          ['Part Number : ' + this.ProductDetail[0].partNumber],
          ['Business Unit : ' + this.ProductDetail[0].businessUnit],
        ],
        [
          ['Model Created Date : ' + this.DebriefDateFormated],
          ['Annual Volume : ' + this.ProductDetail[0].annualVolume],
          ['Engine Displacement : ' + this.ProductDetail[0].engineDisplacement],
        ],
        [
          ['Location : ' + this.ProductDetail[0].mfgRegion],
          ['Batch Size : ' + this.ProductDetail[0].batchSize],
          ['Project Type : ' + this.ProductDetail[0].projectType],
        ],
        [
          ['Old Forex : ' + forex],
          ['Current Year Forex : ' + currentForex],
          [],
        ]
      ];
    }

    autoTable(doc, {
      head: [],
      body: this.projectRows,
      startY: finalYDetails + 1,
      theme: 'grid',
      headStyles: { fontSize: 6, fillColor: [179, 179, 179], textColor: [0, 0, 0], },
      bodyStyles: { fontSize: 6, fontStyle: 'bold', textColor: [0, 0, 0], },
      margin: 5,
      styles: {
        cellPadding: 0.5,   // Add padding to increase vertical spacing
      },
      willDrawCell: function (data: any) {
        debugger;
        var rows = data.table.body;

        if (rows.length > 5) {
          if (rows[0].cells[3].text == "Base Model Details") {
            rows[0].cells[3].styles.halign = 'center';
            rows[0].cells[3].styles.fontSize = 7;
          }
        }
      }

      // columnStyles: {
      //   0: { cellWidth: 50 },
      //   1: { cellWidth: 50 },
      //   2: { cellWidth: 50 },
      //   3: { cellWidth: 50 },
      // },
    });



    let finalY0 = (doc as any).lastAutoTable.finalY;
    ////  Tier1 SGA  Detail
    let Greaterthan = [246, 203, 203];
    let Lessthan = [193, 232, 194]

    const Tier1rows = [
      [this.ProductDetail[0].sgA_T1, this.SGA_per, this.ProductDetail[0].profit_T1, this.Profit_per, this.ProductDetail[0].packaging_T1, this.Packaging_per, this.ProductDetail[0].freight_T1, this.FreightLogistics_per, 0, this.Tariff_Per]];

    autoTable(doc, {
      head: [
        [{ content: 'Finish Part', colSpan: 10, styles: { halign: 'left', fillColor: [217, 217, 217] } }],
        ['SG & A (%)', 'SG & A Updated (%)', 'Profit (%)', 'Profit Updated (%)', 'Packaging (%)', 'Packaging Updated (%)', 'Freight / Logistics (%)', 'Freight / Logistics Update (%)', 'Tariff (%)', 'Tariff Updated (%)'],
      ],
      body: Tier1rows,
      startY: finalY0 + 5,
      theme: 'grid',
      headStyles: { fontSize: 6, fillColor: [179, 179, 179], textColor: [0, 0, 0], },
      bodyStyles: { fontSize: 6, fontStyle: 'bold', textColor: [0, 0, 0] },
      margin: 5,
      willDrawCell: function (data: any) {
        var rows = data.table.body;

        if (rows[0].raw[0] > rows[0].raw[1]) {
          rows[0].cells[1].styles.fillColor = Lessthan;
        }
        if (rows[0].raw[0] < rows[0].raw[1]) {
          rows[0].cells[1].styles.fillColor = Greaterthan;
        }

        if (rows[0].raw[2] > rows[0].raw[3]) {
          rows[0].cells[3].styles.fillColor = Lessthan;
        }
        if (rows[0].raw[2] < rows[0].raw[3]) {
          rows[0].cells[3].styles.fillColor = Greaterthan;
        }

        if (rows[0].raw[4] > rows[0].raw[5]) {
          rows[0].cells[5].styles.fillColor = Lessthan;
        }
        if (rows[0].raw[4] < rows[0].raw[5]) {
          rows[0].cells[5].styles.fillColor = Greaterthan;
        }

        if (rows[0].raw[6] > rows[0].raw[7]) {
          rows[0].cells[7].styles.fillColor = Lessthan;
        }
        if (rows[0].raw[6] < rows[0].raw[7]) {
          rows[0].cells[7].styles.fillColor = Greaterthan;
        }

        if (rows[0].raw[8] > rows[0].raw[9]) {
          rows[0].cells[9].styles.fillColor = Lessthan;
        }
        if (rows[0].raw[8] < rows[0].raw[9]) {
          rows[0].cells[9].styles.fillColor = Greaterthan;
        }
      }
    });

    ////  Tier2 SGA  Detail is Present
    if (!this.T2NotPresent) {
      let finalY0 = (doc as any).lastAutoTable.finalY;

      const Tier2rows = [
        [this.ProductDetail[0].sgA_T2, this.SGA_per_T2, this.ProductDetail[0].profit_T2, this.Profit_per_T2, this.ProductDetail[0].packaging_T2, this.Packaging_per_T2, this.ProductDetail[0].freight_T2, this.FreightLogistics_per_T2, 0, this.Tariff_Per_T2]
      ];

      autoTable(doc, {
        head: [
          [{ content: 'Tier#2 Cost or Rough Part Cost or Casting Cost or Forging Cost', colSpan: 10, styles: { halign: 'left', fillColor: [217, 217, 217] } }],
          ['SG & A (%)', 'SG & A Updated (%)', 'Profit (%)', 'Profit Updated (%)', 'Packaging (%)', 'Packaging Updated (%)', 'Freight / Logistics (%)', 'Freight / Logistics Update (%)', 'Tariff (%)', 'Tariff Updated (%)'],
        ],
        body: Tier2rows,
        startY: finalY0 + 2,
        theme: 'grid',
        headStyles: { fontSize: 6, fillColor: [179, 179, 179], textColor: [0, 0, 0], },
        bodyStyles: { fontSize: 6, fontStyle: 'bold', textColor: [0, 0, 0] },
        margin: 5,
        willDrawCell: function (data: any) {
          var rows = data.table.body;

          if (rows[0].raw[0] > rows[0].raw[1]) {
            rows[0].cells[1].styles.fillColor = Lessthan;
          }
          if (rows[0].raw[0] < rows[0].raw[1]) {
            rows[0].cells[1].styles.fillColor = Greaterthan;
          }

          if (rows[0].raw[2] > rows[0].raw[3]) {
            rows[0].cells[3].styles.fillColor = Lessthan;
          }
          if (rows[0].raw[2] < rows[0].raw[3]) {
            rows[0].cells[3].styles.fillColor = Greaterthan;
          }

          if (rows[0].raw[4] > rows[0].raw[5]) {
            rows[0].cells[5].styles.fillColor = Lessthan;
          }
          if (rows[0].raw[4] < rows[0].raw[5]) {
            rows[0].cells[5].styles.fillColor = Greaterthan;
          }

          if (rows[0].raw[6] > rows[0].raw[7]) {
            rows[0].cells[7].styles.fillColor = Lessthan;
          }
          if (rows[0].raw[6] < rows[0].raw[7]) {
            rows[0].cells[7].styles.fillColor = Greaterthan;
          }

          if (rows[0].raw[8] > rows[0].raw[9]) {
            rows[0].cells[9].styles.fillColor = Lessthan;
          }
          if (rows[0].raw[8] < rows[0].raw[9]) {
            rows[0].cells[9].styles.fillColor = Greaterthan;
          }

        }
      });
    }

    let finalY1 = (doc as any).lastAutoTable.finalY;


    ////  Material Greade
    const headersMaterial = [['Sr. No.', 'Supply Level', 'Material Grade', 'Current Net Weight (kg)', 'Updated Net Weight (kg)', 'Current Rate ($)', 'Updated Rate($)']];

    // Map your data to match the headers
    var MaterailGradedata = [];

    for (var i = 0; i < this.MaterailGrade.length; i++) {
      MaterailGradedata.push([i + 1, this.MaterailGrade[i].supplyLevel, this.MaterailGrade[i].materialType, this.MaterailGrade[i].netWeightKG, this.MaterailGrade[i].updatenetWeightKG, this.MaterailGrade[i].unitMaterialRate, this.MaterailGrade[i].updateMaterialRate])
    }

    if (this.MaterailGrade.length <= 0) {
      MaterailGradedata.push(['', "Material grade are not available", '', '']);
    }

    autoTable(doc, {
      head: headersMaterial,
      startY: finalY1 + 5,
      body: MaterailGradedata,
      theme: 'grid',
      headStyles: { fontSize: 7, fillColor: [179, 179, 179], textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 7, fontStyle: 'bold', textColor: [0, 0, 0] },
      //html: "#printsectionMaterial",
      // columnStyles: {
      //   0: { cellWidth: 14 },
      //   1: { cellWidth: 110 },
      //   2: { cellWidth: 33 },
      //   3: { cellWidth: 33 },
      // },
      margin: 10,
      styles: {
        cellPadding: 1,   // Add padding to increase vertical spacing
      },
      willDrawCell: function (data: any) {
        var rows = data.table.body;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].raw[3] < rows[i].raw[4]) {
            rows[i].cells[4].styles.fillColor = Greaterthan;
          }
          if (rows[i].raw[3] > rows[i].raw[4]) {
            rows[i].cells[4].styles.fillColor = Lessthan;
          }
          if (rows[i].raw[5] < rows[i].raw[6]) {
            rows[i].cells[6].styles.fillColor = Greaterthan;
          }
          if (rows[i].raw[5] > rows[i].raw[6]) {
            rows[i].cells[6].styles.fillColor = Lessthan;
          }
          // // if (rows[i].cells[3].raw.className.includes('UpdateValueGreaterThan')) {
          // //   rows[i].cells[3].styles.fillColor = Greaterthan;
          // // }
          // // if (rows[i].cells[3].raw.className.includes('UpdateValueLessThan')) {
          // //   rows[i].cells[3].styles.fillColor = Lessthan;
          // // }
        }
      }

    });

    debugger;
    let finalY = (doc as any).lastAutoTable.finalY;

    let pageadded = false

    // this.MaterailGrade.length
    if (this.MaterailGrade.length >= 8) {

      pageadded = true
      doc.addPage();
      /// header
      const headerlogo1 = '../../../assets/welcome/Model Mart_Final Logo_130325.png';
      doc.addImage(headerlogo1, 4, 3, 34, 20);
      const headerlogo2 = '../../../assets/newCumminslogo.jpg';
      doc.addImage(headerlogo2, 185, 2, 24, 22);

      /// footer
      doc.setTextColor("#da291c");
      doc.setFontSize(10);
      doc.text('This report is an electronically generated simulation by Model Mart based on user inputs.', fileWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });


      doc.setFontSize(8);
      doc.setTextColor("#000000");
      doc.text('Page ' + 3 + ' of ' + 3, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 5);

      finalY = 25;
    }

    const row = [["Should Cost By Should Costing Team", "User Simulation"]];
    autoTable(doc, {
      theme: 'plain',
      headStyles: { fillColor: [255, 255, 255] },
      bodyStyles: { minCellHeight: 110 },
      startY: finalY + 5,
      head: [],
      body: row,
      margin: 5,
      tableWidth: 200,
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 80 }
      },
      didDrawCell: function (data) {
        if (data.cell.text[0] == "Should Cost By Should Costing Team" && data.cell.section === 'body') {
          autoTable(doc, {
            theme: 'grid',
            tableLineColor: [189, 195, 199],
            tableLineWidth: .10,
            headStyles: { fontSize: 7, fillColor: [179, 179, 179], textColor: [0, 0, 0] },
            bodyStyles: { fontSize: 7, fontStyle: 'bold', textColor: [0, 0, 0] },
            html: "#printsectionHead",
            columnStyles: {
              0: { cellWidth: 48 },
              1: { cellWidth: 23 },
              2: { cellWidth: 28 },
              3: { cellWidth: 21 },
            },
            startY: data.cell.y + 2,
            margin: { left: data.cell.x + data.cell.padding('left') - 1 },
            didParseCell: function (data) {
              var rows = data.table.body;
              //debugger;
              // if (data.row.index == 6 || data.row.index === rows.length - 1) {
              //   data.cell.styles.fillColor = [217, 217, 217];
              // }

              if (data.row.index == 7 || data.row.index === rows.length - 1) {
                data.cell.styles.fillColor = [217, 217, 217];
              }


              data.table.head[0].cells[0].styles.fillColor = [217, 217, 217];
            },
            willDrawCell: function (data: any) {
              var rows = data.table.body;
              for (let i = 0; i < rows.length; i++) {
                if (parseInt(rows[i].cells[3].text[0].trim()) > 0) {
                  var dimwidth = (parseInt(rows[i].cells[3].text[0].trim()) / 100) * 21;
                  rows[i].cells[3].width = dimwidth;
                  rows[i].cells[3].styles.fillColor = [169, 169, 169]
                }
                else {
                  rows[i].cells[3].width = 0;
                }
              }
            },
            tableWidth: 120,
          });
        }
        if (data.cell.text[0] == "User Simulation" && data.cell.section === 'body') {
          autoTable(doc, {
            theme: 'grid',
            tableLineColor: [189, 195, 199],
            tableLineWidth: .10,
            headStyles: { fontSize: 7, fillColor: [179, 179, 179], textColor: [0, 0, 0] },
            bodyStyles: { fontSize: 7, fontStyle: 'bold', textColor: [0, 0, 0] },
            html: "#printsectionHead2",
            columnStyles: {
              0: { cellWidth: 29 },
              1: { cellWidth: 30 },
              2: { cellWidth: 21 },
            },
            tableWidth: 80,
            startY: data.cell.y + 2,
            margin: { left: data.cell.x + data.cell.padding('left') },
            didParseCell: function (data: any) {
              var rows = data.table.body;
              // if (data.row.index == 6 || data.row.index === rows.length - 1) {
              //   data.cell.styles.fillColor = [217, 217, 217];
              // }
              if (data.row.index == 7 || data.row.index === rows.length - 1) {
                data.cell.styles.fillColor = [217, 217, 217];
              }

              data.table.head[0].cells[0].styles.fillColor = [217, 217, 217];
              if (data.cell.section === 'body') {
                //debugger;
                for (let i = 0; i < rows.length; i++) {
                  if (rows[i].cells[0].raw.className.includes('UpdateValueGreaterThan')) {
                    rows[i].cells[0].styles.fillColor = Greaterthan;

                  }
                  if (rows[i].cells[0].raw.className.includes('UpdateValueLessThan')) {
                    rows[i].cells[0].styles.fillColor = Lessthan;
                  }
                }
              }
            },
            willDrawCell: function (data: any) {
              if (data.cell.section === 'body') {
                var rows = data.table.body;
                for (let i = 0; i < rows.length; i++) {
                  if (parseInt(rows[i].cells[2].text[0].trim()) > 0) {
                    var dimwidth = (parseInt(rows[i].cells[2].text[0].trim()) / 100) * 21;
                    rows[i].cells[2].width = dimwidth;
                    rows[i].cells[2].styles.fillColor = [169, 169, 169]
                  }
                  else {
                    rows[i].cells[2].width = 0;
                  }
                }
              }
            }
          });
        }
      },
    });
    debugger;

    //let finalYMark = (doc as any).lastAutoTable.finalY;

    let remark = doc.internal.pageSize.getHeight() - 20;

    doc.setFontSize(6);
    doc.setFillColor(246, 203, 203);
    doc.rect(5, remark - 3, 5, 5, 'F');
    doc.text('Greater than Existing Cost', 11, remark);

    doc.setFillColor(193, 232, 194);
    doc.rect(40, remark - 3, 5, 5, 'F');
    doc.text('Less than Existing Cost', 46, remark);

    doc.setTextColor("#C0C0C0");
    doc.setFontSize(17);
    doc.setGState(doc.GState({ opacity: 0.5 }));
    doc.text('User simulation, not a Cost Model', 132, finalY + 90, { angle: 46 });

    if (pageadded == false) {
      doc.addPage();
      /// header
      const headerlogo1 = '../../../assets/welcome/Model Mart_Final Logo_130325.png';
      doc.addImage(headerlogo1, 4, 3, 34, 20);
      const headerlogo2 = '../../../assets/newCumminslogo.jpg';
      doc.addImage(headerlogo2, 185, 2, 24, 22);

      /// footer
      doc.setTextColor("#da291c");
      doc.setFontSize(10);
      doc.text('This report is an electronically generated simulation by Model Mart based on user inputs.', fileWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });


      doc.setFontSize(8);
      doc.setTextColor("#000000");
      doc.text('Page ' + 3 + ' of ' + 3, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 5);
    }

    //let finalYSimulation = (doc as any).lastAutoTable.finalY;

    let Vavecolumns = [['VAVE Changes']];
    autoTable(doc, {
      head: Vavecolumns,
      body: [],
      startY: 30,
      theme: 'grid',
      headStyles: { fontSize: 9, fillColor: [217, 217, 217], textColor: [0, 0, 0], halign: 'center' },
      bodyStyles: { fillColor: [255, 255, 255] },
      margin: 35,
      tableWidth: 140,
    });

    debugger;
    const headers = [['Sr. No', 'Idea', 'Potential Savings PP ($)']];

    // Map your data to match the headers
    var vavedata = [];

    const vavetextvalues = document.getElementsByClassName("vavePercentText") as any;

    for (var i = 0; i < this.Vavedetails.length; i++) {
      vavedata.push([i + 1, this.Vavedetails[i].Idea, vavetextvalues[i].value])
    }

    if (this.Vavedetails.length <= 0) {
      vavedata.push(['', "VAVE Ideas not selected", '']);
    }

    ////  Vave Greade
    autoTable(doc, {
      head: headers,
      body: vavedata,
      startY: 30 + 7,
      theme: 'grid',
      headStyles: { fontSize: 7, fillColor: [179, 179, 179], textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 7, fontStyle: 'bold', textColor: [0, 0, 0] },
      //html: "#printsectionVave",
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 80 },
        2: { cellWidth: 40 }
      },
      margin: 35
    });

    let finalYVAVE = (doc as any).lastAutoTable.finalY;

    let TotalCost = [['Total Cost : $ ' + this.totalvavecost]];
    autoTable(doc, {
      head: TotalCost,
      body: [],
      startY: finalYVAVE + 10,
      theme: 'grid',
      headStyles: { fontSize: 9, fillColor: [217, 217, 217], textColor: [0, 0, 0], halign: 'center' },
      bodyStyles: { fillColor: [255, 255, 255] },
      margin: 35,
      tableWidth: 140,
    });


    var filename = this.ProjectTitle + " .pdf";
    doc.save(filename);
  }

  hh: any;

  backToPreviousPage() {
    debugger;
    if (this.shouldcostrequets) {
      this.location.back();
    }
    else {
      this.shouldcostrequets = true;
    }

  }


  rr: any;
  onvaveChange() {
    debugger;
    this.totalvavecost = 0;

    const vavePercentText = document.getElementsByClassName("form-control vavePercentText") as any;

    for (let i = 0; i < vavePercentText.length; i++) {
      if (vavePercentText[i].value == "") {
        this.rr = '0';
      }
      else {
        this.rr = vavePercentText[i].value;
        this.Vavedetails[i].PotentialSavingsPerPieceMDO = vavePercentText[i].value;
      }

      this.totalvavecost = this.totalvavecost + parseFloat(this.rr.replace(/,/g, ""));
    }

    this.totalvavecost = Math.round((this.totalcost - this.totalvavecost + Number.EPSILON) * 100) / 100;

  }

  IsVAVEDataInsert = false;

  SaveVavedetails() {
    debugger;
    console.log('this.Vavedetails', this.Vavedetails)
    let vavelist: any[] = [];

    const vavePercentText = document.getElementsByClassName("form-control vavePercentText") as any;

    for (let i = 0; i < this.Vavedetails.length; i++) {
      vavelist.push({ CSHeaderId: this.CSHeaderId, IdeaId: this.Vavedetails[i].id, PSavings: vavePercentText[i].value, CreatedBy: this.userId })
    }

    if (this.Vavedetails.length <= 0) {
      vavelist.push({ CSHeaderId: this.CSHeaderId, IdeaId: 0, PSavings: 0, CreatedBy: this.userId })
    }

    if (this.SCReportId > 0) {
      this.reportservice.insertDPVavedetails(vavelist, this.SCReportId).subscribe({
        next: async (_res: any) => {
          debugger
          this.IsVAVEDataInsert = true;
          //this.toastr.success("Vave Data Inserted Successfully.");
          const data = await this.searchservice.downloadUpdatedShouldeCost(this.CSHeaderId, this.userId).toPromise();

          this.newPDF();
          //localStorage.setItem("DTCSCReportId", _res.Result);
        },
        error: (error: any) => {
          this.IsVAVEDataInsert = false;
          console.error('Inserting API call error:', error);
        },
      });
    }

  }

  GoToRefreshRequest() {
    debugger;

    if (!this.IsVAVEDataInsert) {
      this.SaveVavedetails();
    }

    setTimeout(() => {
      this.ShowRequesterData();
      this.shouldcostreport = true;
      this.shouldcostrequets = false;
      this.showthankyou = true;

      window.scrollTo({
        top: 0,
        behavior: 'smooth' // For smooth scrolling animation
      });

    }, 500);

  }


  keyPressDecimal(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
      return false;
    }
    else {
      return true;
    }
  }




  //  ----------------- should cost request send  start ---------  

  fileName: string = "Attach File";
  filesdsdd: File[] = [];
  selectedFiles: File[] = [];
  Comments: any = '';
  RefresModelComments: any = '';
  IsRefresModelComments = false;
  FolderLink: any = '';
  RequesteDate: any = new Date();
  userName: any;
  // userId: any;
  Btn_Text: any;
  // UniqueId: any;
  // SCReportId: any;
  RequestUsername: any;
  RequestId: any;
  Status: any;
  CreatedDate: any;
  updateRequest: UpdateRequest[] = [];
  EmailForRequestUpdate: any;
  ResubmitRequest = true;
  Origin: any;
  ResubmitRequesterData: any;

  UploadSheetcomments: any;

  @ViewChild('myFile') myInputFile!: ElementRef;

  async ShowRequesterData() {

    debugger;
    this.Btn_Text = 'Submit';
    this.RequesteDate = new Date();
    this.RequesteDate = this.datePipe.transform(this.RequesteDate, 'MMM dd yyyy');

    this.IsRefresModelComments = true;
    this.RefresModelComments = 'Design for Manufacturing, Assembly & Cost (DfMAC) for ' + this.ProjectTitle;
    this.UploadSheetcomments = '1. Please upload CAD, prints of all parts & subcomponents (if any) for the New Design. Also add any design review documents, standards and other artefacts. ';

  }


  @ViewChild('myFile') fileUploader: ElementRef | undefined;


  async onChange(event: any) {
    this.selectedFiles = [];

    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.includes('.') || file.name.endsWith('.')) {
        var ex = file.name.slice(file.name.lastIndexOf('.') + 1);
        if (this.UniqueId == ':request' || this.Origin == 'RFM') {
          if (ex == 'xlsx' || ex == 'xls' || ex == 'xlsm') {
            this.selectedFiles.push(file);
          }
          else {
            this.toastr.warning("Please select only excel file");
            this.fileUploader!.nativeElement.value = null;
          }
        }
        else {
          const blockedExtensions = ["exe", "dll", "msi", "bat", "cmd", "com", "scr", "cpl", "ocx",
            "sys", "pif", "gadget", "jar", "vbs", "js", "jse", "vbe", "wsf",
            "wsh", "ps1", "lnk", "msp", "inf", "hta"];
          if (!blockedExtensions.includes(ex)) {
            this.selectedFiles.push(file);
          }
          else {
            this.toastr.warning("Files with selected extension are not allowed");
            this.fileUploader!.nativeElement.value = null;
          }

        }
      }
    }
  }

  cmd: any;
  async upload() {
    debugger;

    var flag = false;
    console.log("Select File " + this.selectedFiles.length);
    // if (this.Status != 'Rejected') {
    //   if (this.selectedFiles.length <= 0) {
    //     this.toastr.warning("Please Select File");
    //     this.renderer.selectRootElement('#myFile').focus();
    //     return
    //   }
    // }
    if (this.Comments == '' || this.Comments == undefined) {
      this.toastr.warning("Please Enter Comments");
      this.renderer.selectRootElement('#floatingTextarea').focus();
      return
    }

    this.SpinnerService.show('spinner');
    this.cmd = this.RefresModelComments + ' ' + this.Comments;
    let MMID: any = 0
    if (this.Btn_Text == 'Submit') {

      MMID = this.UniqueId
      this.Origin = 2

      this.SpinnerService.show('spinner');
      debugger;
      const data = await this.adminservice.SendShouldCostRequest(this.selectedFiles, this.userId, this.cmd, this.FolderLink, MMID, this.SCReportId, this.Origin).toPromise();

      if (data == true) {
        this.toastr.success("Should Cost Request Sent successfully");
        this.SpinnerService.hide('spinner');
        flag = true;

      }
      else {
        this.toastr.error("Should Cost Request not Sent");
        this.SpinnerService.hide('spinner');

      }

      console.log(this.FolderLink);

      if (data == true) {
        const da = await this.adminservice.SendMail(this.userId, this.cmd, this.FolderLink, 'DTC').toPromise();
        if (da) {
          this.toastr.success("Mail Sent successfully");
          flag = true;
        }
        else {
          this.toastr.error("Mail not Sent");
        }
      }

      this.clear();
      this.SpinnerService.hide('spinner');
    }
    else {
      this.SpinnerService.show('spinner');
      this.updateRequest = [];
      console.log(this.updateRequest)
      const data2 = await this.searchservice.UpdateShouldCostRequest(this.selectedFiles, this.userId, this.cmd, this.FolderLink, this.RequestId, this.Status).toPromise();
      if (data2) {
        this.toastr.success("Request Status Sent successfully");
        flag = true;
      }
      else {
        this.toastr.error("Request Can not Sent");
      }

      this.SpinnerService.hide('spinner');

      if (data2) {

        const da = await this.adminservice.ReSubmittedSendEmail(this.userId, this.cmd, this.FolderLink, this.RequestId).toPromise();

        if (da) {
          this.toastr.success("Mail Sent successfully");
          flag = true;
        }
        else {
          this.toastr.error("Mail not Sent");
        }
      }

      this.clear();
      this.SpinnerService.hide('spinner');


    }

    if (flag) {
      this.fixsubheader = true;
      this.shouldcostreport = true;
      this.shouldcostrequets = true;
      this.showthankyou = false;

      window.scrollTo({
        top: 0,
        behavior: 'smooth' // For smooth scrolling animation
      });

    }
    else {
      this.fixsubheader = true;
      this.shouldcostreport = true;
      this.shouldcostrequets = false;
      this.showthankyou = true;
    }

  }


  clear() {
    this.selectedFiles = [];
    this.Comments = '';
    this.FolderLink = '';
    this.myInputFile.nativeElement.value = "";
  }

  downloadInputRequestForm() {
    this.toastr.success("Request Form donwloadling start");
    var filename = "Should_Cost_Request_Form.xlsm";
    this.adminservice.DownloadInputRequestForm(filename).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    });

  }


  confirmUpload() {
    this.showConfirmationPopup = false;
    this.upload();
  }

  cancelUpload() {
    this.showConfirmationPopup = false;
  }

  showPopup() {
    this.showConfirmationPopup = true;
  }


  //  ----------------- should cost request send  end ---------  


  Step1() {

    this.router.navigate(['/home/designtocost']);
  }

}



