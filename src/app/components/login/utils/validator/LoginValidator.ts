import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoginService } from '../../../../services/login-adm.service';

export class LoginValidator {
  constructor(private loginService: LoginService) {
  }

  static validateEmailNotTaken(loginService: LoginService, control: FormControl): any {
        return new Promise(resolve => {
          // console.log(loginService.recordLogin);
          if (loginService.pkMastId !== undefined && loginService.pkMastId !== null
            && control.value !== null && control.value !== undefined
            && loginService.recordLogin.mastEmail !== control.value) {
              setTimeout(() => {
                return loginService.checkEmailNotTaken(control.value).subscribe(res => {
                  return res ? resolve({ emailTaken: true }) : resolve(null);
                });
              }, 1000);
          } else {
            if (loginService.pkMastId === undefined || loginService.pkMastId === null
              && control.value !== null && control.value !== undefined && control.value.length > 0) {
              setTimeout(() => {
                return loginService.checkEmailNotTaken(control.value).subscribe(res => {
                  return res ? resolve({ emailTaken: true }) : resolve(null);
                });
              }, 1000);
            } else {
              resolve(null);
            }
          }
        });
  }

  static validateLoginNotTaken(loginService: LoginService, control: FormControl): any {
    // console.log('validalogin');
    // console.log(loginService.pkMastId);
      return new Promise(resolve => {
        if (loginService.recordLogin !== undefined && control.value !== null && control.value !== undefined
          && loginService.recordLogin.mastLogin !== control.value) {
            setTimeout(() => {
              return loginService.checkLoginNotTaken(control.value).subscribe(res => {
                return res ? resolve({ loginTaken: true }) : resolve(null);
              });
            }, 1000);
        } else {
          if (loginService.pkMastId === undefined || loginService.pkMastId === null &&
            control.value !== null && control.value !== undefined && control.value.length > 0) {
            setTimeout(() => {
              return loginService.checkLoginNotTaken(control.value).subscribe(res => {
                return res ? resolve({ loginTaken: true }) : resolve(null);
              });
            }, 1000);
          } else {
            return resolve(null);
          }
        }
      });
  }
}
