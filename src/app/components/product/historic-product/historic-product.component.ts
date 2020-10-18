import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import {MessageService} from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../../services/product-adm.service';
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
  selector: 'app-historic-product',
  providers: [MessageService],
  templateUrl: './historic-product.component.html',
  styleUrls: ['./historic-product.component.scss']
})
export class HistoricProduct implements OnInit {
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
    cols: any[];
    @ViewChild('table') table;

  constructor(public http: HttpClient, private productService: ProductService, private messageService: MessageService,
    private excelService: ExcelService, private translate: TranslateService, public router: Router, private route: ActivatedRoute,
    public session: Session, private contextService: ContextService) { 

      
    }

  ngOnInit() {
   
    this.cols = [
      { field: 'typeProduct', header: 'Producto' },
      { field: 'enabled', header: 'Estado' }
    ];
    this.getProducts();
    //this.permissionModule();
    // this.jqueryStart();
  }


  permissionModule () {
      //this.createAccount = this.session.setPermissions(this.idModule, 'createAccountAprov');
      //this.selectAccount = this.session.setPermissions(this.idModule, 'selectAccountAprov');
      //this.updateAccount = this.session.setPermissions(this.idModule, 'updateAccountAprov');
  }


  getProducts () {
    const idUser = +this.route.snapshot.paramMap.get('idUser');
    this.productService.getProducts(idUser)
    .subscribe((product) => {
      this.completeList = [];
      product.forEach(element => {
        const statusDesc = element.enabled === '1' ? 'ADMIN_ACCOUNT.LABEL_ENABLE' : 'ADMIN_ACCOUNT.LABEL_DISABLE';
        const temp = { typeProduct: element.typeProduct,
          product_id: element.productId,
          json: ''
          };
          temp.json = JSON.stringify(temp);
        this.completeList.push(temp);
        });
      this.table.reset();
      
    });
  }

  /*actStatusAccount (pkMapeId, mastStatus) {
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
  }*/

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

}
