import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../../../../services/account-adm.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import 'rxjs/add/operator/filter';
import { Subscription, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Session } from '../../../../entities/Session';
import { Master } from '../../../../entities/Master';
import {Md5} from 'md5-typescript';


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

  paramsSubscription: Subscription;

  public account_data: any[] = [];
  public master:Master;

  /*Declaracion de Modelos*/
  public radio_button = "ROLE_USER";
  public accountadm_id;
  public accountadm_name;
  public accountadm_idNumber;
  public accountadm_celNumber;
  public accountadm_password;
  public tipos: any[] = [];
  public tipo: any = null;
  public roleAdmin = false;
      

  constructor(public http: HttpClient, private router: Router, private accountService: AccountService, private route: ActivatedRoute,
    private messageService: MessageService, private formBuilder: FormBuilder, private translate: TranslateService,
      public session: Session) {}

  ngOnInit() {
    this.roleAdmin = this.session.isAdmin();
    this.accountForm = this.formBuilder.group({
      accountadm_id: [null],
      radio_button: ["ROLE_USER", Validators.required],
      form_tipo: [null, Validators.required],
      accountadm_name: [null, Validators.required],
      accountadm_idNumber: [null, Validators.required],
      accountadm_celNumber: [null, Validators.required],
      accountadm_password:[null, Validators.required]
    });

    this.tipos = [
      {label:'Cédula de ciudadania', value:'CC'},
      {label:'Cédula de Extranjeria', value:'CE'},
      {label:'Pasaporte', value:'PS'}
    ];

    this.getDataAccount();

  }

     
  getDataAccount () {
    const idUser = +this.route.snapshot.paramMap.get('idUser');
    console.log(idUser);
    if (idUser !== null && idUser!==0){
      console.log("holi");
      this.accountService.getUser(idUser)
      .subscribe((user) => {
        this.master = user;
        this.accountForm.setValue({
          accountadm_id: this.master.id,
          form_tipo:this.master.tipoidentificacion, 
          accountadm_name:this.master.fullname, 
          accountadm_idNumber: this.master.login,
          accountadm_celNumber: this.master.cellnumber,
          accountadm_password: this.master.password,
          radio_button: this.master.authorities[0]['authority']
        })
      });
    }
    
  }

  onSaveUser() {
          const values = this.accountForm.value;
          console.log("el id es");
          console.log( values.accountadm_id);
          const infoAccount = { 
            login: values.accountadm_idNumber,
            password: typeof(values.accountadm_id) === 'undefined'? Md5.init(values.accountadm_password):values.accountadm_password,
            tipoidentificacion: values.form_tipo,
            id: values.accountadm_id,
            fullname: values.accountadm_name,
            cellnumber: values.accountadm_celNumber,
            authorities: [{authority:this.radio_button}]
          };
          if (values.accountadm_id != null){
              this.accountService.updateDataAccount(infoAccount).subscribe((account) => {
                this.showSuccess("Actualizado");
                this.accountForm.reset();
                //this.router.navigate(['/HistoricAccountComponent']);
            },
            error => {
              this.showError("Error actualizando usuario");
          });
          } else{
              this.accountService.saveDataAccount(infoAccount).subscribe((account) => {
                this.showSuccess("Guardado");
                this.accountForm.reset();
               // this.router.navigate(['/HistoricAccountComponent']);
            },
            error => {
              this.showError("Usuario ya existe");
          });
          }
          
    }


    showSuccess(detail) {
      this.messageService.add({severity: 'success', summary: 'Usuario Guardado', detail: detail});
    }

    showError(detail) {
      this.messageService.add({severity: 'error', summary: 'No se pudo guardar', detail: detail});
    }

  }

