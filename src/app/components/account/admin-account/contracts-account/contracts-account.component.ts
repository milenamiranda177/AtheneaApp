import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../../../../services/account-adm.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import 'rxjs/add/operator/filter';
import { TranslateService } from '@ngx-translate/core';
import { TranslationWidth } from '@angular/common';
import { ContractsVehiclesComponent } from './contracts-vehicles/contracts-vehicles.component';

@Component({
  selector: 'app-contracts-account',
  providers: [MessageService],
  templateUrl: './contracts-account.component.html',
  styleUrls: ['./contracts-account.component.scss']
})
export class ContractsAccountComponent implements OnInit {
  // Formulario
  contractForm: FormGroup;
  loading = false;

  /*Vectores Contrato*/
  public statusContract_data: any[] = [];
  public Contract_data: any[] = [];

  // Table
  completeList: any[] = [];
  filteredList: any[] = [];
  filterText;
  cols: any[];

  /*Modelos Contrato*/
  public contractNumber;
  public dateStart_contract;
  public dateEnd_contract;
  public statusContract = '';
  public pkContId;
  public tempId;
  public currentDate = this.getDate();
  public descStatus;
  @Input() pkMapeId;

  @ViewChild('vehiclesComponent') vehiclesComponent: ContractsVehiclesComponent;

  constructor(public http: HttpClient, private accountService: AccountService, private route: ActivatedRoute,
    private messageService: MessageService, private formBuilder: FormBuilder, private translate: TranslateService) { }

  ngOnInit() {
    this.getStatusContract();
    this.getContracts(this.pkMapeId);
    this.cols = [
      { field: 'contNumber', header: 'ADMIN_ACCOUNT.CONTRACT_TABLE' },
      { field: 'descStatus', header: 'ADMIN_ACCOUNT.TB_STATUS' },
      { field: 'contDateInit', header: 'ADMIN_ACCOUNT.START_DATE_TABLE', type: 'date' },
      { field: 'contDateEnd', header: 'ADMIN_ACCOUNT.END_DATE_TABLE', type: 'date' }
    ];
    this.contractForm = this.formBuilder.group({
      contractNumber: [null, Validators.required],
      dateStart_contract: [null, Validators.required],
      dateEnd_contract: [null, Validators.required],
      statusContract: [null, Validators.required],
    });
  }

  getStatusContract () {
    this.accountService.getAllStatusContract()
    .subscribe(status => this.statusContract_data = status);
  }

  getContracts (pkMapeId) {
    if (pkMapeId !== undefined && pkMapeId !== null) {
      this.accountService.getContractsById(pkMapeId)
      .subscribe((contract) => {
        this.completeList = [];
        contract.forEach(element => {
          let dateStart = '';
          let dateFinish = '';
          if (element.contDateInit !== undefined) {
             dateStart = element.contDateInit.substr(0, 10);
          }
          if (element.contDateEnd !== undefined) {
            dateFinish = element.contDateEnd.substr(0, 10);
          }
          if (element.fkCtstId['pkCtstId'] === 1) {}
          this.getDescStatus(element.fkCtstId['pkCtstId']);
          const temp = {contNumber: element.contNumber,
            contDateInit: dateStart,
            contDateEnd: dateFinish,
            descStatus: this.descStatus,
            ctstName: element.fkCtstId['ctstName'],
            pkCtstId: element.fkCtstId['pkCtstId'],
            pkContId: element.pkContId};
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

  // Guardar Contrato
  addContract (pkMapeId) {
    if (this.contractNumber == null || this.contractNumber === '' ||
    this.dateStart_contract == null || this.dateStart_contract === '' ||
    this.dateEnd_contract == null || this.dateEnd_contract === '' ||
    this.statusContract == null || this.statusContract === '') {
      this.showError(this.translate.instant('MESSAGES.FAIL_DATA'));
    } else if (this.contractNumber <= 0) {
      this.showError(this.translate.instant('MESSAGES.CONTRACT_LIMIT'));
    } else if (this.dateEnd_contract < this.currentDate && this.statusContract === '1') {
      this.showError(this.translate.instant('MESSAGES.INVALID_CONTRACT1'));
    } else if (this.dateEnd_contract > this.currentDate && this.statusContract === '3') {
      this.showError(this.translate.instant('MESSAGES.INVALID_CONTRACT2'));
    } else if (this.dateStart_contract < this.dateEnd_contract) {
      const infoContract = {contNumber: this.contractNumber,
        contDateInit: this.dateStart_contract,
        contDateEnd: this.dateEnd_contract,
        fkCtstId: {pkCtstId: this.statusContract}};
        this.loading = true;
      this.accountService.saveDataContract(infoContract, pkMapeId).subscribe(account => {
        this.loading = false;
        if (account.pkContId != null) {
          this.clearData();
          this.getContracts(this.pkMapeId);
          this.showSuccess(this.translate.instant('MESSAGES.DATA_SAVED'));
        }
      },
        error => {
        this.loading = false;
        this.showError(error);
      });
    } else {
      this.showError(this.translate.instant('MESSAGES.FAIL_DATE2'));
    }
  }

  // Eliminar Contrato
  deleteContract (pkContId) {
    this.accountService.deleteDataContract(pkContId)
    .subscribe((data) => {
      if (data === null) {
        this.getContracts(this.pkMapeId);
        this.showSuccess(this.translate.instant('MESSAGES.DATA_DELETED'));
      }
    },
    error => {
      this.showError(error);
    });
  }

  // Actualizar Contrato
  UpdateContract (pkContId) {
    if (this.contractNumber == null || this.contractNumber === '' ||
    this.dateStart_contract == null || this.dateStart_contract === '' ||
    this.dateEnd_contract == null || this.dateEnd_contract === '' ||
    this.statusContract == null || this.statusContract === '') {
      this.showError(this.translate.instant('MESSAGES.FAIL_DATA'));
    } else if (this.contractNumber <= 0) {
      this.showError(this.translate.instant('MESSAGES.CONTRACT_LIMIT'));
    } else if (this.dateStart_contract < this.dateEnd_contract) {
      const infoContract = {contNumber: this.contractNumber,
        contDateInit: this.dateStart_contract,
        contDateEnd: this.dateEnd_contract,
        fkCtstId: {pkCtstId: this.statusContract}};
        this.loading = true;
      this.accountService.updateDataContract(infoContract, pkContId).subscribe(account => {
        this.loading = false;
        if (account === true) {
          this.clearData();
          this.getContracts(this.pkMapeId);
          this.showSuccess(this.translate.instant('MESSAGES.DATA_UPDATED'));
        }
      },
      error => {
        this.loading = false;
        this.showError(error);
      });
    } else {
      this.showError(this.translate.instant('MESSAGES.FAIL_DATE2'));
    }
  }

  // Mostrar Contrato para actualizar
  showContract (data) {
    this.contractNumber = data.contNumber;
    if (data.contDateInit !== undefined) {
      this.dateStart_contract = data.contDateInit.substr(0, 10);
    }
    if (data.contDateEnd !== undefined) {
      this.dateEnd_contract = data.contDateEnd.substr(0, 10);
    }
    this.statusContract = data.pkCtstId;
    this.pkContId = data.pkContId;
  }

  // Acción guardar
  actionContract (pkContId, pkMapeId) {
    if (pkContId == null) {
      this.addContract(pkMapeId);
    } else {
      this.UpdateContract(pkContId);
    }
  }

  // Limpiar Inputs
  clearData () {
    this.contractNumber = '';
    this.dateStart_contract = '';
    this.dateEnd_contract = '';
    this.statusContract = '';
    this.pkContId = null;
  }

  showVehicles(contractId: String) {
    this.vehiclesComponent.updateVehicles(contractId);
  }

  showSuccess(detail) {
    this.messageService.add({severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: detail});
  }

  showError(detail) {
    this.messageService.add({severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: detail});
  }

  validateLenght(name, lenght) {
    if (name === 'contractNumber') {
      // tslint:disable-next-line:no-construct
      const quantity = new String(this.contractNumber);
      if (quantity.length > lenght) {
        this.showError(this.translate.instant('MESSAGES.OUT_LIMIT'));
        this.contractNumber = quantity.substr(0, 14);
      }
    }
  }

  bindinDelete(currentId) {
    this.tempId = currentId;
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

  getDescStatus (status) {
    if (status === 1) {
      this.descStatus = 'Vigente';
    } else if (status === 2) {
      this.descStatus = 'Pendiente';
    } else if (status === 3) {
      this.descStatus = 'Concluido';
    } else {
      this.descStatus = 'Cancelado / Anulado';
    }
  }
/*
updateDiv()
{
    $( "contenidos2" ).load(window.location.href + " contenidos2" );
}*/

muestraMensaje() {
  alert('Gracias por pinchar');
}

clearFilter() {
    setTimeout(function() {
   /* document.getElementById('clear').value='';*/
    document.getElementById('clear').focus();
    document.getElementById('cli').click();

  }, 200);

}

  }
