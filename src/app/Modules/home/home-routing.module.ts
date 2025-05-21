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

// import { SendMessageComponent } from '../contact/send-message/send-message.component';
//import { UserAuditComponent } from '../user-audit/user-audit.component';
import { UserAnalyticsComponent } from '../Report/user-analytics/user-analytics.component';

import { SendMessageComponent } from '../contact/send-message/send-message.component';
import { CartdetailsComponent } from '../cartdetails/cartdetails.component';
import { FeedbackComponent } from '../contact/feedback/feedback.component';
import { FeedbackhistoryComponent } from '../Report/feedbackhistory/feedbackhistory.component';
import { TcoUploadComponent } from '../Request/tco-upload/tco-upload.component';
import { SuppcomparisonComponent } from '../comparisonnew/suppcomparison/suppcomparison.component';
import { BomdetailsComponent } from '../bomdetails/bomdetails.component';
import { DesigntocostStartComponent } from '../design-to-cost-engg/designtocost-start/designtocost-start.component';
import { DesigntocostStep1Component } from '../design-to-cost-engg/designtocost-step1/designtocost-step1.component';
import { DesigntocostStep2Component } from '../design-to-cost-engg/designtocost-step2/designtocost-step2.component';
import { DesigntocostStep3Component } from '../design-to-cost-engg/designtocost-step3/designtocost-step3.component';
import { DesigntocostStep4Component } from '../design-to-cost-engg/designtocost-step4/designtocost-step4.component';
import { DesigntocostStep2SimulationComponent } from '../design-to-cost-engg/designtocost-step2-simulation/designtocost-step2-simulation.component';
import { DtcrequestReportComponent } from '../Report/dtcrequest-report/dtcrequest-report.component';
 
 

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
 
      // { path : 'sendmessage' , component:SendMessageComponent},
     // { path : 'useraudit' , component:UserAuditComponent},
      { path : 'useranalytics' , component:UserAnalyticsComponent},
      { path : 'cartdetails' , component:CartdetailsComponent},
      { path : 'sendmessage' , component:SendMessageComponent},
      { path : 'feedback', component: FeedbackComponent },
      { path : 'feedbackhistory', component: FeedbackhistoryComponent },
      { path : 'tcoupload', component: TcoUploadComponent },
      { path : 'suppcomparison', component: SuppcomparisonComponent },
      { path : 'bom' , component:BomdetailsComponent},
      { path : 'designtocost', component: DesigntocostStartComponent},
      { path : 'designtocost/step1', component: DesigntocostStep1Component },
      { path : 'designtocost/step2', component: DesigntocostStep2Component },
      { path : 'designtocost/step2/simulation', component: DesigntocostStep2SimulationComponent },
      { path : 'designtocost/step3', component: DesigntocostStep3Component },
      { path : 'designtocost/step4', component: DesigntocostStep4Component },
      { path : 'DTCRequestReport', component: DtcrequestReportComponent },


      
    ]
  },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
