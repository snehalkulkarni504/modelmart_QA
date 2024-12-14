import { DatePipe, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import { SearchService } from 'src/app/SharedServices/search.service';

@Component({
  selector: 'app-should-cost-user-history',
  templateUrl: './should-cost-user-history.component.html',
  styleUrls: ['./should-cost-user-history.component.css']
})
export class ShouldCostUserHistoryComponent {

  varr: any;
  DebriefDateFormated: any;
  ForexRegion: any;

  constructor(private route: ActivatedRoute,
    public searchservice: SearchService,
    private reportService: ReportServiceService,
    public router: Router,
    private datePipe: DatePipe, private location: Location, private SpinnerService: NgxSpinnerService, public toastr: ToastrService) {
    this.route.queryParams.subscribe(params => {
      this.param_CSHeaderId = params['param_CSHeaderId'];
      this.param_SCReportId = params['param_SCReportId'];
    });
  }

  param_CSHeaderId: any;
  param_userId: any;
  param_IsCastingSheet: any;
  param_SCReportId: any;
  ProjectData:any;

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
  //ProjectName: any;
  userFullName: any;

  T2NotPresent = true;

  ngOnInit(): void {

    this.router.events.subscribe((event) => {
      window.scrollTo(0, 0)
    });

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

   
    this.CSHeaderId = this.param_CSHeaderId;
    this.userId = this.param_userId;
    this.param_SCReportId = this.param_SCReportId;

    this.GetReportData();

    //this.CurruntDate  = this.ProjectData[0].CreatedOn ;

    setTimeout(() => {
      const myElement = document.getElementById("printsection");
      myElement?.classList.add("SetFontSizeONPrint");
    }, 2000);
  }

  async GetReportData() {
    try {

      debugger;
      this.SpinnerService.show('spinner');
      const data = await this.reportService.GetSourcingManagerReportHistory(this.CSHeaderId,this.param_SCReportId ).toPromise();

      this.ProjectData = data.ProjectData;
      this.ProductDetail = data.ProductDetail;
      this.MaterailGrade = data.MaterailGrade;
      this.NonManufacturingCost = data.NonManufacturingCost;
      this.TierData = data.TierData;
      this.Tier2Data = data.TierDataT2;

      this.ContributionInTotal(data.TierData);

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
      this.Manu_TotalInUSD += data[i].USDValue;
      this.Manu_TotalInLocal += data[i].localValue;

      this.Manu_TotalInUSDSM += data[i].smUSDValue;
      this.Manu_TotalInLocalSM += data[i].smlocalValue;
    }


    this.TotalInUSD = data[data.length - 1].USDValue;
    this.TotalInLocal = data[data.length - 1].localValue;

    this.TotalInUSDSM = data[data.length - 1].smUSDValue;
    this.TotalInLocalSM = data[data.length - 1].smlocalValue;

    for (let i = 0; i < data.length; i++) {
      this.TierData[i].totalCostPer = data[i].USDValue / this.TotalInUSD * 100;
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
      if (this.TierData[i].Particular.toLowerCase().includes('sg&a')) {
        if (this.TierData[i].percent_updated == 0) {
          this.SGA_per = this.ProductDetail[0].SGA_T1;
        }
        else {
          this.SGA_per = this.TierData[i].percent_updated;
        }
      }

      if (this.TierData[i].Particular.toLowerCase().includes('profit')) {
        if (this.TierData[i].percent_updated == 0) {
          this.Profit_per = this.ProductDetail[0].Profit_T1;
        }
        else {
          this.Profit_per = this.TierData[i].percent_updated;
        }
      }

      if (this.TierData[i].Particular.toLowerCase().includes('packaging')) {
        if (this.TierData[i].percent_updated == 0) {
          this.Packaging_per = this.ProductDetail[0].Packaging_T1;
        }
        else {
          this.Packaging_per = this.TierData[i].percent_updated;
        }
      }

      if (this.TierData[i].Particular.toLowerCase().includes('logistics')) {
        if (this.TierData[i].percent_updated == 0) {
          this.FreightLogistics_per = this.ProductDetail[0].Freight_T1;
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
        if (this.Tier2Data[i].Particular.toLowerCase().includes('sg&a')) {
          if (this.Tier2Data[i].percent_updated == 0) {
            this.SGA_per_T2 = this.ProductDetail[0].SGA_T2;
          }
          else {
            this.SGA_per_T2 = this.Tier2Data[i].percent_updated;
          }
        }

        if (this.Tier2Data[i].Particular.toLowerCase().includes('profit')) {
          if (this.Tier2Data[i].percent_updated == 0) {
            this.Profit_per_T2 = this.ProductDetail[0].Profit_T2;
          }
          else {
            this.Profit_per_T2 = this.Tier2Data[i].percent_updated;
          }
        }

        if (this.Tier2Data[i].Particular.toLowerCase().includes('packaging')) {
          if (this.Tier2Data[i].percent_updated == 0) {
            this.Packaging_per_T2 = this.ProductDetail[0].Packaging_T2;
          }
          else {
            this.Packaging_per_T2 = this.Tier2Data[i].percent_updated;
          }
        }

        if (this.Tier2Data[i].Particular.toLowerCase().includes('logistics')) {
          if (this.Tier2Data[i].percent_updated == 0) {
            this.FreightLogistics_per_T2 = this.ProductDetail[0].Freight_T2;
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
    debugger;

    this.CurruntDate = this.datePipe.transform(this.ProjectData[0].CreatedOn, 'MMM dd yyyy - HH:mm:ss');
    this.DebriefDateFormated = this.datePipe.transform(this.ProjectData[0].DebriefDate, 'MMM dd yyyy');


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
        var splitText = doc.splitTextToSize(this.ProjectData[0].PName, fileWidth)
        for (var j = 0, length = splitText.length; j < length; j++) {
          doc.text(splitText[j], fileWidth / 2, 80 + line, { align: 'center' });
          line = line + 10;
        }

        this.hh = localStorage.getItem("imagePath")?.toString();
        //'../../../assets/CRANKSHAFT,ENGINE-5714721/ISO.JPG' ;

        if (this.hh == undefined || this.hh == '') {
          const partImg = '../../../assets/No-Image.png';
          doc.addImage(partImg, 70, 120, 70, 70);
        }
        else {
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
    let Projectcolumns = [['Updated Cost Model Report for ' + this.ProjectData[0].PName]];
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
        ['Model Edited By : ' + this.ProjectData[0].FullName],
        ['Model Edit Date : ' + this.CurruntDate],
        ['Model Created Date : ' + this.DebriefDateFormated]
      ],
      [
        ['Part Name : ' + this.ProductDetail[0].PartName],
        ['Part Number : ' + this.ProductDetail[0].PartNumber],
        ['Location : ' + this.ProductDetail[0].MfgRegion]
      ],
      [
        ['Annual Volume : ' + this.ProductDetail[0].AnnualVolume],
        ['Old Forex : ' + this.ProductDetail[0].Forex],
        ['Current Year Forex : ' + this.ProjectData[0].CurrentYearForex]
      ],
      [
        ['Batch Size : ' + this.ProductDetail[0].BatchSize],
        ['Supplier Quote / Invoice Price : ' + this.ProductDetail[0].Supplier],
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
      [this.ProductDetail[0].SGA_T1, this.SGA_per, this.ProductDetail[0].Profit_T1, this.Profit_per, this.ProductDetail[0].Packaging_T1, this.Packaging_per, this.ProductDetail[0].Freight_T1, this.FreightLogistics_per]
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
        [this.ProductDetail[0].SGA_T2, this.SGA_per_T2, this.ProductDetail[0].Profit_T2, this.Profit_per_T2, this.ProductDetail[0].Packaging_T2, this.Packaging_per_T2, this.ProductDetail[0].Freight_T2, this.FreightLogistics_per_T2]
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
            didParseCell: function (data) {
              var rows = data.table.body;
              if (data.row.index == 6 || data.row.index === rows.length - 1) {
                data.cell.styles.fillColor = [217, 217, 217];
              }
              data.table.head[0].cells[0].styles.fillColor = [217, 217, 217];
            },
            willDrawCell: function (data: any) {
              var rows = data.table.body;
              if (data.cell.section === 'body') {
                for (let i = 0; i < rows.length; i++) {
                  if (rows[i].cells[0].raw.className.includes('UpdateValueGreaterThan')) {
                    rows[i].cells[0].styles.fillColor = Greaterthan;
                  }
                  if (rows[i].cells[0].raw.className.includes('UpdateValueLessThan')) {
                    rows[i].cells[0].styles.fillColor = Lessthan;
                  }

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
            },

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


    var filename = this.ProjectData[0].PName + " .pdf";
    doc.save(filename);
  }


  hh: any;

  async openPDF() {
    this.newPDF();
    return;
  }


  backToPreviousPage() {
    this.location.back();
  }




}

