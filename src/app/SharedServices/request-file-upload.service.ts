import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExcelData } from '../Model/excel-data';
import { environment } from 'src/environments/environments';
import { SendRequest } from '../Model/send-request';
import { Cat4 } from '../Model/cat4';

@Injectable({
  providedIn: 'root'
})

export class RequestFileUploadService {

  //apiUrl =  environment.apiUrl + 'file/' ;
  apiUrl = environment.apiUrl_File;

  constructor(private http: HttpClient) { }

  getSendRequest(): Observable<SendRequest[]> {
    return this.http.get<SendRequest[]>(this.apiUrl + 'getRequestID');
  }
  
  fetchExcelDataColumns() {
    return this.http.get(this.apiUrl + 'getExcelDataColumns', {})

  }

  // upload(file: File[],id: any ):Observable<any>{
  //   const formData = new FormData();
  //   formData.append('id', id);
  //   for (const Dfile of file) {
  //     formData.append('files', Dfile);
  //   }

  //   return this.http.post(this.apiUrl+'uploadSendRequestFile',formData);
  // }

  upload(file: File[], id: any, selectedUniqueID: string, userId: any): Observable<any> {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('uniqueID', selectedUniqueID);
    formData.append('userId', userId);
    for (const Dfile of file) {
      formData.append('files', Dfile, Dfile.name);
    }
    return this.http.post<FormData>(this.apiUrl + 'uploadSendRequestFiletest', formData);
  }


  getCat4(): Observable<Cat4[]> {
    return this.http.get<Cat4[]>(this.apiUrl + 'getCat4');
  }


  addSendRequest(csheader: SendRequest[]): Observable<any> {
    return this.http.post(this.apiUrl + 'addCostSummaryHeader', csheader);
  }
  // SaveMatetialCost(saveMatetialCost:SaveMatetialCost[]) : Observable<any> {
  //   return this.httpClient.post(this.apiUrl + "SaveMatetialCost", saveMatetialCost)
  // }

  getUpdateSendRequest(UData: any): Observable<any> {
    const params = new HttpParams({ fromObject: UData });
    return this.http.get<ExcelData[]>(`${this.apiUrl}getUpdateCostSummaryHeader`, { params });
  }

  getFilteredExcelData(excelData: any): Observable<ExcelData[]> {
    const params = new HttpParams({ fromObject: excelData });
    return this.http.get<ExcelData[]>(`${this.apiUrl}getFilteredExcelData`, { params });
  }
  startJob() {
    return this.http.post(this.apiUrl + 'SSISExecute', {})
  }

  DeleteUploadedData(CSHeaderId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}DeleteUploadData?CSHeaderId=${CSHeaderId}`, null);
  }
  
  AddUploadDataValidation(DebriefDate:string,Region:string,PartName:string,PartNumber:string){
    return this.http.get<any[]>(this.apiUrl + `AddUploadDataValidation?DebriefDate=${DebriefDate}&Region=${Region}&PartName=${PartName}&PartNumber=${PartNumber}`);
  }

  getBulkUpload(userId:any,modelTypesID:any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + `BulkUpload?userId=${userId}&modelTypesID=${modelTypesID}`);
  }

  // UpdateLWHandPW(CSHeaderId:number,Length:number, Width:number, Height:number, PartWeight:number): Observable<any>{
  //   return this.http.post<any[]>(this.apiUrl + `UpdateLWHandPW?CSHeaderId=${CSHeaderId}&Length=${Length}&Width=${Width}&Height=${Height}&PartWeight=${PartWeight}`,null);
  // }

  UpdateLWHandPW(data:SendRequest[]): Observable<any>{
    return this.http.post(this.apiUrl + 'UpdateLWHandPW',data); 
  }
 
  GetFilteredHopperData(excelData: any): Observable<ExcelData[]> {
    const params = new HttpParams({ fromObject: excelData });
    return this.http.get<ExcelData[]>(`${this.apiUrl}FetchHopperData`, { params });
  }

 ReadHoppercolumns(){
    return this.http.get(this.apiUrl + 'ReadHopperColumns', {})
  }

  getModelTypes(){
    return this.http.get(this.apiUrl + 'getModelTypes', {})
  }

  uploadexceldata(data:any)
  {
    debugger;
    return this.http.post<any>(this.apiUrl + 'uploadexceldata',data);
  }

 
  yellowbulkupload(userid:any,modeltypeid:any): Observable<any[]> {
    debugger;
    return this.http.get<any[]>(this.apiUrl + `yellowmodelbulkupload?userid=${userid}&modeltypeid=${modeltypeid}`);
  }

}