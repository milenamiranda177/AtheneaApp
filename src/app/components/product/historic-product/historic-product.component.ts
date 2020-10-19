import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {MessageService} from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../../services/product-adm.service';
import { ExcelService } from '../../../services/helpers/excel-service';
import { TranslateService } from '@ngx-translate/core';
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
    filteredList: any[] = [];

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
      { field: 'valor', header: 'Valor' }
    ];
    this.getProducts();
  }


  getProducts () {
    const idUser = +this.route.snapshot.paramMap.get('idUser');
    this.productService.getProducts(idUser)
    .subscribe((product) => {
      this.completeList = [];
      product.forEach(element => {
        const temp = { productId: element.productId, typeProduct: element.typeProduct,
          valor: element.valor,
          json: ''
          };
          temp.json = JSON.stringify(temp);
        this.completeList.push(temp);
        });
        this.filteredList = this.completeList;
      
    });
  }

  showSuccess(detail) {
    this.messageService.add({severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: detail});
  }

  showError(detail) {
    this.messageService.add({severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: detail});
  }

  bindinAccion(productId) {
    this.productService.deleteProduct(productId)
    .subscribe((data) => {
      this.showSuccess("Producto Borrado");
      this.getProducts();
    },
    error => {
      this.showError(error);
    });
  }

}

