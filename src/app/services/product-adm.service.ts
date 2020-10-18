import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, retry} from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Session } from '../entities/Session';
import { HistoricData } from '../entities/HistoricData';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private userId = null;

  private handleError: HandleError;
  constructor(private http: HttpClient, private session: Session, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ProductService');
  }
  
  
  getProducts(idUser): Observable<HistoricData[]> {
    const url = this.session.apiUrl + 'core/products/' + idUser;
    return this.http.get<HistoricData[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }


  // Actualizar Cuenta
  updateDataAccount(JSONAccount, pkVwlaId): Observable<null> {
    const url = this.session.apiUrl + 'accounts/' + pkVwlaId;
    return this.http.put(url, JSONAccount, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('UpdateDataAccount', null))
    );
  }

  // Actualizar Estado de la cuenta
  updateStatusAccount(pkVwlaId, mastStatus): Observable<null> {
    const url = this.session.apiUrl + 'accounts/' + pkVwlaId + '/status/' + mastStatus;
    return this.http.put(url, '{}', {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('UpdateStatusAccount', null))
    );
  }

  public setUserId(userId){
    this.userId = userId;
  }

}
