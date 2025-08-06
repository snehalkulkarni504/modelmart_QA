import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {
 
  apiUrl = environment.apiUrl_User;

  constructor(private httpClient: HttpClient) { }

  GetUserDetails(): Observable<any> {
      return this.httpClient.get<any[]>(this.apiUrl + "GetUser");
  }

  GetSingleUser(userId: Number): Observable<any> {
      return this.httpClient.get<any[]>(this.apiUrl + `GetSingleUser/${userId}`);
  }
  
}
