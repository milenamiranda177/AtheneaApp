import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, retry} from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Session } from '../entities/Session';
import { AccountAdm } from '../entities/Account';
import { TypeOfPerson } from '../entities/TypeOfPerson';
import { TypeOfDoc } from '../entities/TypeOfDoc';
import { Country } from '../entities/Country';
import { State } from '../entities/State';
import { City } from '../entities/City';
import { Utc } from '../entities/Utc';
import { Address } from '../entities/Address';
import { Contact } from '../entities/Contact';
import { Contract } from '../entities/Contract';
import { StatusContract } from '../entities/StatusContract';
import { HistoricData } from '../entities/HistoricData';
import { Vehicle } from '../entities/Vehicle';
import { Profile } from '../entities/Profile';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private handleError: HandleError;
  constructor(private http: HttpClient, private session: Session, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('AccountService');
  }
  /*Obtener valores para los Inputs*/
  // Tipos de Personas.
  getKindfOfPersons(): Observable<TypeOfPerson[]> {
    const url = this.session.apiUrl + 'typePersons';
    return this.http.get<TypeOfPerson[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Tipos de Documentos.
  getKinfOfDocs(): Observable<TypeOfDoc[]> {
    const url = this.session.apiUrl + 'typeDocuments';
    return this.http.get<TypeOfDoc[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Paises
  getAllCountries(): Observable<Country[]> {
    const url = this.session.apiUrl + 'countries';
    return this.http.get<Country[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Estados
  getAllStates(): Observable<State[]> {
    const url = this.session.apiUrl + 'countries/states';
    return this.http.get<State[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Ciudades
  getAllCities(pkStatId): Observable<City[]> {
    const url = this.session.apiUrl + 'countries/' + pkStatId + '/cities';
    return this.http.get<City[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // UTC
  getAllUtcs(): Observable<Utc[]> {
    const url = this.session.apiUrl + 'utcs';
    return this.http.get<Utc[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Estado de Contrato
  getAllStatusContract(): Observable<StatusContract[]> {
    const url = this.session.apiUrl + 'contracts/status';
    return this.http.get<StatusContract[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  /*Obtener datos para las tablas*/
  // Contratos Creados
  getContractsById(pkVwlaId): Observable<Contract[]> {
    const url = this.session.apiUrl + 'contracts/' + pkVwlaId;
    return this.http.get<Contract[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Direcciones de Persona
  getAddressesById(pkVwlaId): Observable<Address[]> {
    const url = this.session.apiUrl + 'addresses/person/' + pkVwlaId;
    return this.http.get<Address[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Contactos de Persona
  getContactsById(pkVwlaId): Observable<Contact[]> {
    const url = this.session.apiUrl + 'contacts/person/' + pkVwlaId;
    return this.http.get<Contact[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Cuentas Individual
  getAccountById(pkVwlaId): Observable<HistoricData[]> {
    const url = this.session.apiUrl + 'accounts/' + pkVwlaId;
    return this.http.get<HistoricData[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Cuentas del País
  getAllAccounts(): Observable<HistoricData[]> {
    const url = this.session.apiUrl + 'accounts';
    return this.http.get<HistoricData[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Vehículos del País
  getAvailableVehicles(): Observable<Vehicle[]> {
    const url = this.session.apiUrl + 'vehicles/available';
    return this.http.get<Vehicle[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Vehículos del País
  getVehiclesAssigned(pkContId): Observable<Vehicle[]> {
    const url = this.session.apiUrl + 'vehicles/assigned/' + pkContId;
    return this.http.get<Vehicle[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Vehículos compartidos histórico
  getHitoricsharedVehicles(): Observable<Vehicle[]> {
    const url = this.session.apiUrl + 'share';
    return this.http.get<Vehicle[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Cuentas titulares
  getCustomerAccounts(): Observable<AccountAdm[]> {
    const url = this.session.apiUrl + 'accounts/titular';
    return this.http.get<AccountAdm[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Cuentas titulares
  getLoginByBoss(pkBossId): Observable<AccountAdm[]> {
    const url = this.session.apiUrl + 'login/boss/' + pkBossId;
     return this.http.get<AccountAdm[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
       retry(3)
       );
  }

  // Obtener Usuarios
  getAllUsers(): Observable<AccountAdm[]> {
    const url = this.session.apiUrl + 'login/byRol';
    return this.http.get<AccountAdm[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Vehículos compartidos disponibles
  getVehiclesAssignedById(fkMastIdShare, fkMastId): Observable<Vehicle[]> {
    const url = this.session.apiUrl + 'vehicles/master/' + fkMastIdShare + '/notshare/' + fkMastId;
    return this.http.get<Vehicle[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Vehículos compartidos a un Login
  getSharedVehiclesByLogin(fkMastId): Observable<Vehicle[]> {
    const url = this.session.apiUrl + 'vehicles/master/' + fkMastId + '/shared';
    return this.http.get<Vehicle[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Grupos compartidos disponibles
  getGroupsAssignedById(pkMastId, fkMastId): Observable<Vehicle[]> {
    const url = this.session.apiUrl + 'share/master/' + pkMastId + '/submaster/' + fkMastId;
    return this.http.get<Vehicle[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Grupos cocreampartidos a un Login
  getSharedGroupsByLogin(fkMastId): Observable<Vehicle[]> {
    const url = this.session.apiUrl + 'share/group/' + fkMastId;
    return this.http.get<Vehicle[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Histórico de perfiles
  getHitoricProfile(): Observable<Profile[]> {
    const url = this.session.apiUrl + 'profile';
    return this.http.get<Profile[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Productos para perfiles
  getProfileProducts(): Observable<Profile[]> {
    const url = this.session.apiUrl + 'profile/products';
    return this.http.get<Profile[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Moddulos para perfiles
  getModulesById(pkProdId): Observable<Profile[]> {
    const url = this.session.apiUrl + 'profile/products/' + pkProdId + '/modules';
    return this.http.get<Profile[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Moddulos para perfiles
  getModulesByProfile(pkPrflId): Observable<Profile[]> {
    const url = this.session.apiUrl + 'profile/options/' + pkPrflId;
    return this.http.get<Profile[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
  }

  // Otener perfiles disponibles para un login
  getAvailableProfilesById(pkMastId): Observable<Profile[]> {
  const url = this.session.apiUrl + 'permission/login/' + pkMastId;
  return this.http.get<Profile[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
    retry(3)
    );
  }

  // Otener perfiles asociados a un login
  getAssociatedProfilesById(pkMastId): Observable<Profile[]> {
    const url = this.session.apiUrl + 'permission/assigned/login/' + pkMastId;
    return this.http.get<Profile[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
    }

  // Otener funcionalidades de un login
  getModulesByUser(pkMastId): Observable<Profile[]> {
    const url = this.session.apiUrl + 'permission/additional/' + pkMastId;
    return this.http.get<Profile[]>(url, { headers: this.session.getAuthHeaders()}).pipe(
      retry(3)
      );
    }

  /*Acciones para guardar datos*/
  // Guardar Cuenta
  saveDataAccount(JSONAccount): Observable<AccountAdm> {
    const url = this.session.apiUrl + 'accounts';
    return this.http.post<AccountAdm>(url, JSONAccount, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('SaveDataAccount', null))
    );
  }

  // Guardar Contrato
  saveDataContract(JSONContract, pkMapeId): Observable<Contract> {
    const url = this.session.apiUrl + 'contracts/' + pkMapeId;
    return this.http.post<Contract>(url, JSONContract, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('SaveDataContract', null))
    );
  }

  // Guardar Dirección
  saveDataAddress(JSONAddress, pkMapeId): Observable<Address> {
    const url = this.session.apiUrl + 'addresses/' + pkMapeId;
    return this.http.post<Address>(url, JSONAddress, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('SaveDataAccount', null))
    );
  }

  // Guardar Contacto
  saveDataContact(JSONContact, pkCopeId): Observable<Contact> {
    const url = this.session.apiUrl + 'contacts/' + pkCopeId;
    return this.http.post<Contact>(url, JSONContact, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('SaveDataAccount', null))
    );
  }

  // Compartir vehículos asignados - Módulo compartir vehículos
  ShareAssigneVehicles(shareVehicles): Observable<Vehicle> {
    const url = this.session.apiUrl + 'share';
    return this.http.post<Vehicle>(url, shareVehicles, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('ShareAssigneVehicles', null))
    );
  }

  // Compartir grupos de una cuenta - Módulo compartir vehículos
  ShareAssigneGroups(JSONShareGroups, fkMastIdBoss): Observable<Vehicle> {
    const url = this.session.apiUrl + 'share/' + fkMastIdBoss;
    return this.http.post<Vehicle>(url, JSONShareGroups, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('ShareAssigneGroups', null))
    );
  }

  // Guardar nuevo perfil - Perfiles
  SaveNewProfile(infoProfile): Observable<Profile> {
    const url = this.session.apiUrl + 'profile';
    return this.http.post<Profile>(url, infoProfile, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('SaveNewProfile', null))
    );
  }

  // Guardar funciones adicionales a un usuario - Perfiles
  saveAddFunctions(infoAddFun): Observable<Profile> {
    const url = this.session.apiUrl + 'permission/additional';
    return this.http.post<Profile>(url, infoAddFun, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('saveAddFunctions', null))
    );
  }

  // Asociar perfiles - Perfiles
  AssociateProfilesById(JSONAssocProfiles): Observable<Profile> {
    const url = this.session.apiUrl + 'permission';
    return this.http.post<Profile>(url, JSONAssocProfiles, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('AssociateProfilesById', null))
    );
  }

  // Guardar nuevo perfil - Perfiles
  DisassociateProfileById(JSONDisassocProfiles): Observable<Profile> {
    const url = this.session.apiUrl + 'profile/disassociate';
    return this.http.post<Profile>(url, JSONDisassocProfiles, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('DisassociateProfileById', null))
    );
  }

  /*Acciones para borrar datos*/
  // Borrar Contrato
  deleteDataContract(idContract): Observable<Contract> {
    const url = this.session.apiUrl + 'contracts/' + idContract;
    return this.http.delete<Contract>(url, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('DeleteDataContract', null))
    );
  }

  // Borrar Dirección
  deleteDataAddress(idAddress): Observable<Address> {
    const url = this.session.apiUrl + 'addresses/' + idAddress;
    return this.http.delete<Address>(url, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('DeleteDataAddress', null))
    );
  }

  // Borrar Contacto
  deleteDataContact(idContact): Observable<Contact> {
    const url = this.session.apiUrl + 'contacts/' + idContact;
    return this.http.delete<Contact>(url, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('DeleteDataContact', null))
    );
  }

  // Dejar de compartir un vehículos
  stopShareVehicle(fkMastId, fkVhclId): Observable<Vehicle> {
    const url = this.session.apiUrl + 'vehicles/login/' + fkMastId + '/notshare/' + fkVhclId;
    return this.http.delete<Vehicle>(url, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('stopShareVehicle', null))
    );
  }

  // Dejar de compartir un grupo
  stopShareGroup(pkGrmaId): Observable<Vehicle> {
    const url = this.session.apiUrl + 'share/' + pkGrmaId;
    return this.http.delete<Vehicle>(url, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('stopShareGroup', null))
    );
  }

  // Borrar Perfil
  deleteProfileByID(pkPrflId): Observable<Profile> {
    const url = this.session.apiUrl + 'profile/' + pkPrflId;
    return this.http.delete<Profile>(url, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError('deleteProfileByID', null))
    );
  }

  /*Acciones para actualizar datos*/
  // Actualizar Contrato
  updateDataContract(JSONContract, pkContId): Observable<null> {
    const url = this.session.apiUrl + 'contracts/' + pkContId;
    return this.http.put(url, JSONContract, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('UpdateDataContract', null))
    );
  }

  // Actualizar Dirección
  updateDataAddress(JSONAddress, pkAdpeId): Observable<null> {
    const url = this.session.apiUrl + 'addresses/' + pkAdpeId;
    return this.http.put(url, JSONAddress, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('UpdateDataAddress', null))
    );
  }

  // Actualizar Contacto
  updateDataContact(JSONContact, pkCopeId): Observable<null> {
    const url = this.session.apiUrl + 'contacts/' + pkCopeId;
    return this.http.put(url, JSONContact, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('UpdateDataContact', null))
    );
  }

  // Actualizar Cuenta
  updateDataAccount(JSONAccount, pkVwlaId): Observable<null> {
    const url = this.session.apiUrl + 'accounts/' + pkVwlaId;
    return this.http.put(url, JSONAccount, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('UpdateDataAccount', null))
    );
  }

  // Actualizar Estado de la cuenta
  updateStatusAccount(pkVwlaId, mastStatus): Observable<null> {
    const url = this.session.apiUrl + 'accounts/' + pkVwlaId + '/status/' + mastStatus;
    return this.http.put(url, '{}', {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('UpdateStatusAccount', null))
    );
  }

  // Actualizar vehículos asignados
  updateAssigneVehicles(assignedVehicles, pkContId): Observable<null> {
    const url = this.session.apiUrl + 'vehicles/contract/' + pkContId;
    return this.http.put(url, assignedVehicles, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('updateAssigneVehicles', null))
    );
  }

  // Actualizar fecha de vehículos compartidos  - Módulo compartir vehículos
  updateVehicleShareDate(JSONDates, pkVhmaId): Observable<null> {
    const url = this.session.apiUrl + 'share/' + pkVhmaId;
    return this.http.put(url, JSONDates, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('updateAssigneVehicles', null))
    );
  }

  // Actualizar fecha de grupos compartidos  - Módulo compartir vehículos
  updateGroupShareDate(JSONGroupDates, pkGrmaId): Observable<null> {
    const url = this.session.apiUrl + 'share/groups/' + pkGrmaId;
    return this.http.put(url, JSONGroupDates, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('updateGroupShareDate', null))
    );
  }

  // Actualizar Estado del perfil - Perfiles
  updateStatusProfile(pkPrflId, prflStatus): Observable<null> {
    const url = this.session.apiUrl + 'profile/' + pkPrflId + '/status/' + prflStatus;
    return this.http.put(url, '{}', {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('updateStatusProfile', null))
    );
  }

  // Actualizar perfil - Perfiles
  updateProfileById(pkPrflId, infoUpdate): Observable<null> {
    const url = this.session.apiUrl + 'profile/' + pkPrflId;
    return this.http.put(url, infoUpdate, {headers: this.session.getAuthHeaders()}).pipe(
      catchError(this.handleError<any>('updateProfile', null))
    );
  }
}
