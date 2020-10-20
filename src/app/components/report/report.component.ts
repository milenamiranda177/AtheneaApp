import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {MessageService} from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../services/product-adm.service';
import { ExcelService } from '../../services/helpers/excel-service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Session } from '../../entities/Session';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { ContextService } from '../../services/context.service';
declare const jquery: any;
declare const $: any;


@Component({
  selector: 'app-report',
  providers: [MessageService],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class Report implements OnInit {
    /*Declaración de Vectores*/
    downloadList: MenuItem[];
    paramsSubscription: Subscription;
    data: any[] = [];
    filteredList: any[] = [];

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
      { field: 'fullname', header: 'Usuario' },
      { field: 'identificacion', header: 'Identificación' },
      { field: 'typeProduct', header: 'Producto' },
      { field: 'valor', header: 'Valor' }
    ];
    this.getReport();
  }


  getReport () {
    this.productService.getReport()
    .subscribe((product) => {
      this.completeList = [];
      product.forEach(element => {
        const temp = { fullname: element.fullname,
          identificacion: element.username, 
          typeProduct: element.typeProduct,
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


}

