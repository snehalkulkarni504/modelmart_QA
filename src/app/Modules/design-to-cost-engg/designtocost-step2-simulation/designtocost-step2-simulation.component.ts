import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { SearchService } from 'src/app/SharedServices/search.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup } from '@angular/forms';
import { SaveMatetialCost, SaveMatetialCostDetails, SaveMatetialCostHeader, SaveProcessDetails, updatemodeldata } from 'src/app/Model/save-matetial-cost';
import { environment } from 'src/environments/environments';
import { ReportServiceService } from 'src/app/SharedServices/report-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-designtocost-step2-simulation',
  // standalone: true,
  // imports: [],
  templateUrl: './designtocost-step2-simulation.component.html',
  styleUrl: './designtocost-step2-simulation.component.css'
})
export class DesigntocostStep2SimulationComponent implements OnInit {


  constructor(public searchservice: SearchService, public router: Router, public toastr: ToastrService, private location: Location,
    private SpinnerService: NgxSpinnerService, private reportService: ReportServiceService) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };
  }

  ShouldCostReoprt!: FormGroup;
  TierCostReportList: any;
  TierCostReportNonList: any;
  IsHiddenDiv: boolean | undefined;
  TierCostDetails: any;

  Tier2CostReportList: any;
  Tier2CostReportNonList: any;

  TotalInUSD: number = 0; TotalInUSDT2: number = 0;
  TotalInLocal: number = 0; TotalInLocalT2: number = 0;
  TotalInPer: number = 0; TotalInPerT2: number = 0;

  Manu_TotalInUSD: number = 0; Manu_TotalInUSDT2: number = 0;
  Manu_TotalInLocal: number = 0; Manu_TotalInLocalT2: number = 0;
  Manu_TotalInPer: number = 0; Manu_TotalInPerT2: number = 0;

  Non_TotalInUSD: number = 0; Non_TotalInUSDT2: number = 0;
  Non_TotalInLocal: number = 0; Non_TotalInLocalT2: number = 0
  Non_TotalInPer: number = 0; Non_TotalInPerT2: number = 0

  updatePercentValue: number = 0;
  display = "none";
  display_Material = "none";
  MaterialGrade: any = [];
  CSHeaderId: any;
  display_Tariff = "none";

  //MaterialGridUpdated: any = []
  MaterialGridUpdated: SaveMatetialCostDetails[] = [];
  MatetialTierUpdate: SaveMatetialCostHeader[] = [];
  SaveProcessDetails: SaveProcessDetails[] = [];
  saveMatetialCost: SaveMatetialCost[] = [];
  updatemodeldata: updatemodeldata[] = [];

  ForexDetails: any;
  AluminiumCastingGrade: any;

  obj = {
    DirectMaterialCost_USD: "", BoughtoutFinishCost_USD: "", RoughPartCost_USD: "", DirectLaborCost_USD: "",
    ProcessOverheadCost_USD: "", SurfaceTreatmentsCost_USD: "", Version: "", Tier2Cost: "", RoughPartCost: "", CastingCost: "", ForgingCost: "",
    SGA_USD: "", Profit_USD: "",
    Packaging_USD: "", FreightLogistics_USD: "", DirectedBuyCost_USD: "", HandlingCharges_USD: "", ICC_USD: "", Rejection_USD: "", TotalCost: ""
  };

  PartName: any; PartNumber: any; ProjectName: any; DebriefDate: any
  BusinessUnit: any; ProjectType: any; EngineDisplacement: any; TargetQuote: any; AnnualVolume: any; Supplier: any;

  IsHiddenT1: boolean = true;
  IsHiddenT2: boolean = true;
  IsHiddenT1_DirectCost: boolean = true;
  IsHiddenT2_DirectCost: boolean = true;


  updateMaterialRate: any;
  userId: any;
  IsExternalCostmodel: boolean = false;
  ModelTypes_Id: any;
  IsCESmodel: boolean = false;
  ModelwiseNote: any;
  Istier_1_CostReportBreakdown = true;
  Istier_2_CostReportBreakdown = true;
  Projecttitle: any;

  TotalandTeriffInLocalT1: any;
  TotalandTeriffInLocalT2: any;
  TotalTeriffPercentT1: any;
  TotalTeriffPercentT2: any;

  display_frequentlyUsedMaterials = "none";
  textsearch: string = '';
  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };

  FrequentlyUsedMaterialsData: any;
  Frequentlyusedmaterialgrade!: FormGroup;
  YellowModel_MarketBenchmark: boolean = true;
  btnsaveandgotonext_value = 'Save & Go to Next Step';

  ngOnInit(): void {

    this.router.events.subscribe((event) => {
      window.scrollTo(0, 0)
    });

    if (localStorage.getItem("userName") == null) {
      this.router.navigate(['/welcome']);
      return;
    }

    this.userId = localStorage.getItem("userId");

    this.CSHeaderId = localStorage.getItem("DTCComapredId"); //--- CSHeaderId
    this.GetTierCostData();

    this.Projecttitle = localStorage.getItem("DTCProjecttitle");

    this.Frequentlyusedmaterialgrade = new FormGroup({
      textsearch: new FormControl(),
    });

  }



  async GetTierCostData() {
    try {

      this.AluminiumCastingGrade = [];

      this.SpinnerService.show('spinner');

      const myElement1 = document.getElementById("hideTier2Box");
      const myElement2 = document.getElementById("Tier1Box");
      debugger;;

      const data = await this.searchservice.GetTierCostData(this.CSHeaderId).toPromise();
      this.ForexDetails = data.forexDetails[0];
      this.TierCostDetails = data.tierCostDetails[0];
      this.TierCostReportList = data.tier_1_CostReportBreakdown;
      this.TierCostReportNonList = data.tier_1_CostReportBreakdownNon;
      this.AluminiumCastingGrade = data.aluminiumCastingGrade;
      console.log(this.AluminiumCastingGrade);

      this.PartName = this.TierCostDetails.partName;
      this.PartNumber = this.TierCostDetails.partNumber;
      this.ProjectName = this.TierCostDetails.projectName;
      this.DebriefDate = this.TierCostDetails.debriefDateFormated;
      this.ModelTypes_Id = this.TierCostDetails.modelTypes_Id;


      if (this.ModelTypes_Id == 2 || this.ModelTypes_Id == 3 || this.ModelTypes_Id == 5) {
        if (localStorage.getItem("Costtype") == environment.CostType_WeightBased || localStorage.getItem("Costtype") == environment.CostType_RMBased) {
          this.IsExternalCostmodel = false;
        }
        else {
          this.IsExternalCostmodel = true;
        }
        this.IsCESmodel = true;
        this.ModelwiseNote = "This is a yellow model. Some features of this cost model might not be available for update."
      }
      else {
        this.IsExternalCostmodel = false;
        this.IsCESmodel = false;
        this.ModelwiseNote = "";
      }

      debugger;
      if (localStorage.getItem("YellowModel_MarketBenchmark") == "true") {
        this.YellowModel_MarketBenchmark = true;
        this.IsCESmodel = true;
        this.ModelwiseNote = "This is Market Benchmark cost model, Material, Process and other cost details can not be updated on this model."
        this.btnsaveandgotonext_value = 'Go to Next Step';
      }
      else {
        this.YellowModel_MarketBenchmark = false;
        this.btnsaveandgotonext_value = 'Save & Go to Next Step';
      }



      this.findsum(data.tier_1_CostReportBreakdown, data.tier_1_CostReportBreakdownNon);

      debugger;;
      if (data.tier_2_CostReportBreakdown.length > 0) {
        let tt = 0;
        for (let i = 0; i < data.tier_2_CostReportBreakdown.length; i++) {
          tt = tt + parseFloat(data.tier_2_CostReportBreakdown[i].usdValue);
        }

        if (tt > 0) {
          this.Tier2CostReportList = data.tier_2_CostReportBreakdown;
          this.Tier2CostReportNonList = data.tier_2_CostReportBreakdownNon;
          this.findsumTier2(data.tier_2_CostReportBreakdown, data.tier_2_CostReportBreakdownNon);

          myElement1?.classList.remove("hideTier2Box");
          myElement2?.classList.remove("col-md-8");
          myElement2?.classList.add("col-md-6");
          this.IsHiddenDiv = true;

          this.Istier_1_CostReportBreakdown = true;
          this.Istier_2_CostReportBreakdown = false;

        }
        else {
          myElement1?.classList.add("hideTier2Box");
          myElement2?.classList.add("col-md-8");
          myElement2?.classList.remove("col-md-6");
          this.IsHiddenDiv = false;
          this.Istier_1_CostReportBreakdown = false;
          this.Istier_2_CostReportBreakdown = true;
        }

      }
      else {
        myElement1?.classList.add("hideTier2Box");
        myElement2?.classList.add("col-md-8");
        myElement2?.classList.remove("col-md-6");
        this.IsHiddenDiv = false;
        this.Istier_1_CostReportBreakdown = false;
        this.Istier_2_CostReportBreakdown = true;
      }

      this.SpinnerService.hide('spinner');
    }
    catch (e) {
      this.SpinnerService.hide('spinner');
    }
  }

  findsum(data: any, data2: any) {


    for (let i = 0; i < data.length; i++) {
      this.Manu_TotalInUSD += data[i].usdValue;
      this.Manu_TotalInLocal += data[i].localValue;
    }

    for (let i = 0; i < data2.length; i++) {
      this.Non_TotalInUSD += data2[i].usdValue;
      this.Non_TotalInLocal += data2[i].localValue;
    }

    this.TotalInUSD = this.Manu_TotalInUSD + this.Non_TotalInUSD;
    this.TotalInLocal = this.Manu_TotalInLocal + this.Non_TotalInLocal;
    this.TotalandTeriffInLocalT1 = this.TotalInLocal;

    for (let i = 0; i < data.length; i++) {
      this.TierCostReportList[i].totalCostPer = data[i].usdValue / this.TotalInUSD * 100;
    }

    for (let i = 0; i < this.TierCostReportNonList.length; i++) {
      this.TierCostReportNonList[i].totalCostPer = data2[i].usdValue / this.TotalInUSD * 100;
    }

    const SetValueTarifUpdatedT1 = document.getElementById('TarifUpdatedT1') as any;
    SetValueTarifUpdatedT1.value = 0.00;

  }

  findsumTier2(data: any, data2: any) {

    for (let i = 0; i < data.length; i++) {
      this.Manu_TotalInUSDT2 += data[i].usdValue;
      this.Manu_TotalInLocalT2 += data[i].localValue;
    }

    for (let i = 0; i < data2.length; i++) {
      this.Non_TotalInUSDT2 += data2[i].usdValue;
      this.Non_TotalInLocalT2 += data2[i].localValue;
    }

    this.TotalInUSDT2 = this.Manu_TotalInUSDT2 + this.Non_TotalInUSDT2;
    this.TotalInLocalT2 = this.Manu_TotalInLocalT2 + this.Non_TotalInLocalT2;
    this.TotalandTeriffInLocalT2 = this.TotalInLocalT2;

    for (let i = 0; i < data.length; i++) {
      this.Tier2CostReportList[i].totalCostPer = data[i].usdValue / this.TotalInUSDT2 * 100;
    }

    for (let i = 0; i < this.TierCostReportNonList.length; i++) {
      this.Tier2CostReportNonList[i].totalCostPer = data2[i].usdValue / this.TotalInUSDT2 * 100;
    }

    const SetValueTarifUpdatedT2 = document.getElementById('TarifUpdatedT2') as any;
    SetValueTarifUpdatedT2.value = 0.00;

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

  keyPressDecimal_4decimal(event: any) {
    const reg = /^-?\d*(\.\d{0,4})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
      event.preventDefault();
      return false;
    }
    else {
      return true;
    }
  }


  keyPressInt(e: any) {
    var keyCode = e.which ? e.which : e.keyCode
    var ret = (keyCode >= 48 && keyCode <= 57);
    return ret;
  }


  CalculatePercent(e: any, val: any, no: number) {

    //debugger;;
    let Forex = 0;
    //const updatedTextboxNon = document.getElementById('UpdateCostNon' + e.srcElement.id) as any;
    const updatedTextbox = document.getElementById('UpdateCost' + e.srcElement.id) as any;

    this.updatePercentValue = 0;
    let txtValue = e.srcElement.value;
    if (txtValue == "" || txtValue == 0) {
      if (no == 1) {
        updatedTextbox.value = val.usdValue.toFixed(2);;
      }
      this.findsumPercent();
      return
    }

    // Forex = this.ForexDetails.oldForex / this.ForexDetails.newForex * val.usdValue ( 1 + e.srcElement.value / 100 ) ;
    // txtValue = Forex * e.srcElement.value;

    if (this.ForexDetails != undefined) {
      Forex = this.ForexDetails.oldForex / this.ForexDetails.newForex * val.usdValue(1 + e.srcElement.value / 100);
      txtValue = Forex * e.srcElement.value;
    }

    this.updatePercentValue = txtValue / 100 * val.usdValue;

    let UpdateCost = parseFloat(val.usdValue) + this.updatePercentValue;

    if (no == 1) {
      updatedTextbox.value = UpdateCost.toFixed(2);
    }

    this.findsumPercent();
  }


  CalculatePercentNon(e: any, val: any, no: number, id: any) {


    const updatedTextboxNon = document.getElementById('UpdateCostNon' + id) as any;

    this.updatePercentValue = 0;
    let txtValue = e.srcElement.value;
    if (txtValue == "" || txtValue == 0) {
      if (no == 1) {
        // updatedTextbox.value = val.usdValue;
      }
      else {

        // updatedTextboxNon.value = val.usdValue.toFixed(2);
        updatedTextboxNon.value = (val.perValue / 100 * this.Manu_TotalInLocal).toFixed(2);
      }
      this.findsumPercent();
      return
    }

    // this.updatePercentValue = e.srcElement.value / 100 * val.usdValue;
    this.updatePercentValue = e.srcElement.value / 100 * this.Manu_TotalInLocal;


    //let UpdateCost = parseFloat(val.usdValue) + this.updatePercentValue;
    if (no == 1) {
      //updatedTextbox.value =  this.updatePercentValue.toFixed(2);
    }
    else {
      updatedTextboxNon.value = this.updatePercentValue.toFixed(2);
    }

    this.findsumPercent();
  }

  Manu_TotalInLocal_Per: number = 0;
  Non_TotalInLocal_Per: number = 0;

  findsumPercent() {

    debugger;
    this.Manu_TotalInLocal_Per = 0;
    this.Non_TotalInLocal_Per = 0;

    const unit = document.getElementsByClassName("form-control UpdateText disabled NotNon T1") as any;
    const unitNon = document.getElementsByClassName("form-control UpdateText Notdisabled Non T1") as any;
    const particular_perValue = document.getElementsByClassName("particular_perValue") as any;
    const Enter_PerValue = document.getElementsByClassName("form-control percentText Non T1") as any;
    const NonusdValueT1 = document.getElementsByClassName("text-end NonusdValueT1") as any;

    // if (no == 1) {
    for (let i = 0; i < unit.length; i++) {
      if (unit[i].value == "") {
        unit[i].value = 0;
      }
      // this.Manu_TotalInLocal_Per = this.Manu_TotalInLocal_Per + parseFloat(unit[i].value);
      this.Manu_TotalInLocal_Per = this.Manu_TotalInLocal_Per + parseFloat(unit[i].value.replace(/,/g, ""));
    }
    this.Manu_TotalInLocal = this.Manu_TotalInLocal_Per;
    // if (this.IsCastingSheet) {
    //   for (let i = 0; i < unitNon.length; i++) {

    //     let tt = (particular_perValue[i].children[1].innerText / 100) * parseFloat(this.Manu_TotalInLocal_Per.toFixed(4));
    //     unitNon[i].value = tt.toFixed(2);
    //     this.Non_TotalInLocal_Per = this.Non_TotalInLocal_Per + parseFloat(unitNon[i].value);
    //   }
    //   this.Non_TotalInLocal = this.Non_TotalInLocal_Per;
    // }
    // }
    //else {
    // for (let i = 0; i < unitNon.length; i++) {
    //   if (unitNon[i].value == "") {
    //     unitNon[i].value = 0;
    //   }
    //   this.Non_TotalInLocal_Per = this.Non_TotalInLocal_Per + parseFloat(unitNon[i].value);
    // }
    // this.Non_TotalInLocal = this.Non_TotalInLocal_Per;
    //}

    let tt = 0;
    for (let i = 0; i < unitNon.length; i++) {
      if (Enter_PerValue[i].value != '') {
        tt = (Enter_PerValue[i].value / 100) * parseFloat(this.Manu_TotalInLocal_Per.toFixed(4));
      }
      else {
        if (particular_perValue.length > 0) {
          if (particular_perValue[i].children.length <= 1) {
            tt = parseFloat(NonusdValueT1[i].innerText);
          }
          else if (particular_perValue[i].children.length == 2) {
            tt = parseFloat(NonusdValueT1[i].innerText);
          }
          else if (particular_perValue[i].children[1] == undefined) {
            tt = 0;
          }
          else {
            tt = (particular_perValue[i].children[1].innerText / 100) * parseFloat(this.Manu_TotalInLocal_Per.toFixed(4));
          }
        }
      }

      unitNon[i].value = tt.toFixed(2);
      this.Non_TotalInLocal_Per = this.Non_TotalInLocal_Per + parseFloat(unitNon[i].value);
    }


    this.Non_TotalInLocal = this.Non_TotalInLocal_Per;

    this.TotalInLocal = this.Manu_TotalInLocal + this.Non_TotalInLocal

    debugger
    ////// teriff cost //////
    const SetValueTarifUpdatedT1 = document.getElementById('TarifUpdatedT1') as any;
    if (this.TotalTeriffPercentT1 != undefined) {
      var tr = (parseFloat(this.TotalTeriffPercentT1) / 100) * this.TotalInLocal;
      this.TotalandTeriffInLocalT1 = tr + this.TotalInLocal;
      SetValueTarifUpdatedT1.value = tr.toFixed(2);
    }
    else {
      this.TotalandTeriffInLocalT1 = this.Manu_TotalInLocal + this.Non_TotalInLocal
    }

    // this.TotalInLocal = this.Manu_TotalInLocal + this.Non_TotalInLocal + parseFloat(this.TarifT1Cost);

  }

  CalculateAmountT2(e: any, val: any, no: any, id: any) {

    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {

      const updatedPer = document.getElementById('UpdateCostNonPerT2' + id) as any;
      const updatedAmount = document.getElementsByName('UpdateCostPerT1') as any;
      // const exitstAmout = document.getElementById('UpdateCostTDdata' + id) as any;


      this.updatePercentValue = 0;
      let txtValue = e.srcElement.value;
      if (txtValue == "" || txtValue == 0) {

        updatedAmount.value = val.usdValue.toFixed(2);;
        this.findsumPercent();
        //this.findsumPercentT2(no);
        return
      }

      let UpdateCost = e.srcElement.value * 100 / this.Manu_TotalInLocal;

      if (updatedPer.value > 0 || updatedPer.value == "") {
        if (no == 1) {
          updatedPer.value = UpdateCost.toFixed(2);  ///Math.round(UpdateCost);   //
        }
        else {
          updatedPer.value = UpdateCost.toFixed(2);  //Math.round(UpdateCost);
        }
      }

      this.findsumPercent();
      //this.findsumPercentT2(no);

    }
  }

  CalculateAmount(e: any, val: any, no: any, id: any) {

    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || (keyCode == 8 || keyCode == 9 || keyCode == 13) || (keyCode >= 48 && keyCode <= 57)) {

      const updatedPer = document.getElementById('UpdateCostNonPer' + id) as any;
      const updatedAmount = document.getElementsByName('UpdateCostPerT1') as any;
      // const exitstAmout = document.getElementById('UpdateCostTDdata' + id) as any;


      this.updatePercentValue = 0;
      let txtValue = e.srcElement.value;
      if (txtValue == "" || txtValue == 0) {

        updatedAmount.value = val.usdValue.toFixed(2);;
        this.findsumPercent();
        //this.findsumPercentT2(no);
        return
      }

      let UpdateCost = e.srcElement.value * 100 / this.Manu_TotalInLocal;

      if (updatedPer.value > 0 || updatedPer.value == "") {
        if (no == 1) {
          updatedPer.value = UpdateCost.toFixed(2); //Math.round(UpdateCost); 
        }
        else {
          updatedPer.value = UpdateCost.toFixed(2); //Math.round(UpdateCost); 
        }
      }

      this.findsumPercent();
      //this.findsumPercentT2(no);

    }
  }

  CalculatePercentT2(e: any, val: any, no: number) {

    //const updatedTextboxNon = document.getElementById('UpdateCostNon' + e.srcElement.id) as any;
    const updatedTextbox = document.getElementById('UpdateCostT2' + e.srcElement.id) as any;

    let Forex = 0;
    this.updatePercentValue = 0;
    let txtValue = e.srcElement.value;
    if (txtValue == "" || txtValue == 0) {
      if (no == 1) {
        updatedTextbox.value = val.usdValue.toFixed(2);
      }

      this.findsumPercentT2();
      return
    }


    if (this.ForexDetails != undefined) {
      Forex = this.ForexDetails.oldForex / this.ForexDetails.newForex;
      txtValue = Forex * e.srcElement.value;
    }

    this.updatePercentValue = txtValue / 100 * val.usdValue;

    let UpdateCost = parseFloat(val.usdValue) + this.updatePercentValue;
    if (no == 1) {
      updatedTextbox.value = UpdateCost.toFixed(2);
    }

    this.findsumPercentT2();
  }

  CalculatePercentNonT2(e: any, val: any, no: number, id: any) {


    const updatedTextboxNon = document.getElementById('UpdateCostNonT2' + id) as any;


    this.updatePercentValue = 0;
    let txtValue = e.srcElement.value;
    if (txtValue == "" || txtValue == 0) {
      if (no == 1) {
        // updatedTextbox.value = val.usdValue;
      }
      else {

        // updatedTextboxNon.value = val.usdValue.toFixed(2);
        updatedTextboxNon.value = (val.perValue / 100 * this.Manu_TotalInLocalT2).toFixed(2);
      }
      this.findsumPercentT2();
      return
    }

    // this.updatePercentValue = e.srcElement.value / 100 * val.usdValue;
    this.updatePercentValue = e.srcElement.value / 100 * this.Manu_TotalInLocalT2;


    //let UpdateCost = parseFloat(val.usdValue) + this.updatePercentValue;
    if (no == 1) {
      //updatedTextbox.value =  this.updatePercentValue.toFixed(2);
    }
    else {
      updatedTextboxNon.value = this.updatePercentValue.toFixed(2);
    }

    //this.findsumPercent(no);
    this.findsumPercentT2();
  }



  findsumPercentT2() {
    debugger;

    this.Manu_TotalInLocal_Per = 0;
    this.Non_TotalInLocal_Per = 0;

    const unit = document.getElementsByClassName("form-control UpdateText disabled NotNon T2") as any;
    const unitNon = document.getElementsByClassName("form-control UpdateText Notdisabled Non T2") as any;
    const particular_perValue = document.getElementsByClassName("particular_perValueT2") as any;
    const Enter_PerValue = document.getElementsByClassName("form-control percentText Non T2") as any;
    const NonusdValueT2 = document.getElementsByClassName("text-end NonusdValueT2") as any;

    // if (no == 1) {
    for (let i = 0; i < unit.length; i++) {
      if (unit[i].value == "") {
        unit[i].value = 0;
      }
      // this.Manu_TotalInLocal_Per = this.Manu_TotalInLocal_Per + parseFloat(unit[i].value);
      this.Manu_TotalInLocal_Per = this.Manu_TotalInLocal_Per + parseFloat(unit[i].value.replace(/,/g, ""));
    }
    this.Manu_TotalInLocalT2 = this.Manu_TotalInLocal_Per;

    //debugger;;

    let tt = 0;
    for (let i = 0; i < unitNon.length; i++) {
      if (Enter_PerValue[i].value != '') {
        tt = (Enter_PerValue[i].value / 100) * parseFloat(this.Manu_TotalInLocal_Per.toFixed(4));
      }
      else {
        if (particular_perValue.length > 0) {
          if (particular_perValue[i].children.length <= 1) {
            tt = parseFloat(NonusdValueT2[i].innerText);
          }
          else if (particular_perValue[i].children.length == 2) {
            tt = parseFloat(NonusdValueT2[i].innerText);
          }
          else if (particular_perValue[i].children[1] == undefined) {
            tt = 0;
          }
          else {
            tt = (particular_perValue[i].children[1].innerText / 100) * parseFloat(this.Manu_TotalInLocal_Per.toFixed(4));
          }
        }
      }

      unitNon[i].value = tt.toFixed(2);
      this.Non_TotalInLocal_Per = this.Non_TotalInLocal_Per + parseFloat(unitNon[i].value);
    }

    this.Non_TotalInLocalT2 = this.Non_TotalInLocal_Per;

    this.TotalInLocalT2 = this.Manu_TotalInLocalT2 + this.Non_TotalInLocalT2;
    debugger
    ////// teriff cost //////
    const SetValueTarifUpdatedT2 = document.getElementById('TarifUpdatedT2') as any;
    if (this.TotalTeriffPercentT2 != undefined) {
      var tr = (parseFloat(this.TotalTeriffPercentT2) / 100) * this.TotalInLocalT2;
      this.TotalandTeriffInLocalT2 = tr + this.TotalInLocalT2;
      SetValueTarifUpdatedT2.value = tr.toFixed(2);
    }
    else {
      this.TotalandTeriffInLocalT2 = this.Manu_TotalInLocalT2 + this.Non_TotalInLocalT2
    }


    // this.TotalInLocalT2 = this.Manu_TotalInLocalT2 + this.Non_TotalInLocalT2 + parseFloat(this.TarifT2Cost);

    const updatedTier1Cost = document.getElementById('UpdateCost2') as any;
    const updatedSrcapCost = document.getElementById('UpdateCost0') as any;
    // updatedTier1Cost.value = this.TotalInLocalT2.toFixed(2);
    updatedTier1Cost.value = this.TotalandTeriffInLocalT2.toFixed(2);


    let updateMaterialCost_casting = 0;
    let updateMaterialCost_existing_casting = 0;


    if (this.IsCastingSheet) {
      for (var i = 0; i < this.MaterialGridT2.length; i++) {
        if (this.MaterialGridT2[i].supplyLevel == 'T1') {
          updateMaterialCost_existing_casting = updateMaterialCost_existing_casting + parseFloat(this.MaterialGridT2[i].updateMaterialCostExisting);
          updateMaterialCost_casting = updateMaterialCost_casting + parseFloat(this.MaterialGridT2[i].updateMaterialCost);
        }
      }

      let tt = parseFloat(this.TierCostReportList[0].usdValue) - updateMaterialCost_existing_casting;
      updatedSrcapCost.value = (tt + updateMaterialCost_casting).toFixed(2);
    }

    this.findsumPercent();

  }


  CheckNonManuPercent() {


    const unit = document.getElementsByClassName("form-control percentText Non T1") as any;
    const unitNon = document.getElementsByClassName("form-control UpdateText Notdisabled Non T1") as any;
    let UpdateCost = 0;

    for (let i = 0; i < unit.length; i++) {
      if (unit[i].value == "") {
        unit[i].value = '';
      }

      if (unit[i].value > 0) {
        unitNon[i].value = (this.Manu_TotalInLocal / 100 * unit[i].value).toFixed(2);
        UpdateCost = UpdateCost + unitNon[i].value;
      }

    }
    this.Non_TotalInLocal = parseInt(UpdateCost.toFixed(2));
    // this.TotalInLocal = this.Manu_TotalInLocal + this.Non_TotalInLocal;

  }

  T2count: boolean = false;
  DirectMaterialCostT1: any;
  DirectMaterialCostT2: any;
  IsCastingSheet: boolean = false;
  DirectMaterialCostT1_casting: any;

  DirectLaborCostT1: any;
  DirectLaborCostT2: any;
  ModelPopUpheaderLable: any;
  ModelPopUp_usdValue: any;
  ModelPopUp_usdValue_Updated: any;
  SGAperValue_T1: any;
  SGAperValue_T2: any;
  ModelPopUp_Per: any;

  Notes1: any;
  Notes2: any;
  Notes3: any;
  Notes4: any;
  Notes5: any;
  Notes6: any;

  Direct_haeder1: any;
  Direct_haeder2: any;
  Direct_haeder3: any;
  Direct_haeder4: any;
  Direct_haeder5: any;

  IsNotes = true;
  UpdateCostfromPopup_id: any;

  popupTotalInLocal: any;
  perValue: any;

  Direct_Labor_Cost: string = "Direct Labour Cost"

  async openModal(t: string, value: any, id: any) {

    debugger;;
    this.UpdateCostfromPopup_id = id;
    this.ModelPopUpheaderLable = '';
    this.DirectMaterialCostT1 = 0;
    this.DirectMaterialCostT2 = 0;
    this.DirectMaterialCostT1_casting = 0;

    this.DirectLaborCostT1 = 0;

    this.TotalMaterialRate_Update = 0;
    this.IsHiddenT1 = true;
    this.IsHiddenT2 = true;


    this.IsHiddenT1_DirectCost = true;
    this.IsHiddenT2_DirectCost = true;

    if (value.particular.toLowerCase().includes('direct labour cost')) {
      this.ModelPopUpheaderLable = value.particular + '¹';
      this.Direct_haeder1 = value.particular;
      this.Direct_haeder2 = 'Total Direct Labour' + '²';
      this.Direct_haeder3 = 'Labour Inflation in % ³';
      this.Direct_haeder4 = 'New Direct Labour';

      this.Notes1 = 'Use this pop-up window to update direct labour cost used in previously costed models by adding an inflationary increase to adjust to recent market trends. If you are not aware of inflationary trends, please reach out to the COE team through Help & Support or send the model for refresh through "Refresh Model" button on previous page.';
      this.Notes2 = 'Total direct Labour content in cost model ($)';
      this.Notes3 = 'Inflationary increase in Labour in %. If you are unsure of inflationary trends, reach out to COE or send the model for refresh.';
      this.Notes4 = 'This model was costed on ' + this.DebriefDate;

    }
    else if (value.particular == "SGA") {
      this.ModelPopUpheaderLable = 'Selling, General & Administrative (SG&A)' + '¹';
      this.Direct_haeder1 = 'SG&A';
      this.Direct_haeder2 = 'Model SG&A' + '²';
      this.Direct_haeder5 = 'Model SG&A in % ³';
      this.Direct_haeder3 = 'New SG&A in % ⁴';
      this.Direct_haeder4 = 'New Model SG&A';

      this.Notes1 = 'Use this pop-up window to update SG&A as a percentage of Total Manufacturing Cost.';
      this.Notes2 = 'SG&A used in cost model';  //Also add one more column;
      this.Notes3 = 'SG&A as a percentage of Total Manufacturing Cost used in cost model.';
      this.Notes4 = 'Update new SG&A as a percentage of Total Manufacturing Cost, if required';
    }
    else {
      this.ModelPopUpheaderLable = value.particular + '¹';
      this.Direct_haeder1 = value.particular;
      this.Direct_haeder2 = 'Model ' + value.particular + '²';
      this.Direct_haeder5 = 'Model ' + value.particular + ' in % ³';
      this.Direct_haeder3 = 'New ' + value.particular + ' in % ⁴';
      this.Direct_haeder4 = 'New Model ' + value.particular;

      this.Notes1 = 'Use this pop-up window to update ' + value.particular + ' as a percentage of Total Manufacturing Cost.';
      this.Notes2 = value.particular + ' used in cost model';  //Also add one more column;
      this.Notes3 = value.particular + ' as a percentage of Total Manufacturing Cost used in cost model.';
      this.Notes4 = 'Update new ' + value.particular + ' as a percentage of Total Manufacturing Cost, if required';

    }

    //debugger;;
    if (t == "T1") {
      debugger;
      this.IsHiddenT1_DirectCost = false;
      this.IsHiddenT1 = false;
      this.IsCastingSheet = false;

      if (value.particular == 'Direct Material Cost') {
        const exitstCost = document.getElementById('UpdateCostTD0') as any;
        this.DirectMaterialCostT1 = exitstCost.innerText;
        this.display = "none";
        this.display_Material = "block";

      }
      else {

        const UpdateCostTD = document.getElementById('UpdateCostTD' + this.UpdateCostfromPopup_id) as any;
        //const UpdateCostTD_per = document.getElementById(this.UpdateCostfromPopup_id) as any;
        const dd = document.getElementsByClassName('form-control percentText T1') as any;
        const UpdateCostTD_per = dd[this.UpdateCostfromPopup_id];


        const UpdateCost = document.getElementById('UpdateCost' + this.UpdateCostfromPopup_id) as any;

        const UpdateCostNonPer = document.getElementById('UpdateCostNonPer' + this.UpdateCostfromPopup_id) as any;
        const UpdateCostNon = document.getElementById('UpdateCostNon' + this.UpdateCostfromPopup_id) as any;

        const UpdateCostNonPer_Popup = document.getElementById('UpdateCostNonPer_Popup') as any;

        // if (value.perValue > 0) {
        //   this.ModelPopUpheaderLable = value.particular + '  (' + value.perValue.toFixed(2) + ' %)';
        // }
        // else {
        //   this.ModelPopUpheaderLable = value.particular + '¹';
        // }

        this.popupTotalInLocal = this.Manu_TotalInLocal;

        if (value.particular.toLowerCase().includes('direct labour cost')) {
          this.IsNotes = true;
          //this.Notes = ' Update in Percentage on Existing Cost';
          this.ModelPopUp_usdValue_Updated = UpdateCost.value;
          UpdateCostNonPer_Popup.value = UpdateCostTD_per.value;
          this.Notes5 = '';
          this.Notes6 = 'Labor cost may increase or decrease based on forex fluctuations.';
        }
        else {
          this.IsNotes = false;
          //this.Notes = ' Update on Total Manufacturing Cost is ';
          this.ModelPopUp_usdValue_Updated = UpdateCostNon.value;
          UpdateCostNonPer_Popup.value = UpdateCostNonPer.value;
          this.Notes5 = 'Total Manufacturing Cost : ' + this.Manu_TotalInLocal.toFixed(2);

        }

        this.SGAperValue_T1 = value.perValue;

        this.DirectLaborCostT1 = value.usdValue + value.perValue;
        this.ModelPopUp_usdValue = value.usdValue;
        this.perValue = value.perValue;

        this.display = "block";
        this.display_Material = "none";

      }

    }
    else {

      this.IsHiddenT2_DirectCost = false;
      this.IsHiddenT2 = false;

      const exitstCost = document.getElementById('UpdateCostT2TD0') as any;
      this.DirectMaterialCostT2 = exitstCost.innerText

      // if (this.TierCostReportList[0].particular == 'Machining Scrap Credit') {
      //   const exitstCost = document.getElementById('UpdateCostTD0') as any;
      //   this.DirectMaterialCostT1_casting = exitstCost.innerText
      //   if (exitstCost.innerText == 0) {
      //     this.IsCastingSheet = false;
      //   }
      //   else {
      //     this.IsCastingSheet = true;
      //   }
      //   this.T2count = true;
      // }
      // else {
      //   this.IsCastingSheet = false;
      //   this.T2count = false;
      // }

      if (this.Tier2CostReportList != undefined && this.Tier2CostReportList.length > 0) {
        const exitstCost = document.getElementById('UpdateCostTD0') as any;
        this.DirectMaterialCostT1_casting = exitstCost.innerText
        if (exitstCost.innerText == 0) {
          this.IsCastingSheet = false;
        }
        else {
          this.IsCastingSheet = true;
        }
        this.T2count = true;
      }

      if (this.TierCostReportList[0].particular == 'Direct Material Cost') {
        this.IsCastingSheet = false;
      }


      if (value.particular == 'Direct Material Cost') {
        const exitstCost = document.getElementById('UpdateCostTD0') as any;
        this.DirectMaterialCostT1 = exitstCost.innerText;
        this.display = "none";
        this.display_Material = "block";

      }
      else {

        const UpdateCostT2TD = document.getElementById('UpdateCostT2TD' + this.UpdateCostfromPopup_id) as any;
        //const UpdateCostTD_per = document.getElementById(this.UpdateCostfromPopup_id) as any;
        const dd = document.getElementsByClassName('form-control percentText T2') as any;
        const UpdateCostTD_per = dd[this.UpdateCostfromPopup_id];


        const UpdateCostT2 = document.getElementById('UpdateCostT2' + this.UpdateCostfromPopup_id) as any;

        const UpdateCostNonPerT2 = document.getElementById('UpdateCostNonPerT2' + this.UpdateCostfromPopup_id) as any;
        const UpdateCostNonT2 = document.getElementById('UpdateCostNonT2' + this.UpdateCostfromPopup_id) as any;

        const UpdateCostNonPer_Popup = document.getElementById('UpdateCostNonPer_Popup') as any;

        // if (value.perValue > 0) {
        //   this.ModelPopUpheaderLable = value.particular + '  (' + value.perValue.toFixed(2) + ' %)';
        // }
        // else {
        //   this.ModelPopUpheaderLable = value.particular + '¹';
        // }

        this.popupTotalInLocal = this.Manu_TotalInLocalT2;

        if (value.particular.toLowerCase().includes('direct labour cost')) {
          this.IsNotes = true;
          //this.Notes = ' Update in Percentage on Existing Cost';
          this.ModelPopUp_usdValue_Updated = UpdateCostT2.value;
          UpdateCostNonPer_Popup.value = UpdateCostTD_per.value;
          this.Notes5 = '';
          this.Notes6 = 'Labor cost may increase or decrease based on forex fluctuations.';
        }
        else {
          this.IsNotes = false;
          //this.Notes = ' Update on Total Manufacturing Cost is ';
          this.ModelPopUp_usdValue_Updated = UpdateCostNonT2.value;
          UpdateCostNonPer_Popup.value = UpdateCostNonPerT2.value;
          this.Notes5 = 'Total Manufacturing Cost : ' + this.Manu_TotalInLocalT2.toFixed(2);

        }

        this.SGAperValue_T1 = value.perValue;

        this.DirectLaborCostT1 = value.usdValue + value.perValue;
        this.ModelPopUp_usdValue = value.usdValue;
        this.perValue = value.perValue;

        this.display = "block";
        this.display_Material = "none";

      }
    }

    if (t == "T1") {
      if (this.MaterialGridT1.length > 0) {
        console.log(this.MaterialGridT1);
        this.MaterialGrade = this.MaterialGridT1;
        setTimeout(() => {
          this.CalculateTotalMaterialRate(0);
        }, 100);
        //this.CalculateTotalMaterialRate(0);
        return
      }
    }
    else {
      if (this.MaterialGridT2.length > 0) {
        this.MaterialGrade = this.MaterialGridT2;
        setTimeout(() => {
          this.CalculateTotalMaterialRate(0);
        }, 100);
        //this.CalculateTotalMaterialRate(0);
        return
      }
    }


    if (value.particular == 'Direct Material Cost') {
      debugger;
      const data = await this.searchservice.GetMatetialCostForUpdate(this.CSHeaderId, t, this.IsCastingSheet).toPromise();

      this.MaterialGrade = data;

      if (this.MaterialGrade.length <= 0) {
        if (t == "T1") {
          alert("Tier T1 Record Not Found");
        }
        else {
          alert("Tier T2 Record Not Found");
        }
      }
      else {
        //debugger;;
        //// aluminum reverse logic
        // this.AluminiumCastingGrade
        for (var i = 0; i < this.MaterialGrade.length; i++) {
          this.MaterialGrade[i]['updatedNetWeight'] = '';
          this.MaterialGrade[i].grossNetWeightKG = parseFloat(this.MaterialGrade[i].grossNetWeightKG.toFixed(4));

          //console.log(this.MaterialGrade);

          for (var j = 0; j < this.AluminiumCastingGrade.length; j++) {
            var rr = this.AluminiumCastingGrade[j].materialName.toLowerCase();
            // if (this.MaterialGrade[i].materialType.toLowerCase().includes(rr) && this.MaterialGrade[i].supplyLevel == 'T2') {
            if (this.MaterialGrade[i].materialType.toLowerCase().includes(rr)) {
              //this.MaterialGrade[i].unitMaterialRate = 7.80;
              // G6/((1+5%)*100%-((1-D6)*(0.9)))

              var Utilization = (this.MaterialGrade[i].netWeightKG / this.MaterialGrade[i].partFinishWeight).toFixed(2);
              this.MaterialGrade[i].unitMaterialRate = parseFloat(this.MaterialGrade[i].unitMaterialRate) / ((1 + 0.05) * 1 - ((1 - parseFloat(Utilization)) * (0.9)));

              if (isNaN(this.MaterialGrade[i].unitMaterialRate)) {
                this.MaterialGrade[i].unitMaterialRate = null;
              }
              break;
            }

          }
        }
        // if (t == "T2") {
        //   // this.T2count = true;
        //   // this.IsHiddenT2 = false;
        // }
        // else {
        //   //this.IsHiddenT1 = false;
        // }
      }
    }

  }



  CalculatePercentNon_DirectCost() {

    const updatedTextboxNon = document.getElementById('UpdateCostNonPer_Popup') as any;

    this.updatePercentValue = 0;
    if (updatedTextboxNon.value == "") {
      this.ModelPopUp_usdValue_Updated = this.ModelPopUp_usdValue.toFixed(2);
      this.ModelPopUp_Per = updatedTextboxNon.value;
      return
    }
    // if (updatedTextboxNon.value == 0) {
    //   this.toastr.warning('percentage should not be 0');
    //   this.ModelPopUp_usdValue_Updated = this.ModelPopUp_usdValue.toFixed(2);
    //   updatedTextboxNon.value = '';
    //   return
    // }
    if (updatedTextboxNon.value >= 100) {
      this.toastr.warning('Percentage should not be greater than or equal to 100%');
      this.ModelPopUp_usdValue_Updated = this.ModelPopUp_usdValue.toFixed(2);
      updatedTextboxNon.value = '';
      return
    }

    var UpdatedCost = '0';
    //var rr = '0';
    if (this.IsNotes) {
      UpdatedCost = (updatedTextboxNon.value / 100 * this.ModelPopUp_usdValue).toFixed(2);
      // this.ModelPopUp_usdValue_Updated = (this.ModelPopUp_usdValue + parseFloat(Updated)).toFixed(2);


      //existing * (1+inflation/100) * old/new

      // var rr = this.ModelPopUp_usdValue * (updatedTextboxNon.value / 100 );
      // this.ModelPopUp_usdValue_Updated = rr * (56.700 / 58.900);

      if (this.ForexDetails != undefined) {
        var rr = (this.ModelPopUp_usdValue + parseFloat(UpdatedCost));
        this.ModelPopUp_usdValue_Updated = (rr * (this.ForexDetails.oldForex / this.ForexDetails.newForex)).toFixed(2);
      }
      else {
        this.ModelPopUp_usdValue_Updated = (this.ModelPopUp_usdValue + parseFloat(UpdatedCost)).toFixed(2);
      }

    }
    else {
      this.ModelPopUp_usdValue_Updated = (updatedTextboxNon.value / 100 * this.popupTotalInLocal).toFixed(2);
    }
    this.ModelPopUp_Per = updatedTextboxNon.value;

  }

  UpdateCost(T: any) {

    //debugger;;

    this.CalculatePercentNon_DirectCost();
    if (T == 'T1') {
      if (this.IsNotes) {
        const UpdateCost = document.getElementById('UpdateCost' + this.UpdateCostfromPopup_id) as any;
        //const UpdateCostPer = document.getElementById(this.UpdateCostfromPopup_id) as any;
        const dd = document.getElementsByClassName('form-control percentText T1') as any;
        const UpdateCostPer = dd[this.UpdateCostfromPopup_id];
        UpdateCost.value = this.ModelPopUp_usdValue_Updated;

        if (this.ModelPopUp_Per == undefined) {
          UpdateCostPer.value = "";
        }
        else {
          UpdateCostPer.value = this.ModelPopUp_Per;
        }

      }
      else {
        const UpdateCostNonPer = document.getElementById('UpdateCostNonPer' + this.UpdateCostfromPopup_id) as any;
        const UpdateCostNon = document.getElementById('UpdateCostNon' + this.UpdateCostfromPopup_id) as any;

        UpdateCostNon.value = this.ModelPopUp_usdValue_Updated;
        UpdateCostNonPer.value = this.ModelPopUp_Per;
        if (this.ModelPopUp_Per == undefined) {
          UpdateCostNonPer.value = "";
        }
        else {
          UpdateCostNonPer.value = this.ModelPopUp_Per;
        }

      }
      this.findsumPercent();
    }
    else {
      if (this.IsNotes) {
        const UpdateCostT2 = document.getElementById('UpdateCostT2' + this.UpdateCostfromPopup_id) as any;
        // const UpdateCostPer = document.getElementById(this.UpdateCostfromPopup_id) as any;
        const dd = document.getElementsByClassName('form-control percentText T2') as any;
        const UpdateCostPer = dd[this.UpdateCostfromPopup_id];

        UpdateCostT2.value = this.ModelPopUp_usdValue_Updated;
        if (this.ModelPopUp_Per == undefined) {
          UpdateCostPer.value = "";
        }
        else {
          UpdateCostPer.value = this.ModelPopUp_Per;
        }

      }
      else {
        const UpdateCostNonPerT2 = document.getElementById('UpdateCostNonPerT2' + this.UpdateCostfromPopup_id) as any;
        const UpdateCostNonT2 = document.getElementById('UpdateCostNonT2' + this.UpdateCostfromPopup_id) as any;

        UpdateCostNonT2.value = this.ModelPopUp_usdValue_Updated;
        if (this.ModelPopUp_Per == undefined) {
          UpdateCostNonPerT2.value = "";
        }
        else {
          UpdateCostNonPerT2.value = this.ModelPopUp_Per;
        }
      }
      this.findsumPercentT2();
    }
    this.display = "none";
  }

  onCloseHandled() {
    this.display_Material = "none";
  }

  new_Rate: number = 0;
  TotalMaterialRate_Update: number = 0;
  TotalMaterialRate_Existing: number = 0;
  new_Rate_existing: number = 0;
  new_Rate_casting: number = 0;
  new_Rate_existing_casting: number = 0;
  TotalMaterialRate_Update_casting: number = 0;
  TotalMaterialRate_Existing_casting: number = 0;

  //// new code
  // CalculateMaterialRate(e: any, val: any, index: any) {
  //   
  //   const updated_Rate = document.getElementsByClassName("form-control PopupText RMUpdateRate disabled") as any;
  //   const existing_Cost = document.getElementsByClassName("form-control PopupText disabled Existing") as any;

  //   if (e.currentTarget.value == "" || e.currentTarget.value == 0) {
  //     updated_Rate[index].value = 0;
  //     existing_Cost[index].value = 0;
  //     this.CalculateTotalMaterialRate();
  //     return
  //   }

  //   var scrapPercent = '';
  //   if (val.unitMaterialRate == null) {
  //     val.unitMaterialRate = 0;
  //     scrapPercent = '0';
  //   }
  //   else if (val.unitScrapRate == null) {
  //     val.unitScrapRate = 0;
  //     scrapPercent = '0';
  //   }
  //   else {
  //     scrapPercent = (val.unitScrapRate / val.unitMaterialRate).toFixed(4);
  //     if (scrapPercent == 'Infinity') {
  //       scrapPercent = '0.0000';
  //     }
  //   }

  //   ////////// old rate //////////
  //   let Total_NetWeight = val.quantity * parseFloat(val.netWeightKG);
  //   let Total_GrossWeight = val.quantity * parseFloat(val.grossWeightKG);

  //   let t1_existing = Total_GrossWeight * val.unitMaterialRate;
  //   let t2_existing = (Total_GrossWeight - Total_NetWeight) * parseFloat(val.unitScrapRate);
  //   this.new_Rate_existing = t1_existing - t2_existing;

  //   /////////////  new rate /////////////

  //   let new_unitScrapRate = (e.currentTarget.value * parseFloat(scrapPercent)).toFixed(4);
  //   let t1 = Total_GrossWeight * e.currentTarget.value;
  //   let t2 = (Total_GrossWeight - Total_NetWeight) * parseFloat(new_unitScrapRate);
  //   this.new_Rate = t1 - t2;

  //   updated_Rate[index].value = this.new_Rate.toFixed(4);
  //   existing_Cost[index].value = this.new_Rate_existing.toFixed(4);

  //   for (let i = 0; i < this.MaterialGrade.length; i++) {
  //     if (this.MaterialGrade[i].materialType === val.materialType && (this.MaterialGrade[i].unitMaterialRate == null || this.MaterialGrade[i].unitMaterialRate == 0) ) {

  //       let Total_NetWeight_row = this.MaterialGrade[i].quantity * parseFloat(this.MaterialGrade[i].netWeightKG);
  //       let Total_GrossWeight_row = this.MaterialGrade[i].quantity * parseFloat(this.MaterialGrade[i].grossWeightKG);
  //       ////////// old rate //////////
  //       let t1_existing = Total_GrossWeight_row * this.MaterialGrade[i].unitMaterialRate;
  //       let t2_existing = (Total_GrossWeight_row - Total_NetWeight_row) * parseFloat(this.MaterialGrade[i].unitScrapRate);
  //       this.new_Rate_existing_casting = t1_existing - t2_existing;
  //       /////////////  new rate /////////////
  //       // let new_unitScrapRate = (e.currentTarget.value * parseFloat(scrapPercent)).toFixed(4);
  //       // let t1 = val.grossWeightKG * e.currentTarget.value;
  //       // let t2 = (val.grossWeightKG - val.grossNetWeightKG) * parseFloat(new_unitScrapRate);
  //       // this.new_Rate = t1 - t2;

  //       let scrapPercent_casting = (this.MaterialGrade[i].unitScrapRate / this.MaterialGrade[i].unitMaterialRate).toFixed(4);
  //       if(scrapPercent_casting == 'Infinity'){
  //         scrapPercent_casting = '0'; 
  //       }
  //       let new_unitScrapRate_casting = (e.currentTarget.value * parseFloat(scrapPercent_casting)).toFixed(4);
  //       let t1 = Total_GrossWeight_row * this.MaterialGrade[i].unitMaterialRate;
  //       let t2 = (Total_GrossWeight_row - Total_NetWeight_row) * parseFloat(new_unitScrapRate_casting);
  //       this.new_Rate_casting = t1 - t2;
  //       if (this.MaterialGrade[i].supplyLevel == 'T1') {
  //         const updated_Rate_casting = document.getElementById("PopUpResult" + [i]) as any;
  //         updated_Rate_casting.value = this.new_Rate_casting.toFixed(4);
  //         existing_Cost[i].value = this.new_Rate_existing_casting.toFixed(4);
  //       }
  //     }
  //   }


  //   this.CalculateTotalMaterialRate();
  // }


  //// old code
  CalculateMaterialRate(e: any, val: any, index: any) {

    debugger;
    let IsreverseCasting = false;
    for (var j = 0; j < this.AluminiumCastingGrade.length; j++) {
      var rr = this.AluminiumCastingGrade[j].materialName.toLowerCase();
      if (val.materialType.toLowerCase().includes(rr)) {
        this.IsCastingSheet = true;
        break;
      }
    }

    const updateNetweight = document.getElementsByClassName("form-control PopupText RMTextNetweight") as any;
    const updateNewRate = document.getElementsByClassName("form-control PopupText RMText") as any;

    var Utilization = '';
    Utilization = (val.grossNetWeightKG / val.grossWeightKG).toFixed(4);

    if (this.IsCastingSheet) {
      const updated_Rate = document.getElementsByClassName("form-control PopupText RMUpdateRate disabled") as any;
      const existing_Cost = document.getElementsByClassName("form-control PopupText disabled Existing") as any;

      var e_currentTarget_value = updateNewRate[index].value;
      var unit_Material_Rate = val.unitMaterialRate;

      if (e_currentTarget_value == "" || e_currentTarget_value == 0) {
        // updated_Rate[index].value = 0;
        // existing_Cost[index].value = 0;
        for (let i = 0; i < this.MaterialGrade.length; i++) {
          if (this.MaterialGrade[i].materialType === val.materialType) {
            updated_Rate[i].value = 0;
            existing_Cost[i].value = 0;
          }
        }
        this.CalculateTotalMaterialRate(val.casting);
        return
      }

      //&& val.supplyLevel == 'T2'
      //// aluminum reverse logic
      for (var j = 0; j < this.AluminiumCastingGrade.length; j++) {
        var rr = this.AluminiumCastingGrade[j].materialName.toLowerCase();
        if (val.materialType.toLowerCase().includes(rr)) {
          //  ((F6*(1+5%)*100%-(1-D6)*(F6*0.9))) 
          IsreverseCasting = true;
          //var Utilization = (val.netWeightKG / val.partFinishWeight).toFixed(2);
          e_currentTarget_value = ((parseFloat(e_currentTarget_value) * (1 + 0.05) * 1 - (1 - parseFloat(Utilization)) * (parseFloat(e_currentTarget_value) * 0.9)));
          console.log(e_currentTarget_value);

          //var Utilization = (val.netWeightKG / val.partFinishWeight).toFixed(2);
          //var Utilization = (updateNetweight[index].value / val.partFinishWeight).toFixed(2);
          unit_Material_Rate = ((parseFloat(val.unitMaterialRate) * (1 + 0.05) * 1 - (1 - parseFloat(Utilization)) * (parseFloat(val.unitMaterialRate) * 0.9)));
          console.log(e_currentTarget_value);
          break;
        }
      }


      // if (val.materialType.includes('aluminum')) {
      //   //  ((F6*(1+5%)*100%-(1-D6)*(F6*0.9))) 

      //   var Utilization = (val.netWeightKG / val.partFinishWeight).toFixed(2);
      //   e_currentTarget_value = ((parseFloat(e_currentTarget_value) * (1 + 0.05) * 1 - (1 - parseFloat(Utilization)) * (parseFloat(e_currentTarget_value) * 0.9)));
      //   console.log(e_currentTarget_value);
      // }


      var scrapPercent = '';
      if (val.unitMaterialRate == null) {
        val.unitMaterialRate = 0;
        scrapPercent = '0';
      }
      else if (val.unitScrapRate == null) {
        val.unitScrapRate = 0;
        scrapPercent = '0';
      }
      else {
        scrapPercent = (val.unitScrapRate / unit_Material_Rate).toFixed(4);
      }

      ////////// old rate //////////
      //let t1_existing = val.grossWeightKG * val.unitMaterialRate;
      let t1_existing = val.grossWeightKG * unit_Material_Rate;
      // let t2_existing = (val.grossWeightKG - val.grossNetWeightKG) * parseFloat(val.unitScrapRate);
      let t2_existing = (val.grossWeightKG - updateNetweight[index].value) * parseFloat(val.unitScrapRate);
      this.new_Rate_existing = t1_existing - t2_existing;


      /////////////  new rate /////////////
      // if (this.IsCastingSheet) {
      var UpdatedgrossWeightKG = updateNetweight[index].value / parseFloat(Utilization);

      let new_unitScrapRate = (e_currentTarget_value * parseFloat(scrapPercent)).toFixed(4);
      // let t1 = val.grossWeightKG * e_currentTarget_value;
      //let t2 = (val.grossWeightKG - val.grossNetWeightKG) * parseFloat(val.unitScrapRate);
      let t1 = UpdatedgrossWeightKG * e_currentTarget_value;
      let t2 = (UpdatedgrossWeightKG - updateNetweight[index].value) * parseFloat(new_unitScrapRate);
      this.new_Rate = t1 - t2;
      //}
      // else {
      //   let new_unitScrapRate = (e_currentTarget_value * parseFloat(scrapPercent)).toFixed(4);
      //   let t1 = val.grossWeightKG * e_currentTarget_value;
      //   let t2 = (val.grossWeightKG - val.grossNetWeightKG) * parseFloat(new_unitScrapRate);
      //   this.new_Rate = t1 - t2;

      // }


      if (val.unitMaterialRate == 0) {
        updated_Rate[index].value = 0;
      }
      else {
        updated_Rate[index].value = this.new_Rate.toFixed(4);
      }

      existing_Cost[index].value = this.new_Rate_existing.toFixed(4);

      // var utiliation = '0';
      // var unitMaterialRate_Aluminium = '0';
      // if (val.materialType.includes('Aluminium')) {
      //   utiliation = ((val.netWeightKG / val.grossWeightKG)).toFixed(2);
      //   unitMaterialRate_Aluminium  = (val.unitMaterialRate * (1+0.05) * 1 - (1 - parseFloat(utiliation)) * (val.unitMaterialRate * 0.9)).toFixed(4) ; 
      // }
      // else{
      //   unitMaterialRate_Aluminium = val.unitMaterialRate; 
      // }

      for (let i = 0; i < this.MaterialGrade.length; i++) {

        if (this.MaterialGrade[i].materialType === val.materialType && this.MaterialGrade[i].unitMaterialRate == null) {
          debugger;
          ////////// old rate //////////
          let t1_existing = this.MaterialGrade[i].grossWeightKG * this.MaterialGrade[i].unitMaterialRate;
          let t2_existing = (this.MaterialGrade[i].grossWeightKG - this.MaterialGrade[i].grossNetWeightKG) * parseFloat(this.MaterialGrade[i].unitScrapRate);
          this.new_Rate_existing_casting = t1_existing - t2_existing;

          /////////////  new rate /////////////
          // let new_unitScrapRate = (e_currentTarget_value * parseFloat(scrapPercent)).toFixed(4);
          // let t1 = val.grossWeightKG * e_currentTarget_value;
          // let t2 = (val.grossWeightKG - val.grossNetWeightKG) * parseFloat(new_unitScrapRate);
          // this.new_Rate = t1 - t2;

          //let scrapPercent_casting = (this.MaterialGrade[i].unitScrapRate / parseFloat(unitMaterialRate_Aluminium)).toFixed(4);
          let scrapPercent_casting = (this.MaterialGrade[i].unitScrapRate / unit_Material_Rate).toFixed(4);
          let new_unitScrapRate_casting = (e_currentTarget_value * parseFloat(scrapPercent_casting)).toFixed(4);
          //let t1 = this.MaterialGrade[i].grossWeightKG * this.MaterialGrade[i].unitMaterialRate;
          //let t2 = (this.MaterialGrade[i].grossWeightKG - this.MaterialGrade[i].grossNetWeightKG) * parseFloat(new_unitScrapRate_casting);
          let t1 = updateNetweight[index].value * this.MaterialGrade[i].unitMaterialRate;
          let t2 = (updateNetweight[index].value - this.MaterialGrade[i].grossNetWeightKG) * parseFloat(new_unitScrapRate_casting);
          this.new_Rate_casting = t1 - t2;
          // if (this.MaterialGrade[i].supplyLevel == 'T1') {
          const updated_Rate_casting = document.getElementById("PopUpResult" + [i]) as any;
          updated_Rate_casting.value = this.new_Rate_casting.toFixed(4);
          existing_Cost[i].value = this.new_Rate_existing_casting.toFixed(4);
          //}
        }
        else if (index == i) {
          debugger;
          ////////// old rate //////////
          console.log(unit_Material_Rate);
          console.log(e_currentTarget_value);

          if (IsreverseCasting) {
            let t1_existing = this.MaterialGrade[i].grossWeightKG * unit_Material_Rate;
            let t2_existing = (this.MaterialGrade[i].grossWeightKG - this.MaterialGrade[i].grossNetWeightKG) * parseFloat(this.MaterialGrade[i].unitScrapRate);
            this.new_Rate_existing_casting = t1_existing - t2_existing;
          }
          else {

            //let t1_existing = this.MaterialGrade[i].grossWeightKG * this.MaterialGrade[i].materialCost;
            let t1_existing = this.MaterialGrade[i].grossWeightKG * this.MaterialGrade[i].unitMaterialRate;
            let t2_existing = (this.MaterialGrade[i].grossWeightKG - this.MaterialGrade[i].grossNetWeightKG) * parseFloat(this.MaterialGrade[i].unitScrapRate);
            this.new_Rate_existing_casting = t1_existing - t2_existing;
          }
          /////////////  new rate /////////////
          var Utilization = (this.MaterialGrade[i].grossNetWeightKG / val.partFinishWeight).toFixed(2);
          var UpdatedgrossWeightKG = updateNetweight[index].value / parseFloat(Utilization);

          //let scrapPercent_casting = (this.MaterialGrade[i].unitScrapRate / parseFloat(unitMaterialRate_Aluminium)).toFixed(4);
          let scrapPercent_casting = (this.MaterialGrade[i].unitScrapRate / unit_Material_Rate).toFixed(4);
          let new_unitScrapRate_casting = (e_currentTarget_value * parseFloat(scrapPercent_casting)).toFixed(4);
          //let t1 = this.MaterialGrade[i].grossWeightKG * this.MaterialGrade[i].unitMaterialRate;
          //let t2 = (this.MaterialGrade[i].grossWeightKG - this.MaterialGrade[i].grossNetWeightKG) * parseFloat(new_unitScrapRate_casting);
          let t1 = UpdatedgrossWeightKG * e_currentTarget_value;
          let t2 = (UpdatedgrossWeightKG - updateNetweight[index].value) * parseFloat(new_unitScrapRate_casting);
          this.new_Rate_casting = t1 - t2;
          // if (this.MaterialGrade[i].supplyLevel == 'T1') {
          const updated_Rate_casting = document.getElementById("PopUpResult" + [i]) as any;
          updated_Rate_casting.value = this.new_Rate_casting.toFixed(4);
          existing_Cost[i].value = this.new_Rate_existing_casting.toFixed(4);
        }
      }

      this.CalculateTotalMaterialRate(val.casting);
    }
    else {

      const updated_Rate = document.getElementsByClassName("form-control PopupText RMUpdateRate disabled") as any;
      const existing_Cost = document.getElementsByClassName("form-control PopupText disabled Existing") as any;

      if (updateNewRate[index].value == "" || updateNewRate[index].value == 0) {
        // updated_Rate[index].value = 0;
        // existing_Cost[index].value = 0;
        for (let i = 0; i < this.MaterialGrade.length; i++) {
          if (this.MaterialGrade[i].materialType === val.materialType) {
            updated_Rate[i].value = 0;
            existing_Cost[i].value = 0;
          }
        }

        this.CalculateTotalMaterialRate(val.casting);
        return
      }

      var scrapPercent = '';
      if (val.unitMaterialRate == null) {
        val.unitMaterialRate = 0;
        scrapPercent = '0';
      }
      else if (val.unitScrapRate == null) {
        val.unitScrapRate = 0;
        scrapPercent = '0';
      }
      else {
        scrapPercent = (val.unitScrapRate / val.unitMaterialRate).toFixed(4);
      }


      ////////// old rate //////////
      let t1_existing = val.grossWeightKG * val.unitMaterialRate;
      let t2_existing = (val.grossWeightKG - val.grossNetWeightKG) * parseFloat(val.unitScrapRate);
      // let t2_existing = (val.grossWeightKG - updateNetweight[index].value) * parseFloat(val.unitScrapRate);
      this.new_Rate_existing = t1_existing - t2_existing;

      if (val.casting == 1) { ///  check casting in material type
        var e_currentTarget_value = updateNewRate[index].value;
        //// aluminum reverse logic

        for (var j = 0; j < this.AluminiumCastingGrade.length; j++) {
          var rr = this.AluminiumCastingGrade[j].materialName.toLowerCase();
          if (val.materialType.toLowerCase().includes(rr)) {
            //  ((F6*(1+5%)*100%-(1-D6)*(F6*0.9))) 

            // var Utilization = (val.netWeightKG / val.partFinishWeight).toFixed(2);
            // var Utilization = (updateNetweight[index].value / val.partFinishWeight).toFixed(2);
            e_currentTarget_value = ((parseFloat(e_currentTarget_value) * (1 + 0.05) * 1 - (1 - parseFloat(Utilization)) * (parseFloat(e_currentTarget_value) * 0.9)));
            console.log(e_currentTarget_value);

            break;
          }
        }

        // if (val.materialType.includes('aluminum')) {
        //   //  ((F6*(1+5%)*100%-(1-D6)*(F6*0.9))) 

        //   var Utilization = (val.netWeightKG / val.partFinishWeight).toFixed(2);
        //   e_currentTarget_value = ((parseFloat(e_currentTarget_value) * (1 + 0.05) * 1 - (1 - parseFloat(Utilization)) * (parseFloat(e_currentTarget_value) * 0.9)));
        //   console.log(e_currentTarget_value);
        // }

        // ////////// old rate //////////
        // let t1_existing = val.grossWeightKG * val.unitMaterialRate;
        // let t2_existing = (val.grossWeightKG - val.grossNetWeightKG) * parseFloat(val.unitScrapRate);
        // this.new_Rate_existing = t1_existing - t2_existing;
        /////////////  new rate /////////////

        // if (this.IsCastingSheet) {
        let new_unitScrapRate = (e_currentTarget_value * parseFloat(scrapPercent)).toFixed(4);
        let t1 = val.grossWeightKG * e_currentTarget_value;
        //let t2 = (val.grossWeightKG - val.grossNetWeightKG) * parseFloat(new_unitScrapRate);
        let t2 = (val.grossWeightKG - updateNetweight[index].value) * parseFloat(new_unitScrapRate);

        this.new_Rate = t1 - t2;
        //}
        // else {
        //   let new_unitScrapRate = (e_currentTarget_value * parseFloat(scrapPercent)).toFixed(4);
        //   let t1 = val.grossWeightKG * e_currentTarget_value;
        //   let t2 = (val.grossWeightKG - val.grossNetWeightKG) * parseFloat(new_unitScrapRate);
        //   this.new_Rate = t1 - t2;

        // }

        if (val.unitMaterialRate == 0) {
          updated_Rate[index].value = 0;
        }
        else {
          updated_Rate[index].value = this.new_Rate.toFixed(4);
        }

        existing_Cost[index].value = this.new_Rate_existing.toFixed(4);

        for (let i = 0; i < this.MaterialGrade.length; i++) {
          if (this.MaterialGrade[i].materialType === val.materialType && this.MaterialGrade[i].unitMaterialRate == null) {

            ////////// old rate //////////
            let t1_existing = this.MaterialGrade[i].grossWeightKG * this.MaterialGrade[i].unitMaterialRate;
            let t2_existing = (this.MaterialGrade[i].grossWeightKG - this.MaterialGrade[i].grossNetWeightKG) * parseFloat(this.MaterialGrade[i].unitScrapRate);
            this.new_Rate_existing_casting = t1_existing - t2_existing;
            /////////////  new rate /////////////
            // let new_unitScrapRate = (e_currentTarget_value * parseFloat(scrapPercent)).toFixed(4);
            // let t1 = val.grossWeightKG * e_currentTarget_value;
            // let t2 = (val.grossWeightKG - val.grossNetWeightKG) * parseFloat(new_unitScrapRate);
            // this.new_Rate = t1 - t2;

            let scrapPercent_casting = (this.MaterialGrade[i].unitScrapRate / val.unitMaterialRate).toFixed(4);
            let new_unitScrapRate_casting = (e_currentTarget_value * parseFloat(scrapPercent_casting)).toFixed(4);
            let t1 = this.MaterialGrade[i].grossWeightKG * this.MaterialGrade[i].unitMaterialRate;
            let t2 = (this.MaterialGrade[i].grossWeightKG - this.MaterialGrade[i].grossNetWeightKG) * parseFloat(new_unitScrapRate_casting);
            //let t2 = (updateNetweight[index].value - this.MaterialGrade[i].grossNetWeightKG) * parseFloat(new_unitScrapRate_casting);
            this.new_Rate_casting = t1 - t2;
            // if (this.MaterialGrade[i].supplyLevel == 'T1') {
            const updated_Rate_casting = document.getElementById("PopUpResult" + [i]) as any;
            updated_Rate_casting.value = this.new_Rate_casting.toFixed(4);
            existing_Cost[i].value = this.new_Rate_existing_casting.toFixed(4);
            //}
          }
        }

        this.CalculateTotalMaterialRate(val.casting);
      }
      else {


        // // (PartFinishWeight *  UnitMaterialRate) - ((PartFinishWeight - NetWeightKG) * UnitScrapRate)
        // const updated_Rate = document.getElementsByClassName("form-control PopupText RMUpdateRate disabled") as any;
        // const existing_Cost = document.getElementsByClassName("form-control PopupText disabled Existing") as any;

        // if (e.currentTarget.value == "" || e.currentTarget.value == 0) {
        //   updated_Rate[index].value = 0;
        //   existing_Cost[index].value = 0;
        //   this.CalculateTotalMaterialRate();
        //   return
        // }

        // var scrapPercent = '';
        // if (val.unitMaterialRate == null) {
        //   val.unitMaterialRate = 0;
        //   scrapPercent = '0';
        // }
        // else if (val.unitScrapRate == null) {
        //   val.unitScrapRate = 0;
        //   scrapPercent = '0';
        // }
        // else {
        //   scrapPercent = (val.unitScrapRate / val.unitMaterialRate).toFixed(4);
        // }

        // ////////// old rate //////////
        // let t1_existing = val.grossWeightKG * val.unitMaterialRate;
        // let t2_existing = (val.grossWeightKG - val.grossNetWeightKG) * parseFloat(val.unitScrapRate);
        // this.new_Rate_existing = t1_existing - t2_existing;


        //var e_currentTarget_value = updateNewRate[index].value;
        //// aluminum reverse logic

        for (var j = 0; j < this.AluminiumCastingGrade.length; j++) {
          var rr = this.AluminiumCastingGrade[j].materialName.toLowerCase();
          if (val.materialType.toLowerCase().includes(rr)) {
            //  ((F6*(1+5%)*100%-(1-D6)*(F6*0.9))) 

            // var Utilization = (val.netWeightKG / val.partFinishWeight).toFixed(2);
            var Utilization = (updateNetweight[index].value / val.partFinishWeight).toFixed(2);

            updateNewRate[index].value = ((parseFloat(updateNewRate[index].value) * (1 + 0.05) * 1 - (1 - parseFloat(Utilization)) * (parseFloat(updateNewRate[index].value) * 0.9)));
            console.log(e_currentTarget_value);

            break;
          }
        }
        /////////////  new rate /////////////

        var UpdatedgrossWeightKG = updateNetweight[index].value / parseFloat(Utilization);

        // let new_unitScrapRate = (updateNewRate[index].value * parseFloat(scrapPercent)).toFixed(4);
        // let t1 = val.grossWeightKG * updateNewRate[index].value;
        // let t2 = (val.grossWeightKG - val.grossNetWeightKG) * parseFloat(new_unitScrapRate);
        let new_unitScrapRate = (updateNewRate[index].value * parseFloat(scrapPercent)).toFixed(4);
        let t1 = UpdatedgrossWeightKG * updateNewRate[index].value;
        let t2 = (UpdatedgrossWeightKG - updateNetweight[index].value) * parseFloat(new_unitScrapRate);

        this.new_Rate = t1 - t2;


        if (val.unitMaterialRate == 0) {
          updated_Rate[index].value = 0;
        }
        else {
          updated_Rate[index].value = this.new_Rate.toFixed(4);
        }
        existing_Cost[index].value = this.new_Rate_existing.toFixed(4);
        this.CalculateTotalMaterialRate(val.casting);
      }
    }
  }


  CalculateTotalMaterialRate(IsMaterialTypeCast: any) {
    ///  IsMaterialTypeCast   --  check casting in material type
    debugger;
    this.TotalMaterialRate_Update = 0;
    this.TotalMaterialRate_Existing = 0;

    this.TotalMaterialRate_Update_casting = 0;
    this.TotalMaterialRate_Existing_casting = 0;


    if (this.IsCastingSheet || IsMaterialTypeCast == 1) {
      const updated_Rate = document.getElementsByClassName("form-control PopupText RMUpdateRate disabled") as any;
      for (let i = 0; i < updated_Rate.length; i++) {
        if (updated_Rate[i].value == "") {
          updated_Rate[i].value = 0;
        }
        if (updated_Rate[i].value > 0) {
          this.TotalMaterialRate_Update = this.TotalMaterialRate_Update + parseFloat(updated_Rate[i].value);
        }
        else {
          this.TotalMaterialRate_Update_casting = this.TotalMaterialRate_Update_casting + parseFloat(updated_Rate[i].value);
        }
      }

      // exsting cost
      const existing_Cost = document.getElementsByClassName("form-control PopupText disabled Existing") as any;
      for (let i = 0; i < existing_Cost.length; i++) {
        if (existing_Cost[i].value == "") {
          existing_Cost[i].value = 0;
        }
        if (updated_Rate[i].value > 0) {
          this.TotalMaterialRate_Existing = this.TotalMaterialRate_Existing + parseFloat(existing_Cost[i].value);
        }
        else {
          this.TotalMaterialRate_Existing_casting = this.TotalMaterialRate_Existing_casting + parseFloat(existing_Cost[i].value);
        }
      }
    }
    else {
      const updated_Rate = document.getElementsByClassName("form-control PopupText RMUpdateRate disabled") as any;
      for (let i = 0; i < updated_Rate.length; i++) {
        if (updated_Rate[i].value == "") {
          updated_Rate[i].value = 0;
        }
        this.TotalMaterialRate_Update = this.TotalMaterialRate_Update + parseFloat(updated_Rate[i].value);
      }

      // exsting cost
      const existing_Cost = document.getElementsByClassName("form-control PopupText disabled Existing") as any;
      for (let i = 0; i < existing_Cost.length; i++) {
        if (existing_Cost[i].value == "") {
          existing_Cost[i].value = 0;
        }
        this.TotalMaterialRate_Existing = this.TotalMaterialRate_Existing + parseFloat(existing_Cost[i].value);
      }
    }


  }


  GetMaterialData(t: string) {
    debugger;;

    this.MaterialGridUpdated = [];
    if (t == 'T1') {
      this.GetMaterialDataTier1();
    }
    else {
      this.GetMaterialDataTier2();
    }

    this.display_Material = "none";


  }

  MaterialGridT1: any = [];
  MaterialGridT2: any = [];

  GetMaterialDataTier1() {
    debugger;
    this.MaterialGridT1 = [];
    const updated_Rate = document.getElementsByClassName("form-control PopupText RMText") as any;
    const updated_Cost = document.getElementsByClassName("form-control PopupText RMUpdateRate disabled") as any;
    const updated_Cost_Existing = document.getElementsByClassName("form-control PopupText disabled Existing") as any;
    const updatedNetWeight = document.getElementsByClassName("form-control PopupText RMTextNetweight") as any;

    for (const key in this.MaterialGrade) {
      this.MaterialGridT1.push(
        {
          'materialType': this.MaterialGrade[key].materialType,
          'materialCost': this.MaterialGrade[key].materialCost,
          'materialScrapRate': this.MaterialGrade[key].materialScrapRate,
          'partFinishWeight': this.MaterialGrade[key].partFinishWeight,
          'grossWeightKG': this.MaterialGrade[key].grossWeightKG,
          'grossNetWeightKG': this.MaterialGrade[key].grossNetWeightKG,
          'unitMaterialRate': this.MaterialGrade[key].unitMaterialRate,
          'netWeightKG': this.MaterialGrade[key].netWeightKG,
          'scrapRate': this.MaterialGrade[key].scrapRate,
          'unitScrapRate': this.MaterialGrade[key].unitScrapRate,
          'updateMaterialRate': updated_Rate[key].value,
          'updateMaterialCost': updated_Cost[key].value,
          'updateMaterialCostExisting': updated_Cost_Existing[key].value,
          'supplyLevel': this.MaterialGrade[key].supplyLevel,
          'casting': this.MaterialGrade[key].casting,
          'updatedNetWeight': updatedNetWeight[key].value,
        });
    }


    const updatedTextbox = document.getElementById('UpdateCost0') as any;

    // if (this.TotalMaterialRate_Update > 0) {
    //   var num = parseFloat(this.DirectMaterialCostT1.replace(",", ""));  ///this.DirectMaterialCostT1; 
    //   let total = num - this.TotalMaterialRate_Existing;
    //   updatedTextbox.value = (total + this.TotalMaterialRate_Update).toFixed(2);
    // }
    // else {
    //   updatedTextbox.value = this.DirectMaterialCostT1;
    // }
    // this.findsumPercent();

    var MaterialContent_Casting = false;

    for (var i = 0; i < this.MaterialGridT1.length; i++) {
      for (var j = 0; j < this.AluminiumCastingGrade.length; j++) {
        var rr = this.AluminiumCastingGrade[j].materialName.toLowerCase();
        if (i != j) {
          if (this.MaterialGridT1[i].materialType.toLowerCase().includes(rr) && this.MaterialGridT1[i].supplyLevel == 'T1') {
            MaterialContent_Casting = true;
            break;
          }
        }
      }
    }

    if (this.TotalMaterialRate_Update > 0) {
      if (MaterialContent_Casting) {
        let t_existing = this.TotalMaterialRate_Existing - Math.abs(this.TotalMaterialRate_Existing_casting);
        let t_Updated = this.TotalMaterialRate_Update - Math.abs(this.TotalMaterialRate_Update_casting);

        var num = parseFloat(this.DirectMaterialCostT1.replace(",", ""));
        let total = (num - t_existing);
        updatedTextbox.value = (total + t_Updated).toFixed(2);
      }
      else {
        var num = parseFloat(this.DirectMaterialCostT1.replace(",", ""));
        let total = num - this.TotalMaterialRate_Existing;
        updatedTextbox.value = (total + this.TotalMaterialRate_Update).toFixed(2);
      }
    }
    else {
      updatedTextbox.value = this.DirectMaterialCostT1;
    }


    this.findsumPercent();


  }



  GetTotalSGA_Profit() {

    const updatedTextbox = document.getElementById('UpdateCost0') as any;
    const unitNon = document.getElementsByClassName("form-control UpdateText Notdisabled Non T1") as any;
    const particular_perValue = document.getElementsByClassName("particular_perValue") as any;

    let Manu_TotalInLocal_test = 0;
    for (let i = 0; i < this.TierCostReportList.length; i++) {
      if (i != 0) {
        Manu_TotalInLocal_test += this.TierCostReportList[i].usdValue;
      }
    }
    Manu_TotalInLocal_test += parseFloat(updatedTextbox.value);

    let tt = 0;
    for (let i = 0; i < unitNon.length; i++) {
      if (particular_perValue[i].children[1] == undefined) {
        tt = 0;
      }
      else {
        tt = (particular_perValue[i].children[1].innerText / 100) * parseFloat(Manu_TotalInLocal_test.toFixed(4));
      }

      unitNon[i].value = tt.toFixed(2);

      this.Non_TotalInLocal_Per = this.Non_TotalInLocal_Per + parseFloat(unitNon[i].value);
    }
    this.Non_TotalInLocal = this.Non_TotalInLocal_Per;

  }

  GetTotalSGA_ProfitT2() {

    const updatedTextbox = document.getElementById('UpdateCost0') as any;
    const unitNon = document.getElementsByClassName("form-control UpdateText Notdisabled Non T2") as any;
    const particular_perValue = document.getElementsByClassName("particular_perValueT2") as any;

    let Manu_TotalInLocal_test = 0;
    for (let i = 0; i < this.TierCostReportList.length; i++) {
      if (i != 0) {
        Manu_TotalInLocal_test += this.TierCostReportList[i].usdValue;
      }
    }
    Manu_TotalInLocal_test += parseFloat(updatedTextbox.value);

    let tt = 0;
    for (let i = 0; i < unitNon.length; i++) {
      if (particular_perValue[i].children[1] == undefined) {
        tt = 0;
      }
      else {
        tt = (particular_perValue[i].children[1].innerText / 100) * parseFloat(Manu_TotalInLocal_test.toFixed(4));
      }

      unitNon[i].value = tt.toFixed(2);

      this.Non_TotalInLocal_Per = this.Non_TotalInLocal_Per + parseFloat(unitNon[i].value);
    }
    this.Non_TotalInLocal = this.Non_TotalInLocal_Per;

  }

  GetMaterialDataTier2() {
    debugger;
    this.MaterialGridT2 = [];
    const updated_Rate = document.getElementsByClassName("form-control PopupText RMText") as any;
    const updated_Cost = document.getElementsByClassName("form-control PopupText RMUpdateRate disabled") as any;
    const updated_Cost_Existing = document.getElementsByClassName("form-control PopupText disabled Existing") as any;
    const updatedNetWeight = document.getElementsByClassName("form-control PopupText RMTextNetweight") as any;

    for (const key in this.MaterialGrade) {
      // if (this.MaterialGrade[key].casting == 0) {
      this.MaterialGridT2.push(
        {
          'materialType': this.MaterialGrade[key].materialType,
          'materialCost': this.MaterialGrade[key].materialCost,
          'materialScrapRate': this.MaterialGrade[key].materialScrapRate,
          'partFinishWeight': this.MaterialGrade[key].partFinishWeight,
          'grossWeightKG': this.MaterialGrade[key].grossWeightKG,
          'grossNetWeightKG': this.MaterialGrade[key].grossNetWeightKG,
          'unitMaterialRate': this.MaterialGrade[key].unitMaterialRate,
          'netWeightKG': this.MaterialGrade[key].netWeightKG,
          'scrapRate': this.MaterialGrade[key].scrapRate,
          'unitScrapRate': this.MaterialGrade[key].unitScrapRate,
          'updateMaterialRate': updated_Rate[key].value,
          'updateMaterialCost': updated_Cost[key].value,
          'updateMaterialCostExisting': updated_Cost_Existing[key].value,
          'supplyLevel': this.MaterialGrade[key].supplyLevel,
          'casting': this.MaterialGrade[key].casting,
          'updatedNetWeight': updatedNetWeight[key].value,
        });
      // }
    }


    const updatedTextbox = document.getElementById('UpdateCostT20') as any;

    // if (this.IsCastingSheet) {
    //   //if (this.TotalMaterialRate_Update_casting > 0) {
    //   let total = this.DirectMaterialCostT1_casting - this.TotalMaterialRate_Existing_casting;
    //   updatedTextbox.value = (total + this.TotalMaterialRate_Update_casting).toFixed(2);
    //   //}
    //   //else {
    //   //updatedTextbox.value = this.DirectMaterialCostT2;
    //   //}
    // }
    // else {

    var MaterialContent_Casting = false;
    // for (var i = 0; i < this.MaterialGridT2.length; i++) {
    //   for (var j = 0; j < this.MaterialGridT2.length; j++) {
    //     if (i != j) {
    //       if (this.MaterialGridT2[i].materialType == this.MaterialGridT2[j].materialType && this.MaterialGridT2[i].supplyLevel == this.MaterialGridT2[j].supplyLevel) {
    //         MaterialContent_Casting = true;
    //         break;
    //       }
    //     }
    //   }
    // }

    for (var i = 0; i < this.MaterialGridT2.length; i++) {
      for (var j = 0; j < this.AluminiumCastingGrade.length; j++) {
        var rr = this.AluminiumCastingGrade[j].materialName.toLowerCase();
        if (i != j) {
          if (this.MaterialGridT2[i].materialType.toLowerCase().includes(rr) && this.MaterialGridT2[i].supplyLevel == 'T2') {
            MaterialContent_Casting = true;
            break;
          }
        }
      }
    }


    if (this.TotalMaterialRate_Update > 0) {

      //if (this.IsCastingSheet) {
      if (MaterialContent_Casting) {
        // let t_existing = this.TotalMaterialRate_Existing - Math.abs(this.TotalMaterialRate_Existing_casting);
        // let t_Updated = this.TotalMaterialRate_Update - Math.abs(this.TotalMaterialRate_Update_casting);

        let t_existing = this.TotalMaterialRate_Existing;
        let t_Updated = this.TotalMaterialRate_Update;

        var num = parseFloat(this.DirectMaterialCostT2.replace(",", ""));
        let total = (num - t_existing);
        updatedTextbox.value = (total + t_Updated).toFixed(2);
      }
      else {
        var num = parseFloat(this.DirectMaterialCostT2.replace(",", ""));
        let total = num - this.TotalMaterialRate_Existing;
        updatedTextbox.value = (total + this.TotalMaterialRate_Update).toFixed(2);
      }

      // }
      // else {
      //   let total = this.DirectMaterialCostT2 - this.TotalMaterialRate_Existing;
      //   updatedTextbox.value = (total + this.TotalMaterialRate_Update).toFixed(2);
      // }
    }
    else {
      updatedTextbox.value = this.DirectMaterialCostT2;
    }
    //}

    this.GetTotalSGA_Profit();
    this.GetTotalSGA_ProfitT2();
    this.findsumPercentT2();
  }


  displaymodal = 'none';
  header = 'Update Model Details';
  txt_btn = 'Update';

  updatemodeldatavalidation =
    {
      csheaderid: '',
      partnumber: '',
      programname: '',
      projecttype: '',
      potentialsupplier: '',
      businessunit: '',
      annualvolume: '',
      enginedisplacement: '',
      supplierquote: ''
    }

  hasAnyUpdateData(): boolean {
    return Object.values(this.updatemodeldatavalidation).some(val => val && val.trim() !== '');
  }



  async openupdatemodal() {
    debugger;
    if (this.YellowModel_MarketBenchmark != true) {
      const result = await Swal.fire({
        title: 'Do you want to update Model Details?',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        allowOutsideClick: true,
        customClass: {
          popup: 'custom-swal-popup',
        },
      });

      if (result.isConfirmed) {
        this.displaymodal = "block";
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
        this.GetReport();
      }
      else if (result.dismiss === Swal.DismissReason.backdrop) {
      }
    }
    else {
      this.GetReport();
    }

  };

  closeopenupdatemodal() {
    this.displaymodal = "none";
  }

  updatemodeldetails() {
    this.GetReport();
  }

  async GetReport() {
    debugger;

    this.SpinnerService.show('spinner');

    //debugger;;
    var a = 0;

    if (this.TierCostReportList[0].particular == 'Machining Scrap Credit') {
      this.IsCastingSheet = true;
      localStorage.setItem('IsCastingSheet', '1');
    }
    else {
      this.IsCastingSheet = false;
      localStorage.setItem('IsCastingSheet', '0');
    }

    if (this.Tier2CostReportList != undefined) {
      this.IsCastingSheet = true;
      localStorage.setItem('IsCastingSheet', '1');
    }

    this.MatetialTierUpdate = [];
    this.MaterialGridUpdated = [];
    this.updatemodeldata = [];

    //////  Material Grade
    for (const key in this.MaterialGridT1) {
      this.MaterialGridUpdated.push(
        {
          CSHeaderId: this.CSHeaderId,
          MaterialType: this.MaterialGridT1[key].materialType,
          MaterialCost: this.MaterialGridT1[key].materialCost,
          MaterialScrapRate: this.MaterialGridT1[key].materialScrapRate,
          PartFinishWeight: this.MaterialGridT1[key].partFinishWeight,
          GrossWeightKG: this.MaterialGridT1[key].grossWeightKG,
          UnitMaterialRate: this.MaterialGridT1[key].unitMaterialRate,
          NetWeightKG: this.MaterialGridT1[key].netWeightKG,
          GrossNetWeightKG: this.MaterialGridT1[key].grossNetWeightKG,
          ScrapRate: this.MaterialGridT1[key].scrapRate,
          UnitScrapRate: this.MaterialGridT1[key].unitScrapRate,
          UpdateMaterialRate: this.MaterialGridT1[key].updateMaterialRate,
          UpdateMaterialCost: this.MaterialGridT1[key].updateMaterialCost,
          Created_By: this.userId,
          SupplyLevel: this.MaterialGridT1[key].supplyLevel,
          Casting: this.MaterialGridT1[key].casting,
          UpdatenetWeightKG: this.MaterialGridT1[key].updatedNetWeight,
        });
    }

    console.log(this.MaterialGridT1);
    console.log(this.MaterialGridUpdated);

    for (const key in this.MaterialGridT2) {
      this.MaterialGridUpdated.push(
        {
          CSHeaderId: this.CSHeaderId,
          MaterialType: this.MaterialGridT2[key].materialType,
          MaterialCost: this.MaterialGridT2[key].materialCost,
          MaterialScrapRate: this.MaterialGridT2[key].materialScrapRate,
          PartFinishWeight: this.MaterialGridT2[key].partFinishWeight,
          GrossWeightKG: this.MaterialGridT2[key].grossWeightKG,
          UnitMaterialRate: this.MaterialGridT2[key].unitMaterialRate,
          NetWeightKG: this.MaterialGridT2[key].netWeightKG,
          GrossNetWeightKG: this.MaterialGridT2[key].grossNetWeightKG,
          ScrapRate: this.MaterialGridT2[key].scrapRate,
          UnitScrapRate: this.MaterialGridT2[key].unitScrapRate,
          UpdateMaterialRate: this.MaterialGridT2[key].updateMaterialRate,
          UpdateMaterialCost: this.MaterialGridT2[key].updateMaterialCost,
          Created_By: this.userId,
          SupplyLevel: this.MaterialGridT2[key].supplyLevel,
          Casting: this.MaterialGridT2[key].casting,
          UpdatenetWeightKG: this.MaterialGridT2[key].updatedNetWeight,
        });
    }

    for (const key in this.userAddedCostList1Update) {
      this.SaveProcessDetails.push(
        {
          PartNumber: this.userAddedCostList1Update[key].partNumber,
          ManufacturingProcessName: this.userAddedCostList1Update[key].manufacturingProcessName,
          ManufacturingCost: this.userAddedCostList1Update[key].manufacturingCost,
          UpdateManufacturingCost: this.userAddedCostList1Update[key].updatedCost,
          SupplyLevel: this.userAddedCostList1Update[key].supplyLevel,
          ProcessStatus: this.userAddedCostList1Update[key].processStatus
        }
      )
    }

    for (const key in this.userAddedCostList1UpdateT2) {
      this.SaveProcessDetails.push(
        {
          PartNumber: this.userAddedCostList1UpdateT2[key].partNumber,
          ManufacturingProcessName: this.userAddedCostList1UpdateT2[key].manufacturingProcessName,
          ManufacturingCost: this.userAddedCostList1UpdateT2[key].manufacturingCost,
          UpdateManufacturingCost: this.userAddedCostList1UpdateT2[key].updatedCost,
          SupplyLevel: this.userAddedCostList1UpdateT2[key].supplyLevel,
          ProcessStatus: this.userAddedCostList1UpdateT2[key].processStatus
        }
      )
    }

    this.updatemodeldata.push(
      {
        csheaderid: this.CSHeaderId,
        partnumber: this.updatemodeldatavalidation.partnumber,
        programname: this.updatemodeldatavalidation.programname,
        projecttype: this.updatemodeldatavalidation.projecttype,
        potentialsupplier: this.updatemodeldatavalidation.potentialsupplier,
        businessunit: this.updatemodeldatavalidation.businessunit,
        annualvolume: this.updatemodeldatavalidation.annualvolume,
        enginedisplacement: this.updatemodeldatavalidation.enginedisplacement,
        supplierquote: this.updatemodeldatavalidation.supplierquote
      }
    )


    this.GetUpdateReocrdForTier('T1');
    //if (this.T2count) {
    this.GetUpdateReocrdForTier('T2');
    //}

    debugger;

    this.saveMatetialCost.push({
      "SaveMatetialCostHeader": this.MatetialTierUpdate,
      "SaveMatetialCostDetails": this.MaterialGridUpdated,
      "SaveProcessDetails": this.SaveProcessDetails,
      "updatemodeldata": this.updatemodeldata
    });


    debugger;
    const data = await this.searchservice.SaveMatetialCost(this.saveMatetialCost, this.userId, this.IsCastingSheet).toPromise();

    if (data == 0) {
      this.SpinnerService.hide('spinner');
      alert("Should Cost Not Updated !!!");
      return
    }
    else {
      localStorage.setItem("DTCSCReportId", data);
      this.SpinnerService.hide('spinner');
      if (!this.YellowModel_MarketBenchmark) {
        alert("Should Cost Updated !!!");
      }
    }

    this.SpinnerService.hide('spinner');
    this.router.navigate(['/home/designtocost/step3']);
  }




  UpdateRate: any;
  updateRateNon: any;
  TierCostReportTextT1: any;
  TierCostReportNonTextT1: any;
  existingusdValue: any;
  existingNonusdValue: any;
  percent_updated: any;

  GetUpdateReocrdForTier(t: string) {

    // ---------------------- new code start ------------------------------

    debugger;;


    if (t == 'T1') {
      this.TierCostReportTextT1 = document.getElementsByClassName("TierCostReportTextT1") as any;
      this.existingusdValue = document.getElementsByClassName('TierCostReportListusdValueT1') as any;
      this.TierCostReportNonTextT1 = document.getElementsByClassName("TierCostReportNonTextT1") as any;
      this.UpdateRate = document.getElementsByClassName("form-control UpdateText disabled NotNon T1") as any;
      this.updateRateNon = document.getElementsByClassName("form-control UpdateText Notdisabled Non T1") as any;
      this.existingNonusdValue = document.getElementsByClassName('NonusdValueT1') as any;
      this.percent_updated = document.getElementsByClassName('form-control percentText Non T1') as any;

      var TarifT1;
      const TarifUpdatedT1 = document.getElementById('TarifUpdatedT1') as any;
      if (TarifUpdatedT1.value != "") {
        TarifT1 = TarifUpdatedT1.value;
      }
      else {
        TarifT1 = 0;
      }


      for (var i = 0; i < this.TierCostReportTextT1.length; i++) {
        for (var j = i; j < this.UpdateRate.length; j++) {
          this.MatetialTierUpdate.push(
            {
              CSHeaderId: this.CSHeaderId,
              header: this.TierCostReportTextT1[i].innerText,
              value_existing: this.existingusdValue[i].innerText,
              // header: this.TierCostReportList[i].particular,
              // value_existing: this.TierCostReportList[i].usdValue,
              value_updated: this.UpdateRate[i].value,
              Cost_Spec: 'TMC',
              Version: 'T1',
              percent_updated: 0,
            });
          break;
        }
      }

      this.MatetialTierUpdate.push(
        {
          CSHeaderId: this.CSHeaderId,
          header: 'Total Manufacturing Cost',
          value_existing: this.Manu_TotalInUSD,
          value_updated: this.Manu_TotalInLocal,
          Cost_Spec: 'TMC',
          Version: 'T1',
          percent_updated: 0,
        });

      for (var i = 0; i < this.TierCostReportNonTextT1.length; i++) {
        for (var j = i; j < this.updateRateNon.length; j++) {
          this.MatetialTierUpdate.push(
            {
              CSHeaderId: this.CSHeaderId,
              header: this.TierCostReportNonTextT1[i].innerText,
              value_existing: this.existingNonusdValue[i].innerText,
              // header: this.TierCostReportNonList[i].particular,
              // value_existing: this.TierCostReportNonList[i].usdValue,
              value_updated: this.updateRateNon[i].value,
              Cost_Spec: 'TC',
              Version: 'T1',
              percent_updated: this.percent_updated[i].value,
            });
          break;
        }
      }

      this.MatetialTierUpdate.push(
        {
          CSHeaderId: this.CSHeaderId,
          header: 'Part Cost',
          value_existing: this.TotalInUSD,
          value_updated: this.TotalInLocal,
          Cost_Spec: 'TC',
          Version: 'T1',
          percent_updated: 0,
        });

      this.MatetialTierUpdate.push(
        {
          CSHeaderId: this.CSHeaderId,
          header: 'Tariff Cost',
          value_existing: 0,
          value_updated: TarifT1,
          Cost_Spec: 'TR',
          Version: 'T1',
          percent_updated: this.TotalTeriffPercentT1 != undefined ? this.TotalTeriffPercentT1 : 0,
        });

      this.MatetialTierUpdate.push(
        {
          CSHeaderId: this.CSHeaderId,
          header: 'Total Cost',
          value_existing: this.TotalInUSD,
          value_updated: this.TotalandTeriffInLocalT1,
          Cost_Spec: 'TC',
          Version: 'T1',
          percent_updated: 0,
        });


    }

    else {

      debugger;
      if (this.Tier2CostReportList == undefined) {
        return
      }

      this.TierCostReportTextT1 = document.getElementsByClassName("TierCostReportTextT2") as any;
      this.existingusdValue = document.getElementsByClassName('TierCostReportListusdValueT2') as any;
      this.TierCostReportNonTextT1 = document.getElementsByClassName("TierCostReportNonTextT2") as any;
      this.UpdateRate = document.getElementsByClassName("form-control UpdateText disabled NotNon T2") as any;
      this.updateRateNon = document.getElementsByClassName("form-control UpdateText Notdisabled Non T2") as any;
      this.existingNonusdValue = document.getElementsByClassName('NonusdValueT2') as any;
      this.percent_updated = document.getElementsByClassName('form-control percentText Non T2') as any;

      var TarifT2;
      const TarifUpdatedT2 = document.getElementById('TarifUpdatedT2') as any;
      if (TarifUpdatedT2.value != "") {
        TarifT2 = TarifUpdatedT2.value;
      }
      else {
        TarifT2 = 0;
      }

      for (var i = 0; i < this.TierCostReportTextT1.length; i++) {
        for (var j = i; j < this.UpdateRate.length; j++) {
          this.MatetialTierUpdate.push(
            {
              CSHeaderId: this.CSHeaderId,
              header: this.TierCostReportTextT1[i].innerText,
              value_existing: this.existingusdValue[i].innerText,
              // header: this.Tier2CostReportList[i].particular,
              // value_existing: this.Tier2CostReportList[i].usdValue,
              value_updated: this.UpdateRate[i].value,
              Cost_Spec: 'TMC',
              Version: 'T2',
              percent_updated: 0,
            });
          break;
        }
      }

      if (this.TierCostReportTextT1.length > 0) {
        this.MatetialTierUpdate.push(
          {
            CSHeaderId: this.CSHeaderId,
            header: 'Total Manufacturing Cost',
            value_existing: this.Manu_TotalInUSDT2,
            value_updated: this.Manu_TotalInLocalT2,
            Cost_Spec: 'TMC',
            Version: 'T2',
            percent_updated: 0,
          });
      }

      for (var i = 0; i < this.TierCostReportNonTextT1.length; i++) {
        for (var j = i; j < this.updateRateNon.length; j++) {
          this.MatetialTierUpdate.push(
            {
              CSHeaderId: this.CSHeaderId,
              header: this.TierCostReportNonTextT1[i].innerText,
              value_existing: this.existingNonusdValue[i].innerText,
              // header: this.Tier2CostReportNonList[i].particular,
              // value_existing: this.Tier2CostReportNonList[i].usdValue,
              value_updated: this.updateRateNon[i].value,
              Cost_Spec: 'TC',
              Version: 'T2',
              percent_updated: this.percent_updated[i].value
            });
          break;
        }
      }



      if (this.TierCostReportTextT1.length > 0) {
        this.MatetialTierUpdate.push(
          {
            CSHeaderId: this.CSHeaderId,
            header: 'Part Cost',
            value_existing: this.TotalInUSDT2,
            value_updated: this.TotalInLocalT2,
            Cost_Spec: 'TC',
            Version: 'T2',
            percent_updated: 0,
          });

        this.MatetialTierUpdate.push(
          {
            CSHeaderId: this.CSHeaderId,
            header: 'Tariff Cost',
            value_existing: 0,
            value_updated: TarifT2,
            Cost_Spec: 'TR',
            Version: 'T2',
            percent_updated: this.TotalTeriffPercentT2 != undefined ? this.TotalTeriffPercentT2 : 0,
          });


        this.MatetialTierUpdate.push(
          {
            CSHeaderId: this.CSHeaderId,
            header: 'Total Cost',
            value_existing: this.TotalInUSDT2,
            value_updated: this.TotalandTeriffInLocalT2,
            Cost_Spec: 'TC',
            Version: 'T2',
            percent_updated: 0,
          });
      }


    }


    console.log(this.MatetialTierUpdate);


    // ---------------------- new code end ------------------------------


  }

  onCloseHandled_Popup() {
    this.display = "none";
  }


  backToPreviousPage() {
    this.location.back();
  }

  // ---------------------- mfg process ------------------------------

  totalInitialCost: number = 0;
  Cal_totalInitialCost: number = 0;
  Cal_totalInitialCostT2: number = 0;
  totalInitialCost_T2: number = 0;
  costDifference: number = 0;
  costDifferenceT2: number = 0;
  // isModalOpen = false;
  userAddedCostList: any = [];
  userAddedCostList1Update: any = [];
  userAddedCostList1UpdateT2: any = [];
  // isModal1Open: boolean = false;
  // isTier1Modal: boolean = true;
  totalUpdatedCost: number = 0;
  newPart: any;
  newProcess: any;
  newUpdatedCost: any;
  costDifference1: number = 0;
  costDifference_T2: number = 0;
  initialCostList: any[] = [];
  togglestates: boolean[] = [];
  backupUserAddedCostList: any[] = [];
  previousUserAddedCostList: any[] = [];

  display_process = "none";
  TarifValueT1: number = 0;
  IsHiddenT1_process = true;


  async openModalProcess(Supplierlevel: any) {
    debugger;

    this.display_process = "block";
    this.ModelPopUpheaderLable = "User Added Cost" + '¹';

    this.userAddedCostList = [];
    try {

      if (Supplierlevel == 'T1') {
        this.IsHiddenT1_process = true;
        if (this.userAddedCostList1Update.length > 0) {

          this.userAddedCostList = this.userAddedCostList1Update;
          this.togglestates = this.userAddedCostList.map((item: { processStatus: any; }) => item.processStatus ?? true);

          console.log(this.userAddedCostList);
          console.log(this.userAddedCostList1Update);

          this.calculateTotal();

          setTimeout(() => {
            for (var i = 0; i < this.userAddedCostList.length; i++) {
              const txt = document.getElementById("PopUpProcess" + i) as any;
              if (this.userAddedCostList[i].csHeaderId > 0) {
                if (!this.userAddedCostList[i].processStatus) {
                  this.userAddedCostList[i].updatedCost = "0.00";
                  this.userAddedCostList[i].processStatus = 0;
                  txt.readOnly = true;
                  txt.style.backgroundColor = "#8080801a";
                } else {
                  this.userAddedCostList[i].updatedCost = this.userAddedCostList[i].manufacturingCost.toFixed(2);
                  this.userAddedCostList[i].processStatus = 1;
                  txt.readOnly = false;
                  txt.style.backgroundColor = "#fff";
                }
              }

            }
          }, 500);

          return;
        }
      }
      else {
        this.IsHiddenT1_process = false;
        if (this.userAddedCostList1UpdateT2.length > 0) {

          this.userAddedCostList = this.userAddedCostList1UpdateT2;
          this.togglestates = this.userAddedCostList.map((item: { processStatus: any; }) => item.processStatus ?? true);
          console.log(this.userAddedCostList);
          console.log(this.userAddedCostList1UpdateT2);
          this.calculateTotal();

          setTimeout(() => {
            for (var i = 0; i < this.userAddedCostList.length; i++) {
              const txt = document.getElementById("PopUpProcess" + i) as any;
              if (this.userAddedCostList[i].csHeaderId > 0) {
                if (!this.userAddedCostList[i].processStatus && this.userAddedCostList[i].csHeaderId > 0) {
                  this.userAddedCostList[i].updatedCost = "0.00";
                  this.userAddedCostList[i].processStatus = 0;
                  txt.readOnly = true;
                  txt.style.backgroundColor = "#8080801a";
                } else {
                  this.userAddedCostList[i].updatedCost = this.userAddedCostList[i].manufacturingCost.toFixed(2);
                  this.userAddedCostList[i].processStatus = 1;
                  txt.readOnly = false;
                  txt.style.backgroundColor = "#fff";
                }
              }

            }
          }, 500);

          return;
        }
      }

      this.userAddedCostList = [];
      const filteredSubPartDetails = await this.searchservice.GetSubpartProcessData(Supplierlevel, this.CSHeaderId).toPromise();
      this.userAddedCostList = filteredSubPartDetails.map((item: { manufacturingCost: any }) => ({
        ...item,
        updatedCost: item.manufacturingCost.toFixed(2),
      }));
      this.togglestates = this.userAddedCostList.map(() => true);
    }
    catch (error: any) {
      console.error('Error fetching data:', error);
    }

    this.calculateTotal();
  }


  onCloseHandled_ProcessPopup() {
    this.display_process = "none";
  }



  toggleCost(index: number) {
    debugger;
    this.togglestates[index] = !this.togglestates[index];
    //  this.userAddedCostList[index].isEnabled = !this.userAddedCostList[index];
    //PopUpProcess

    const txt = document.getElementById("PopUpProcess" + index) as any;

    if (!this.togglestates[index]) {
      this.userAddedCostList[index].updatedCost = "0.00";
      this.userAddedCostList[index].processStatus = 0;
      txt.readOnly = true;
      txt.style.backgroundColor = "#8080801a";
    } else {
      this.userAddedCostList[index].updatedCost = this.userAddedCostList[index].manufacturingCost.toFixed(2);
      this.userAddedCostList[index].processStatus = 1;
      txt.readOnly = false;
      txt.style.backgroundColor = "#fff";
    }

    localStorage.setItem('toggleStates', JSON.stringify(this.togglestates));
    this.previousUserAddedCostList = JSON.parse(
      JSON.stringify(this.userAddedCostList)
    );

    this.calculateTotal();
  }


  isEnabled(index: number): boolean {
    return this.togglestates[index] ?? false;
  }

  updateRowCost(index: number, event: any, item: any) {
    debugger;

    const value = event.target.value ? parseFloat(event.target.value) : 0;
    this.userAddedCostList[index].updatedCost = value;
    // this.previousUserAddedCostList = JSON.parse(
    //   JSON.stringify(this.userAddedCostList)
    // );
    this.calculateTotal();

  }


  addNewProcess() {
    debugger;

    let inputField = document.getElementById("newPart") as any;
    this.newPart = inputField.value;

    let inputField2 = document.getElementById("newProcess") as any;
    this.newProcess = inputField2.value;

    let inputField3 = document.getElementById("newUpdatedCost") as any;
    this.newUpdatedCost = inputField3.value;

    if (inputField.value == "") {
      this.toastr.warning("Please enter Part Number");
      return;
    }
    if (inputField2.value == "") {
      this.toastr.warning("Please enter Process Name");
      return;
    }
    if (inputField3.value == "") {
      this.toastr.warning("Please enter Cost");
      return;
    }

    console.log(this.newPart, this.newProcess, this.newUpdatedCost);

    const data = {
      csHeaderId: 0,
      manufacturingCost: 0,
      manufacturingProcessName: this.newProcess,
      partNumber: this.newPart,
      supplyLevel: 'T1',
      updatedCost: Number(this.newUpdatedCost)
    };

    this.userAddedCostList.push(data);

    this.calculateTotal();

    inputField.value = '';
    inputField2.value = '';
    inputField3.value = null;

    const box = document.getElementById("ProcessPopup") as any;
    box.style.display = "none";

  }


  saveUserAddedCost(supplyvalue: any) {
    debugger;
    console.log('Saving User Added Costs:', this.userAddedCostList);

    if (supplyvalue == 'T1') {
      this.userAddedCostList1Update = [];

      for (const key in this.userAddedCostList) {
        var ProcessStatus;
        if (this.userAddedCostList[key].csHeaderId == 0) {
          ProcessStatus = 2;
        }
        else {
          ProcessStatus = this.userAddedCostList[key].processStatus
        }

        this.userAddedCostList1Update.push(
          {
            'csHeaderId': this.userAddedCostList[key].csHeaderId,
            'partNumber': this.userAddedCostList[key].partNumber,
            'manufacturingProcessName': this.userAddedCostList[key].manufacturingProcessName,
            'manufacturingCost': this.userAddedCostList[key].manufacturingCost,
            'updatedCost': this.userAddedCostList[key].updatedCost,
            'supplyLevel': supplyvalue,
            'processStatus': ProcessStatus
          });
      }

      // localStorage.setItem('savedUserAddedCostList', JSON.stringify(this.userAddedCostList));

      var manufacturingCost = this.userAddedCostList.reduce((sum: any, item: { manufacturingCost: any; }) => sum + (parseFloat(item.manufacturingCost) || 0), 0);
      var updatedCost = this.userAddedCostList.reduce((sum: any, item: { updatedCost: any; }) => sum + (parseFloat(item.updatedCost) || 0), 0);

      this.costDifference = parseFloat(updatedCost) - parseFloat(manufacturingCost);
      this.Cal_totalInitialCost = manufacturingCost;

      const UpdateCostUserAddedT1 = document.getElementById('UpdateCostUserAddedT1') as any;
      if (UpdateCostUserAddedT1) {
        UpdateCostUserAddedT1.value = this.costDifference.toFixed(2);
      }

      this.findsumPercent();

    }
    else {
      this.userAddedCostList1UpdateT2 = [];

      for (const key in this.userAddedCostList) {
        var ProcessStatus;
        if (this.userAddedCostList[key].csHeaderId == 0) {
          ProcessStatus = 2;
        }
        else {
          ProcessStatus = this.userAddedCostList[key].processStatus
        }

        this.userAddedCostList1UpdateT2.push(
          {
            'csHeaderId': this.userAddedCostList[key].csHeaderId,
            'partNumber': this.userAddedCostList[key].partNumber,
            'manufacturingProcessName': this.userAddedCostList[key].manufacturingProcessName,
            'manufacturingCost': this.userAddedCostList[key].manufacturingCost,
            'updatedCost': this.userAddedCostList[key].updatedCost,
            'supplyLevel': supplyvalue,
            'processStatus': ProcessStatus
          });
      }

      // localStorage.setItem('savedUserAddedCostList', JSON.stringify(this.userAddedCostList));

      var manufacturingCost = this.userAddedCostList.reduce((sum: any, item: { manufacturingCost: any; }) => sum + (parseFloat(item.manufacturingCost) || 0), 0);
      var updatedCost = this.userAddedCostList.reduce((sum: any, item: { updatedCost: any; }) => sum + (parseFloat(item.updatedCost) || 0), 0);

      this.costDifferenceT2 = parseFloat(updatedCost) - parseFloat(manufacturingCost);
      this.Cal_totalInitialCostT2 = manufacturingCost;

      const UpdateCostUserAddedT2 = document.getElementById('UpdateCostUserAddedT2') as any;
      if (UpdateCostUserAddedT2) {
        UpdateCostUserAddedT2.value = this.costDifferenceT2.toFixed(2);
      }

      this.findsumPercentT2();

    }


    //this.backupUserAddedCostList = JSON.parse(JSON.stringify(this.userAddedCostList));

    this.onCloseHandled_ProcessPopup();

  }


  calculateTotal() {
    debugger;

    this.totalInitialCost = this.userAddedCostList.reduce(
      (sum: any, item: { manufacturingCost: any; }) => sum + (parseFloat(item.manufacturingCost) || 0),
      0
    );


    this.totalUpdatedCost = this.userAddedCostList
      .filter((_: any, i: number) => this.isEnabled(i)) // Only sum enabled items
      .reduce((sum: any, item: { updatedCost: any; }) => sum + (parseFloat(item.updatedCost) || 0), 0);

    this.totalUpdatedCost = this.userAddedCostList
      .reduce((sum: any, item: { updatedCost: any; }) => sum + (parseFloat(item.updatedCost) || 0), 0);

    this.costDifference1 = this.totalUpdatedCost - this.totalInitialCost;

  }

  removeAddedProcess(item: any) {

    this.userAddedCostList.splice(item, 1);
    this.calculateTotal();

  }

  ShowNewProcessPopup() {
    const box = document.getElementById("ProcessPopup") as any;
    box.style.display = "flex";

  }

  closeaddNewProcess() {
    const box = document.getElementById("ProcessPopup") as any;
    box.style.display = "none";
  }


  updateTotalCost(supplyLevel: any) {
    debugger;
    if (supplyLevel == 'T1') {
      this.findsumPercent();
    }
    else {
      this.findsumPercentT2();
    }

  }




  Notes1_Tariff = "Use this pop-up window to add Tariff as a percentage of Part Cost.";
  Notes2_Tariff = 'Add Tariff as a percentage of Part Cost, if required';
  Notes3_Tariff: any;
  IsHiddenT1_Tarrif = false;
  totalcostforTeriff: any;

  onCloseHandled_TariffPopup() {
    this.display_Tariff = "none";
  }

  openModalTariff(supplyLevel: any) {
    debugger;
    this.display_Tariff = "block";
    this.totalcostforTeriff = 0;
    if (supplyLevel == 'T1') {
      this.IsHiddenT1_Tarrif = true;
      this.Notes3_Tariff = "Part Cost is : " + this.TotalInLocal.toFixed(2);
      const SetValueTarifUpdatedT1 = document.getElementById('UpdateTariff_Popup') as any;
      this.totalcostforTeriff = this.TotalInLocal.toFixed(2);

      if (this.TotalTeriffPercentT1 != undefined) {
        SetValueTarifUpdatedT1.value = this.TotalTeriffPercentT1;
      }
      else {
        SetValueTarifUpdatedT1.value = '';
      }

    }
    else {
      this.IsHiddenT1_Tarrif = false;
      this.Notes3_Tariff = "Part Cost is : " + this.TotalInLocalT2.toFixed(2);
      const SetValueTarifUpdatedT2 = document.getElementById('UpdateTariff_Popup') as any;
      this.totalcostforTeriff = this.TotalInLocalT2.toFixed(2);

      if (this.TotalTeriffPercentT2 != undefined) {
        SetValueTarifUpdatedT2.value = this.TotalTeriffPercentT2;
      }
      else {
        SetValueTarifUpdatedT2.value = '';
      }
    }

    this.CalculatePercent_Teriff();
  }


  TarifT1Cost: any;
  TarifT2Cost: any;
  SaveTariff(supplyLevel: any) {
    debugger;
    if (supplyLevel == 'T1') {
      this.TarifT1Cost = 0;

      const UpdateTariff_Popup = document.getElementById('UpdateTariff_Popup') as any;
      const SetValueTarifUpdatedT1 = document.getElementById('TarifUpdatedT1') as any;
      const TarifUpdatedT1 = document.getElementById('TotalTariff_Popup') as any;

      if (TarifUpdatedT1.value != "") {
        this.TarifT1Cost = TarifUpdatedT1.value;
        SetValueTarifUpdatedT1.value = this.TarifT1Cost;
        this.TotalTeriffPercentT1 = UpdateTariff_Popup.value;
      }
      else {
        this.TarifT1Cost = 0;
        SetValueTarifUpdatedT1.value = this.TarifT1Cost;
        this.TotalTeriffPercentT1 = undefined;
      }

      this.findsumPercent();
    }
    else {

      this.TarifT2Cost = 0;

      const UpdateTariff_Popup = document.getElementById('UpdateTariff_Popup') as any;
      const SetValueTarifUpdatedT2 = document.getElementById('TarifUpdatedT2') as any;
      const TarifUpdatedT2 = document.getElementById('TotalTariff_Popup') as any;

      if (TarifUpdatedT2.value != "") {
        this.TarifT2Cost = TarifUpdatedT2.value;
        SetValueTarifUpdatedT2.value = this.TarifT2Cost;
        this.TotalTeriffPercentT2 = UpdateTariff_Popup.value;
      }
      else {
        this.TarifT2Cost = 0;
        SetValueTarifUpdatedT2.value = this.TarifT2Cost;
        this.TotalTeriffPercentT2 = undefined;
      }

      this.findsumPercentT2();
    }

    this.onCloseHandled_TariffPopup();

  }


  CalculatePercent_Teriff() {
    debugger;
    //TotalTeriffPercentT1
    const UpdateTariff_Popup = document.getElementById('UpdateTariff_Popup') as any;
    const TotalTariff_Popup = document.getElementById('TotalTariff_Popup') as any;
    const TotalTeriffandCost_Popup = document.getElementById('TotalTeriffandCost_Popup') as any;

    if (UpdateTariff_Popup.value > 0) {
      var rr = (parseFloat(UpdateTariff_Popup.value) / 100) * parseFloat(this.totalcostforTeriff.replace(/,/g, ""));
      TotalTariff_Popup.value = rr.toFixed(2);
      var tt = parseFloat(this.totalcostforTeriff.replace(/,/g, "")) + parseFloat(TotalTariff_Popup.value);
      TotalTeriffandCost_Popup.value = tt.toFixed(2);

    }
    else {
      TotalTariff_Popup.value = null;
      TotalTeriffandCost_Popup.value = null
    }

  }


  async FrequentlyUsedMaterialGrade() {
    this.FrequentlyUsedMaterialsData = [];

    const data = await this.reportService.GetFrequentlyusedmaterialgrade().toPromise();
    this.FrequentlyUsedMaterialsData = data;
    this.display_frequentlyUsedMaterials = "block";


  }


  ClosefrequentlyUsedMaterialsPopup() {
    this.display_frequentlyUsedMaterials = "none";
  }


}
