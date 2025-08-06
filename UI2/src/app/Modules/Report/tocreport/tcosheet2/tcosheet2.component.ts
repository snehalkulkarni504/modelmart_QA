import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TcoService } from 'src/app/SharedServices/tco.service';

@Component({
  selector: 'app-tcosheet2',
  templateUrl: './tcosheet2.component.html',
  styleUrl: './tcosheet2.component.css'
})
export class Tcosheet2Component {


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
  getData: any;
  getbreakdown: any;
  getmfgprocess: any
  textsearch: string = '';
  page: number = 1;
  pageSize: number = 10;
  config: any;
  filterMetadata = { count: 0 };
  tcoid: any;
  tcono: any;

  pricebreakdowntotal: any;




  ngOnInit(): void {
    debugger;

    this.Tcosheet = new FormGroup({
      textsearch: new FormControl(),
    });

    this.route.queryParams.subscribe((parameter) => {
      this.tcoid = parameter['tcoid'] || 3,
        this.tcono = parameter['tcono'] || 2
    }

    )

    this.getviewtco2sheet(this.tcoid, this.tcono);
    this.Gettco2purpart(this.tcoid);
    this.Gettco2surface(this.tcoid);
    this.Gettco2suppacklog(this.tcoid);
    this.Gettco2mfgprocess(this.tcoid);
    this.Gettco2macinfo(this.tcoid);

  }

  async getviewtco2sheet(tcoid: any, tcono: any) {
    this.getData = await this.tcoService.Getviewtcosheet2(tcoid, tcono).toPromise();

    console.log("pricebreakdown", this.pricebreakdowntotal);
    console.log(this.getData);
  }


  // async Gettcobreakdown(tcoid:any) {
  //   this.getbreakdown = await this.tcoService.Gettcobreakdown(tcoid).toPromise();
  //   console.log(this.getbreakdown);
  //   this.cdr.detectChanges();
  // }

  async Gettco2mfgprocess(tcoid: any) {
    debugger;
    this.getmfgprocess = await this.tcoService.Gettco2mfgprocess(tcoid).toPromise();
    console.log("mfgprocess", this.getmfgprocess);

  }

  getmacinfo: any;
  async Gettco2macinfo(tcoid: any) {
    debugger;
    this.getmacinfo = await this.tcoService.Gettco2macinfo(tcoid).toPromise();
    console.log("macinfo", this.getmacinfo);

  }

  getpurpart: any;
  async Gettco2purpart(tcoid: any) {
    debugger;
    this.getpurpart = await this.tcoService.Gettco2purpart(tcoid).toPromise();
    console.log("macinfo", this.getmacinfo);

  }

  getsurface: any;
  async Gettco2surface(tcoid: any) {
    debugger;
    this.getsurface = await this.tcoService.Gettco2surface(tcoid).toPromise();
    console.log("surinfo", this.getsurface);

  }

  getsuppacklog: any;
  async Gettco2suppacklog(tcoid: any) {
    debugger;
    this.getsuppacklog = await this.tcoService.Gettco2suppacklog(tcoid).toPromise();
    console.log("macinfo", this.getmacinfo);

  }



  backToPreviousPage() {
    this.location.back();
  }


}
