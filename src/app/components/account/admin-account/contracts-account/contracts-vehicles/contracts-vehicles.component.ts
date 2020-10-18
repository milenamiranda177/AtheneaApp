import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from '../../../../../services/account-adm.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {PickListModule} from 'primeng/picklist';
import { TranslateService } from '@ngx-translate/core';
import { TranslationWidth } from '@angular/common';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-contracts-vehicles',
  providers: [MessageService],
  templateUrl: './contracts-vehicles.component.html',
  styleUrls: ['./contracts-vehicles.component.scss']
})
export class ContractsVehiclesComponent implements OnInit {

  /*Declaración de Vectores*/
  public availableVehicles: any[] = [];
  public assignedVehicles: any[] = [];
  public listVehiclesId: any[] = [];
  public listVehiclesPlacas: any[] = [];
  public assigned: any[] = [];
  public listVehicle: any[] = [];

  /*Declaración de Modelos*/
  public pkContId: String;
  public agregarPlaca: String;
  public agregarId: String;
  public quitarId: String;
  public quitarPlaca: String;

    // Table
    completeList: any[] = [];
    completeList2: any[] = [];
    loadVehicles: any[] = [];
    filteredList: any[] = [];
    filterText;
    filterText2;


  constructor(public http: HttpClient, private accountService: AccountService, private route: ActivatedRoute,
    private messageService: MessageService, private formBuilder: FormBuilder, private translate: TranslateService) { }

  ngOnInit() {
  }

  public updateVehicles(pkContId: String) {
      this.pkContId = pkContId;
      this.loadVehicles = [];
      this.filterText = '';
      this.filterText2 = '';
      this.getAvailable();
      this.getAssigned();
  }

  getAvailable () {
    this.accountService.getAvailableVehicles()
    .subscribe((vehicle) => {
       this.availableVehicles  = vehicle;
      this.completeList = this.availableVehicles;
    });
  }

  getAssigned () {
    this.accountService.getVehiclesAssigned(this.pkContId)
    .subscribe((vehicle) => {
      vehicle.forEach(element => {
        const pkVhclId = element.pkVhclId;
        this.loadVehicles.push(pkVhclId);
        });
      this.assignedVehicles  = vehicle;
      this.completeList2 = this.assignedVehicles;
    });
  }

  updateAssigned () {
    this.accountService.updateAssigneVehicles(this.loadVehicles, this.pkContId).subscribe(vehicle => {
        this.showSuccess(this.translate.instant('MESSAGES.DATA_SAVED'));
    },
    error => {
      this.showError(error);
    });
  }

  assignAll() {
    this.availableVehicles.forEach(element => {
      this.assignedVehicles.push(element);
      const pkVhclId = element.pkVhclId;
      this.loadVehicles.push(pkVhclId);
      });
    this.availableVehicles = [];
  }

  unassignAll() {
    this.assignedVehicles.forEach(element => {
      this.availableVehicles.push(element);
      });
    this.assignedVehicles = [];
    this.loadVehicles = [];
  }

  onLoadVehicles (vhclObj) {
    const pkVhclId = vhclObj.pkVhclId;
    this.loadVehicles.push(pkVhclId);
    this.assignedVehicles.push(vhclObj);

    const index = this.availableVehicles.indexOf(vhclObj);
    this.availableVehicles.splice(index, 1);
  }

  dropVehicles (vhclObj) {
    const pkVhclId = vhclObj.pkVhclId;
    const index = this.loadVehicles.indexOf(pkVhclId);
    this.loadVehicles.splice(index, 1);

    const index2 = this.assignedVehicles.indexOf(vhclObj);
    this.assignedVehicles.splice(index2, 1);
    this.availableVehicles.push(vhclObj);
  }

  filterAvailable() {
    const texto = this.filterText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (texto === '' || texto === null) {
    this.availableVehicles = this.completeList;
    } else {
      const filteredVehicles = [];
      this.completeList.forEach(function (plateObj: any) {
        if (plateObj.vhclNumberPlate != null && plateObj.vhclNumberPlate.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(texto)) {
          filteredVehicles.push(plateObj);
        }
      });
      this.availableVehicles = filteredVehicles;
    }
  }

  filterAssigned() {
    const texto2 = this.filterText2.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (texto2 === '' || texto2 === null) {
    this.assignedVehicles = this.completeList2;
    } else {
      const filteredVehicles2 = [];
      this.completeList2.forEach(function (plateObj: any) {
        if (plateObj.vhclNumberPlate != null && plateObj.vhclNumberPlate.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(texto2)) {
          filteredVehicles2.push(plateObj);
        }
      });
      this.assignedVehicles = filteredVehicles2;
    }
  }

  showSuccess(detail) {
    this.messageService.add({severity: 'success', summary: this.translate.instant('MESSAGES.SUCCESS'), detail: detail});
  }

  showError(detail) {
    this.messageService.add({severity: 'error', summary: this.translate.instant('MESSAGES.ERROR'), detail: detail});
  }

}



