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




   // TCOSHEET1

   Getviewtcosheet(tcoid:any,tcono:any) : Observable<any>
   {
    debugger;
    return this.httpclient.get<any[]>(this.apiUrl+`Getviewtcosheet1?tcoid=${tcoid}&tcono=${tcono}`)
  }
  
  Gettco1mfgprocess(tcoid:any) : Observable<any>
  {
   debugger;
   return this.httpclient.get<any[]>(this.apiUrl+`Gettco1mfgpro?tcoid=${tcoid}`)
  }
  

   Gettcobreakdown(tcoid:any) : Observable<any>
   {
    debugger;
    return this.httpclient.get<any[]>(this.apiUrl+`Gettcobreakdown?tcoid=${tcoid}`)
   }


   Gettco1surfacetreatment(tcoid:any) : Observable<any>
   {
    debugger;
    return this.httpclient.get<any[]>(this.apiUrl+`Gettco1surfacetreatment?tcoid=${tcoid}`)
   }
   Gettco1purpart(tcoid:any) : Observable<any>
   {
    debugger;
    return this.httpclient.get<any[]>(this.apiUrl+`Gettco1purpart?tcoid=${tcoid}`)
   }

   Gettco1metalmar(tcoid:any) : Observable<any>
   {
    debugger;
    return this.httpclient.get<any[]>(this.apiUrl+`Gettco1metalmar?tcoid=${tcoid}`)
   }



   //TCOSHEET 2

   Getviewtcosheet2(tcoid:any,tcono:any) : Observable<any>
   {
    debugger;
    return this.httpclient.get<any[]>(this.apiUrl+`Getviewtcosheet2?tcoid=${tcoid}&tcono=${tcono}`)
   }

   Gettco2purpart(tcoid:any) : Observable<any>
   {
    debugger;
    return this.httpclient.get<any[]>(this.apiUrl+`Gettco2purpart?tcoid=${tcoid}`)
   }

   Gettco2surface(tcoid:any) : Observable<any>
   {
    debugger;
    return this.httpclient.get<any[]>(this.apiUrl+`Gettco2surface?tcoid=${tcoid}`)
   }

   Gettco2suppacklog(tcoid:any) : Observable<any>
   {
    debugger;
    return this.httpclient.get<any[]>(this.apiUrl+`Gettco2suppacklog?tcoid=${tcoid}`)
   }

   Gettco2mfgprocess(tcoid:any) : Observable<any>
   {
    debugger;
    return this.httpclient.get<any[]>(this.apiUrl+`Gettco2mfgpro?tcoid=${tcoid}`)
   }

   Gettco2macinfo(tcoid:any) : Observable<any>
   {
    debugger;
    return this.httpclient.get<any[]>(this.apiUrl+`Gettco2macinfo?tcoid=${tcoid}`)
   }





   //TCO model Upload
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

  uploadFile1(file: File, TCOID: string, TCO_Number: string, TCO_Version: string, requestID: string, uniqueId: string, Status: string): Observable<any> {
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
 
  // Bulkupload(userid: string): Observable<any> {
  //   const formData = new FormData();
  //     formData.append('userid',userid );
  //   return this.httpclient.post(this.apiUrl + "TCOBulkUpload", formData);
  // }
 
  uploadNewFile(file: File, TCOID: string, TCO_Number: string, TCO_Version: string, requestID: string, uniqueId: string, Status: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('TCO_ID', TCOID);
    formData.append('Tco_Number', TCO_Number);
    formData.append('Version', TCO_Version);
    formData.append('uniqueID', uniqueId);
    formData.append('Status', Status);
    formData.append('requestID', requestID);
    return this.httpclient.post(this.apiUrl + "NewUploadDoc", formData);
  }

  OldSheetBulkupload(userid: string): Observable<any> {
    debugger
    const formData = new FormData();
    formData.append('userid',userid );
    return this.httpclient.post(this.apiUrl + "Tco1BulkUpload" , formData);
  }
 
  NewSheetBulkupload(userid: string): Observable<any> {
    debugger
    const formData = new FormData();
    formData.append('userid',userid );
    return this.httpclient.post(this.apiUrl + "Tco2BulkUpload", formData);
  }
 
}