import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminAccountComponent } from './components/account/admin-account/admin-account.component';
import { HistoricAccountComponent } from './components/account/historic-account/historic-account.component';
import { HistoricLoginComponent } from './components/login/historic-login/historic-login.component';
import { AdminLoginComponent } from './components/login/admin-login/admin-login.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { HistoricProduct } from './components/product/historic-product/historic-product.component';
import { AdminProduct } from './components/product/admin-product/admin-product.component';
import { TipoProduct } from './components/product/tipo-product/tipo-product.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'AdminAccount', component: AdminAccountComponent},
  { path: 'HistoricAccount', component: HistoricAccountComponent},
  { path: 'Login', component: HistoricLoginComponent},
  { path: 'AdminLogin/:pkMastId', component: AdminLoginComponent},
  { path: 'SideBar', component: SidebarComponent},
  { path: 'HistoricProduct/:idUser', component: HistoricProduct},
  { path: 'AdminProduct', component: AdminProduct},
  { path: 'TipoProduct', component: TipoProduct},
  
  /*{ path: '**', redirectTo: '/dashboard', pathMatch: 'full' }*/
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
