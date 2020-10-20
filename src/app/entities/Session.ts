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
 DEFAULT = '{"registrar_usuario": false,"registrar_producto": false,"historico_usuario": false,"historico_cuentas":false,"reportes": false, "nuevo_usuario":false}';
 ROLE_USER = '{"registrar_usuario": true,"registrar_producto": true,"historico_usuario": false,"historico_cuentas":false,"reportes": false, "nuevo_usuario":true}';
 ROLE_ADMIN= '{"registrar_usuario": true,"registrar_producto": true,"historico_usuario": true,"historico_cuentas":true,"reportes": true, "nuevo_usuario":true}';
 
 getAuthHeaders() {
   // this.token = '14df43652ba669d69637a854778f';
   return new HttpHeaders().set('Authorization', 'Bearer ' + btoa(this.token));
 }
 getAuthHeadersSimple() {
  // this.token = '14df43652ba669d69637a854778f';
  return new HttpHeaders().append('Content-Type', 'application/json');
}
 loadPermissions() {
    this.permissions = JSON.parse(this.getJsonPermissions(this.master.authorities[0]['authority']));
    console.log(this.permissions);
  }

  getPermissions() {
    return this.permissions;
  }
  getJsonPermissions(role){
    if (role==='ROLE_USER'){
      return this.ROLE_USER;
    }
    if (role==='ROLE_ADMIN'){
      return this.ROLE_ADMIN;
    }
  }

  isAdmin(){
    if (typeof(this.master) !== 'undefined' && this.master !== null && 
    typeof(this.master.authorities) !=='undefined' && 
    typeof(this.master.authorities[0]) !=='undefined' && 
    this.master.authorities[0]['authority'] == 'ROLE_ADMIN'){
      return true;
    } else{
      return false;
    }
  }
}
