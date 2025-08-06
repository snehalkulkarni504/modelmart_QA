import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TcoService } from 'src/app/SharedServices/tco.service';
@Component({
  selector: 'app-tcosheet',
  templateUrl: './tcosheet.component.html',
  styleUrl: './tcosheet.component.css'
})
export class TcosheetComponent {

  constructor(
    public router: Router,
    private tcoService: TcoService,
    private location: Location,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10
    };

    
  }


  Tcosheet!: FormGroup;

  textsearch: string = '';
  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };
  tcoid: any;
  tcono: any;

  getData: any[] = [];
  getbreakdown: any[] = [];
  getmfgprocess: any[] = [];
  surfacetreatment: any[] = [];
  purpartdata: any[] = [];




  ngOnInit(): void {
    debugger;

    this.Tcosheet = new FormGroup({
      textsearch: new FormControl(),
    });

    this.route.queryParams.subscribe((parameter) => {

      this.tcoid = parameter['tcoid'],
        this.tcono = parameter['tcono']
    }

    )

    this.getviewtcosheet(this.tcoid, this.tcono)
    this.getpurpartdata(this.tcoid);
    this.Gettsurfacetreatment(this.tcoid);
    this.Gettcomfgprocess(this.tcoid);
    this.Gettcometalmar(this.tcoid);


  }


  async loadAllData() {
    try {
      const [viewData, mfgProcess, surfaceTreatment, purPartData] = await Promise.all([
        this.tcoService.Getviewtcosheet(this.tcoid, this.tcono).toPromise(),
        this.tcoService.Gettco1mfgprocess(this.tcoid).toPromise(),
        this.tcoService.Gettco1surfacetreatment(this.tcoid).toPromise(),
        this.tcoService.Gettco1purpart(this.tcoid).toPromise(),
      ]);

      this.getData = viewData || [];
      this.getmfgprocess = mfgProcess || [];
      this.surfacetreatment = surfaceTreatment || [];
      this.purpartdata = purPartData || [];

      this.cdr.detectChanges();  // Ensure UI updates correctly

    } catch (error) {
      console.error("Error loading data:", error);
    }
  }



  async getviewtcosheet(tcoid: any, tcono: any) {
    this.getData = await this.tcoService.Getviewtcosheet(tcoid, tcono).toPromise();
    this.cdr.detectChanges();
    console.log("viewsheet", this.getData);
    console.log(this.getData);
  }


  async Gettcomfgprocess(tcoid: any) {
    debugger;
    this.getmfgprocess = await this.tcoService.Gettco1mfgprocess(tcoid).toPromise();
    this.cdr.detectChanges();
    console.log("mfgprocess", this.getmfgprocess);
  }


  async Gettsurfacetreatment(tcoid: any) {
    debugger;
    this.surfacetreatment = await this.tcoService.Gettco1surfacetreatment(tcoid).toPromise();
    this.cdr.detectChanges();
    console.log("surfacetreatment", this.surfacetreatment);
  }


  async getpurpartdata(tcoid: any) {
    debugger;
    this.purpartdata = await this.tcoService.Gettco1purpart(tcoid).toPromise();
    this.cdr.detectChanges();
    console.log("purpart", this.purpartdata);
  }

  getmetalmar: any;
  async Gettcometalmar(tcoid: any) {
    debugger;
    this.getmetalmar = await this.tcoService.Gettco1metalmar(tcoid).toPromise();
    this.cdr.detectChanges();
    console.log("metalmar", this.getmetalmar);
  }

  backToPreviousPage() {
    this.location.back();
  }

}
