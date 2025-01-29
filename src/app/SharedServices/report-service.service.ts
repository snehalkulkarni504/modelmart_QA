import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {

  apiUrl = environment.apiUrl_Admin;
 
  constructor(private http:HttpClient) { }

  // getProgramName():Observable<any>{
  //   return this.http.get<any>(this.apiUrl+'GetProgramName');
  // }
  getProgramName(UserId:any,RoleId:any):Observable<any>{
    return this.http.get<any>(this.apiUrl+`GetProgramName?UserId=${UserId}&RoleId=${RoleId}`);
  }

  getCat4(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getCat4');
  }  

  // getProgramWiseShouldCost(From_Date:string,To_Date:string,ProgramName:string, SuppManfLoc:string):Observable<any>{
  //   return this.http.get<any[]>(this.apiUrl + `GetProgramData?From_Date=${From_Date}&To_Date=${To_Date}&ProgramName=${ProgramName}&SuppManfLoc=${SuppManfLoc}`);
  // }
   
  getProgramWiseShouldCost(From_Date:string,To_Date:string,ProgramName:string, SuppManfLoc:string,UserId:any,RoleId:any):Observable<any>{
    return this.http.get<any[]>(this.apiUrl + `GetProgramData?From_Date=${From_Date}&To_Date=${To_Date}&ProgramName=${ProgramName}&SuppManfLoc=${SuppManfLoc}&UserId=${UserId}&RoleId=${RoleId}`);
  }


  // getRegionWiseToolingCost(From_Date:string,To_Date:string,CAT4:string, SuppManfLoc:string):Observable<any>{
  //   return this.http.get<any[]>(this.apiUrl + `GetCategorywisetoolingcostData?From_Date=${From_Date}&To_Date=${To_Date}&CAT4=${CAT4}&SuppManfLoc=${SuppManfLoc}`);
  // }

  getRegionWiseToolingCost(From_Date:string,To_Date:string,CAT4:string, SuppManfLoc:string,UserId:any,RoleId:any):Observable<any>{
    return this.http.get<any[]>(this.apiUrl + `GetCategorywisetoolingcostData?From_Date=${From_Date}&To_Date=${To_Date}&CAT4=${CAT4}&SuppManfLoc=${SuppManfLoc}&UserId=${UserId}&RoleId=${RoleId}`);
  }

  // getRegionWiseRate(From_Date:string,To_Date:string,CAT4:string, SuppManfLoc:string):Observable<any>{
  //   return this.http.get<any[]>(this.apiUrl + `GetRegionWiseRate?From_Date=${From_Date}&To_Date=${To_Date}&CAT4=${CAT4}&SuppManfLoc=${SuppManfLoc}`); 
  // }

  getRegionWiseRate(From_Date:string,To_Date:string,CAT4:string, SuppManfLoc:string,UserId:any,RoleId:any):Observable<any>{
    return this.http.get<any[]>(this.apiUrl + `GetRegionWiseRate?From_Date=${From_Date}&To_Date=${To_Date}&CAT4=${CAT4}&SuppManfLoc=${SuppManfLoc}&UserId=${UserId}&RoleId=${RoleId}`); 
  }
  
  getEditedUsers(From_Date:string,To_Date:string, CreatedBy:number):Observable<any>{
    return this.http.get<any[]>(this.apiUrl + `GetEditedUserlogs?From_Date=${From_Date}&To_Date=${To_Date}&CreatedBy=${CreatedBy}`); 
  }

  getViewUsers(From_Date:string,To_Date:string,CreatedBy:number):Observable<any>{
    return this.http.get<any[]>(this.apiUrl + `GetViewUserlogs?From_Date=${From_Date}&To_Date=${To_Date}&CreatedBy=${CreatedBy}`); 
  }

  getSearchUsers(From_Date:string,To_Date:string,CreatedBy:number):Observable<any>{
    return this.http.get<any[]>(this.apiUrl + `GetSearchUserlogs?From_Date=${From_Date}&To_Date=${To_Date}&CreatedBy=${CreatedBy}`); 
  }
  
  getDownloadeUsers(From_Date:string,To_Date:string,CreatedBy:number):Observable<any>{
    return this.http.get<any[]>(this.apiUrl + `GetDownloadedUserlogs?From_Date=${From_Date}&To_Date=${To_Date}&CreatedBy=${CreatedBy}`); 
  }

  GetUserHistoryDetails(CreatedBy:number):Observable<any>{
    return this.http.get<any[]>(this.apiUrl + `GetUserhistory?CreatedBy=${CreatedBy}`); 
  }

  GetSourcingManagerReportHistory(CSHeaderId:any,param_SCReportId:any):Observable<any>{
    return this.http.get<any[]>(this.apiUrl + `GetSourcingManagerReportHistory?CSHeaderId=${CSHeaderId}&SCReportId=${param_SCReportId}`); 
  }

  GetFrequentlyusedmaterialgrade():Observable<any>{
    return this.http.get<any[]>(this.apiUrl + `GetFrequentlyusedmaterialgrade`); 
  }

  
  sendfeedbackdata(data:any):Observable<any> {
    return this.http.post<any>(this.apiUrl + 'Feedbackdata',data)
  }
   
  GetFeedbackHistoryDetails(username:any):Observable<any> {
    return this.http.get<any[]>(this.apiUrl+`Getfeedbackdata?username=${username}`);
  }

  
}
