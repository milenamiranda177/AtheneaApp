import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import {MessageService} from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../../../services/login-adm.service';
import { ExcelService } from '../../../services/helpers/excel-service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Session } from '../../../entities/Session';
import { ContextService } from '../../../services/context.service';

@Component({
  selector: 'app-historic-login',
  providers: [MessageService],
  templateUrl: './historic-login.component.html',
  styleUrls: ['./historic-login.component.scss']
})
export class HistoricLoginComponent implements OnInit {
    paramsSubscription: Subscription;
    /*Declaración de Vectores*/
    downloadList: MenuItem[];
    data: any[] = [];

    /*Declaración de Vectores de Acciones*/
    public idModule = 'loginAprov';
    public createLogin;
    public searchLogin;
    public updateLogin;

    // Table
    completeList: any[] = [];
    filteredList: any[] = [];
    filterText;
    cols: any[];
    @ViewChild('table') table;

  constructor(public http: HttpClient, private loginService: LoginService, private messageService: MessageService,
    private excelService: ExcelService, private router: Router, private route: ActivatedRoute, private translate: TranslateService,
    private contextService: ContextService, public session: Session) { }

  ngOnInit() {
    this.downloadList = [
      {
        label: 'CSV', command: () => {
          this.toExport('CSV');
        }
      },
      {
        label: 'Excel', command: () => {
          this.exportAsXLSX();
        }
      }/*,{
        label: 'PDF', command: () => {
        }
      }
      */
    ];
    this.cols = [
      { field: 'mastLogin', header: 'ADMIN_LOGIN.LOGIN' },
      { field: 'mastName', header: 'ADMIN_LOGIN.NAME' },
      { field: 'mastEmail', header: 'ADMIN_LOGIN.EMAIL' },
      { field: 'mastLoginAccount', header: 'ADMIN_LOGIN.CUSTOMER' },
      { field: 'mastLoginRegister', header: 'ADMIN_LOGIN.CREATE_USER' },
      { field: 'mastCreationDate', header: 'ADMIN_LOGIN.CREATE_DATE', type: 'date' },
      { field: 'roleName', header: 'ADMIN_LOGIN.TYPE_LOGIN' }
    ];
    this.getLogins();
    this.permissionModule();
  }

  permissionModule () {
   // this.createLogin = this.session.setPermissions(this.idModule, 'createLoginAprov');
   // this.searchLogin = this.session.setPermissions(this.idModule, 'searchLoginAprov');
   // this.updateLogin = this.session.setPermissions(this.idModule, 'updateLoginAprov');
  }

  getLogins () {
    this.loginService.getAllLogin()
    .subscribe((master) => {
      this.completeList = [];
      master.forEach(element => {
        const temp = {
          pkMastId: element.pkMastId,
          mastLogin: element.mastLogin,
          mastName: element.mastName,
          mastEmail: element.mastEmail.toLowerCase(),
          mastLoginAccount: element.mastLoginAccount,
          mastLoginRegister: element.mastLoginRegister,
          mastCreationDate: element.mastCreationDate,
          roleName: element.roleName,
          mastStatus: element.mastStatus,
          json: ''};
          temp.json = JSON.stringify(temp);
        this.completeList.push(temp);
      });
      // console.log(this.completeList);
      this.table.reset();
      this.filterText = '';
      this.filteredList = this.completeList;
    });
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
          // if (value[col] != null && value[col].toLowerCase().includes(texto)) {
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

  disableUser(data, event) {
    // console.log(event);
    this.loginService.disableLogin(data).subscribe(master => {
      if (master === true) {
        data.mastStatus = false;
        this.showSuccess(this.translate.instant('MESSAGES.USER_DISABLE'));
        this.getLogins();
      }
    });
  }

  enableUser(data, event) {
    // console.log(event);
    this.loginService.enableLogin(data).subscribe(master => {
      if (master === true) {
        data.mastStatus = true;
        this.showSuccess(this.translate.instant('MESSAGES.USER_ENABLE'));
        this.getLogins();
      }
    });
  }

  showSuccess(detail) {
    this.messageService.add({severity: 'success', summary: this.translate.instant('ADMIN_LOGIN.HEADER_MESSAGE_SUCCESS'), detail: detail});
  }

  showError(detail) {
    this.messageService.add({severity: 'error', summary: this.translate.instant('ADMIN_LOGIN.HEADER_MESSAGE_ERROR'), detail: detail});
  }

  toExport(format) {
    const rows = [];
    if (format === 'CSV') {
      const rowsHeader =     [this.translate.instant('ADMIN_LOGIN.LOGIN'),
      this.translate.instant('ADMIN_LOGIN.NAME'), this.translate.instant('ADMIN_LOGIN.EMAIL'),
      this.translate.instant('ADMIN_LOGIN.CUSTOMER'), this.translate.instant('ADMIN_LOGIN.CREATE_USER'),
      this.translate.instant('ADMIN_LOGIN.CREATE_DATE'), this.translate.instant('ADMIN_LOGIN.TYPE_LOGIN')];
      rows.push(rowsHeader);
      this.completeList.forEach(element => {
        if (element.mastCreationDate !== undefined) {
          element.mastCreationDate = element.mastCreationDate.substr(0, 10);
        }

      const rows1 = [element.mastLogin, element.mastName, element.mastEmail, element.mastLoginAccount,
        element.mastLoginRegister, element.mastCreationDate, element.roleName];
      rows.push(rows1);
      });
      /*let csvContent = 'data:text/csv;charset=utf-8,';

      rows.forEach(function(rowArray) {
        const row = rowArray.join(',');
        csvContent += row + '\r\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', this.translate.instant('MENU.LOGIN') + '.csv');
      document.body.appendChild(link);
      link.click();*/
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
    link.setAttribute('download', this.translate.instant('MENU.LOGIN') + (new Date()).toLocaleDateString('YmdHis') + '.csv');
    document.body.appendChild(link); 
    link.click(); 

    }
  }

  exportAsXLSX(): void {
    this.completeList.forEach(element => {
      if (element.mastCreationDate !== undefined) {
        element.mastCreationDate = element.mastCreationDate.substr(0, 10);
      }
      const datos = {
      Login: element.mastLogin,
      Nombre_completo: element.mastName,
      Email: element.mastEmail,
      Cuenta: element.mastLoginAccount,
      Usuario_creador: element.mastLoginRegister,
      Fecha_Hora_creación: element.mastCreationDate,
      Tipo : element.roleName
      };
    this.data.push(datos);
    });
    this.excelService.exportAsExcelFile(this.data, this.translate.instant('MENU.LOGIN') + (new Date()).toLocaleDateString('YmdHis'));
  }
}
