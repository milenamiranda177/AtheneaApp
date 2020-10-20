import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import {MessageService} from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../../../services/account-adm.service';
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
    paramsSubscription: Subscription;
    data: any[] = [];
    // Table
    completeList: any[] = [];
    filteredList: any[] = [];
    filterText;
    cols: any[];
    @ViewChild('table') table;

  constructor(public http: HttpClient, private accountService: AccountService, private messageService: MessageService,
    private translate: TranslateService, public router: Router, private route: ActivatedRoute,
    public session: Session, private contextService: ContextService) { }

  ngOnInit() {
    this.cols = [
      { field: 'fullname', header: 'Nombre' },
      { field: 'login', header: 'Identificacion' },
      { field: 'tipoidentificacion', header: 'Tipo de Identificacion' },
      { field: 'cellnumber', header: 'Celular'},
      { field: 'role', header: 'Rol'},
      ];
    this.getAccounts();
  }


  getAccounts () {

    this.accountService.getAllUser()
    .subscribe((account) => {
      this.completeList = [];
      account.forEach(element => {
        const temp = { 
          id:element.id,
          fullname: element.fullname,
          login: element.login,
          tipoidentificacion: element.tipoidentificacion,
          cellnumber: element.cellnumber,
          role:typeof(element.authorities)!== 'undefined' && typeof(element.authorities[0])!== 'undefined' ? element.authorities[0]['authority'].replace("ROLE_","") : '',
          json: ''};
          temp.json = JSON.stringify(temp);
        this.completeList.push(temp);
        });
      this.table.reset();
      this.filterText = '';
      this.filteredList = this.completeList;
      
    });
  }

  showSuccess(detail) {
    this.messageService.add({severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: detail});
  }

  showError(detail) {
    this.messageService.add({severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: detail});
  }

  bindinAccion(idUser) {
    this.accountService.deleteDataAccount(idUser)
    .subscribe((data) => {
      this.showSuccess("Usuario Borrado");
      this.getAccounts();
    },
    error => {
      this.showError(error);
    });
  }
  isAdmin(){
    this.session.isAdmin();
  }
}
