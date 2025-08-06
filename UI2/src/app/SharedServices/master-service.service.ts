import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Engine } from '../Model/Engine';
import { BUnitMaster } from '../Model/BUnitMaster';
import { environment } from 'src/environments/environments';
import { SupplManuLocation } from '../Model/suppl-manu-location';
import { ForexMaster } from '../Model/forex-master';
import { RoleUnitMaster } from '../Model/role-unit-master';
import { CategoryMaster } from '../Model/categoryMaster';
import { UserMaster } from '../Model/user-master';

@Injectable({
  providedIn: 'root'
})
export class MasterServiceService {
  
  apiUrl = environment.apiUrl_Admin;

  constructor(private http: HttpClient) { }
 

  // getEngine() {
  //   debugger;
  //   let auth_token = localStorage.getItem("accessToken");
  //   let header_obj = new HttpHeaders().set('Authorization','Bearer '+auth_token) ;
  //   return this.http.get<Engine[]>(this.apiUrl + 'getEngine',  { headers: header_obj }) ;
  // }

  // ---------------------------------------------------------------

  getEngine(): Observable<Engine[]> {
     return this.http.get<Engine[]>(this.apiUrl + 'getEngine');
  }

  addEngine(engine: Engine): Observable<any> {
    return this.http.post<Engine>(this.apiUrl + 'addEngine', engine);
  }

  updateEngine(engine: Engine): Observable<any> {
    return this.http.put<Engine>(this.apiUrl + 'updateEngine', engine);
  }

  deleteEngine(engine: Engine): Observable<any> {
    return this.http.put<Engine>(this.apiUrl + 'deleteEngine', engine);
  }

  GetBusinessUnitData(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + 'GetBusinessUnitData');
  }

  AddBusinessUnitData(businessUnit: BUnitMaster[]): Observable<any> {
    return this.http.post<BUnitMaster>(this.apiUrl + 'addBusinessUnitData', businessUnit)
  }

  UpdateBusinessUnitData(businessUnit: BUnitMaster[]): Observable<any> {
    return this.http.put<BUnitMaster>(this.apiUrl + 'updateBusinessUnitData', businessUnit)
  }

  DeleteBusinessUnitData(BusinessUnit: BUnitMaster[]): Observable<any> {
    return this.http.put<BUnitMaster>(this.apiUrl + 'deleteBusinessUnitData', BusinessUnit)
  }

  GetSupplierManuLocationData(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + 'getSupplierManuLocationData');
  }

  AddSupplierManuLocationData(SupplManuLoc: SupplManuLocation[]): Observable<any> {
    return this.http.post<SupplManuLocation>(this.apiUrl + 'addSupplierManuLocationData', SupplManuLoc)
  }

  UpdateSupplierManuLocationData(SupplManuLoc: SupplManuLocation[]): Observable<any> {
    return this.http.put<SupplManuLocation>(this.apiUrl + 'updateSupplierManuLocationData', SupplManuLoc)
  }

  DeleteSupplierManuLocationData(SupplManuLoc: SupplManuLocation[]): Observable<any> {
    return this.http.put<SupplManuLocation>(this.apiUrl + 'deleteSupplierManuLocationData', SupplManuLoc)
  }

  getForex(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + 'GetForex');
  }

  addForex(forex: ForexMaster[]): Observable<any> {
    return this.http.post<ForexMaster>(this.apiUrl + 'AddForex', forex)
  }

  updateForex(forex: ForexMaster[]): Observable<any> {
    return this.http.put<ForexMaster>(this.apiUrl + 'UpdateForex', forex)
  }

  deleteForex(forex: ForexMaster[]): Observable<any> {
    return this.http.put<ForexMaster>(this.apiUrl + 'deleteForex', forex)
  }

  getRole(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + 'GetRoleData');
  }

  addRole(role: RoleUnitMaster[]): Observable<any> {
    return this.http.post<RoleUnitMaster>(this.apiUrl + 'AddRoleData', role)
  }

  updateRole(role: RoleUnitMaster[]): Observable<any> {
    return this.http.put<RoleUnitMaster>(this.apiUrl + 'UpdateRoleData', role)
  }

  deleteRole(role: RoleUnitMaster[]): Observable<any> {
    return this.http.put<RoleUnitMaster>(this.apiUrl + 'DeleteRoleData', role)
  }

  getCategory(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + 'getCategory');
  }

  getMenuList(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'GetMenuList');
  }

  getCategoryTree(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'GetCategoryMasterTree');
  }

  GetChildCategory(catgroup: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + `GetChildCategory?catgroup=${catgroup}`);
  }

  AddCategoryMaster(Cat: CategoryMaster[]): Observable<any> {
    return this.http.post<CategoryMaster>(this.apiUrl + 'AddCategoryMaster', Cat)
  }

  GetForexDetails(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'GetUserforex');
  }

  Getmenus(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `GetMenus_?id=${id}`)
  }

  GetUserData(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + 'GetUsersData');
  }

  addUserData(userUnitMaster: UserMaster[]): Observable<any> {
    return this.http.post<UserMaster>(this.apiUrl + 'AddUsersData', userUnitMaster)
  }
  updateUserData(userUnitMaster: UserMaster[]): Observable<any> {
    return this.http.put<UserMaster>(this.apiUrl + 'UpdateUsersData', userUnitMaster)
  }


}
