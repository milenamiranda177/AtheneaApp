import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Master } from '../entities/Master';
import { Session } from '../entities/Session';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  constructor(private http: HttpClient, private session: Session) { }
  
}
