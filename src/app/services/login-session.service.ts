import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Master } from '../entities/Master';
import { Session } from '../entities/Session';

@Injectable({
  providedIn: 'root'
})


export class SessionService {
  private handleError: HandleError;
  constructor(private http: HttpClient,private session: Session, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('SessionService');
  }
  
  saveDataLogin(JSONLogin): Observable<Master> {
    const url = this.session.apiUrl + 'login';
    return this.http.post<Master>(url, JSONLogin, {headers: this.session.getAuthHeadersSimple()}).pipe(
      catchError(this.handleError('SaveDataLogin', null))
    );
  }

}
