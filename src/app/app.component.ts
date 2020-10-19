import { Component, OnInit } from '@angular/core';
import {PanelMenuModule} from 'primeng/panelmenu';
import {MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import { ContextService } from './services/context.service';
import { Master } from './entities/Master';
import { ActivatedRoute } from '@angular/router';
import { Session } from './entities/Session';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AtheneaApp';
  items: MenuItem[];
  collapedSideBar: boolean;

  paramsSubscription: Subscription;
  constructor(private translate: TranslateService, private contextService: ContextService, public session: Session,
    public route:  ActivatedRoute) {
  }
  public ngOnInit() {
    
    this.items = [
            {
                label: 'Cuentas',
                items: [
                    {label: 'Administrar cuentas', routerLink: 'AdminAccount'},
                    {label: 'Histórico de cuentas', routerLink: 'HistoricAccount'}
                ]
            },
            {
                label: 'Perfiles',
                items: [
                    {label: 'Administrar perfiles'},
                    {label: 'Histórico de perfiles'}
                ]
            },
            {
                label: 'Usuarios',
                items: [
                    {label: 'Administrar usuarios'},
                    {label: 'Histórico de usuarios'}
                ]
            },
            {
                label: 'Compartir vehículos',
                items: [
                    {label: 'A sub-cuentas'},
                    {label: 'A cuentas CGS'},
                    {label: 'Histórico de compartidos'}
                ]
            },
            {
                label: 'Configuración de Pánicos',
                items: [
                    {label: 'Actualizar Configuración de Pánicos'},
                    {label: 'Histórico de Configuración de Pánicos'},                    
                ]
            }
        ];
  }
  receiveCollapsed($event) {
    this.collapedSideBar = $event;
  }
}