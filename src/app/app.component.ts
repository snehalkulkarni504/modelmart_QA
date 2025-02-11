import { Component, OnInit } from '@angular/core';
import { Route, Router,NavigationEnd, NavigationStart } from '@angular/router';
import { environment } from 'src/environments/environments';
import { AdminService } from 'src/app/SharedServices/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Model Mart';
  previousUrl: string = '';
  currentUrl: string = '';
  newArr: any = {};
  previouspage:string='';
  currentpage:string='';
  UserId: any= localStorage.getItem("userId");
  SessionId: any=localStorage.getItem("sessionId");

  IsMaintenances = environment.IsMaintenance;

  constructor(private router: Router,public admin: AdminService,) {
  }

  ngOnInit() {
    // console.log("App in Username ", localStorage.getItem("userName"));
    // var Id = localStorage.getItem("userName") ;
    // if (this.IsMaintenances && Id != '8' && Id != null) {
    //   this.router.navigate(['/maintenance']);
  //   // }
  

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     this.previousUrl = this.currentUrl; // Store the previous page
    //     this.previouspage=this.getpagename(this.previousUrl)
    //     if (this.previouspage!='')
    //     {
    //       this.admin.updatepageexit(this.UserId,this.SessionId,this.previouspage).subscribe({
    //         next: (_res: any) => {
    //         },
    //         error: (error: any) => {
    //           console.error('API call error:', error);
    //         },
    //       });
    //     }
    //   };

    //   if (event instanceof NavigationEnd) {
    //     this.currentUrl = event.urlAfterRedirects; // Store the new page
    //     console.log(`Navigated from: ${this.previousUrl} to ${this.currentUrl}`);
    //     this.currentpage=this.getpagename(this.currentUrl)
    //     if (this.currentUrl!='')
    //     {
    //     this.admin.insertpageentry(this.UserId,this.SessionId,this.currentpage).subscribe({
    //       next: (_res: any) => {
    //       },
    //       error: (error: any) => {
    //         console.error('API call error:', error);
    //       },
    //     });
    //   }
    //   }

    //   })

     

      
  }


getpagename(url:string):string{
    if (url=='/welcome')
    {
      return 'Welcome'
    }
    else if(url=='/home/search/%20')
    {
      return 'Search'
    }
    else if(url=='/home/shouldcost')
    {
      return 'ShouldCost'
    }
    else if(url=='/home/tiercost')
    {
      return 'Model Simulation'
    }
    else if(url=='/home/shouldcostrequeststatus')
    {
      return 'Request Status'
    }
    else if(url=='/home/sendrequest')
    {
      return 'Upload Should Cost File'
    }
    else if(url=='/home')
    {
      return 'CAT3 Management'
    }
    else if(url=='/home/costinsights')
    {
      return 'Category Management Page - Exhaust Manifolds'
    }
    else if(url=='/home/toolingcost')
    {
      return 'Cost Details'
    }
    else if(url.includes('/home/shouldcostrequest/'))
    { 
      if(url=='/home/shouldcostrequest/:request')
        {
          return 'Should Cost Request'
        }
      else
        return 'Project Should Cost Request'
    }
      
    return''
}
}
