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
  collapedSideBar: boolean;

  paramsSubscription: Subscription;
  constructor(private translate: TranslateService, private contextService: ContextService, public session: Session,
    public route:  ActivatedRoute) {
  }
  public ngOnInit() {
    
  }
  receiveCollapsed($event) {
    this.collapedSideBar = $event;
  }
}