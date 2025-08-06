import { DatePipe, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import { environment } from 'src/environments/environments';

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
  ProjectData: any;

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

    debugger;

    this.router.events.subscribe((event) => {
      window.scrollTo(0, 0)
    });

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    var uname = String(localStorage.getItem("userName"));
    if (environment.IsMaintenance && uname.toUpperCase() != environment.IsMaintenance_userName.toUpperCase()) {
      this.router.navigate(['/maintenance']);
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

  ProjectName: any;
  Vavedetails: any;
  IsVavedetails = true;
  totalcost: number = 0;
  totalvavecost: number = 0;

  async GetReportData() {
    try {

      debugger;
      this.SpinnerService.show('spinner');
      const data = await this.reportService.GetSourcingManagerReportHistory(this.CSHeaderId, this.param_SCReportId).toPromise();
      //const data = await this.reportService.GetDTCRequestReport(this.CSHeaderId, this.param_SCReportId).toPromise();

      this.ProjectData = data.ProjectData;
      this.ProductDetail = data.ProductDetail;
      this.MaterailGrade = data.MaterailGrade;
      this.NonManufacturingCost = data.NonManufacturingCost;
      this.TierData = data.TierData;
      this.Tier2Data = data.TierDataT2;
      this.hh = data.ImagePath;
      this.Vavedetails = data.Vavedetails;

      if (this.Vavedetails.length > 0) {
        this.IsVavedetails = false
      }

      this.totalcost = this.TierData[this.TierData.length - 1].smUSDValue

      this.onvaveChange();
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


  onvaveChange() {
    this.totalvavecost = 0;
    for (let i = 0; i < this.Vavedetails.length; i++) {
      this.totalvavecost = this.totalvavecost + Number(this.Vavedetails[i].PSavings)
      console.log("this.totalvavecost", this.totalvavecost)
    }
    this.totalvavecost = Math.round((this.totalcost - this.totalvavecost + Number.EPSILON) * 100) / 100
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
  Tariff_Per: any

  GetSGA_InPer() {
    debugger;
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

      if (this.TierData[i].Particular.toLowerCase().includes('tariff')) {
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

        if (this.Tier2Data[i].Particular.toLowerCase().includes('tariff')) {
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


  newPDF() {
    debugger;

    this.CurruntDate = this.datePipe.transform(this.ProjectData[0].CreatedOn, 'MMM dd yyyy - HH:mm:ss');
    this.DebriefDateFormated = this.datePipe.transform(this.ProjectData[0].DebriefDate, 'MMM dd yyyy');


    let totalPages;
    if (!this.IsVavedetails) {
      totalPages = 3;
    }
    else {
      totalPages = 2;
    }

    var doc = new jsPDF('p', 'mm', 'a4');

    var fileWidth = 210;
    //doc.addPage();

   // var pagecount = doc.getNumberOfPages();

    // for (let i = 1; i <= totalPages; i++) {
    //doc.addPage();// page 1
    //doc.setPage();
    // var currentPage = doc.getCurrentPageInfo().pageNumber;
    /// header
    const headerlogo1 = '../../../assets/welcome/Model Mart_Final Logo_130325.png';
    doc.addImage(headerlogo1, 4, 3, 34, 20);
    const headerlogo2 = '../../../assets/newCumminslogo.jpg';
    doc.addImage(headerlogo2, 185, 2, 24, 22);

    //if (i == 1) {
    doc.setFontSize(20);
    doc.text('Updated Should Cost Model Report: ', fileWidth / 2, 70, { align: 'center' });

    doc.setFontSize(15);
    var line = 10;
    var splitText = doc.splitTextToSize(this.ProjectData[0].PName, fileWidth)
    for (var j = 0, length = splitText.length; j < length; j++) {
      doc.text(splitText[j], fileWidth / 2, 80 + line, { align: 'center' });
      line = line + 10;
    }

    // this.hh = localStorage.getItem("imagePath")?.toString();
    //'../../../assets/CRANKSHAFT,ENGINE-5714721/ISO.JPG' ;

    if (this.hh == undefined || this.hh == '' || this.hh == null) {
      const partImg = '../../../assets/No-Image.png';
      doc.addImage(partImg, 70, 120, 70, 70);
    }
    else {
      const partImg = this.hh;
      //const partImg = '../../../assets/No-Image.png';
      doc.addImage(partImg, 70, 120, 70, 70);
    }

    doc.setTextColor("#da291c");
    doc.setFontSize(15);
    doc.text('Cummins Confidential - Not to be shared with supplier or outside the organization!', fileWidth / 2, 240, { align: 'center' });
    // }

    //fotter
    doc.setTextColor("#da291c");
    doc.setFontSize(10);
    doc.text('This report is an electronically generated simulation by Model Mart based on user inputs.', fileWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor("#000000");
    doc.text('Page ' + 1 + ' of ' + totalPages, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 5);

    //  }

     doc.addPage(); // page 2
      /// header
    const headerlogo3 = '../../../assets/welcome/Model Mart_Final Logo_130325.png';
    doc.addImage(headerlogo3, 4, 3, 34, 20);
    const headerlogo4 = '../../../assets/newCumminslogo.jpg';
    doc.addImage(headerlogo4, 185, 2, 24, 22);

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
      [this.ProductDetail[0].SGA_T1, this.SGA_per, this.ProductDetail[0].Profit_T1, this.Profit_per, this.ProductDetail[0].Packaging_T1, this.Packaging_per, this.ProductDetail[0].Freight_T1, this.FreightLogistics_per, 0, this.Tariff_Per]
    ];

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
        [this.ProductDetail[0].SGA_T2, this.SGA_per_T2, this.ProductDetail[0].Profit_T2, this.Profit_per_T2, this.ProductDetail[0].Packaging_T2, this.Packaging_per_T2, this.ProductDetail[0].Freight_T2, this.FreightLogistics_per_T2, 0, this.Tariff_Per_T2]
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
    const headers = [['Sr. No.', 'Material Grade', 'Current Rate', 'Updated Rate']];

    // Map your data to match the headers
    var MaterailGradedata = [];
    debugger;
    for (var i = 0; i < this.MaterailGrade.length; i++) {
      MaterailGradedata.push([i + 1, this.MaterailGrade[i].materialType, this.MaterailGrade[i].unitMaterialRate, this.MaterailGrade[i].UpdateMaterialRate])
    }

    if (this.MaterailGrade.length <= 0) {
      MaterailGradedata.push(['', "Material grade are not available", '', '']);
    }

    autoTable(doc, {
      head: headers,
      startY: finalY1 + 5,
      body: MaterailGradedata,
      theme: 'grid',
      headStyles: { fontSize: 7, fillColor: [179, 179, 179], textColor: [0, 0, 0] },
      bodyStyles: { fontSize: 7, fontStyle: 'bold', textColor: [0, 0, 0] },
      //html: "#printsectionMaterial",
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
          if (rows[0].raw[2] < rows[0].raw[3]) {
            rows[i].cells[3].styles.fillColor = Greaterthan;
          }
          if (rows[0].raw[2] > rows[0].raw[3]) {
            rows[i].cells[3].styles.fillColor = Lessthan;
          }

          // if (rows[i].cells[3].raw.className.includes('UpdateValueGreaterThan')) {
          //   rows[i].cells[3].styles.fillColor = Greaterthan;
          // }
          // if (rows[i].cells[3].raw.className.includes('UpdateValueLessThan')) {
          //   rows[i].cells[3].styles.fillColor = Lessthan;
          // }
        }
      }

    });

     //fotter
    doc.setTextColor("#da291c");
    doc.setFontSize(10);
    doc.text('This report is an electronically generated simulation by Model Mart based on user inputs.', fileWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor("#000000");
    doc.text('Page ' + 2 + ' of ' + totalPages, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 5);


    let finalY = (doc as any).lastAutoTable.finalY;

    // this.MaterailGrade.length
    if (this.MaterailGrade.length >= 8) {

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
      doc.text('Page ' + 3 + ' of ' + totalPages, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 5);

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

    debugger;
    let finalVave = (doc as any).lastAutoTable.finalY;

    // this.MaterailGrade.length
    if (!this.IsVavedetails) {

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

      const Viewheaders = [['Idea', 'Potential Savings PP ($)']];

      // Map your data to match the headers
      var vavedata = [];

      //const vavetextvalues = document.getElementsByClassName("vavePercentText") as any;

      for (var i = 0; i < this.Vavedetails.length; i++) {
        vavedata.push([this.Vavedetails[i].Idea, this.Vavedetails[i].PSavings])
      }

      if (this.Vavedetails.length <= 0) {
        vavedata.push(["VAVE Ideas not selected", '']);
      }
      ////  Vave Greade
      autoTable(doc, {
        head: Viewheaders,
        body: vavedata,
        startY: 30 + 7,
        theme: 'grid',
        headStyles: { fontSize: 7, fillColor: [179, 179, 179], textColor: [0, 0, 0] },
        bodyStyles: { fontSize: 7, fontStyle: 'bold', textColor: [0, 0, 0] },
        //html: "#printsectionVave",
        columnStyles: {
          // 0: { cellWidth: 20 },
          0: { cellWidth: 100 },
          1: { cellWidth: 40 }
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
    }

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

