import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../../../../services/account-adm.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import 'rxjs/add/operator/filter';
import { TranslateService } from '@ngx-translate/core';
import { TranslationWidth } from '@angular/common';
import { Session } from '../../../../entities/Session';

@Component({
  selector: 'app-new-account',
  providers: [MessageService],
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss']
})
// @Injectable()
export class NewAccountComponent implements OnInit {
  /*Formulario*/
  accountForm: FormGroup;

  /*Declaración de Vectores*/
  idModule = 'accountAprov';
  public persons_data: any[] = [];
  public docs_data: any[] = [];
  public countries_data: any[] = [];
  public states_data: any[] = [];
  public cities_data: any[] = [];
  public utcs_data: any[] = [];
  public accountSave_data: any[] = [];
  public account_data: any[] = [];
  frameList: any[] = [];

  @Input() pkMapeId;

  @Output() updateAccountEvent = new EventEmitter<String>();

  /*Declaracion de Modelos*/
  public radio_button;
  public accountadm_name;
  public accountadm_email;
  public accountadm_persons: String = '';
  public accountadm_docs: String = '';
  public accountadm_idNumber;
  public accountadm_address;
  public accountadm_areacode = '';
  public accountadm_telNumber;
  public accountadm_celNumber;
  public accountadm_birthdate;
  public accountadm_states: String = '';
  public accountadm_cities: String = '';
  public accountadm_utcs: String = '';
  public currentDate;

  /*Declaracion de Modelos JSON*/
  public JsonIsTitular;
  public JsonName;
  public JsonEmail;
  public JsonTypeId;
  public JsonTypeDoc;
  public JsonId;
  public JsonAddress;
  public JsonTelephone;
  public JSONPhone;
  public JsonBirthDate;
  public JsonCity;
  public JsonUtc;
      
  /*Declaración de Modelos de permisos*/
  public changeTypeAccountAprov = true;

  createTableContract = false;
  constructor(public http: HttpClient, private accountService: AccountService, private route: ActivatedRoute,
    private messageService: MessageService, private formBuilder: FormBuilder, private translate: TranslateService,
      public session: Session) {}

  ngOnInit() {
    this.getDataAccount(this.pkMapeId);
    this.getPersons();
    this.getDocs();
    this.getUtcs();
    this.getCountries();
    this.getStates();
    /*Inicio de variables para permisos*/
    this.permissionModule();
      
    this.currentDate = this.getDate();
    this.accountForm = this.formBuilder.group({
      radio_button: [null, Validators.required],
      accountadm_name: [null, Validators.required],
      accountadm_email: [null, [Validators.required, Validators.email]],
      accountadm_persons: [null, Validators.required],
      accountadm_docs: [null, Validators.required],
      accountadm_idNumber: [null, Validators.required],
      accountadm_address: [null, Validators.required],
      accountadm_areacode: [null, Validators.required],
      accountadm_telNumber: [null, Validators.required],
      accountadm_celNumber: [null, Validators.required],
      accountadm_birthdate: [null, [Validators.required]],
      accountadm_states: [null, Validators.required],
      accountadm_cities: [null, Validators.required],
      accountadm_utcs: [null, Validators.required]
    });
  }
      
  permissionModule () {
      console.log(this.pkMapeId);
      if (typeof (this.pkMapeId) !== 'undefined'){
        //this.changeTypeAccountAprov = this.session.setPermissions(this.idModule, 'changeTypeAccountAprov');
      }
  }

  getPersons () {
    this.accountService.getKindfOfPersons()
    .subscribe(person => this.persons_data = person);
  }

  getDocs () {
    this.accountService.getKinfOfDocs()
    .subscribe(doc => this.docs_data = doc);
  }

  getCountries () {
    this.accountService.getAllCountries()
    .subscribe(country => this.countries_data = country);
  }

  getStates () {
    this.accountService.getAllStates()
    .subscribe(state => this.states_data = state);
  }

  getCities () {
    if (this.accountadm_states) {
      this.accountService.getAllCities(this.accountadm_states)
      .subscribe(city => this.cities_data = city);
      this.accountadm_cities = this.cities_data[0]['pkCityId'];
    }
  }

  getUtcs () {
    this.accountService.getAllUtcs()
    .subscribe(utc => this.utcs_data = utc);
  }

  getDataAccount (pkMapeId) {
   /* if (pkMapeId !== undefined && pkMapeId !== null) {
    this.accountService.getAccountById(pkMapeId)
    .subscribe((account) => {
      account.forEach(element => {
        this.pkMapeId = element.pkMapeId;
        if (element.isTitular === true) {
          this.radio_button = 'true';
        } else {
          this.radio_button = 'false';
        }
        const telNumber = element.mastPhone.split(',');
        this.accountadm_areacode = telNumber[0];
        this.accountadm_telNumber = telNumber[1];
        this.accountadm_name = element.mastName;
        this.accountadm_email = element.mastEmail.toLowerCase();
        this.accountadm_persons = element.fkTypeId;
        this.accountadm_docs = element.fkDocuId;
        this.accountadm_idNumber = element.mastIdentification;
        this.accountadm_address = element.mastAddress;
        this.accountadm_celNumber = element.mastMobilePhone;
        this.accountadm_birthdate = element.mastBirthDate.substr(0, 10);
        this.accountadm_states = element.fkStatId;
        this.accountadm_cities = element.fkCityId;
        this.accountadm_utcs = element.fkUtcId;
        this.getCities();
        });
      });
    }*/
  }

  saveAccount () {
    if (this.accountadm_name == null || this.accountadm_name === '' ||
    this.accountadm_email == null || this.accountadm_email === '' ||
    this.accountadm_persons == null || this.accountadm_persons === '' ||
    this.accountadm_docs == null || this.accountadm_docs === '' ||
    this.accountadm_idNumber == null || this.accountadm_idNumber === '' ||
    this.accountadm_address == null || this.accountadm_address === '' ||
    this.accountadm_areacode == null || this.accountadm_areacode === '' ||
    this.accountadm_telNumber == null || this.accountadm_telNumber === '' ||
    this.accountadm_celNumber == null || this.accountadm_celNumber === '' ||
    this.accountadm_birthdate == null || this.accountadm_birthdate === '' ||
    this.accountadm_states == null || this.accountadm_states === '' ||
    this.accountadm_cities == null || this.accountadm_cities === '' ||
    this.accountadm_utcs == null || this.accountadm_utcs === '' ||
    this.radio_button == null || this.radio_button === '') {
      this.showError(this.translate.instant('MESSAGES.FAIL_DATA'));
    } else {
      const email = this.validateEmail(this.accountadm_email);
      if (email === false) {
        this.showError(this.translate.instant('MESSAGES.FAIL_EMAIL'));
      } else if (this.currentDate < this.accountadm_birthdate) {
        this.showError(this.translate.instant('MESSAGES.FAIL_DATE'));
        } else {
          const infoAccount = { fkDocuId:
            { pkDocuId: this.accountadm_docs},
            fkTypeId: {pkTypeId: this.accountadm_persons},
            mastIdentification: this.accountadm_idNumber,
            mastName: this.accountadm_name,
            mastBirthDate: this.accountadm_birthdate,
            mastPhone: this.accountadm_areacode + ',' + this.accountadm_telNumber,
            mastMobilePhone: this.accountadm_celNumber,
            mastAddress: this.accountadm_address,
            mastEmail: this.accountadm_email.toLowerCase(),
            isDriver: false,
            isOwner: false,
            isTitular: this.radio_button,
            fkCityId: {pkCityId: this.accountadm_cities},
            fkUtcId: {pkUtcId: this.accountadm_utcs}};
          this.accountService.saveDataAccount(infoAccount).subscribe((account) => {
            if (account != null && account.pkMapeId !== null) {
              this.pkMapeId = account.pkMapeId;
              this.showSuccess(this.translate.instant('MESSAGES.DATA_SAVED'));
              this.updateAccountEvent.emit(JSON.stringify(account));
            }
          },
          error => {
            this.showError(error);
        });
      }
    }
  }

  updateAccount (pkMapeId) {
    if (this.accountadm_name == null || this.accountadm_name === '' ||
    this.accountadm_email == null || this.accountadm_email === '' ||
    this.accountadm_persons == null || this.accountadm_persons === '' ||
    this.accountadm_docs == null || this.accountadm_docs === '' ||
    this.accountadm_idNumber == null || this.accountadm_idNumber === '' ||
    this.accountadm_address == null || this.accountadm_address === '' ||
    this.accountadm_telNumber == null || this.accountadm_telNumber === '' ||
    this.accountadm_celNumber == null || this.accountadm_celNumber === '' ||
    this.accountadm_birthdate == null || this.accountadm_birthdate === '' ||
    this.accountadm_states == null || this.accountadm_states === '' ||
    this.accountadm_cities == null || this.accountadm_cities === '' ||
    this.accountadm_utcs == null || this.accountadm_utcs === '' ||
    this.radio_button == null || this.radio_button === '') {
      this.showError(this.translate.instant('MESSAGES.FAIL_DATA'));
    } else {
      const email = this.validateEmail(this.accountadm_email);
      if (email === false) {
        this.showError(this.translate.instant('MESSAGES.FAIL_EMAIL'));
      } else if (this.currentDate <= this.accountadm_birthdate) {
        this.showError(this.translate.instant('MESSAGES.FAIL_DATE'));
        } else {
        const infoAccount = {
            fkDocuId: {
              pkDocuId: this.accountadm_docs
            },
            pkMapeId: this.pkMapeId,
            fkTypeId: {pkTypeId: this.accountadm_persons},
            mastIdentification: this.accountadm_idNumber,
            mastName: this.accountadm_name,
            mastBirthDate: this.accountadm_birthdate,
            mastPhone: this.accountadm_areacode + ',' + this.accountadm_telNumber,
            mastMobilePhone: this.accountadm_celNumber,
            mastAddress: this.accountadm_address,
            mastEmail: this.accountadm_email.toLowerCase(),
            isDriver: false,
            isOwner: false,
            isTitular: this.radio_button,
            fkCityId: {pkCityId: this.accountadm_cities},
            fkUtcId: {pkUtcId: this.accountadm_utcs}
          };
          // console.log(JSON.stringify(infoAccount));
        this.accountService.updateDataAccount(infoAccount, pkMapeId).subscribe(response => {
          if (response === true) {
            this.showSuccess(this.translate.instant('MESSAGES.DATA_UPDATED'));
            const accountString = JSON.stringify(infoAccount);
            this.updateAccountEvent.emit(accountString);
          }
        },
          error => {
          this.showError(error);
        });
      }
    }
  }

  // Acción guardar
  actionAccount (pkMapeId) {
    if (pkMapeId === undefined) {
      this.saveAccount();
    } else {
      this.updateAccount(pkMapeId);
    }
  }

  showSuccess(detail) {
    this.messageService.add({severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: detail});
  }

  showError(detail) {
    this.messageService.add({severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: detail});
  }

  validateLenght(name, lenght) {
    if (name === 'accountadm_telNumber') {
      // tslint:disable-next-line:no-construct
      const quantity = new String(this.accountadm_telNumber);
      if (quantity.length > lenght) {
        this.showError(this.translate.instant('MESSAGES.OUT_LIMIT'));
        this.accountadm_telNumber = quantity.substr(0, 10);
      }
    }
    if (name === 'accountadm_celNumber') {
      // tslint:disable-next-line:no-construct
      const quantity = new String(this.accountadm_celNumber);
      if (quantity.length > lenght) {
        this.showError(this.translate.instant('MESSAGES.OUT_LIMIT'));
        this.accountadm_celNumber = quantity.substr(0, 14);
      }
    }
    if (name === 'accountadm_areacode') {
      // tslint:disable-next-line:no-construct
      const quantity = new String(this.accountadm_areacode);
      if (quantity.length > lenght) {
        this.showError(this.translate.instant('MESSAGES.OUT_LIMIT'));
        this.accountadm_areacode = quantity.substr(0, 2);
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

  getDate () {
    const now = new Date();
    const nowday = now.getDate();
    const nowmonth = now.getMonth() + 1;
    const year = now.getFullYear();
    if (nowday < 10 && nowmonth >= 10) {
      const day = '0' + nowday;
      return year + '-' + nowmonth + '-' + day;
    } else if (nowmonth < 10 && nowday >= 10) {
      const month = '0' + nowmonth;
      return year + '-' + month + '-' + nowday;
    } else if (nowmonth < 10 && nowday < 10) {
      const day = '0' + nowday;
      const month = '0' + nowmonth;
      return year + '-' + month + '-' + day;
    } else if (nowmonth >= 10 && nowday >= 10) {
      return year + '-' + nowmonth + '-' + nowday;
    }
  }

  toLower () {
    this.accountadm_email = this.accountadm_email.toLowerCase();
  }
}
