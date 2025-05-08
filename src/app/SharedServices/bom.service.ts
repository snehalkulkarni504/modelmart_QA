import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cartlist } from '../Model/cartlist';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class BomService {

  apiUrl = environment.apiUrl_Search;
  apiUrl1 = environment.apiUrl_Tco

  constructor(private httpClient: HttpClient) { }

  SaveToCart(userId: any, uniqueId: any, CartName: any, ScReportId: any): Observable<any> {
    return this.httpClient.post(this.apiUrl + "SaveToCart?userId=" + userId + "&uniqueId=" + uniqueId + "&CartName=" + CartName + "&SCReportId=" + ScReportId, '')
  }
  SaveToCartList(cartdetailslist: Cartlist[], CartName: any, userId: any): Observable<any> {
    return this.httpClient.post(this.apiUrl + "SaveToCartList?CartName=" + CartName + "&userId=" + userId, cartdetailslist)
  }

  ItemDeleteFromCart(userId: any, cartid: any, ChildCategory: any, Csheader_Updated: any, cartname: any): Observable<any> {
    return this.httpClient.get(this.apiUrl + `itemDeleteFromCart?cartid=${cartid}&userId=${userId}&scostid=${ChildCategory}&srportid=${Csheader_Updated}&cartname=${cartname}`)
  }
  ////GetCartNameDetails
  getCartName(UserId: any): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl + `GetCartName?UserId=${UserId}`);
  }
  UpdateBomFilter(updatedRow: any, cartname: any, createdby: any): Observable<any> {

    return this.httpClient.post(this.apiUrl + `UpdateBomFilter?cartname=${cartname}&createdby=${createdby}`, updatedRow);
  }

  

  UpdateBomFilterNew(updatedRow: any, cartname: any, createdby: any): Observable<any> {

    return this.httpClient.post(this.apiUrl + `UpdateBomFilterNew?cartname=${cartname}&createdby=${createdby}`, updatedRow);
  }

  UpdateBomFilterList(updatedRow: any, cartname: any, createdby: any): Observable<any> {

    return this.httpClient.post(this.apiUrl + `UpdateBomFilterList?cartname=${cartname}&createdby=${createdby}`, updatedRow);
  }

  DeleteBom(bomid:any): Observable<any> {

    return this.httpClient.get(this.apiUrl + `DeleteBom?BomId=${bomid}`);
  }

  DeleteBomAll(cartid:any): Observable<any> {

    return this.httpClient.get(this.apiUrl + `DeleteBomAll?cartId=${cartid}`);
  }
  addprgramname(programname:any,createdby:any): Observable<any>
  {
    debugger;
    const formData = new FormData();
    formData.append('programname',programname);
    formData.append('createdby',createdby);
    return this.httpClient.post(this.apiUrl + "addprogramname", formData);
  }
  uploadExcelData(file: File, cartname: any, createdby: any): Observable<any> {
    debugger
    const formData = new FormData();
    formData.append('excelFile', file, file.name);
    formData.append('cartname', cartname);
    formData.append('createdby', createdby);
    // const headers = new HttpHeaders();
    // headers.set('Content-Type', 'multipart/form-data');
    console.log(formData)
    return this.httpClient.post(this.apiUrl + "UploadBomData", formData);
  }
  UpdateCart(updateCartDetails: any, userid: any, cartname: string): Observable<any> {
    return this.httpClient.post(this.apiUrl + `UpdateCartDetailsBypartNo?userid=${userid}&cartname=${cartname}`,updateCartDetails);
  }

  GetLandingPageForCartView(flag: any, ParentCategory: string, userid: any): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl + `getCartDetailsBycat?flag=${flag}&ParentCategory=${ParentCategory}&userid=${userid}`);
  }

  GetCart(userid: any): Observable<any> {
    // const headers = { 'Authorization': token } ,{headers}
    return this.httpClient.get<any[]>(this.apiUrl + `getcart?userid=${userid}`);
  }
  fetchprogramname(userid:any):Observable<any>
  {
    return this.httpClient.get<any[]>(this.apiUrl + `fetchprogramname?userid=${userid}`);
  }
  addcartame(programid:any,cartname:any,createdby:any): Observable<any>
  {
    debugger;
    const formData = new FormData();
    formData.append('programid',programid);
    formData.append('cartname',cartname);
    formData.append('createdby',createdby);
    return this.httpClient.post(this.apiUrl + "addcartdetails", formData);
  }
  getcartlist(programid:any):Observable<any>
  {
    return this.httpClient.get<any[]>(this.apiUrl + `getcartlist?programid=${programid}`);
  }
  copycart(data:FormData)
  {
    debugger;
    return this.httpClient.post(this.apiUrl + "copycart", data);
  }

  DeleteBomCart(cartid:any): Observable<any> {
 
    return this.httpClient.delete(this.apiUrl + `deletebomcart?cartId=${cartid}`);
  }


}
