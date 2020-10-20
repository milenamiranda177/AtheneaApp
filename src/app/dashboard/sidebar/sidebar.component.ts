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
    public idUser = null;
    public logoutTab=true;


    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(private translate: TranslateService, public router: Router, public session: Session, private route: ActivatedRoute,
        private contextService: ContextService, private http: HttpClient) {
       

    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
        console.log("carga")
        this.paramsSubscription = this.route.queryParams.subscribe(params => {
            if (typeof(params['token']) !== 'undefined') {
                this.session.token = params['token'];
                this.idUser = this.session.master.id;
                this.logoutTab = false;
                this.jsonPermission = this.session.permissions;
            }
        });

    }

    isHidden(module) {
        if (this.session.permissions !== undefined && this.session.permissions[module] !== undefined) {
            return !this.session.permissions[module];
        } else {
            return true;
        }
    }

    logout(){
        this.session.token = null;
        this.session.master = null;
        this.session.permissions = JSON.parse(this.session.DEFAULT);
        this.idUser = null;
        this.logoutTab = true;
        this.router.navigate(['/dashboard']);
    }
}
