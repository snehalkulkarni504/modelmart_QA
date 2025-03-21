import { WelcomeuserComponent } from './home/welcomeuser/welcomeuser.component';
 
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomepageComponent } from './home/welcomepage/welcomepage.component';
import { LoginComponent } from './home/login/login.component';
import { ForgotpasswordComponent } from './home/forgotpassword/forgotpassword.component';
import { MaintenanceComponent } from './home/maintenance/maintenance.component';
 
const routes: Routes = [
   
  { path: 'login', component: LoginComponent},
  { path: 'forgotpassword', component: ForgotpasswordComponent},
  { path: 'welcome', component: WelcomepageComponent },
  { path: 'invaliduser', component: ForgotpasswordComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'welcomeuser', component: WelcomeuserComponent },

  
  { path: '', redirectTo:'/welcome', pathMatch:'full'},
  
  {
    path: 'home',
    loadChildren: () => import('./Modules/home/home.module').then(m => m.HomeModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled" }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
