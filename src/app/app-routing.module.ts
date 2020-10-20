import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoricAccountComponent } from './components/account/historic-account/historic-account.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { HistoricProduct } from './components/product/historic-product/historic-product.component';
import { AdminProduct } from './components/product/admin-product/admin-product.component';
import { TipoProduct } from './components/product/tipo-product/tipo-product.component';
import { NewAccountComponent } from './components/account/admin-account/new-account/new-account.component';
import { Report } from './components/report/report.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'SideBar', component: SidebarComponent},
  { path: 'HistoricProduct/:idUser', component: HistoricProduct},
  { path: 'AdminProduct', component: AdminProduct},
  { path: 'TipoProduct', component: TipoProduct},
  { path: 'NewAccountComponent/:idUser', component: NewAccountComponent},
  { path: 'NewAccountComponent', component: NewAccountComponent},
  { path: 'HistoricAccountComponent', component: HistoricAccountComponent},
  { path: 'Report', component: Report},
  
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
