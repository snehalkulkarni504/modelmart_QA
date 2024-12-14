 
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class TokeninterceptorService implements HttpInterceptor {
   

  constructor(private adminService:AdminService) { }

  auth_token = localStorage.getItem("accessToken");

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tokenheader = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.auth_token
      }
    });
    debugger;
    return next.handle(tokenheader) ;
    // return next.handle(tokenheader).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     debugger;
    //     if (error.status === 401) {
    //       //this.adminService.RenewAccessTOken();
    //       //this.adminService.$refreshToken.next(true);
    //     }
    //     return throwError(error)
    //   })
    // );


  }

}
