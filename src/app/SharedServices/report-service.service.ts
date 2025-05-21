import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {

  apiUrl = environment.apiUrl_Admin;

  constructor(private http: HttpClient) { }

  // getProgramName():Observable<any>{
  //   return this.http.get<any>(this.apiUrl+'GetProgramName');
  // }
  getProgramName(UserId: any, RoleId: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + `GetProgramName?UserId=${UserId}&RoleId=${RoleId}`);
  }

  getCat4(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getCat4');
  }

  // getProgramWiseShouldCost(From_Date:string,To_Date:string,ProgramName:string, SuppManfLoc:string):Observable<any>{
  //   return this.http.get<any[]>(this.apiUrl + `GetProgramData?From_Date=${From_Date}&To_Date=${To_Date}&ProgramName=${ProgramName}&SuppManfLoc=${SuppManfLoc}`);
  // }

  getProgramWiseShouldCost(From_Date: string, To_Date: string, ProgramName: string, SuppManfLoc: string, UserId: any, RoleId: any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `GetProgramData?From_Date=${From_Date}&To_Date=${To_Date}&ProgramName=${ProgramName}&SuppManfLoc=${SuppManfLoc}&UserId=${UserId}&RoleId=${RoleId}`);
  }


  // getRegionWiseToolingCost(From_Date:string,To_Date:string,CAT4:string, SuppManfLoc:string):Observable<any>{
  //   return this.http.get<any[]>(this.apiUrl + `GetCategorywisetoolingcostData?From_Date=${From_Date}&To_Date=${To_Date}&CAT4=${CAT4}&SuppManfLoc=${SuppManfLoc}`);
  // }

  getRegionWiseToolingCost(From_Date: string, To_Date: string, CAT4: string, SuppManfLoc: string, UserId: any, RoleId: any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `GetCategorywisetoolingcostData?From_Date=${From_Date}&To_Date=${To_Date}&CAT4=${CAT4}&SuppManfLoc=${SuppManfLoc}&UserId=${UserId}&RoleId=${RoleId}`);
  }

  // getRegionWiseRate(From_Date:string,To_Date:string,CAT4:string, SuppManfLoc:string):Observable<any>{
  //   return this.http.get<any[]>(this.apiUrl + `GetRegionWiseRate?From_Date=${From_Date}&To_Date=${To_Date}&CAT4=${CAT4}&SuppManfLoc=${SuppManfLoc}`); 
  // }

  getRegionWiseRate(From_Date: string, To_Date: string, CAT4: string, SuppManfLoc: string, UserId: any, RoleId: any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `GetRegionWiseRate?From_Date=${From_Date}&To_Date=${To_Date}&CAT4=${CAT4}&SuppManfLoc=${SuppManfLoc}&UserId=${UserId}&RoleId=${RoleId}`);
  }

  getEditedUsers(From_Date: string, To_Date: string, CreatedBy: number): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `GetEditedUserlogs?From_Date=${From_Date}&To_Date=${To_Date}&CreatedBy=${CreatedBy}`);
  }

  getViewUsers(From_Date: string, To_Date: string, CreatedBy: number): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `GetViewUserlogs?From_Date=${From_Date}&To_Date=${To_Date}&CreatedBy=${CreatedBy}`);
  }

  getSearchUsers(From_Date: string, To_Date: string, CreatedBy: number): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `GetSearchUserlogs?From_Date=${From_Date}&To_Date=${To_Date}&CreatedBy=${CreatedBy}`);
  }

  getDownloadeUsers(From_Date: string, To_Date: string, CreatedBy: number): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `GetDownloadedUserlogs?From_Date=${From_Date}&To_Date=${To_Date}&CreatedBy=${CreatedBy}`);
  }

  GetUserHistoryDetails(CreatedBy: number): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `GetUserhistory?CreatedBy=${CreatedBy}`);
  }

  GetSourcingManagerReportHistory(CSHeaderId: any, param_SCReportId: any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `GetSourcingManagerReportHistory?CSHeaderId=${CSHeaderId}&SCReportId=${param_SCReportId}`);
  }

  GetFrequentlyusedmaterialgrade(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `GetFrequentlyusedmaterialgrade`);
  }

  // getUserSearchData(UserId:any):Observable<any>{
  //   return this.http.get<any>(this.apiUrl+`GetUserSearchData?UserId=${UserId}`);
  // }

  // getUserLogData(UserId:any):Observable<any>{
  //   // console.log('list1',this.http.get<any>(this.apiUrl+`GetUserLogData?UserId=${UserId}`))
  //   return this.http.get<any>(this.apiUrl+`GetUserLogData?UserId=${UserId}`);
  // }

  // getUserProjectData(UserId:any):Observable<any>{
  //   return this.http.get<any>(this.apiUrl+`GetUserProjectData?UserId=${UserId}`);
  // }

  InsertCompareLogData(CsheaderIds: any, userId: any): Observable<any> {
    const formData = new FormData();
    formData.append('CsheaderIds', CsheaderIds);
    formData.append('userId', userId);
    return this.http.post<any>(this.apiUrl + `InsertCompareLogData`, formData);
  }


  getUserAnalyticsData(From_Date: string, To_Date: string): Observable<any> {
    // console.log('list1',this.http.get<any>(this.apiUrl+`GetUserLogData?UserId=${UserId}`))
    return this.http.get<any>(this.apiUrl + `GetAnalyticsLogData?fromdate=${From_Date}&todate=${To_Date}`);
  }

  sendfeedbackdata(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'Feedbackdata', data)
  }

  GetFeedbackHistoryDetails(username: any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `Getfeedbackdata?username=${username}`);
  }

  Getpiechartdata(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `Getpiechartdata`);
  }

  ExcelExportUserAnalytics(Fromdate: any, Todate: any) {
    return this.http.get(
      this.apiUrl +
      `ExportToExcelUserAnalyticsData?fromdate=${Fromdate}&todate=${Todate}`,
      {
        responseType: 'blob', // Important to specify blob as the response type
      }
    );
  }

  insertDPVavedetails(Vavelist: any): Observable<any> {
    const formdata = new FormData();
    formdata.append('vavelist', JSON.stringify(Vavelist));
    return this.http.post<FormData>(this.apiUrl + `InsertDPVavedetails`, formdata);
  }


  GetDTCVavedata(Ids: any): Observable<any> {
    let params = new HttpParams();
    Ids.forEach((id: { toString: () => string | number | boolean; }) => {
      params = params.append('ids', id.toString());
    });
    return this.http.get<any[]>(this.apiUrl + `GetDesignToCostVavedetails`, { params });
  }

  GetDTCRequestReport(csheaderid: any, screportid: any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `GetDTCRequestReport?csheaderid=${csheaderid}&screportid=${screportid}`);
  }
 

}
