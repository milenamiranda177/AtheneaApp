import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Session } from '../../entities/Session';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ContextService } from '../../services/context.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass: string = 'push-right';
    paramsSubscription: Subscription;

    constructor(private translate: TranslateService, public router: Router, private route: ActivatedRoute, public session: Session,
        private contextService: ContextService) {

        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('es');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'es');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
       /* this.paramsSubscription = this.route.queryParams.subscribe(params => {
            if (typeof(params['token']) !== 'undefined') {
                this.session.token = params['token'];
                this.paramsSubscription.unsubscribe();
                this.contextService.loadContext().toPromise().then(data => {
                    if (data == null) {
                      alert('Sesión expirada');
                    }
                    if  (data['country'] === 'Brasil') {
                        this.changeLang('pt');
                    }
                });
            }
        });*/
        // this.permissionModule(this.session);
    }

    isToggled(): Boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
