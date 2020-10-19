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
  
  //Traer productos por usuario
  getProducts(idUser): Observable<HistoricData[]> {
    const url = this.session.apiUrl + 'core/products/' + idUser;
    return this.http.get<HistoricData[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  //Crear Producto
  saveProduct(JSONProduct): Observable<null> {
    const url = this.session.apiUrl + 'core/products/';
    return this.http.post(url, JSONProduct, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('ProductoCreado', null))
    );
  }

  deleteProduct(productId): Observable<null> {
    const url = this.session.apiUrl + 'core/products/' + productId;
    return this.http.delete(url, productId).pipe(
      catchError(this.handleError<any>('ProductoEliminado', null))
    );
  }

  public setUserId(userId){
    this.userId = userId;
  }

}
