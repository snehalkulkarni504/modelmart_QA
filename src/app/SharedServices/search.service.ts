import { SaveMatetialCost } from './../Model/save-matetial-cost';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { SearchFilters } from '../Model/SearchFilter';
import { UpdateRequest, UpdateRequestbyAdmin } from '../Model/update-request';
import { EmailForRequestUpdate } from '../Model/email-for-request-update';
 
import { Cartlist } from '../Model/cartlist';
 
import { compareIds } from '../Model/CompareIds';
 
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  //apiUrl =  environment.apiUrl + 'search/' ;   /// local Gateway
  apiUrl = environment.apiUrl_Search;


  constructor(private httpClient: HttpClient) { }

  GetSearch(search: string): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getsearch/${search}`);
  }

  GetLandingPage(flag: number, ParentCategory: string): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetCetegorywiseData?flag=${flag}&ParentCategory=${ParentCategory}`);
  }

  GetLandingPageForCartView(flag: any, ParentCategory: string,userid:any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getCartDetailsBycat?flag=${flag}&ParentCategory=${ParentCategory}&userid=${userid}`);
  }

  UpdateCart(excelPartNo: any, partno: string,userid:any,cartname: string): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `UpdateCartDetailsBypartNo?excelPartNo=${excelPartNo}&partno=${partno}&userid=${userid}&cartname=${cartname}`);
  }

  GetCagetory3(CatName: string): Observable<any> {
   // const headers = { 'Authorization': token } ,{headers}
    return this.httpClient.get<any[]>(this.apiUrl + `getcat3?CatName=${CatName}`);
  }

  GetCart(userid: any): Observable<any> {
    // const headers = { 'Authorization': token } ,{headers}
     return this.httpClient.get<any[]>(this.apiUrl + `getcart?userid=${userid}`);
   }

  Search(search: string): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getSearch_Filters?search=${search}`);
  }

  GetEngine(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getEngine`);
  }

  GetLocation(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getlocation`);
  }

  GetCategory(search: string): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetMainSearchCet3?cat=${search}`);
  }

  SearchFilters(searchfilter: SearchFilters[], userId: any): Observable<any> {
    return this.httpClient.post(this.apiUrl + "GetSearchfilter?userId=" + userId, searchfilter);
  }

  GetBusinessUnit(userId: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getBusinessUnit?userId=${userId}`);
  }

  GetProgramName(userId: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetProgramName?userId=${userId}`);
  }

  getComparisonData(ids: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getCompardata?ids=${ids}`);
  }

  getComparisonDataNew(ids: compareIds[]): Observable<any> {
    return this.httpClient.post(this.apiUrl + "getCompardatanew",ids);
  }

  getComparisonDataNewTier2(ids: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getCompardatanewTier2?ids=${ids}`);
  }

  getCompardataTier2(ids: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getCompardataTier2?ids=${ids}`);
  }

  
  getShouldeCost(id: any, userId: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getShouldeCost?id=${id}&userId=${userId}`);
  }

  getviewspreadsheets(id: any, userId: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getviewspreadsheets?id=${id}&userId=${userId}`);
  }


  downloadShouldeCost(id: any, userId: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `downloadShouldeCost?id=${id}&userId=${userId}`);
  }

  downloadUpdatedShouldeCost(id: any, userId: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `downloadUpdatedShouldeCost?id=${id}&userId=${userId}`);
  }

  GetTierCostData(id: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getTierCost?id=${id}`);
  }

  PartSpecificationFilters(id: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getPartSpecification?catId=${id}`);
  }

  GetMatetialCostForUpdate(id: any, t: string, IsCastingSheet: boolean): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetMatetialCostForUpdate?id=${id}&SupplyLevel=${t}&IsCastingSheet=${IsCastingSheet}`);
  }

  DownloadPDF(filename: string) {
    return this.httpClient.get<any[]>(this.apiUrl + `DownloadPDF?filename=${filename}`);
  }

  ////// post method //////
  SaveMatetialCost(saveMatetialCost: SaveMatetialCost[], userId: any, IsCastingSheet: any): Observable<any> {
    return this.httpClient.post(this.apiUrl + "SaveMatetialCost?userId=" + userId + "&IsCastingSheet=" + IsCastingSheet, saveMatetialCost)
  }

 
////Post method for save to cart
  SaveToCart(userId:any,uniqueId:any,CartName:any,ScReportId:any): Observable<any> {
    return this.httpClient.post(this.apiUrl + "SaveToCart?userId="+userId+"&uniqueId=" +uniqueId+ "&CartName=" +CartName+ "&SCReportId="+ScReportId, '')
  }
  SaveToCartList(cartdetailslist:Cartlist[], CartName:any,userId:any): Observable<any> {
    return this.httpClient.post(this.apiUrl + "SaveToCartList?CartName=" +CartName+ "&userId=" +userId, cartdetailslist)
  }

  ItemDeleteFromCart(userId:any,cartid:any,ChildCategory:any,Csheader_Updated:any,cartname:any): Observable<any> {
    return this.httpClient.get(this.apiUrl + `itemDeleteFromCart?cartid=${cartid}&userId=${userId}&scostid=${ChildCategory}&srportid=${Csheader_Updated}&cartname=${cartname}`)
  }
////GetCartNameDetails
  getCartName(UserId:any):Observable<any>{
    return this.httpClient.get<any>(this.apiUrl+`GetCartName?UserId=${UserId}`);
  }

 
  GetSourcingManagerReport(id: number, SM_Id: number, IsCastingSheet: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetSourcingManagerReport?id=${id}&SM_Id=${SM_Id}&IsCastingSheet=${IsCastingSheet}`);
  }

  GetSourcingManagerReport_UserLog(id: number, SM_Id: number, IsCastingSheet: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetSourcingManagerReport_UserLog?id=${id}&SM_Id=${SM_Id}&IsCastingSheet=${IsCastingSheet}`);
  }

  updateRequestGenerationData(RequestGeneration: UpdateRequestbyAdmin[]): Observable<any> {
    return this.httpClient.put(this.apiUrl + "updateRequestGenerationData", RequestGeneration);
  }

  GetRequestGenSingleId(Id: number): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetRequestGenSingleId?Id=${Id}`);
  }

  GetRequestGenDataById(Id: number): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetRequestGenDataById?Id=${Id}`);
  }

  UpdateShouldCostRequest(file: File[], RequesterId: any, Comments: Blob, FolderLink: any,RequestId:any,Status:any): Observable<any> {
    const formData = new FormData();
    formData.append('RequesterId', RequesterId);
    formData.append('Comments', Comments);
    formData.append('FolderLink', FolderLink);
    formData.append('RequestId', RequestId);
    formData.append('Status', Status);
    for (const Dfile of file) {
      formData.append('files', Dfile, Dfile.name);
    }
    return this.httpClient.put(this.apiUrl + "UpdateShouldCostRequest", formData);
  }
 
  UpdateBomFilter(updatedRow:any,cartname:any,createdby:any): Observable<any> {
    
    return this.httpClient.post(this.apiUrl + `UpdateBomFilter?cartname=${cartname}&createdby=${createdby}`, updatedRow); 
  }

  uploadExcelData(file: File,cartname:any,createdby:any): Observable<any> {
    debugger
    const formData = new FormData();
    formData.append('excelFile', file, file.name);
    formData.append('cartname', cartname);
    formData.append('createdby', createdby);
    // const headers = new HttpHeaders();
    // headers.set('Content-Type', 'multipart/form-data');
    console.log(formData)
    return this.httpClient.post(this.apiUrl+"UploadBomData" ,formData);
  }

  // SendShouldCostRequest(file: File[], RequesterId: any, Comments: Blob, FolderLink:any): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('RequesterId', RequesterId);
  //   formData.append('Comments', Comments);
  //   formData.append('FolderLink',FolderLink);
  //   for (const Dfile of file) {
  //     formData.append('files', Dfile, Dfile.name);
  //   }
 
  SearchSimulated(userId: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetSearchSimulated?userId=${userId}`);
  }
 
  GetSubpartProcessData(Supplierlevel: string, CSHeaderId: string): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `GetSubpartProcessData?CSHeaderId=${CSHeaderId}&SupplyLevel=${Supplierlevel}`);
  }

  GetDesignToCostDetails(Program: any): Observable<any> {
    console.log("we are here");
    return this.httpClient.get<any[]>(this.apiUrl +`GetDesignToCostDetails/${Program}`);
  }
 
  GetDesignToCostPart(PartNumber: any): Observable<any> {
    console.log("we are here");
    return this.httpClient.get<any[]>(this.apiUrl +`GetDesignToCostPart/${PartNumber}`);
  }
 
  GetDesignToCostNoun(NounName: any): Observable<any> {
    console.log("we are here");
    return this.httpClient.get<any[]>(this.apiUrl +`GetDesignToCostNoun/${NounName}`);
  }
 
  GetDesignToCostNounProgram(NounName: any, Program: any): Observable<any> {
    console.log("we are here");
    return this.httpClient.get<any[]>(this.apiUrl +`GetDesignToCostNounProgram/${NounName}/${Program}`);
  }
 
  

}
