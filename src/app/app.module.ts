import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomepageComponent } from './home/welcomepage/welcomepage.component';
import { LoginComponent } from './home/login/login.component';
import { ForgotpasswordComponent } from './home/forgotpassword/forgotpassword.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './Modules/search/search.component';
import { HomepageComponent } from './Modules/homepage/homepage.component';
import { HeaderComponent } from './Modules/header/header.component';
import { FooterComponent } from './Modules/footer/footer.component';
import { DashBoardComponent } from './Modules/dash-board/dash-board.component';
import { GroupByPipe } from './Modules/group-by.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BusinessunitmasterComponent } from './Modules/Master/businessunitmaster/businessunitmaster.component';
import { EnginedisplacementComponent } from './Modules/Master/enginedisplacement/enginedisplacement.component';
import { SupplierloactionComponent } from './Modules/Master/supplierloaction/supplierloaction.component';
import { SearchPipe } from './pipe/search.pipe';
import { ProgramShouldCostComponent } from './Modules/Report/program-should-cost/program-should-cost.component';
import { RegionKgRateComponent } from './Modules/Report/region-kg-rate/region-kg-rate.component';
import { RegionToolingCostComponent } from './Modules/Report/region-tooling-cost/region-tooling-cost.component';
import { ToastrModule } from 'ngx-toastr';
import { TreeviewModule } from '@charmedme/ngx-treeview';
import { ComparisonComponent } from './Modules/comparison/comparison.component';
import { ShouldCostGenComponent } from './Modules/should-cost-gen/should-cost-gen.component';
import { ShouldCostReportComponent } from './Modules/should-cost-report/should-cost-report.component';
import { SendRequestComponent } from './Modules/Request/send-request/send-request.component';
import { ShouldCostReportViewComponent } from './Modules/should-cost-report-view/should-cost-report-view.component';
import { NgxPrintModule } from 'ngx-print';
import { ShouldCostRequestComponent } from './Modules/Request/should-cost-request/should-cost-request.component';
import { ShouldCostRequestStatusComponent } from './Modules/Request/should-cost-request-status/should-cost-request-status.component';
import { ShouldCostViewComponent } from './Modules/Request/should-cost-view/should-cost-view.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TreeModule } from 'primeng/tree';
import { UserLogComponentComponent } from './Modules/Report/user-log-component/user-log-component.component';
import { UserMasterComponentComponent } from './Modules/Master/user-master-component/user-master-component.component';
import { RolemasterComponent } from './Modules/Master/rolemaster/rolemaster.component';
import { ForexmasterComponent } from './Modules/Master/forexmaster/forexmaster.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactComponent } from './Modules/contact/contact/contact.component';
import { SupportComponent } from './Modules/contact/support/support.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { CategoryMasterComponent } from './Modules/Master/category-master/category-master.component';
import { ViewspreadsheetsComponent } from './Modules/viewspreadsheets/viewspreadsheets.component';
import { FaqComponent } from './Modules/contact/faq/faq.component';
import { UserAccessComponent } from './Modules/Master/user-access/user-access.component';
import { ForexreportComponent } from './Modules/Report/forexreport/forexreport.component';
import { UserhistoryComponent } from './Modules/Report/userhistory/userhistory.component';
import { ShouldCostUserHistoryComponent } from './Modules/Report/should-cost-user-history/should-cost-user-history.component';
import { FrequentlyusedmaterialgradeComponent } from './Modules/Report/frequentlyusedmaterialgrade/frequentlyusedmaterialgrade.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { MaintenanceComponent } from './home/maintenance/maintenance.component';
import { ComparisonnewComponent } from './Modules/comparisonnew/comparisonnew.component';
import { CostReductionComponent } from './Modules/cost-reduction/cost-reduction.component';
import { HousingflywheelComponent } from './Modules/housingflywheel/housingflywheel.component';

// import { SendMessageComponent } from './Modules/contact/send-message/send-message.component';
//import { UserAuditComponent } from './Modules/user-audit/user-audit.component';
import { TabsComponent } from './Modules/tabs/tabs.component';
import { UserAnalyticsComponent } from './Modules/user-analytics/user-analytics.component';
import { MatTabsModule } from '@angular/material/tabs';
 
import { SendMessageComponent } from './Modules/contact/send-message/send-message.component';
import { CartdetailsComponent } from './Modules/cartdetails/cartdetails.component';
import { FeedbackComponent } from './Modules/contact/feedback/feedback.component';
import { FeedbackhistoryComponent } from './Modules/Report/feedbackhistory/feedbackhistory.component';
import { WelcomeuserComponent } from './home/welcomeuser/welcomeuser.component';


@NgModule({
  declarations: [
    AppComponent,
    WelcomepageComponent,
    LoginComponent,
    ForgotpasswordComponent,
    SearchComponent,
    HomepageComponent,
    HeaderComponent,
    FooterComponent,
    DashBoardComponent,
    GroupByPipe,
    BusinessunitmasterComponent,
    EnginedisplacementComponent,
    SupplierloactionComponent,
    SearchPipe,
    ProgramShouldCostComponent,
    RegionKgRateComponent,
    RegionToolingCostComponent,
    ComparisonComponent,
    ShouldCostGenComponent,
    ShouldCostReportComponent,
    SendRequestComponent,
    ShouldCostReportViewComponent,
    ShouldCostRequestComponent,
    ShouldCostRequestStatusComponent,
    ShouldCostViewComponent,
    UserLogComponentComponent,
    UserMasterComponentComponent,
    RolemasterComponent,
    ForexmasterComponent,
    ContactComponent,
    SupportComponent,
    CategoryMasterComponent,
    ViewspreadsheetsComponent,
    FaqComponent,
    UserAccessComponent,
    ForexreportComponent,
    UserhistoryComponent,
    ShouldCostUserHistoryComponent,
    FrequentlyusedmaterialgradeComponent,
    MaintenanceComponent,
    ComparisonnewComponent,
    CostReductionComponent,
    HousingflywheelComponent,
    TabsComponent,
    UserAnalyticsComponent,
    SendMessageComponent,
    CartdetailsComponent,
    FeedbackComponent,
    FeedbackhistoryComponent,
    WelcomeuserComponent
  ],
  imports: [
    TreeModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    OrganizationChartModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3500
    }),
    TreeviewModule.forRoot(),
    NgxPrintModule,
    NgSelectModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    NgbModule,
    NgIdleKeepaliveModule,

    CanvasJSAngularChartsModule,
    MatTabsModule,BrowserModule,
    BrowserAnimationsModule,
    CanvasJSAngularChartsModule
  ],
  
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    DatePipe
  ],

  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
