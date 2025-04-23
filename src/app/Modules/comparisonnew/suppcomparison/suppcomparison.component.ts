import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { suppliercost } from 'src/app/Model/suppliercost';
import { SearchService } from 'src/app/SharedServices/search.service';



@Component({
  selector: 'app-suppcomparison',
  templateUrl: './suppcomparison.component.html',
  styleUrl: './suppcomparison.component.css'
})
export class SuppcomparisonComponent {

  chartOptions: any;
  SuppcostchartOptions: any[] = [];

  CommericalDetailsSupplierCost: suppliercost[] = [];
  Shouldcost: any;
  comparedata: any[] = [];
  mappedcomparedata: any[] = [];
  suppcomparedata: any[] = [];
  suppmappedcomparedata: any[] = [];
  Tariff: any[] = [];
  chartloaded: boolean = false;
  Totshouldcost: number = 0;
  Totsuppliercost: number[] = [];
  maxchartval: number = 0

  constructor(private location: Location, private SpinnerService: NgxSpinnerService,
    private searchservice: SearchService) { }

  async ngOnInit(): Promise<void> {

    this.Shouldcost = JSON.parse(String(localStorage.getItem("suppcomshouldcost")));
    console.log("shoulcosr", this.Shouldcost);
    const data = await this.searchservice.Gettcosuppliercost(this.Shouldcost[0].value).toPromise();
    this.CommericalDetailsSupplierCost = data;


    this.findchartmaxval();
    this.ShouldCost();
    this.SupplierCost();

    console.log('auppcosr', this.CommericalDetailsSupplierCost)

    this.Tariff = new Array(this.CommericalDetailsSupplierCost.length).fill(0);
  }


  backToPreviousPage() {
    this.location.back();
  }

  ShouldCost() {

    this.mappedcomparedata = [];
    console.log(this.Shouldcost[0].Id)
    for (let i = 0; i < this.Shouldcost.length; i++) {
      this.comparedata = [];
      console.log(this.Shouldcost[i].Id)
      // if (this.Shouldcost[i].Id == 4 || this.Shouldcost[i].Id == 6 || this.Shouldcost[i].Id == 6 || this.Shouldcost[i].Id == 8
      //   || this.Shouldcost[i].Id == 9 || this.Shouldcost[i].Id == 10 || this.Shouldcost[i].Id == 12 || this.Shouldcost[i].Id == 13
      //   || this.Shouldcost[i].Id == 14 || this.Shouldcost[i].Id == 15) {
      if (this.Shouldcost[i].Id != 11 && this.Shouldcost[i].Id != 20 && this.Shouldcost[i].Id != 1 &&
        this.Shouldcost[i].Id != 2 && this.Shouldcost[i].Id != 3) {
        this.comparedata.push(
          { label: 'Should Cost', y: Number(this.Shouldcost[i].value) },
        );

        this.mappedcomparedata.push(
          {
            type: "stackedColumn",
            name: this.Shouldcost[i].particular,
            indexLabelTextAlign: "left",
            dataPoints: this.comparedata
          },
        );
      }
    }

    this.chartOptions = {

      animationEnabled: true,
      exportEnabled: false,
      theme: "light1",
      title: {
        text: ""
      },
      axisX: {
        labelFontSize: 10,
        labelMaxWidth: 100,
        labelWrap: true,

      },
      axisY: {
        title: "Cost in USD($)",
        maximum: this.maxchartval+20,
        minimum:0
      },
      toolTip: {
        shared: true
      },
      legend: {
        horizontalAlign: "right",
        verticalAlign: "center",
        reversed: true
      },
      data: this.mappedcomparedata,


    }
    console.log('chartoptions', this.mappedcomparedata)
  }

  SupplierCost() {


    console.log('log', this.CommericalDetailsSupplierCost);
    this.chartloaded = true;

    for (let i = 0; i <= this.CommericalDetailsSupplierCost.length; i++) {
      this.suppcomparedata = [];
      this.suppmappedcomparedata = [];

      var lbl = this.CommericalDetailsSupplierCost[i].supplier_Company
      this.suppcomparedata.push(
        { label: lbl, y: Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_Material) },
      );

      this.suppmappedcomparedata.push(
        {
          type: "stackedColumn",
          name: 'Direct Material Cost ($)',
          indexLabelTextAlign: "left",
          dataPoints: this.suppcomparedata
        },
      );
      this.suppcomparedata = [];
      this.suppcomparedata.push(
        { label: lbl, y: Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_PurchasedParts) },
      );
      this.suppmappedcomparedata.push(
        {
          type: "stackedColumn",
          name: 'Bought out Finish Cost ($)',
          indexLabelTextAlign: "left",
          dataPoints: this.suppcomparedata
        },
      );

      this.suppcomparedata = [];
      this.suppcomparedata.push(
        { label: lbl, y: Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_LabourCostPerPiece) },
      );
      this.suppmappedcomparedata.push(
        {
          type: "stackedColumn",
          name: 'Direct Labour Cost ($)',
          indexLabelTextAlign: "left",
          dataPoints: this.suppcomparedata
        },
      );

      this.suppcomparedata = [];
      this.suppcomparedata.push(
        { label: lbl, y: Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_OHCostPerPiece) },
      );
      this.suppmappedcomparedata.push(
        {
          type: "stackedColumn",
          name: 'Process Overhead Cost ($)',
          indexLabelTextAlign: "left",
          dataPoints: this.suppcomparedata
        },
      );

      this.suppcomparedata = [];

      this.suppcomparedata.push(
        { label: lbl, y: Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_SurfaceTreatments) },
      );
      this.suppmappedcomparedata.push(
        {
          type: "stackedColumn",
          name: 'Surface Treatments Cost ($)',
          indexLabelTextAlign: "left",
          dataPoints: this.suppcomparedata
        },
      );

      this.suppcomparedata = [];
      this.suppcomparedata.push(
        { label: lbl, y: Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_SGA) },
      );
      this.suppmappedcomparedata.push(
        {
          type: "stackedColumn",
          name: 'SG&A ($)',
          indexLabelTextAlign: "left",
          dataPoints: this.suppcomparedata
        },
      );
      this.suppcomparedata = [];

      this.suppcomparedata.push(
        { label: lbl, y: Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_Profit) },
      );
      this.suppmappedcomparedata.push(
        {
          type: "stackedColumn",
          name: 'Profit ($)',
          indexLabelTextAlign: "left",
          dataPoints: this.suppcomparedata
        },
      );


      this.suppcomparedata = [];
      this.suppcomparedata.push(
        { label: '', y: Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_PackLogisticsWare) },
      );
      this.suppmappedcomparedata.push(
        {
          type: "stackedColumn",
          name: 'Packaging ($)',
          indexLabelTextAlign: "left",
          dataPoints: this.suppcomparedata
        },
      );

      this.suppcomparedata = [];
      this.suppcomparedata.push(
        { label: '', y: Number(this.CommericalDetailsSupplierCost[i].sP_FreightLogisticsCost) },
      );
      this.suppmappedcomparedata.push(
        {
          type: "stackedColumn",
          name: 'Freight/Logistics ($)',
          indexLabelTextAlign: "left",
          dataPoints: this.suppcomparedata
        },
      );

      // this.suppcomparedata = [];
      // this.suppcomparedata.push(
      //   { label: '', y: Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_TotalPartPrice) },
      // );
      // this.suppmappedcomparedata.push(
      //   {
      //     type: "stackedColumn",
      //     name: 'Total Cost ($)',
      //     indexLabelTextAlign: "left",
      //     dataPoints: this.suppcomparedata
      //   },
      // );

      this.SuppcostchartOptions[i] = {

        animationEnabled: true,
        exportEnabled: false,
        theme: "light1",
        title: {
          text: ""
        },
        axisX: {
          labelFontSize: 10,
          labelMaxWidth: 100,
          labelWrap: true,

        },
        axisY: {
          title: "Cost in USD($)",
          maximum: this.maxchartval+20,
          minimum:0
        },
        toolTip: {
          shared: true
        },
        legend: {
          horizontalAlign: "right",
          verticalAlign: "center",
          reversed: true
        },
        data: this.suppmappedcomparedata,
      }

    }


  }

  GetshouldcostTotal() {
    for (let i = 0; i < this.Shouldcost.length; i++) {
      // if (this.Shouldcost[i].Id == 4 || this.Shouldcost[i].Id == 6 || this.Shouldcost[i].Id == 8
      //   || this.Shouldcost[i].Id == 9 || this.Shouldcost[i].Id == 10 || this.Shouldcost[i].Id == 12 || this.Shouldcost[i].Id == 13
      //   || this.Shouldcost[i].Id == 14 || this.Shouldcost[i].Id == 15) {
      if (this.Shouldcost[i].Id != 11 && this.Shouldcost[i].Id != 20 && this.Shouldcost[i].Id != 1 &&
        this.Shouldcost[i].Id != 2 && this.Shouldcost[i].Id != 3) {

        this.Totshouldcost = this.Totshouldcost + Number(this.Shouldcost[i].value)

      }
    }
    console.log('totshould', this.Totshouldcost)
  }

  GetsupplierCostTotal() {
    var Tot;
    for (let i = 0; i < this.CommericalDetailsSupplierCost.length; i++) {
      Tot = Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_Material)
      Tot = Tot + Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_PurchasedParts)
      Tot = Tot + Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_LabourCostPerPiece)
      Tot = Tot + Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_OHCostPerPiece)
      Tot = Tot + Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_SurfaceTreatments)
      Tot = Tot + Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_SGA)
      Tot = Tot + Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_Profit)
      Tot = Tot + Number(this.CommericalDetailsSupplierCost[i].pbPerPiece_PackLogisticsWare)
      Tot = Tot + Number(this.CommericalDetailsSupplierCost[i].sP_FreightLogisticsCost)
      this.Totsuppliercost.push(Tot);
    }
    console.log('totsupp', this.Totsuppliercost)

  }

  async findchartmaxval() {
    this.GetshouldcostTotal();
    this.GetsupplierCostTotal();
    const suppmax = Math.max(...this.Totsuppliercost);
    console.log('suppmax', suppmax)
    const greaterNumber = Math.max(suppmax, this.Totshouldcost);
    this.maxchartval = greaterNumber
    //this.maxchartval = Math.ceil(greaterNumber / 5) * 5;
    console.log('maxchartval', this.maxchartval)
  }



}
