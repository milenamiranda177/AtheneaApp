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
  selector: 'app-adress-account',
  providers: [MessageService],
  templateUrl: './adress-account.component.html',
  styleUrls: ['./adress-account.component.scss']
})
export class AdressAccountComponent implements OnInit {
    // Formulario
    addressForm: FormGroup;
    loading = false;

    /*Declaración de Vectores*/
    public typeOfAddress_data: any[] = [];
    public states_data: any[] = [];
    public cities_data: any[] = [];
    public Address_data: any[] = [];

    // Table
    completeList: any[] = [];
    filteredList: any[] = [];
    filterText;
    cols: any[];

    /*Declaración de Modelos*/
    public addressadm_type = '';
    public addressadm_state = '';
    public addressadm_city = '';
    public addressadm_neighborhood;
    public addressadm_address;
    public addressadm_areacode = '';
    public addressadm_telephone;
    public addressadm_celphone;
    public tempId;
    public pkAdpeId;

    @Input() pkMapeId;

  constructor(public http: HttpClient, private accountService: AccountService, private route: ActivatedRoute,
    private messageService: MessageService, private formBuilder: FormBuilder, private translate: TranslateService) { }

  ngOnInit() {
    this.getTypeOfAddress();
    this.getStates();
    this.getAddresses(this.pkMapeId);
    this.cols = [
      { field: 'typeAddress', header: 'ADMIN_ACCOUNT.TYPE_TABLE' },
      { field: 'statName', header: 'ADMIN_ACCOUNT.DEPARTMENT_TABLE' },
      { field: 'cityName', header: 'ADMIN_ACCOUNT.CITY_TABLE' },
      { field: 'adpeAddress', header: 'ADMIN_ACCOUNT.ADDRESS_TABLE' }
    ];
    this.addressForm = this.formBuilder.group({
      addressadm_type: [null, Validators.required],
      addressadm_state: [null, Validators.required],
      addressadm_city: [null, Validators.required],
      addressadm_neighborhood: [null, Validators.required],
      addressadm_address: [null, Validators.required],
      addressadm_areacode: [null, Validators.required],
      addressadm_telephone: [null, Validators.required],
      addressadm_celphone: [null, Validators.required],
    });
  }

  getTypeOfAddress () {
    return this.typeOfAddress_data = [
      {TypeOfAddress : 'Casa'},
      {TypeOfAddress : 'Oficina'},
      {TypeOfAddress : 'Otro'}
    ];
  }

  getStates () {
    this.accountService.getAllStates()
    .subscribe(state => this.states_data = state);
  }

  getCities () {
    this.accountService.getAllCities(this.addressadm_state)
    .subscribe(city => this.cities_data = city);
  }

  getAddresses (pkMapeId) {
    if (pkMapeId !== undefined && pkMapeId != null) {
      this.accountService.getAddressesById(pkMapeId)
      .subscribe((addresses) => {
        this.completeList = [];
        addresses.forEach(element => {
          const pkAdpeId = element.pkAdpeId;
          const telNumber = element.adpePhone.split(',');
          const temp = {typeAddress: element.typeAddress,
            pkStatId: element.fkStatId['pkStatId'],
            statName: element.fkStatId['statName'],
            pkCityId: element.fkCityId['pkCityId'],
            cityName: element.fkCityId['cityName'],
            adpeDistrict: element.adpeDistrict,
            adpeAddress: element.adpeAddress,
            areaCode: telNumber[0],
            adpePhone: telNumber[1],
            adpePhoneCelular: element.adpePhoneCelular,
            pkAdpeId: pkAdpeId};
            this.completeList.push(temp);
        });
        this.filterText = '';
        this.filteredList = this.completeList;
      });
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

  // Guardar Dirección
  saveAddress (pkMapeId) {
    if (this.addressadm_type == null || this.addressadm_type === '' ||
    this.addressadm_state == null || this.addressadm_state === '' ||
    this.addressadm_city == null || this.addressadm_city === '' ||
    this.addressadm_neighborhood == null || this.addressadm_neighborhood === '' ||
    this.addressadm_address == null || this.addressadm_address === '' ||
    this.addressadm_areacode == null || this.addressadm_areacode === '' ||
    this.addressadm_telephone == null || this.addressadm_telephone === '' ||
    this.addressadm_celphone == null || this.addressadm_celphone === '') {
      this.showError(this.translate.instant('MESSAGES.FAIL_DATA'));
    } else {
      const infoAccount = {typeAddress: this.addressadm_type,
        fkStatId: {pkStatId: this.addressadm_state},
        fkCityId: {pkCityId: this.addressadm_city},
        adpeDistrict: this.addressadm_neighborhood,
        adpeAddress: this.addressadm_address,
        adpePhone: this.addressadm_areacode + ',' + this.addressadm_telephone,
        adpePhoneCelular: this.addressadm_celphone};
        this.loading = true;
      this.accountService.saveDataAddress(infoAccount, pkMapeId).subscribe((address) => {
        this.loading = false;
        this.clearData();
        this.getAddresses(pkMapeId);
        this.showSuccess(this.translate.instant('MESSAGES.DATA_SAVED'));
      },
        error => {
          this.loading = false;
        this.showError(error);
      });
    }
  }

  // Eliminar Dirección
  deleteAddress (pkAdpeId) {
    this.accountService.deleteDataAddress(pkAdpeId)
    .subscribe((data) => {
      if (data === null) {
        this.clearData();
        this.getAddresses(this.pkMapeId);
        this.showSuccess(this.translate.instant('MESSAGES.DATA_DELETED'));
      } /*else {
        this.showError('Error al eliminar dirección');
      }*/
    },
    error => {
      this.showError(error);
    });
  }

  // Actualizar Dirección
  updateAddress (pkAdpeId) {
    if (this.addressadm_type == null || this.addressadm_type === '' ||
    this.addressadm_state == null || this.addressadm_state === '' ||
    this.addressadm_city == null || this.addressadm_city === '' ||
    this.addressadm_neighborhood == null || this.addressadm_neighborhood === '' ||
    this.addressadm_address == null || this.addressadm_address === '' ||
    this.addressadm_areacode == null || this.addressadm_areacode === '' ||
    this.addressadm_telephone == null || this.addressadm_telephone === '' ||
    this.addressadm_celphone == null || this.addressadm_celphone === '') {
      this.showError(this.translate.instant('MESSAGES.FAIL_DATA'));
    } else {
      const infoAccount = {typeAddress: this.addressadm_type,
        fkStatId: {pkStatId: this.addressadm_state},
        fkCityId: {pkCityId: this.addressadm_city},
        adpeDistrict: this.addressadm_neighborhood,
        adpeAddress: this.addressadm_address,
        adpePhone: this.addressadm_areacode + ',' + this.addressadm_telephone,
        adpePhoneCelular: this.addressadm_celphone};
        this.loading = true;
      this.accountService.updateDataAddress(infoAccount, pkAdpeId).subscribe((address) => {
        this.loading = false;
        this.clearData();
        this.getAddresses(this.pkMapeId);
        this.showSuccess(this.translate.instant('MESSAGES.DATA_UPDATED'));
      },
        error => {
          this.loading = false;
        this.showError(error);
      });
    }
  }

  // Mostrar Dirección para actualizar
  showAddress (data) {
      this.addressadm_type = data.typeAddress;
      this.addressadm_state = data.pkStatId;
      this.addressadm_city = data.pkCityId;
      this.addressadm_neighborhood = data.adpeDistrict;
      this.addressadm_address = data.adpeAddress;
      this.addressadm_areacode = data.areaCode;
      this.addressadm_telephone = data.adpePhone;
      this.addressadm_celphone = data.adpePhoneCelular;
      this.pkAdpeId = data.pkAdpeId;
      this.getCities();
  }

  // Acción guardar
  actionAddress (pkAdpeId, pkMapeId) {
    if (pkAdpeId == null) {
      this.saveAddress(pkMapeId);
    } else {
      this.updateAddress(pkAdpeId);
    }
  }

  // Limpiar Inputs
  clearData () {
    this.addressadm_type = '';
    this.addressadm_state = '';
    this.addressadm_city = '';
    this.addressadm_neighborhood = '';
    this.addressadm_address = '';
    this.addressadm_areacode = '';
    this.addressadm_telephone = '';
    this.addressadm_celphone = '';
    this.pkAdpeId = null;
  }

  showSuccess(detail) {
    this.messageService.add({severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: detail});
  }

  showError(detail) {
    this.messageService.add({severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: detail});
  }

  validateLenght(name, lenght) {
    if (name === 'addressadm_telephone') {
      // tslint:disable-next-line:no-construct
      const quantity = new String(this.addressadm_telephone);
      if (quantity.length > lenght) {
        this.showError(this.translate.instant('MESSAGES.OUT_LIMIT'));
        this.addressadm_telephone = quantity.substr(0, 10);
      }
    }
    if (name === 'addressadm_celphone') {
      // tslint:disable-next-line:no-construct
      const quantity = new String(this.addressadm_celphone);
      if (quantity.length > lenght) {
        this.showError(this.translate.instant('MESSAGES.OUT_LIMIT'));
        this.addressadm_celphone = quantity.substr(0, 14);
      }
    }
    if (name === 'addressadm_areacode') {
      // tslint:disable-next-line:no-construct
      const quantity = new String(this.addressadm_areacode);
      if (quantity.length > lenght) {
        this.showError(this.translate.instant('MESSAGES.OUT_LIMIT'));
        this.addressadm_areacode = quantity.substr(0, 2);
      }
    }
  }

  bindinDelete(currentId) {
    this.tempId = currentId;
  }
}
