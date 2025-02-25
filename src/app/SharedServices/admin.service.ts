import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { BUnitMaster } from 'src/app/Model/BUnitMaster';
import { Authclass } from '../Model/authclass';
 

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  apiUrl = environment.apiUrl_Admin;
  
  //public $refreshToken = new Subject<boolean>;

  constructor(private httpClient: HttpClient) {
    // debugger;
    // this.$refreshToken.subscribe((res: any) => {
    //   this.RenewAccessTOken();
    // })
  }


  // -----------------------------------------------------------------------

  GetAuthentication(username: string, password: string): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetAuthentication?username=${username}&password=${password}`);
  }

  // RenewAccessTOken(): Observable<any> {
  //   debugger;

  //   this.mSTUsers.push({
  //     "Token": localStorage.getItem("accessToken"),
  //     "RefreshToken": localStorage.getItem("refreshToken"),
  //     "RefreshTokenExpires": localStorage.getItem("refreshTokenExpires")
  //   });
 
  //   return this.httpClient.post(this.apiUrl + "RenewAccessTOken", this.mSTUsers)
  // }

  //  RenewAccessTOken(mSTUsers:Authclass[]): Observable<any> {
  //   debugger;
  //   return this.httpClient.post(this.apiUrl + "RenewAccessTOken", mSTUsers)
  // }

  UserForModelMart(username: string): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `UserForModelMart?username=${username}`);
  }

  getMenus(username: string): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetMenus?username=${username}`);
  }

  GetBusinessUnitData(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetBusinessUnitData`);
  }

  addBusinessUnitData(BusinessUnit: BUnitMaster[]): Observable<any> {
    return this.httpClient.post(this.apiUrl + "addBusinessUnitData", BusinessUnit)
  }

  UpdateBusinessUnitData(BusinessUnit: BUnitMaster[]): Observable<any> {
    return this.httpClient.post(this.apiUrl + "updateBusinessUnitData", BusinessUnit)
  }

  GetUsersList(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetAdminList`);
  }

  // SendMail(file: File[], RequesterId: any, Comments: Blob,FolderLink:any): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('RequesterId', RequesterId);
  //   formData.append('Comments', Comments);
  //   formData.append('FolderLink',FolderLink);
  //   for (const Dfile of file) {
  //     formData.append('files', Dfile, Dfile.name);
  //   }

  //   return this.httpClient.post<FormData>(this.apiUrl + `SendEmail`, formData);
  // }

  // SendMail(RequesterId: any, Comments: any,FolderLink:any): Observable<any> {
  //   return this.httpClient.get<any[]>(this.apiUrl + `SendEmail?RequesterId=${RequesterId}&Comments=${Comments}&FolderLink=${FolderLink}`);
  // }

  SendMail(RequesterId: any, Comments: any, FolderLink: any): Observable<any> {
    // return this.httpClient.get<any[]>(this.apiUrl + `SendEmail?RequesterId=${RequesterId}&Comments=${Comments}&FolderLink=${FolderLink}`);
    const formData = new FormData();
    formData.append('RequesterId', RequesterId);
    formData.append('Comments', Comments);
    formData.append('FolderLink', FolderLink);
    return this.httpClient.post<FormData>(this.apiUrl + `SendEmail`, formData);
  }

  // ReSubmittedSendEmail(RequesterId: any, Comments: any,FolderLink:any,requestHeaderId:any): Observable<any> {
  //   return this.httpClient.get<any[]>(this.apiUrl + `ReSubmittedSendEmail?RequesterId=${RequesterId}&Comments=${Comments}&FolderLink=${FolderLink}&requestHeaderId=${requestHeaderId}`);
  // }


  ReSubmittedSendEmail(RequesterId: any, Comments: any, FolderLink: any, requestHeaderId: any): Observable<any> {
    const formData = new FormData();
    formData.append('RequesterId', RequesterId);
    formData.append('Comments', Comments);
    formData.append('FolderLink', FolderLink);
    formData.append('requestHeaderId', requestHeaderId);

    return this.httpClient.post<FormData>(this.apiUrl + `ReSubmittedSendEmail?RequesterId`, formData);
  }



  SendShouldCostRequest(file: File[], RequesterId: any, Comments: Blob, FolderLink: any): Observable<any> {
    const formData = new FormData();
    formData.append('RequesterId', RequesterId);
    formData.append('Comments', Comments);
    formData.append('FolderLink', FolderLink);
    for (const Dfile of file) {
      formData.append('files', Dfile, Dfile.name);
    }

    return this.httpClient.post<FormData>(this.apiUrl + `SendShouldCostRequest`, formData);
  }


  // GetRequestGenStatus(From_Date:any, To_Date:any, Status:any) : Observable<any> {
  //   return this.httpClient.get(this.apiUrl + `GetRequestGenerationData?fromDate=${From_Date}&toDate=${To_Date}&status=${Status}`);
  // }

  GetRequestGenStatus(From_Date: any, To_Date: any, Status: any, UserID: any, RoleID: any): Observable<any> {
    return this.httpClient.get(this.apiUrl + `GetRequestGenerationData?fromDate=${From_Date}&toDate=${To_Date}&status=${Status}&userID=${UserID}&roleID=${RoleID}`);
  }

  SendEmailForRequestUpdate(CreatedBy: number, requestHeaderId: number) {
    return this.httpClient.get(this.apiUrl + `SendEmailForRequestUpdate?CreatedBy=${CreatedBy}&requestHeaderId=${requestHeaderId}`);
  }

  DownloadInputRequestForm(filename: string) {
    return this.httpClient.get(this.apiUrl + `DownloadInputRequestForm?filename=${filename}`, { responseType: 'blob' });
  }

  getActiveUsersList() {
    return this.httpClient.get<any>(`${this.apiUrl}GetActiveUsersList`);
  }

  getRoleList(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}GetRoleList`);
  }

  getBusinessUnits(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}GetBusinessUnits`);
  }

  getuserandBUdetails(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}GetUserandBUDetails`)
  }

  updateUserRole(user_id: any, UserId: any, roleid: any, buids: any, IsActive: any): Observable<any> {
    const mSTUsers = new FormData();
    mSTUsers.append('Id', user_id);
    mSTUsers.append('ModifiedBy', UserId);
    mSTUsers.append('RoleId', roleid);
    mSTUsers.append('BUIDs', buids);
    mSTUsers.append('IsActive', IsActive);

    return this.httpClient.post<FormData>(this.apiUrl + `UpdateUserRole`, mSTUsers);

    // const url = `${this.apiUrl}UpdateUserRole`;
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // return this.httpClient.post<FormData>(url, user, { headers });
  }

  GetResubmitRequesterData(requetsId: any) {
    return this.httpClient.get(this.apiUrl + `GetResubmitRequesterData?requetsId=${requetsId}`);
  }


<<<<<<< Updated upstream
=======
  submitContact(contact: any): Observable<any> {
    return this.httpClient.post(this.apiUrl+`submitcontact`, contact);
  }


  InsertLoginDetails(userid:any,username:any): Observable<any> {
    const formdata = new FormData();
    formdata.append('userid', userid);
    formdata.append('username', username);
    return this.httpClient.post<FormData>(this.apiUrl + `InsertLoginDetails`,formdata);
  }

  UpdateLogout(userid:any,sessionid:any,autologout:any): Observable<any> {
    const formdata = new FormData();
    formdata.append('userid', userid);
    formdata.append('sessionid', sessionid);
    formdata.append('autologout', autologout);
    return this.httpClient.post(this.apiUrl + `UpdateLogout`,formdata);
  }

  insertpageentry(userid:any,sessionid:any,page:any): Observable<any> {
    const formdata = new FormData();
    formdata.append('userid', userid);
    formdata.append('sessionid', sessionid);
    formdata.append('page', page);
    return this.httpClient.post<FormData>(this.apiUrl + `InsertPageEntry`,formdata);
  }

  updatepageexit(userid:any,sessionid:any,page:any): Observable<any> {
    const formdata = new FormData();
    formdata.append('userid', userid);
    formdata.append('sessionid', sessionid);
    formdata.append('page', page);
    return this.httpClient.post(this.apiUrl + `UpdatePageExit`,formdata);
  }
  
  // GetUsersList(): Observable<any> {
  //   return this.httpClient.get<any[]>(this.apiUrl + `GetAdminList`);
  // }
  GetSupplierList(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetSupplierdetails`);
  }
  GetTcoDetails(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetTcoDetails`);
  }
  GetFilteredTcoDetails(UniqueId: string, RequestHeaderId: string): Observable<any> {
    debugger
    return this.httpClient.get<any[]>(this.apiUrl + `GetTcoDetails?UniqueId=${UniqueId}&RequestHeaderId=${RequestHeaderId}`);
  }
  GetFilteredSupplierdetails(MMID: string, Request_ID: string): Observable<any> {
    debugger
    return this.httpClient.get<any[]>(this.apiUrl + `GetSupplierdetails?MMID=${MMID}&Request_ID=${Request_ID}`);
  }
  uploadFile(file: File,TCOID: string ,TCO_Number:string,TCO_Version:string,requestID:string,uniqueId:string,Status:string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('TCO_ID', TCOID);
    formData.append('Tco_Number', TCO_Number);
    formData.append('Version', TCO_Version);
    formData.append('uniqueID', uniqueId);
    formData.append('Status', Status);
    formData.append('requestID', requestID);
  
    debugger; 
    return this.httpClient.post(this.apiUrl+"UploadDoc", formData);
  }

  bulkUpload(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file, file.name);
    });
    debugger; 
    return this.httpClient.post(this.apiUrl + "Bulkupload", formData);
}

>>>>>>> Stashed changes


}
