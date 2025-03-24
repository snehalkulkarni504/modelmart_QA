import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TcoService {

  apiUrl = environment.apiUrl_Tco;

  constructor(private httpclient:HttpClient)
   { }

   gettcoreport(): Observable<any>
   {
     return this.httpclient.get<any[]>(this.apiUrl+`Gettcoreportdata`)
   }

   tcostatusedit(tcoid:any,tcono:string) : Observable<any>
   {
    return this.httpclient.get(this.apiUrl+`Tcostatusedit?tcoid=${tcoid}&tcono=${tcono}`);
    // return this.httpclient.post(this.apiUrl+"Tcostatusedit",tcoid,tcono)
   }

   Getviewtcosheet(tcoid:any,tcono:any) : Observable<any>
   {
    
    return this.httpclient.get<any[]>(this.apiUrl+`Getviewtcosheet?tcoid=${tcoid}&tcono=${tcono}`)
   }


   
  GetSupplierList(): Observable<any> {
    return this.httpclient.get<any[]>(this.apiUrl + `GetSupplierdetails`);
  }

  GetTcoDetails(): Observable<any> {
    return this.httpclient.get<any[]>(this.apiUrl + `GetTcoDetails`);
  }

  GetFilteredTcoDetails(UniqueId: string, RequestHeaderId: string): Observable<any> {
     
    return this.httpclient.get<any[]>(this.apiUrl + `GetTcoDetails?UniqueId=${UniqueId}&RequestHeaderId=${RequestHeaderId}`);
  }

  GetFilteredSupplierdetails(MMID: string, Request_ID: string): Observable<any> {
     
    return this.httpclient.get<any[]>(this.apiUrl + `GetSupplierdetails?MMID=${MMID}&Request_ID=${Request_ID}`);
  }

  uploadFile(file: File, TCOID: string, TCO_Number: string, TCO_Version: string, requestID: string, uniqueId: string, Status: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('TCO_ID', TCOID);
    formData.append('Tco_Number', TCO_Number);
    formData.append('Version', TCO_Version);
    formData.append('uniqueID', uniqueId);
    formData.append('Status', Status);
    formData.append('requestID', requestID);
    return this.httpclient.post(this.apiUrl + "UploadDoc", formData);
  }

  bulkUpload(files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });
    return this.httpclient.post(this.apiUrl + "Bulkupload", formData);
  }
  

}
