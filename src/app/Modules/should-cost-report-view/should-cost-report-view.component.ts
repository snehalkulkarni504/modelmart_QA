import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/SharedServices/search.service';
import "jspdf-autotable";
import html2canvas from 'html2canvas';
import { DatePipe, Location } from '@angular/common';
import jspdf, { jsPDF } from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import autoTable from 'jspdf-autotable'
import { color } from 'html2canvas/dist/types/css/types/color';
import { opacity } from 'html2canvas/dist/types/css/property-descriptors/opacity';


@Component({
  selector: 'app-should-cost-report-view',
  templateUrl: './should-cost-report-view.component.html',
  styleUrls: ['./should-cost-report-view.component.css']
})
export class ShouldCostReportViewComponent {
  varr: any;
  DebriefDateFormated: any;
  ForexRegion: any;

  constructor(private route: ActivatedRoute,
    public searchservice: SearchService,
    public router: Router,
    private datePipe: DatePipe, private location: Location, private SpinnerService: NgxSpinnerService, public toastr: ToastrService) {
    this.route.params.subscribe(param => {
      this.IsUserLog = param['data']
    })
  }

  ProductDetail: any;
  MaterailGrade: any;
  MaterailGradeT2: any;
  NonManufacturingCost: any;
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
  IsCastingSheet: any;
  SCReportId: any;
  IsUserLog: any;
  ProjectName: any;
  userFullName: any;
  uniqueId:any;
  T2NotPresent = true;
  editModal: boolean = false;
    editRowIndex: any;
    textsearch: string = '';
    engineDis: any;
    Cartcategory:any;
  cartName:any;
  CreateNewCart:boolean=false;
  AddToCart:boolean=true;
  ShowHideNewCartButton:boolean=true;
  cartNameList:any={};
  showError2: boolean = false;
  showError1: boolean = false;
  display = "none";
  header: string = '';
  txt_btn: string = '';
  statusValue: boolean = false;
  ngOnInit(): void {

    this.router.events.subscribe((event) => {
      window.scrollTo(0, 0)
    });

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.IsCastingSheet = localStorage.getItem('IsCastingSheet');

    this.userId = localStorage.getItem("userId");
    this.ForexRegion = localStorage.getItem("ForexRegion");

    this.UserName = localStorage.getItem("userName");
    this.userFullName = localStorage.getItem("userFullName");

    this.CSHeaderId = localStorage.getItem("ComapredId");
    this.SCReportId = localStorage.getItem("SCReportId");

    //alert(this.SCReportId);

    this.ProjectName = localStorage.getItem("ProjectName");
    this.uniqueId=localStorage.getItem("uniqueId");
    if (this.IsUserLog == 1) {
      this.GetReportData();
    }
    else {
      this.GetReportData_UserLog();
    }

    this.CurruntDate = this.datePipe.transform(new Date(), 'MMM dd yyyy');

    this.DebriefDateFormated = localStorage.getItem("DebriefDateFormated");

    setTimeout(() => {
      const myElement = document.getElementById("printsection");
      myElement?.classList.add("SetFontSizeONPrint");
    }, 2000);
  }

  async GetReportData() {
    try {

      this.SpinnerService.show('spinner');
      const data = await this.searchservice.GetSourcingManagerReport(this.CSHeaderId, this.userId, this.IsCastingSheet).toPromise();

      this.ProductDetail = data.productDetail;
      this.MaterailGrade = data.materailGrade;
      this.NonManufacturingCost = data.nonManufacturingCost;
      this.TierData = data.tierData;
      this.Tier2Data = data.tierDataT2;

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

  async GetReportData_UserLog() {

    try {

      this.SpinnerService.show('spinner');
      const data = await this.searchservice.GetSourcingManagerReport_UserLog(this.CSHeaderId, this.SCReportId, this.IsCastingSheet).toPromise();

      this.ProductDetail = data.productDetail;
      this.MaterailGrade = data.materailGrade;
      this.MaterailGradeT2 = data.materailGradeT2;
      this.TierData = data.tierData;
      this.Tier2Data = data.tierDataT2;

      this.ContributionInTotal(data.tierData);

      setTimeout(() => {
        this.GetSGA_InPer();
      }, 500);

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
    }
  }


  SGA_per_T2: any;
  Profit_per_T2: any;
  Packaging_per_T2: any;
  FreightLogistics_per_T2: any;

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


  newPDF() {

    let totalPages = 2;
    var doc = new jsPDF('p', 'mm', 'a4');

    var fileWidth = 210;
    doc.addPage();

    var pagecount = doc.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      // var currentPage = doc.getCurrentPageInfo().pageNumber;
      /// header
      const headerlogo1 = '../../../assets/welcome/modelmartsliderlogo.jpg';
      doc.addImage(headerlogo1, 2, 0, 38, 25);
      const headerlogo2 = '../../../assets/newCumminslogo.jpg';
      doc.addImage(headerlogo2, 185, 2, 24, 22);

      if (i == 1) {
        doc.setFontSize(20);
        doc.text('Updated Should Cost Model Report: ', fileWidth / 2, 70, { align: 'center' });

        doc.setFontSize(15);
        var line = 10;
        var splitText = doc.splitTextToSize(this.ProjectName, fileWidth)
        for (var j = 0, length = splitText.length; j < length; j++) {
          doc.text(splitText[j], fileWidth / 2, 80 + line, { align: 'center' });
          line = line + 10;
        }
        debugger;
        this.hh = localStorage.getItem("imagePath")?.toString();
        //'../../../assets/CRANKSHAFT,ENGINE-5714721/ISO.JPG' ;

        if (this.hh == undefined || this.hh == '') {
          const partImg = '../../../assets/No-Image.png';
          doc.addImage(partImg, 70, 120, 70, 70);
        }
        else {
          //const partImgNew = '.../../../assets/2021000001/ISO.jpg';
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
    let Projectcolumns = [['Updated Cost Model Report for ' + this.ProjectName]];
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

    const projectRows = [
      [
        ['Model Edited By : ' + this.userFullName],
        ['Model Edit Date : ' + this.CurruntDate],
        ['Model Created Date : ' + this.DebriefDateFormated]
      ],
      [
        ['Part Name : ' + this.ProductDetail[0].partName],
        ['Part Number : ' + this.ProductDetail[0].partNumber],
        ['Location : ' + this.ProductDetail[0].mfgRegion]
      ],
      [
        ['Annual Volume : ' + this.ProductDetail[0].annualVolume],
        ['Old Forex : ' + this.ProductDetail[0].forex],
        ['Current Year Forex : ' + this.ProductDetail[0].currentYearForex]
      ],
      [
        ['Batch Size : ' + this.ProductDetail[0].batchSize],
        ['Supplier Quote / Invoice Price : ' + this.ProductDetail[0].supplier],
      ]
    ];

    autoTable(doc, {
      head: [],
      body: projectRows,
      startY: finalYDetails + 1,
      theme: 'grid',
      headStyles: { fontSize: 7, fillColor: [179, 179, 179], textColor: [0, 0, 0], },
      bodyStyles: { fontSize: 7, fontStyle: 'bold', textColor: [0, 0, 0] },
      margin: 10,
      columnStyles: {
        0: { cellWidth: 78 },
        1: { cellWidth: 60 },
        2: { cellWidth: 52 },
      },
    });


    let finalY0 = (doc as any).lastAutoTable.finalY;
    ////  Tier1 SGA  Detail
    let Greaterthan = [246, 203, 203];
    let Lessthan = [193, 232, 194]

    const Tier1rows = [
      [this.ProductDetail[0].sgA_T1, this.SGA_per, this.ProductDetail[0].profit_T1, this.Profit_per, this.ProductDetail[0].packaging_T1, this.Packaging_per, this.ProductDetail[0].freight_T1, this.FreightLogistics_per]
    ];

    autoTable(doc, {
      head: [
        [{ content: 'Finish Part', colSpan: 8, styles: { halign: 'left', fillColor: [217, 217, 217] } }],
        ['SG & A (%)', 'SG & A Updated (%)', 'Profit (%)', 'Profit Updated (%)', 'Packaging (%)', 'Packaging Updated (%)', 'Freight / Logistics (%)', 'Freight / Logistics Update (%)'],
      ],
      body: Tier1rows,
      startY: finalY0 + 5,
      theme: 'grid',
      headStyles: { fontSize: 7, fillColor: [179, 179, 179], textColor: [0, 0, 0], },
      bodyStyles: { fontSize: 7, fontStyle: 'bold', textColor: [0, 0, 0] },
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

      }
    });

    ////  Tier2 SGA  Detail is Present
    if (!this.T2NotPresent) {
      let finalY0 = (doc as any).lastAutoTable.finalY;

      const Tier2rows = [
        [this.ProductDetail[0].sgA_T2, this.SGA_per_T2, this.ProductDetail[0].profit_T2, this.Profit_per_T2, this.ProductDetail[0].packaging_T2, this.Packaging_per_T2, this.ProductDetail[0].freight_T2, this.FreightLogistics_per_T2]
      ];

      autoTable(doc, {
        head: [
          [{ content: 'Tier#2 Cost or Rough Part Cost or Casting Cost or Forging Cost', colSpan: 8, styles: { halign: 'left', fillColor: [217, 217, 217] } }],
          ['SG & A (%)', 'SG & A Updated (%)', 'Profit (%)', 'Profit Updated (%)', 'Packaging (%)', 'Packaging Updated (%)', 'Freight / Logistics (%)', 'Freight / Logistics Update (%)'],
        ],
        body: Tier2rows,
        startY: finalY0 + 2,
        theme: 'grid',
        headStyles: { fontSize: 7, fillColor: [179, 179, 179], textColor: [0, 0, 0], },
        bodyStyles: { fontSize: 7, fontStyle: 'bold', textColor: [0, 0, 0] },
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

        }
      });
    }

    let finalY1 = (doc as any).lastAutoTable.finalY;


    ////  Material Greade
    autoTable(doc, {
      startY: finalY1 + 5,
      theme: 'grid',
      headStyles: { fontSize: 7, fillColor: [179, 179, 179], textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 7, fontStyle: 'bold', textColor: [0, 0, 0] },
      html: "#printsectionMaterial",
      columnStyles: {
        0: { cellWidth: 14 },
        1: { cellWidth: 110 },
        2: { cellWidth: 33 },
        3: { cellWidth: 33 },
      },
      margin: 10,
      willDrawCell: function (data: any) {
        var rows = data.table.body;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].cells[3].raw.className.includes('UpdateValueGreaterThan')) {
            rows[i].cells[3].styles.fillColor = Greaterthan;
          }
          if (rows[i].cells[3].raw.className.includes('UpdateValueLessThan')) {
            rows[i].cells[3].styles.fillColor = Lessthan;
          }
        }
      }

    });

    let finalY = (doc as any).lastAutoTable.finalY;

    // this.MaterailGrade.length
    if (this.MaterailGrade.length >= 8) {

      doc.addPage();
      /// header
      const headerlogo1 = '../../../assets/welcome/modelmartsliderlogo.jpg';
      doc.addImage(headerlogo1, 2, 0, 38, 25);
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

              if (data.row.index == 6 || data.row.index === rows.length - 1) {
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
              if (data.row.index == 6 || data.row.index === rows.length - 1) {
                data.cell.styles.fillColor = [217, 217, 217];
              }
              data.table.head[0].cells[0].styles.fillColor = [217, 217, 217];
              if (data.cell.section === 'body') {
                debugger;
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

    let finalYMark = (doc as any).lastAutoTable.finalY;

    doc.setFontSize(6);
    doc.setFillColor(246, 203, 203);
    doc.rect(5, finalYMark - 3, 5, 5, 'F');
    doc.text('Greater than Existing Cost', 11, finalYMark);

    doc.setFillColor(193, 232, 194);
    doc.rect(40, finalYMark - 3, 5, 5, 'F');
    doc.text('Less than Existing Cost', 46, finalYMark);

    doc.setTextColor("#C0C0C0");
    doc.setFontSize(17);
    doc.setGState(doc.GState({ opacity: 0.5 }));
    doc.text('User simulation, not a Cost Model', 132, finalY + 90, { angle: 46 });


    var filename = this.ProjectName + " .pdf";
    doc.save(filename);
  }


  hh: any;

  async openPDF() {

    const data = await this.searchservice.downloadUpdatedShouldeCost(this.CSHeaderId, this.userId).toPromise();

    this.newPDF();
    return;
  }


  backToPreviousPage() {
    this.location.back();
  }
  openModal() {
    //this.getCartName();
    this.searchservice.getCartName(this.userId).subscribe((_result: any) => {
      this.cartNameList = _result;

    
    if(this.cartNameList.length<=0)
    {
      this.onCartCreate();
    }

    this.display = "block";
    if (this.CreateNewCart) {
      this.showError2 = false;
      this.header = 'Create Cart and Save To Add Item';
      this.txt_btn = 'Create New Cart';
      this.engineDis = ""; 
      this.statusValue ;
    } else {
      this.showError2 = false;
      this.header = 'Add To Cart';
      this.txt_btn = 'Save';
      this.engineDis = "";
      this.statusValue;
    }
  });
  };

  onCloseHandled() {

    this.CreateNewCart=false;
    this.AddToCart=true;
    this.ShowHideNewCartButton=true;
    this.showError1=false;
    this.display = "none";
 
     
   }

  getCartName() {
    this.searchservice.getCartName(this.userId).subscribe((_result: any) => {
      this.cartNameList = _result;

    });
  }

  onCartCreate(){
    this.AddToCart=false;
    this.CreateNewCart=true;
    this.ShowHideNewCartButton=false;
    this.showError1=false;
    this.Cartcategory=undefined;

  }

  async onSaveButton() {

    if(!this.Cartcategory)
    {
      this.showError1=true;
      return;
    }

    if(this.CreateNewCart)
    {
      const matches = this.cartNameList.filter((x:any) => x.cartName.includes(this.Cartcategory)); 
      if(matches.length>0)
      {
        this.showError2=true;
        return;
      }
    }
  this.searchservice.SaveToCart(this.userId, this.uniqueId,this.Cartcategory,"Update")
    .subscribe({
      next: (_res) => {
        if(_res==1)
        {
        //this.getEngineAll();
        this.toastr.success("Item Inserted Successfully.");
        this.AddToCart=true;
        this.CreateNewCart=false;
        this.ShowHideNewCartButton=true;
        this.showError1=false;
        this.showError2=false;
        this.onCloseHandled();
        this.Cartcategory=undefined;
        this.getCartName();
        }
        if(_res==2)
        {
          this.toastr.warning("Item Already exist in the cart Please use different cart");
          this.showError1=false;
          this.showError2=false;
          this.Cartcategory=undefined;
        }
      },
      error: (error) => {
        console.error('Inserting API call error:', error);
        this.AddToCart=true;
        this.CreateNewCart=false;
        this.ShowHideNewCartButton=true;
        this.showError1=false;
        this.showError2=false;
        this.Cartcategory=undefined;
      },
    });
  }




}


