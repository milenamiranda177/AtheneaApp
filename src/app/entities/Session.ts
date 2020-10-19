import { Injectable } from '@angular/core';
import { Master } from './Master';
import { HttpHeaders } from '@angular/common/http';
import { Profile } from 'selenium-webdriver/firefox';

@Injectable()
export class Session {
 master: Master;
 token: string;
 permissions: JSON;
 apiUrl = location.protocol + '//' + location.hostname + ':8080/athenea/restapi/';
 getAuthHeaders() {
   // this.token = '14df43652ba669d69637a854778f';
   return new HttpHeaders().set('authorization', 'Bearer ' + btoa(this.token));
 }
 getAuthHeadersSimple() {
  // this.token = '14df43652ba669d69637a854778f';
  return new HttpHeaders().append('Content-Type', 'application/json');
}
 loadPermissions() {
    this.permissions = JSON.parse(this.master.authorities[0]['permission']);
    console.log(this.permissions);
  }

  getPermissions() {
    return this.permissions;
  }
}
