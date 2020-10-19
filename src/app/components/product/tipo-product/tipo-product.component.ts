import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../../services/product-adm.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {MessageService} from 'primeng/api';
import 'rxjs/add/operator/filter';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
import { Session } from '../../../entities/Session';
import { Product } from '../../../entities/Product';

@Component({
  selector: 'app-tipo-product',
  providers: [MessageService],
  templateUrl: './tipo-product.component.html',
  styleUrls: ['./tipo-product.component.scss'],
})
export class TipoProduct implements OnInit {
      // Formulario
      productForm: FormGroup;
      cols: any[];

      paramsSubscription: Subscription;

      /*Declaración de Modelos*/
      public tarjetaCredito = false;
      public fondoInversion = false;
      public cuentaCorriente= false;
      public cuentaAhorro = false;

      public tipo = '';
      public valor = '5000000';
      public param;
      public idProduct = null;

      public  CUENTAAHORRO = "Cuenta de Ahorro";
      public  CUENTACORRIENTE = "Cuenta Corriente";
      public  TARJETACREDITO = "Tarjeta de Crédito";
      public  FONDOINVERSION = "Fondo de Inversión";
    

  constructor(public http: HttpClient, private producService: ProductService, private route: ActivatedRoute,
    private messageService: MessageService, private formBuilder: FormBuilder, private session: Session, private translate: TranslateService) { }

  ngOnInit() {
    console.log("inicio de tipo");
    console.log(this.route.queryParams);

    this.productForm = this.formBuilder.group({
      form_id:[this.idProduct],
      form_valor: [this.valor],
      form_aproved: [5000000],
    });

    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      console.log(params)
      if (params['tipo'] !== 'undefined') {
          this.param = params['tipo'];
          this.getTipo(params['tipo']);
      }
      if (params['valor'] !== 'undefined') {
        this.valor = params['valor'];
      } 
      if (params['id'] !== 'undefined'){
        this.idProduct = params['id'];
      }
  });

  }

  getTipo(tipoParam){
    console.log("el tipo es")
    console.log(tipoParam);
    if (tipoParam === "cuenta_ahorro"){
      this.cuentaAhorro = true;
      this.tipo = this.CUENTAAHORRO;
    }
    if (tipoParam === "cuenta_corriente"){
      console.log("aqui es cuenta corriente")
      this.cuentaCorriente = true;
      this.tipo = this.CUENTACORRIENTE;
    }
    if (tipoParam === "tarjeta_credito"){
      this.tarjetaCredito = true;
      this.tipo = this.TARJETACREDITO;
    }
    if (tipoParam === "fondo_inversion"){
      this.fondoInversion = true;
      this.tipo = this.FONDOINVERSION;
    }
  }


  /*Consumo de Servicios POST*/
  onSaveProduct () {
    console.log("tarjeta de credito");
    console.log(this.TARJETACREDITO);
    console.log(this.session.master.id)
    const values = this.productForm.value;
      const objectProduct = new Product();
      objectProduct.productId = this.idProduct;
      objectProduct.typeProduct = this.param ;
      objectProduct.valor = this.tarjetaCredito ? values.form_aproved :values.form_valor;
      objectProduct.enabled = '1';
      objectProduct.userIdProduct = this.session.master.id
      console.log(objectProduct);
      
      this.producService.saveProduct(objectProduct).subscribe((master) => {
        this.showSuccess('');
      },
      error => {
        this.showError(error);
        });
    
  }

  

  showSuccess(detail) {
    this.messageService.add({severity: 'success', summary: 'Producto Guardado', detail: detail});
  }

  showError(detail) {
    this.messageService.add({severity: 'error', summary: 'No se pudo guardar', detail: detail});
  }


  
}
