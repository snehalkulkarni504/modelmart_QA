import { HousingflywheelComponent } from './../housingflywheel/housingflywheel.component';
import { FrequentlyusedmaterialgradeComponent } from './../Report/frequentlyusedmaterialgrade/frequentlyusedmaterialgrade.component';
import { FaqComponent } from './../contact/faq/faq.component';
import { SendRequestComponent } from './../Request/send-request/send-request.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from '../homepage/homepage.component';
import { SearchComponent } from '../search/search.component';
import { DashBoardComponent } from '../dash-board/dash-board.component';
import { EnginedisplacementComponent } from '../Master/enginedisplacement/enginedisplacement.component';
import { BusinessunitmasterComponent } from '../Master/businessunitmaster/businessunitmaster.component';
import { SupplierloactionComponent } from '../Master/supplierloaction/supplierloaction.component';
import { ProgramShouldCostComponent } from '../Report/program-should-cost/program-should-cost.component';
import { RegionKgRateComponent } from '../Report/region-kg-rate/region-kg-rate.component';
import { RegionToolingCostComponent } from '../Report/region-tooling-cost/region-tooling-cost.component';
import { ComparisonComponent } from '../comparison/comparison.component';
import { ShouldCostGenComponent } from '../should-cost-gen/should-cost-gen.component';
import { ShouldCostReportComponent } from '../should-cost-report/should-cost-report.component';
import { ShouldCostReportViewComponent } from '../should-cost-report-view/should-cost-report-view.component';
import { ShouldCostRequestComponent } from '../Request/should-cost-request/should-cost-request.component';
import { ShouldCostRequestStatusComponent } from '../Request/should-cost-request-status/should-cost-request-status.component';
import { ShouldCostViewComponent } from '../Request/should-cost-view/should-cost-view.component';
import { UserLogComponentComponent } from '../Report/user-log-component/user-log-component.component';
import { ForexmasterComponent } from '../Master/forexmaster/forexmaster.component';
import { UserMasterComponentComponent } from '../Master/user-master-component/user-master-component.component';
import { RolemasterComponent } from '../Master/rolemaster/rolemaster.component';
import { ContactComponent } from '../contact/contact/contact.component';
import { SupportComponent } from '../contact/support/support.component';
import { CategoryMasterComponent } from '../Master/category-master/category-master.component';
import { ViewspreadsheetsComponent } from '../viewspreadsheets/viewspreadsheets.component';
import { UserAccessComponent } from '../Master/user-access/user-access.component';
import { ForexreportComponent } from '../Report/forexreport/forexreport.component';
import { UserhistoryComponent } from '../Report/userhistory/userhistory.component';
import { ShouldCostUserHistoryComponent } from '../Report/should-cost-user-history/should-cost-user-history.component';
import { ComparisonnewComponent } from '../comparisonnew/comparisonnew.component';
import { CostReductionComponent } from '../cost-reduction/cost-reduction.component';
import { SendMessageComponent } from '../contact/send-message/send-message.component';
 

const routes: Routes = [
  {
    path: '', component: DashBoardComponent,
    children: [
      { path: 'search/:cat', component: SearchComponent },
      { path: '', component: HomepageComponent },
      { path: '', redirectTo:'/home', pathMatch:'full'},
      { path: 'enginedisplacement', component: EnginedisplacementComponent },
      { path: 'businessunit', component: BusinessunitmasterComponent },
      { path: 'location', component: SupplierloactionComponent },
      { path: 'programShouldCost', component: ProgramShouldCostComponent },
      { path: 'regionKgRate', component: RegionKgRateComponent },
      { path: 'regionToolingCost', component: RegionToolingCostComponent },
      { path: 'forex', component:ForexmasterComponent},
      { path: 'usermaster', component:UserMasterComponentComponent},
      { path: 'rolemaster', component:RolemasterComponent},
      { path: 'category', component:CategoryMasterComponent},
      { path: 'userLog', component: UserLogComponentComponent },
      // { path: 'comparison', component: ComparisonComponent },
      { path: 'comparison', component: ComparisonnewComponent },
      { path: 'shouldcost', component: ShouldCostGenComponent },
      { path: 'tiercost', component: ShouldCostReportComponent },
      { path: 'sendrequest', component:SendRequestComponent },
      { path: 'shouldcostreportview/:data', component:ShouldCostReportViewComponent },
      { path: 'shouldcostrequest/:request', component: ShouldCostRequestComponent},
      { path: 'shouldcostrequeststatus',component:ShouldCostRequestStatusComponent},
      { path: 'shouldcostview/:data',component:ShouldCostViewComponent},
      { path: 'contact',component:ContactComponent},
      { path: 'supportpage',component:SupportComponent},
      { path: 'viewspreadsheets' , component:ViewspreadsheetsComponent} ,
      { path : 'faq' , component:FaqComponent} ,
      { path : 'useraccess' , component:UserAccessComponent},
      { path : 'userforex' , component:ForexreportComponent},
      { path : 'userhistory', component:UserhistoryComponent},
      { path : 'shouldcostuserhistory/:data', component:ShouldCostUserHistoryComponent},
      { path : 'frequentlyusedmaterialgrade' , component:FrequentlyusedmaterialgradeComponent},
      { path : 'costinsights' , component:CostReductionComponent},
      { path : 'toolingcost' , component:HousingflywheelComponent},
      { path : 'sendmessage' , component:SendMessageComponent},

      



    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
