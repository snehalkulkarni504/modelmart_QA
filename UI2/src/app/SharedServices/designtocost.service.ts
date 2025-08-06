import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DesigntocostService {

  
    apiUrl = environment.apiUrl_Search;
  
    //public $refreshToken = new Subject<boolean>;
  
    constructor(private httpClient: HttpClient) { }
  
    GetPartName(): Observable<any> {
      return this.httpClient.get<any[]>(this.apiUrl + `GetPartName`);
    }
   
    GetAdditionfilters(partname:any): Observable<any> {
      return this.httpClient.get<any[]>(this.apiUrl + `GetAdditionfilters_DTC?partname=${partname}`);
    }

    GetEngineBaseOnPlatform(platform:any,partname:any):Observable<any>{
      return this.httpClient.get<any[]>(this.apiUrl + `GetEngineBaseOnPlatform?platform=${platform}&partname=${partname}`);
    }
}
