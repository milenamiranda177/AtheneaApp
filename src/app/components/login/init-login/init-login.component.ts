import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SelectItem, MessageService} from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Master } from '../../../entities/Master';
import { Session } from '../../../entities/Session';
import {Md5} from 'md5-typescript';
import { SessionService } from '../../../services/login-session.service';


@Component({
  selector: 'app-init',
  providers: [MessageService],
  templateUrl: './init-login.component.html',
  styleUrls: ['./init-login.component.scss']
})
export class InitLogin implements OnInit {


  public tipos: any[] = [];
  public tipo: any = null;
  public password = null;
  public identificacion = null;
  public isSession = false;

  // Formulario
  sessionForm: FormGroup;


  constructor(public http: HttpClient, private router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private session : Session, private sessionService: SessionService, private messageService: MessageService) { }

  ngOnInit() {

    this.tipos = [
      {label:'Tipo de Documento', value:null},
      {label:'Cédula de ciudadania', value:'CC'},
      {label:'Cédula de Extranjeria', value:'CE'},
      {label:'Pasaporte', value:'PS'}
    ];


    this.sessionForm = this.formBuilder.group({
      form_tipo: [{value: this.tipo}],
      form_identificacion: [{value: null}, Validators.compose([Validators.required, Validators.maxLength(50)])],
      form_password: [{value: null}, [Validators.required, Validators.maxLength(20)]],
    });
  }

  
  onSubmit() {
      const values = this.sessionForm.value;
      const objectMaster = new Master();
      objectMaster.identificacion = values.form_identificacion;
      objectMaster.tipoidentificacion = this.tipo;
      objectMaster.password = Md5.init(values.form_password);
      console.log(objectMaster);
      
      this.sessionService.saveDataLogin(objectMaster).subscribe((master) => {
          this.session.master = master;
          this.session.token = master.token.toString();
          this.session.loadPermissions();
          this.router.navigate(['/SideBar'], {queryParams: {token: this.session.token}});
          this.sessionForm.reset();
          this.isSession = true;
      },
      error => {
        });
  }

}

