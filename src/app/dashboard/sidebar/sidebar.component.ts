import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Session } from '../../entities/Session';
import { Master } from '../../entities/Master';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ContextService } from '../../services/context.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    paramsSubscription: Subscription;
    public jsonPermission;
    public idUser;


    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(private translate: TranslateService, public router: Router, public session: Session, private route: ActivatedRoute,
        private contextService: ContextService, private http: HttpClient) {
       

    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        console.log("carga")
        this.paramsSubscription = this.route.queryParams.subscribe(params => {
            if (typeof(params['token']) !== 'undefined') {
                console.log("AQUI ENTRA")
                console.log(this.session.master);
                this.session.token = params['token'];
                this.idUser = this.session.master.id;
                console.log("ID USER");
                console.log(this.idUser);
                this.jsonPermission = this.session.permissions;
                console.log(this.jsonPermission);
            }
        });

    }

    isHidden(module) {
        if (this.jsonPermission !== undefined && this.jsonPermission[module] !== undefined) {
            return !this.jsonPermission[module];
        } else {
            return true;
        }
    }
}
