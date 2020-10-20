import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, retry} from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Session } from '../entities/Session';
import { AccountAdm } from '../entities/Account';
import { City } from '../entities/City';
import { Master } from '../entities/Master';
import { HistoricData } from '../entities/HistoricData';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private handleError: HandleError;
  constructor(private http: HttpClient, private session: Session, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('AccountService');
  }


  getUser(idUser): Observable<Master> {
    const url = this.session.apiUrl + 'core/usuarios/' + idUser;
    return this.http.get<Master>(url, { headers: this.session.getAuthHeaders()}).pipe(
     
      );
  }

  getAllUser(): Observable<Master[]> {
    const url = this.session.apiUrl + 'core/usuarios';
    return this.http.get<Master[]>(url, { headers: this.session.getAuthHeaders()}).pipe( 
    );
  }

  saveDataAccount(JSONAccount): Observable<String> {
    const url = this.session.apiUrl + 'core/usuarios';
    return this.http.post<Master>(url, JSONAccount, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('SaveDataAccount', null))
    );
  }

  updateDataAccount(JSONAccount): Observable<String> {
    const url = this.session.apiUrl + 'core/usuarios';
    return this.http.put<Master>(url, JSONAccount, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('UpdateDataAccount', null))
    );
  }

  deleteDataAccount(idUser): Observable<String> {
    const url = this.session.apiUrl + 'core/usuarios/' +idUser;
    return this.http.delete<Master>(url, idUser).pipe(
      catchError(this.handleError('DeleteDataAccount', null))
    );
  }

}
