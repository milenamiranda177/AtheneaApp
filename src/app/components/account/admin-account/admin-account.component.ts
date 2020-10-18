import { Component, OnInit } from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuItem} from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../../../services/account-adm.service';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-admin-account',
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.scss']
})
export class AdminAccountComponent implements OnInit {
  items: MenuItem[];
  account: JSON;
  pkMapeId;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.account)
      .subscribe(params => {
        if (params.account === '') {
          this.account = null;
        } else {
          this.account = JSON.parse(params.account);
          this.pkMapeId = this.account['pkMapeId'];
        }
      });
  }

  onUpdateAccount($event) {
    console.log($event);
    this.account = JSON.parse($event);
    this.pkMapeId = this.account['pkMapeId'];
  }

}
