
import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// Translate
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageService } from './services/message.service';
import { RequestCache, RequestCacheWithMap } from './services/request-cache.service';

// Routes
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

// Primeng
import {PanelMenuModule} from 'primeng/panelmenu';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {MultiSelectModule} from 'primeng/multiselect';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TableModule} from 'primeng/table';
import {GMapModule} from 'primeng/gmap';
import {SplitButtonModule} from 'primeng/splitbutton';
import {ToastModule} from 'primeng/toast';
import {PickListModule} from 'primeng/picklist';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {AccordionModule} from 'primeng/accordion';
import {ProgressBarModule} from 'primeng/progressbar';
import {FieldsetModule} from 'primeng/fieldset';

import { SidebarComponent } from './dashboard/sidebar/sidebar.component';

import { Session } from './entities/Session';
import { InitLogin } from './components/login/init-login/init-login.component';
import { HistoricProduct } from './components/product/historic-product/historic-product.component';
import { AdminProduct } from './components/product/admin-product/admin-product.component';
import { TipoProduct } from './components/product/tipo-product/tipo-product.component';
import { NewAccountComponent } from './components/account/admin-account/new-account/new-account.component';
import { HistoricAccountComponent } from './components/account/historic-account/historic-account.component';
import { Report } from './components/report/report.component';



@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    InitLogin,
    HistoricProduct,
    AdminProduct,
    TipoProduct,
    NewAccountComponent,
    HistoricAccountComponent,
    Report
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
    }),
    BrowserAnimationsModule,
    PanelMenuModule,
    TabMenuModule,
    TabViewModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    TableModule,
    OverlayPanelModule,
    GMapModule,
    SplitButtonModule,
    RadioButtonModule,
    AppRoutingModule,
    ToastModule,
    PickListModule,
    AccordionModule,
    ProgressBarModule,
    FieldsetModule,
    NgbModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    Session,
    HttpErrorHandler,
    MessageService,
    { provide: RequestCache, useClass: RequestCacheWithMap }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
