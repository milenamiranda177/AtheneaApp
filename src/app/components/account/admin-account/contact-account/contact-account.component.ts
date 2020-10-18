import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../../../../services/account-adm.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import 'rxjs/add/operator/filter';
import { TranslateService } from '@ngx-translate/core';
import { TranslationWidth } from '@angular/common';

@Component({
  selector: 'app-contact-account',
  providers: [MessageService],
  templateUrl: './contact-account.component.html',
  styleUrls: ['./contact-account.component.scss']
})
export class ContactAccountComponent implements OnInit {
      // Formulario
      contactForm: FormGroup;
      loading = false;

      /*Declaración de Vectores*/
      public Contact_data: any[] = [];

      // Table
      completeList: any[] = [];
      filteredList: any[] = [];
      filterText;
      cols: any[];

      /*Declaración de Modelos*/
      public contactadm_name;
      public contactadm_celphone;
      public contactadm_email;
      public contactadm_areacode = '';
      public contactadm_telephone;
      public contactadm_occurrence;
      public pkCopeId;
      public tempId;
      @Input() pkMapeId;

      /*Declaración de Modelos JSON*/
      public JSONname;
      public JSONemail;
      public JSONtelephone;
      public JSONcelphone;

  constructor(public http: HttpClient, private accountService: AccountService, private route: ActivatedRoute,
    private messageService: MessageService, private formBuilder: FormBuilder, private translate: TranslateService) { }

  ngOnInit() {
    this.getContacts(this.pkMapeId);
    this.cols = [
      { field: 'copeName', header: 'ADMIN_ACCOUNT.NAME_TABLE' },
      { field: 'copeEmail', header: 'ADMIN_ACCOUNT.EMAIL_TABLE' },
      { field: 'areaCode', header: 'ADMIN_ACCOUNT.CODE_AREA' },
      { field: 'copePhone', header: 'ADMIN_ACCOUNT.TELEPHONE_TABLE' },
      { field: 'copePhoneCelular', header: 'ADMIN_ACCOUNT.CELPHONE_TABLE' }
    ];
    this.contactForm = this.formBuilder.group({
      contactadm_name: [null, Validators.required],
      contactadm_email: [null, Validators.required],
      contactadm_areacode: [null, Validators.required],
      contactadm_celphone: [null, Validators.required],
      contactadm_telephone: [null, Validators.required],
    });
  }

  getContacts (pkMapeId) {
    if (pkMapeId !== undefined && pkMapeId != null) {
      this.accountService.getContactsById(pkMapeId)
      .subscribe((contact) => {
        this.completeList = [];
        contact.forEach(element => {
          this.JSONname = element.copeName;
          this.JSONemail = element.copeEmail;
          this.JSONcelphone = element.copePhoneCelular;
          const pkCopeId = element.pkCopeId;
          const telNumber = element.copePhone.split(',');
          const temp = {copeName: this.JSONname,
            copeEmail: this.JSONemail,
            areaCode: telNumber[0],
            copePhone: telNumber[1],
            copePhoneCelular: this.JSONcelphone,
            pkCopeId: pkCopeId};
          this.completeList.push(temp);
        });
        this.filterText = '';
        this.filteredList = this.completeList;
      });
    }
  }

  /*Consumo de Servicios POST*/
  saveContact (pkMapeId) {
    if (this.contactadm_name == null || this.contactadm_name === '' ||
    this.contactadm_celphone == null || this.contactadm_celphone === '' ||
    this.contactadm_email == null || this.contactadm_email === '' ||
    this.contactadm_telephone == null || this.contactadm_telephone === '' ||
    this.contactadm_areacode == null || this.contactadm_areacode === '') {
      this.showError(this.translate.instant('MESSAGES.FAIL_DATA'));
    } else {
      if (this.contactadm_occurrence === 1) {
        this.contactadm_occurrence = 'true';
      } else { this.contactadm_occurrence = 'false'; }
      const email = this.validateEmail(this.contactadm_email);
      if (email === false) {
        this.showError(this.translate.instant('MESSAGES.FAIL_EMAIL'));
      } else {
        const infoContact = {copeName: this.contactadm_name,
          copeEmail: this.contactadm_email,
          copePhone: this.contactadm_areacode + ',' + this.contactadm_telephone,
          copePhoneCelular: this.contactadm_celphone,
          copeNotify: this.contactadm_occurrence};
          this.loading = true;
        this.accountService.saveDataContact(infoContact, pkMapeId).subscribe(contact => {
          this.loading = false;
            this.clearData();
            this.getContacts(pkMapeId);
            this.showSuccess(this.translate.instant('MESSAGES.DATA_SAVED'));
        },
          error => {
            this.loading = false;
          this.showError(error);
        });
      }
    }
  }

  deleteContact (pkCopeId) {
    this.accountService.deleteDataContact(pkCopeId)
    .subscribe((data) => {
      if (data === null) {
        this.clearData();
        this.getContacts(this.pkMapeId);
        this.showSuccess(this.translate.instant('MESSAGES.DATA_DELETED'));
      } /*else {
        this.showError('Error al eliminar contacto');
      }*/
    },
    error => {
      this.showError(error);
    });
  }

  updateContact (pkCopeId) {
    if (this.contactadm_name == null || this.contactadm_name === '' ||
    this.contactadm_celphone == null || this.contactadm_celphone === '' ||
    this.contactadm_email == null || this.contactadm_email === '' ||
    this.contactadm_telephone == null || this.contactadm_telephone === '' ||
    this.contactadm_areacode == null || this.contactadm_areacode === '') {
      this.showError(this.translate.instant('MESSAGES.FAIL_DATA'));
    } else {
      if (this.contactadm_occurrence === 1) {
        this.contactadm_occurrence = 'true';
      } else {this.contactadm_occurrence = 'false'; }
      const email = this.validateEmail(this.contactadm_email);
      if (email === false) {
        this.showError(this.translate.instant('MESSAGES.FAIL_EMAIL'));
      } else {
        const infoContact = {copeName: this.contactadm_name,
          copeEmail: this.contactadm_email,
          copePhone: this.contactadm_areacode + ',' + this.contactadm_telephone,
          copePhoneCelular: this.contactadm_celphone,
          copeNotify: this.contactadm_occurrence};
          this.loading = true;
        this.accountService.updateDataContact(infoContact, pkCopeId).subscribe(contact => {
          this.loading = false;
            this.clearData();
            this.getContacts(this.pkMapeId);
            this.showSuccess(this.translate.instant('MESSAGES.DATA_UPDATED'));
        },
          error => {
            this.loading = false;
          this.showError(error);
        });
      }
    }
  }

  filter() {
    const texto = this.filterText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if ('') {
      this.filteredList = this.completeList;
    } else {
      const list = [];
      const cols = this.cols;
      this.completeList.forEach(function (value) {
        for (let i = 0; i < cols.length; i++) {
          const col = cols[i].field;
          if (value[col] != null && value[col].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(texto)) {
              list.push(value);
              break;
          }
        }
      });
      this.filteredList = list;
    }
  }

  showContact (data) {
      this.contactadm_name = data.copeName;
      this.contactadm_email = data.copeEmail;
      this.contactadm_telephone = data.copePhone;
      this.contactadm_areacode = data.areaCode;
      this.contactadm_celphone = data.copePhoneCelular;
      this.contactadm_occurrence = data.copeNotify;
      this.pkCopeId = data.pkCopeId;
  }

  actionContact (pkCopeId, pkMapeId) {
    if (pkCopeId == null) {
      this.saveContact(pkMapeId);
    } else {
      this.updateContact(pkCopeId);
    }
  }

  // Limpiar Inputs
  clearData () {
    this.contactadm_name = '';
    this.contactadm_celphone = '';
    this.contactadm_email = '';
    this.contactadm_areacode = '';
    this.contactadm_telephone = '';
    this.contactadm_occurrence = '';
    this.pkCopeId = null;
  }

  showSuccess(detail) {
    this.messageService.add({severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: detail});
  }

  showError(detail) {
    this.messageService.add({severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: detail});
  }

  validateLenght(name, lenght) {
    if (name === 'contactadm_telephone') {
      // tslint:disable-next-line:no-construct
      const quantity = new String(this.contactadm_telephone);
      if (quantity.length > lenght) {
        this.showError(this.translate.instant('MESSAGES.OUT_LIMIT'));
        this.contactadm_telephone = quantity.substr(0, 10);
      }
    }
    if (name === 'contactadm_celphone') {
      // tslint:disable-next-line:no-construct
      const quantity = new String(this.contactadm_celphone);
      if (quantity.length > lenght) {
        this.showError(this.translate.instant('MESSAGES.OUT_LIMIT'));
        this.contactadm_celphone = quantity.substr(0, 14);
      }
    }
    if (name === 'contactadm_areacode') {
      // tslint:disable-next-line:no-construct
      const quantity = new String(this.contactadm_areacode);
      if (quantity.length > lenght) {
        this.showError(this.translate.instant('MESSAGES.OUT_LIMIT'));
        this.contactadm_areacode = quantity.substr(0, 2);
      }
    }
  }

  validateEmail (email) {
    let boolEmail: any = null;
    boolEmail =  /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)$/i.test(email);
    if (!boolEmail) {
      // tslint:disable-next-line:max-line-length
      boolEmail = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])))$/i.test(email);
      if (!boolEmail) {
        return boolEmail;
      } else {
        return boolEmail;
      }
    } else {
      return boolEmail;
    }
  }

  bindinDelete(currentId) {
    this.tempId = currentId;
  }

  toLower () {
    this.contactadm_email = this.contactadm_email.toLowerCase();
  }
}
