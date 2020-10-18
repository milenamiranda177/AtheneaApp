import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import {MessageService} from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../../../services/account-adm.service';
import { ExcelService } from '../../../services/helpers/excel-service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationWidth } from '@angular/common';
import { Subscription } from 'rxjs';
import { Session } from '../../../entities/Session';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { ContextService } from '../../../services/context.service';
declare const jquery: any;
declare const $: any;


@Component({
  selector: 'app-historic-account',
  providers: [MessageService],
  templateUrl: './historic-account.component.html',
  styleUrls: ['./historic-account.component.scss']
})
export class HistoricAccountComponent implements OnInit {
    /*Declaración de Vectores*/
    idModule = 'accountAprov';
    downloadList: MenuItem[];
    paramsSubscription: Subscription;
    data: any[] = [];

    /*Declaración de Modelos*/
    public tempId;
    public tempStatus;

    /*Declaración de Modelos de Acciones*/
    public createAccount;
    public selectAccount;
    public updateAccount;

    // Table
    completeList: any[] = [];
    filteredList: any[] = [];
    filterText;
    cols: any[];
    @ViewChild('table') table;

  constructor(public http: HttpClient, private accountService: AccountService, private messageService: MessageService,
    private excelService: ExcelService, private translate: TranslateService, public router: Router, private route: ActivatedRoute,
    public session: Session, private contextService: ContextService) { }

  ngOnInit() {
    this.downloadList = [
      {
        label: 'CSV', command: () => {
          this.toExport('CSV');
        }
      },
      {
        label: 'Excel', command: () => {
          // this.toExport('Excel');
          this.exportAsXLSX();
        }
      }/*,{
        label: 'PDF', command: () => {
          this.toExport('PDF');
        }
      }*/
    ];
    this.cols = [
      { field: 'statusDesc', header: 'ADMIN_ACCOUNT.TB_STATUS' },
      { field: 'mastName', header: 'ADMIN_ACCOUNT.NAME_TABLE' },
      { field: 'mastEmail', header: 'ADMIN_ACCOUNT.TB_EMAIL' },
      { field: 'titularDesc', header: 'ADMIN_ACCOUNT.TYPE_TABLE' },
      { field: 'mastLoginCreate', header: 'ADMIN_ACCOUNT.LABEL_USER_CREATE' },
      { field: 'mastDateCreate', header: 'ADMIN_ACCOUNT.LABEL_DATE_CREATE', type: 'date' },
      { field: 'mastLoginUpdate', header: 'ADMIN_ACCOUNT.LABEL_USER_UPDATE' },
      { field: 'mastDateUpdate', header: 'ADMIN_ACCOUNT.LABEL_DATE_UPDATE', type: 'date' },
      { field: 'vhclNumberPlate', header: 'Placas' },
    ];
    this.getAccounts();
    this.permissionModule();
    // this.jqueryStart();
  }

  permissionModule () {
      //this.createAccount = this.session.setPermissions(this.idModule, 'createAccountAprov');
      //this.selectAccount = this.session.setPermissions(this.idModule, 'selectAccountAprov');
      //this.updateAccount = this.session.setPermissions(this.idModule, 'updateAccountAprov');
  }

  getAccounts () {
   /* this.accountService.getAllAccounts()
    .subscribe((account) => {
      this.completeList = [];
      account.forEach(element => {
        const statusDesc = element.mastStatus === true ? 'ADMIN_ACCOUNT.LABEL_ENABLE' : 'ADMIN_ACCOUNT.LABEL_DISABLE';
        const temp = { mastStatus: element.mastStatus,
          mastEmail: element.mastEmail.toLowerCase(),
          docuName: element.docuName,
          isTitular: element.isTitular,
          mastLoginCreate: element.mastLoginCreate,
          mastName: element.mastName,
          mastDateCreate: element.mastDateCreate,
          mastLoginUpdate: element.mastLoginUpdate,
          mastDateUpdate: element.mastDateUpdate,
          pkMapeId: element.pkMapeId,
          statusDesc: statusDesc,
          titularDesc : element.roleName,
          vhclNumberPlate: element.vhclNumberPlate,
          json: ''};
          temp.json = JSON.stringify(temp);
        this.completeList.push(temp);
        });
      this.table.reset();
      this.filterText = '';
      this.filteredList = this.completeList;
      
    });*/
  }

  filter() {
    const texto = this.filterText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if ('') {
      this.filteredList = this.completeList;
      this.table.reset();
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
      this.table.reset();
    }
  }

  actStatusAccount (pkMapeId, mastStatus) {
    mastStatus = mastStatus === true ? 0 : 1;
    this.accountService.updateStatusAccount(pkMapeId, mastStatus).subscribe(account => {
      if (account === true) {
        if (mastStatus === 1) {
        this.showSuccess(this.translate.instant('MESSAGES.ACC_ENA'));
        } else if (mastStatus === 0) {
          this.showSuccess(this.translate.instant('MESSAGES.ACC_DIS'));
        }
        this.filteredList = [];
        this.getAccounts();
      }
    },
    error => {
      this.showError(error);
    });
  }

  showSuccess(detail) {
    this.messageService.add({severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: detail});
  }

  showError(detail) {
    this.messageService.add({severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: detail});
  }

  bindinAccion(currentId, currentStatus) {
    this.tempId = currentId;
    this.tempStatus = currentStatus;
  }

  toExport(format) {
    const rows = [];
    if (format === 'CSV') {
      const rowsHeader = [this.translate.instant('ADMIN_ACCOUNT.TB_STATUS'),
      this.translate.instant('ADMIN_ACCOUNT.NAME_TABLE'), this.translate.instant('ADMIN_ACCOUNT.TB_EMAIL'),
      this.translate.instant('ADMIN_ACCOUNT.TYPE_TABLE'), this.translate.instant('ADMIN_ACCOUNT.LABEL_USER_CREATE'),
      this.translate.instant('ADMIN_ACCOUNT.LABEL_DATE_CREATE'), this.translate.instant('ADMIN_ACCOUNT.LABEL_USER_UPDATE'),
      this.translate.instant('ADMIN_ACCOUNT.LABEL_DATE_UPDATE')];
      rows.push(rowsHeader);
      this.completeList.forEach(element => {
      const statusDesc = element.mastStatus === true ? this.translate.instant('ADMIN_ACCOUNT.LABEL_ENABLE') :
      this.translate.instant('ADMIN_ACCOUNT.LABEL_DISABLE');
      const isTitular = element.isTitular === true ? this.translate.instant('ADMIN_ACCOUNT.HEADLINE') :
      this.translate.instant('ADMIN_ACCOUNT.OPERATOR');
        if (element.mastDateUpdate !== undefined) {
          element.mastDateUpdate = element.mastDateUpdate.substr(0, 10);
        }
        if (element.mastDateCreate !== undefined) {
          element.mastDateCreate = element.mastDateCreate.substr(0, 10);
        }
      const rows1 = [statusDesc, element.mastName, element.mastEmail, element.titularDesc, element.mastLoginCreate,
        element.mastDateCreate, element.mastLoginUpdate, element.mastDateUpdate];
      rows.push(rows1);
      });
      /*
      let csvContent = 'data:text/csv;charset=utf-8,';
              
      rows.forEach(function(rowArray) {
        const row = rowArray.join(',');
        csvContent += row + '\r\n';
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', this.translate.instant('MENU.ACCOUNTS') + '.csv');
      document.body.appendChild(link);
      link.click();

    }*/
    var csvContent = '';
    rows.forEach(function(rowArray) {
      const row = rowArray.join(';');
      csvContent += row + '\r\n';
    });
    
    let blob = new Blob(['\ufeff' + csvContent], { 
      type: 'text/csv;charset=ISO-8859-1;'
    });
    
    const link = document.createElement('a'); 
    let url = URL.createObjectURL(blob); 
    link.setAttribute("href", url); 
    link.setAttribute('download', this.translate.instant('MENU.ACCOUNTS') + (new Date()).toLocaleDateString('YmdHis') + '.csv');
    document.body.appendChild(link); 
    link.click(); 
    }


  

    if (format === 'PDF') {
      /*// NOTA: Se deja la primera posición en blanco, ya que Microsoft Excel comienza a contar desde la posición 1.
      const rowsHeader = ['', this.translate.instant('ADMIN_ACCOUNT.TB_STATUS'),
      this.translate.instant('ADMIN_ACCOUNT.NAME_TABLE'), this.translate.instant('ADMIN_ACCOUNT.TB_EMAIL'),
      this.translate.instant('ADMIN_ACCOUNT.TYPE_TABLE'), this.translate.instant('ADMIN_ACCOUNT.LABEL_USER_CREATE'),
      this.translate.instant('ADMIN_ACCOUNT.LABEL_DATE_CREATE'), this.translate.instant('ADMIN_ACCOUNT.LABEL_USER_UPDATE'),
      this.translate.instant('ADMIN_ACCOUNT.LABEL_DATE_UPDATE')];
      rows.push(rowsHeader);
      this.completeList.forEach(element => {
      const statusDesc = element.mastStatus === true ? this.translate.instant('ADMIN_ACCOUNT.LABEL_ENABLE') :
      this.translate.instant('ADMIN_ACCOUNT.LABEL_DISABLE');
        if (element.mastDateUpdate !== undefined) {
          element.mastDateUpdate = element.mastDateUpdate.substr(0, 10);
        }
        if (element.mastDateCreate !== undefined) {
          element.mastDateCreate = element.mastDateCreate.substr(0, 10);
        }
      const rows1 = [statusDesc, element.mastName, element.mastEmail, element.titularDesc, element.mastLoginCreate,
        element.mastDateCreate, element.mastLoginUpdate, element.mastDateUpdate];
      rows.push(rows1);
      });
      let pdfContent = 'data:application/pdf';

      rows.forEach(function(rowArray) {
        const row = rowArray.join(',');
        pdfContent += row + '\r\n';
      });

      const encodedUri = encodeURI(pdfContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', this.translate.instant('MENU.ACCOUNTS') + '.pdf');
      document.body.appendChild(link);
      link.click();*/

    }
  }

  exportAsXLSX(): void {
    this.completeList.forEach(element => {
      const statusDesc = element.mastStatus === true ? this.translate.instant('ADMIN_ACCOUNT.LABEL_ENABLE') :
      this.translate.instant('ADMIN_ACCOUNT.LABEL_DISABLE');
        if (element.mastDateUpdate !== undefined) {
          element.mastDateUpdate = element.mastDateUpdate.substr(0, 10);
        }
        if (element.mastDateCreate !== undefined) {
          element.mastDateCreate = element.mastDateCreate.substr(0, 10);
        }
        const datos = {
        Estado: statusDesc,
        Nombre: element.mastName,
        Email: element.mastEmail,
        Tipo: element.titularDesc,
        Usuario_creador: element.mastLoginCreate,
        Fecha_Hora_creación: element.mastDateCreate,
        Usuario_modificó : element.mastLoginUpdate,
        Fecha_Hora_modificación : element.mastDateUpdate
        };
      this.data.push(datos);
    });
    this.excelService.exportAsExcelFile(this.data, this.translate.instant('MENU.ACCOUNTS') + (new Date()).toLocaleDateString('YmdHis'));
  }

}
