import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Session } from '../entities/Session';
import { TypeOfDoc } from '../entities/TypeOfDoc';
import { Utc } from '../entities/Utc';
import { Role } from '../entities/Role';
import { HistoricData } from '../entities/HistoricData';
import { Person } from '../entities/Person';
import { Master } from '../entities/Master';
import { HistoricLogin } from '../entities/HistoricLogin';

@Injectable({
  providedIn: 'root'
})


export class LoginService {
  public pkMastId: null;
  public recordLogin: any;
  private handleError: HandleError;
  constructor(private http: HttpClient, private session: Session, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('LoginService');
    this.pkMastId = null;
  }
  // Tipos de Documentos.
  getKinfOfDocs(): Observable<TypeOfDoc[]> {
    const url = this.session.apiUrl + 'typeDocuments';
    return this.http.get<TypeOfDoc[]>(url, { headers: this.session.getAuthHeaders() }).pipe(
      retry(3)
      );
  }
  // Roles.
  getRoles(): Observable<Role[]> {
    const url = this.session.apiUrl + 'roles';
    return this.http.get<Role[]>(url, { headers: this.session.getAuthHeaders() }).pipe(
      retry(3)
      );
  }
  // UTC
  getUtcs(): Observable<Utc[]> {
    const url = this.session.apiUrl + 'utcs';
    return this.http.get<Utc[]>(url, { headers: this.session.getAuthHeaders() }).pipe(
      retry(3)
      );
  }
  // Cuentas titulares
  getTitularAccount(): Observable<HistoricData[]> {
    const url = this.session.apiUrl + 'accounts';
    return this.http.get<HistoricData[]>(url, { headers: this.session.getAuthHeaders() }).pipe(
      retry(3)
      );
  }

  // Personas del país
  getAllPersons(): Observable<Person[]> {
    const url = this.session.apiUrl + 'persons';
    return this.http.get<Person[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Validación de email ya existente
  checkEmailNotTaken(email: Master) {
      const url = this.session.apiUrl + 'login/email/' + email;
      return this.http.get<Master>(url, { headers: this.session.getAuthHeaders()}).pipe(
        retry(3)
        );
  }

  // Validación de login ya existente
  checkLoginNotTaken(login: Master) {
    const url = this.session.apiUrl + 'login/user/' + login;
    return this.http.get<Master>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Logins para histórico
  getAllLogin(): Observable<HistoricLogin[]> {
    const url = this.session.apiUrl + 'login/historic';
    return this.http.get<HistoricLogin[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Traer registro de login para editar
  getLogin(pkMastId: Master) {
    const url = this.session.apiUrl + 'login/' + pkMastId;
    return this.http.get<Master>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  /* Métodos para enviar datos */

  // Guardar Login

  saveDataLogin(JSONLogin): Observable<Master> {
    const url = this.session.apiUrl + 'login';
    return this.http.post<Master>(url, JSONLogin, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('SaveDataLogin', null))
    );
  }

  updateDataLogin(JSONLogin): Observable<boolean> {
    const url = this.session.apiUrl + 'login/' + JSONLogin.pkMastId;
    return this.http.put<boolean>(url, JSONLogin, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('UpdateDataLogin', null))
    );
  }

  disableLogin(JSONLogin): Observable<boolean> {
    const url = this.session.apiUrl + 'login/disable/' + JSONLogin.pkMastId;
    return this.http.put<boolean>(url, JSONLogin, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('disableLogin', null))
    );
  }

  enableLogin(JSONLogin): Observable<boolean> {
    const url = this.session.apiUrl + 'login/enable/' + JSONLogin.pkMastId;
    return this.http.put<boolean>(url, JSONLogin, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('enableLogin', null))
    );
  }
}
