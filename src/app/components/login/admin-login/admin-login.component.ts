import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login-adm.service';
import { ActivatedRoute } from '@angular/router';
import { SelectItem, MessageService} from 'primeng/api';
import { Role } from '../../../entities/Role';
import { Session } from '../../../entities/Session';
import { LoginValidator } from '../../../components/login/utils/validator/LoginValidator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Master } from '../../../entities/Master';
import {Md5} from 'md5-typescript';
import { TranslateService } from '@ngx-translate/core';
import { TranslationWidth } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  providers: [MessageService],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  /*Declaración de Vectores*/
  public people_data: any[] = [];
  public list_people: SelectItem[] = [{label: this.translate.instant('ADMIN_LOGIN.SELECT'),
    value: {mastName: null, mastIdentification: null, fkDocuId: {}}}];
  public docs_data: any[] = [];
  public roles_data: any[] = [];
  public utcs_data: any[] = [];
  public accounts_data: any[] = [];
  public master: any;
  public visiblePassword = true;
  public isChangePassword = false;
  // Formulario
  loginForm: FormGroup;

  /*Declaración de Modelos*/
  loginadm_persons: String = null;
  disabledInput = false;
  hideFields = this.hideFieldsCustomer();
  accounts = [];
  public loginadm_id = null;
  public loginadm_name;
  public loginadm_role: any = null;
  public loginadm_docs = null;
  public loginadm_account = null;
  public loginadm_utc = null;
  public loginadm_identification;
  public loginadm_email;
  public loginadm_login;
  public loginadm_password;
  public loginadm_password_again;
  public validate_pass;
  /* Declaración de Modelos Json */

  public JsonTypeDoc;
  public JsonRole;

  constructor(public http: HttpClient, private loginService: LoginService, private session: Session, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private messageService: MessageService, private translate: TranslateService) { }

  ngOnInit() {
    this.getRoles();
    this.getPersons();
    this.getDocs();
    this.getUtcs();
    this.getTitularPerson();
    this.route.params.subscribe( (params) => {
      if (params['pkMastId'] != null && params['pkMastId'] !== '') {
        this.loginService.pkMastId = params['pkMastId'];
        setTimeout(function() {
          this.visiblePassword = false;
          this.getLogin(params['pkMastId']);
         }.bind(this), 500);
      }
    });
    // Validación de campos formulario


    this.loginForm = this.formBuilder.group({
      loginadm_id: [{value: this.loginService.pkMastId}],
      loginadm_name: [{value: null}, Validators.compose([Validators.required, Validators.maxLength(50)])],
      loginadm_identification: [{value: null}, [Validators.required, Validators.maxLength(20)]],
      loginadm_docs: [{value: null}, Validators.required],
      //loginadm_role: this.session.isInternRole() ? [null, Validators.required] : [this.session.master.fkRoleId],
      //loginadm_account: this.session.isInternRole() ? [{value: null}] : [this.session.master.pkMastId],
      loginadm_utc: [{value: null}, Validators.required],
      loginadm_email: ['', [Validators.required, Validators.email],
        [LoginValidator.validateEmailNotTaken.bind(this, this.loginService)]],
      loginadm_login: ['', [Validators.required, Validators.maxLength(15)],
      [LoginValidator.validateLoginNotTaken.bind(this, this.loginService)]],
      loginadm_password : [null, Validators.required], // [{value: null}, [Validators.required, Validators.maxLength(50)]],
      loginadm_password_again: [null, Validators.required], // [{value: null}, [Validators.required, Validators.maxLength(50)]],
      loginadm_persons : [{value: null}]
    });
  }

  getPersons() {
    this.loginService.getAllPersons()
    .subscribe(data => {
      this.people_data = data;
      for (const c of this.people_data) {
        this.list_people.push({ label: c.mastName , value: c });
      }
    }
    );
  }

  getDocs () {
    this.loginService.getKinfOfDocs()
    .subscribe(doc => this.docs_data = doc);
  }

  getRoles () {
    this.loginService.getRoles()
    .subscribe(role => this.roles_data = role);
  }

  getUtcs () {
    this.loginService.getUtcs()
    .subscribe(utc => this.utcs_data = utc);
  }

  getTitularPerson () {
    this.loginService.getTitularAccount()
    .subscribe(account => this.accounts_data = account);
  }

  selectPerson(event) {
    /*const data = event.value;
    this.loginadm_identification = data.mastIdentification;
    this.loginadm_name = data.mastName;
    this.loginadm_docs = data.fkDocuId.pkDocuId;

    if (this.loginadm_identification != null) {
      this.loginForm.get('loginadm_name').disable();
      this.loginForm.get('loginadm_identification').disable();
      this.loginForm.get('loginadm_docs').disable();
    } else {
      this.loginForm.get('loginadm_name').enable();
      this.loginForm.get('loginadm_identification').enable();
      this.loginForm.get('loginadm_docs').enable();
    }*/
  }

  // Ocultar campos de formulario para el usuario Cliente
  hideFieldsCustomer() {
    /*try {
        if (this.session.master.sensitivity === 'intern') {
          return true;
        } else {
          return false;
        }
    } catch (ex) {
      // console.log('Error en permisos de usuario');
    }*/
  }

  hideButtonSave(id) {
    try {
        if (id.value !== null && id.value !== '') {
          return true;
        } else {
          return false;
        }
    } catch (ex) {
     // console.log('Error en permisos de usuario');
    }
  }

  // Filtro de lista de cuentas al escoger un tipo de usuario(Rol)
  onSelectRole(value) {
    /*this.loginadm_account = null;
    const idRol = value;
    let itemMe = null;
     this.accounts = this.accounts_data.filter((item) => {
       if (item.mastLogin === this.session.master.mastLogin) {
         const mast = String(this.session.master.mastName);
         itemMe = item;
         item.mastName = '[Mi] '.concat(mast);
       }
       return Number(item.fkRoleId) === Number(idRol) && item.mastLogin !== this.session.master.mastLogin;
    });
    // Agregar la cuenta logueada en la primera opción de la lista
    if (itemMe != null && Number(itemMe.fkRoleId) === Number(idRol)) {
      this.accounts.splice(0, 0, itemMe);
    }
    // console.log(this.loginService.pkMastId);
    if (this.loginService.pkMastId !== undefined && this.loginService.pkMastId !== null) {
      this.loginForm.get('loginadm_role').disable();
    }*/
  }
  onSubmit() {
   /* if (this.loginadm_password === this.loginadm_password_again) {
      const values = this.loginForm.value;
      const objectMaster = new Master();
      objectMaster.pkMastId = values.loginadm_id !== null ? values.loginadm_id : null;
      objectMaster.fkRoleId = this.session.isInternRole() ?
        {'pkRoleId': this.loginForm.getRawValue().loginadm_role} : this.session.master.fkRoleId;
      objectMaster.mastEmail = values.loginadm_email.toLowerCase();
      objectMaster.mastLogin = values.loginadm_login;
      objectMaster.mastName = this.loginForm.getRawValue().loginadm_name;
      objectMaster.mastPassword = Md5.init(values.loginadm_password);
      objectMaster.mastIdentification = this.loginForm.getRawValue().loginadm_identification;
      objectMaster.fkDocuId = {'pkDocuId': this.loginForm.getRawValue().loginadm_docs};
      objectMaster.fkTypeId = {'pkTypeId': 1};
      objectMaster.fkMastIdBoss = this.session.isInternRole() ? values.loginadm_account : this.session.master.pkMastId;
      objectMaster.fkUtcId = {'pkUtcId': values.loginadm_utc};
      objectMaster.pkMapeId = (values.loginadm_persons !== null && typeof values.loginadm_persons === 'object') ?
        values.loginadm_persons.pkMapeId : values.loginadm_persons;

      this.loginService.saveDataLogin(objectMaster).subscribe((master) => {
        if (master != null && master.fkMapeId !== null)   {
          this.showSuccess(this.translate.instant('MESSAGES.DATA_SAVED'));
          this.loginForm.reset();
          this.loginForm.get('loginadm_name').enable();
          this.loginForm.get('loginadm_identification').enable();
          this.loginForm.get('loginadm_docs').enable();
        }
      },
      error => {
        this.showError(error);
        });
    } else {
      this.showError(this.translate.instant('ADMIN_LOGIN.PASS_NOT_MATCH'));
    }*/
  }

  onUpdate() {
    /*if (this.loginadm_password === this.loginadm_password_again) {
      const values = this.loginForm.value;
      const objectMaster = new Master();
      const name = values.loginadm_name === undefined ? this.loginForm.getRawValue().loginadm_name : values.loginadm_name;
      const identification = values.loginadm_identification === undefined ?
        this.loginForm.getRawValue().loginadm_identification : values.loginadm_identification;
      const docs = values.loginadm_docs === undefined ? this.loginForm.getRawValue().loginadm_docs : values.loginadm_docs;

      const pass = values.loginadm_password !== null && this.isChangePassword ?
        Md5.init(values.loginadm_password) : values.loginadm_password;
      const login = values.loginadm_login !== null ? values.loginadm_login : this.loginService.recordLogin.mastLogin;

      objectMaster.pkMastId = values.loginadm_id !== null ? values.loginadm_id : null;
      objectMaster.fkRoleId = this.session.isInternRole() ?
      {'pkRoleId': this.loginForm.getRawValue().loginadm_role} : this.session.master.fkRoleId;
      objectMaster.mastEmail = values.loginadm_email.toLowerCase();
      objectMaster.mastLogin = login;
      objectMaster.mastName = name;
      objectMaster.mastPassword = pass;
      objectMaster.mastIdentification = identification;
      objectMaster.fkDocuId = {'pkDocuId': docs};
      objectMaster.fkTypeId = {'pkTypeId': 1};
      objectMaster.fkMastIdBoss = this.session.isInternRole() ? values.loginadm_account : this.session.master.pkMastId;
      objectMaster.fkUtcId = {'pkUtcId': values.loginadm_utc};
      objectMaster.pkMapeId =  (typeof values.loginadm_persons === 'object') ?
        values.loginadm_persons.pkMapeId : values.loginadm_persons;
      // console.log('objectMaster: ' + JSON.stringify(objectMaster));
      this.loginService.updateDataLogin(objectMaster).subscribe((master) => {
        if (master != null && master === true)   {
          this.showSuccess( this.translate.instant('MESSAGES.DATA_UPDATED'));
        }
      },
      error => {
        this.showError(error);
      });
    } else {
      this.showError(this.translate.instant('ADMIN_LOGIN.PASS_NOT_MATCH'));
    }*/
  }

  getLogin (pkMastId) {
    /*this.loginService.getLogin(pkMastId)
    .subscribe(master => {
      if (master !== null) {
        this.loginService.recordLogin = master[0];
        if (this.loginService.recordLogin != null) {
            this.onSelectRole(this.loginService.recordLogin.fkRoleId);
        }

        this.loginForm.setValue({
          loginadm_id: master[0].pkMastId,
          loginadm_persons: {pkMapeId: master[0].fkMapeId},
          loginadm_name: master[0].mastName,
          loginadm_identification: master[0].mastIdentification,
          loginadm_docs: master[0].fkDocuId,
          loginadm_role: master[0].fkRoleId,
          loginadm_account: master[0].fkMastIdBoss === undefined ? null : master[0].fkMastIdBoss,
          loginadm_utc: master[0].fkUtcId,
          loginadm_email: master[0].mastEmail,
          loginadm_login: master[0].mastLogin === undefined ? null : master[0].mastLogin,
          loginadm_password: master[0].mastPassword === null || master[0].mastPassword === undefined ? ' ' : master[0].mastPassword,
          loginadm_password_again : master[0].mastPassword === null || master[0].mastPassword === undefined ? '' : master[0].mastPassword,
        });
        console.log(this.loginForm.getRawValue());
        // console.log(this.loginForm.value);
        if (this.loginService.pkMastId !== null && master[0].mastLogin !== undefined) {
          this.loginForm.get('loginadm_login').disable();
        }
        if (master[0].mastLogin === undefined) {
          this.visiblePassword = true;
          this.isChangePassword = true;
        }
      }
    });*/
  }

  changePass () {
    /*if (!this.visiblePassword) {
      console.log('Aquí voy a cambiar la contraseña');
      this.visiblePassword = true;
      this.loginadm_password = null;
      this.loginadm_password_again = null;
      this.loginForm.patchValue({loginadm_password : null, loginadm_password_again : null});
      this.isChangePassword = true;
    }*/
  }

  showSuccess(detail) {
    this.messageService.add({severity: 'success', summary: this.translate.instant('ADMIN_LOGIN.HEADER_MESSAGE_SUCCESS'), detail: detail});
  }

  showError(detail) {
    this.messageService.add({severity: 'error', summary: this.translate.instant('ADMIN_LOGIN.HEADER_MESSAGE_ERROR'), detail: detail});
  }

  toLower (model) {
    if (this[model] !== undefined) {
      this[model] = this[model].toLowerCase();
    }
  }

  validatePassword () {
    if (this.loginadm_password !== this.loginadm_password_again) {
      this.validate_pass = true;
    } else {
      this.validate_pass = false;
    }
  }
}

