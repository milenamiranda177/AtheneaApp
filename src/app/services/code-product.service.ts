import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { CodeProduct } from '../entities/CodeProduct';
import { Country2 } from '../entities/Country2';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CodeProductService {

  private countriesUrl = 'http://eborastester.invytec.com/AppEboras-war/eboras/rbAccount/rbFindCountry/';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country2[]> {

const countries = [
{counPrefix: '000550', counName: 'Brasil'},
{counPrefix: '000570', counName: 'Colombia'},
{counPrefix: '000340', counName: 'España'},
{counPrefix: '005020', counName: 'Guatemala'},
{counPrefix: '005030', counName: 'El Salvador'},
{counPrefix: '005040', counName: 'Honduras'},
{counPrefix: '005050', counName: 'Nicaragua'},
{counPrefix: '005060', counName: 'Costa Rica'},
{counPrefix: '005070', counName: 'Panama'},
{counPrefix: '018090', counName: 'Rep. Dominicana'},
{counPrefix: '000580', counName: 'Venezuela'}
    ];

    return of(countries);
    /*return this.http.get<Country[]>(this.countriesUrl)*/
  }

}
