import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Colony } from '../remote-models/colony-model';
import { CountryCode } from '../remote-models/country-code-model';
import { Media } from '../remote-models/media-model';
import { Municipality } from '../remote-models/municipality-model';
import { Skills } from '../remote-models/skills-model';
import { StateCode } from '../remote-models/state-code-model';
import { Status } from '../remote-models/status-model';
import { UserAddress } from '../remote-models/user-address-model';
import { UserAuth } from '../remote-models/user-auth-model';
import { UserModel } from '../remote-models/user-model';
import { UserRole } from '../remote-models/user-role-model';
import { ZipCode } from '../remote-models/zip-code-model';

@Injectable({
  providedIn: 'root'
})
export class RemoteDbService {
  endpoint:string = 'http://127.0.0.1:5000'
  headers:{}
  token:string

  constructor(private httpClient: HttpClient)  {
    this.headers = {
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': "*"
    }
  }

  /**
   * POST /login
   */
  login(username:string, password:string): Observable<any> {
    return this.httpClient.post<any>(
      this.endpoint + '/login', {
        'user_auth_name': username, 
        'user_auth_password': password
      }
    )
  }

  /**
   * Set token in headers after login
   * @param token Given token after login
   */
  setToken(token:string): void {
    this.headers = {
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': "*", 
      'x-access-token': token
    }
  }

  /**
   * GET /colonies
   */
  getColonies(): Observable<Colony[]> {
    return this.httpClient.get<Colony[]>(
      this.endpoint + '/colonies', {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /colonies/filter
   */
  getFilteredColonies(id_zip_code?: number, id_municipality?: number): Observable<Colony[]> {
    var params:{id_zip_code?:string, id_municipality?:string} = {}
    if (id_zip_code) params.id_zip_code = id_zip_code.toString()
    if (id_municipality) params.id_municipality = id_municipality.toString()

    return this.httpClient.get<Colony[]>(
      this.endpoint + '/colonies/filter' , {
        'headers': this.headers,
        'params': params
      }
    ).pipe(retry(1))
  }

  /**
   * GET /colonies/:id
   */
  getColonyById(id_colony_code: number): Observable<Colony> {
    return this.httpClient.get<Colony>(
      this.endpoint + '/colonies/' + id_colony_code, {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /countries
   */
  getCountries(): Observable<CountryCode[]> {
    return this.httpClient.get<CountryCode[]>(
      this.endpoint + '/countries', {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /countries/:id
   */
  getCountryById(id_country_code: number): Observable<CountryCode> {
    return this.httpClient.get<CountryCode>(
      this.endpoint + '/countries/' + id_country_code, {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /municipalities
   */
  getMunicipalities(): Observable<Municipality[]> {
    return this.httpClient.get<Municipality[]>(
      this.endpoint + '/municipalities', {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /municipalities/filter
   */
  getFilteredMunicipalities(id_state_code?: number): Observable<Municipality[]> {
    var params:{id_state_code?:string} = {}
    if (id_state_code) params.id_state_code = id_state_code.toString()

    return this.httpClient.get<Municipality[]>(
      this.endpoint + '/municipalities/filter' , {
        'headers': this.headers,
        'params': params
      }
    ).pipe(retry(1))
  }

  /**
   * GET /municipalities/:id
   */
  getMunicipalityById(id_municipality: number): Observable<Municipality> {
    return this.httpClient.get<Municipality>(
      this.endpoint + '/countries/' + id_municipality, {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /roles
   */
  getRoles(): Observable<UserRole[]> {
    return this.httpClient.get<UserRole[]>(
      this.endpoint + '/roles', {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /roles/:id
   */
  getRoleById(user_role_id: number): Observable<UserRole> {
    return this.httpClient.get<UserRole>(
      this.endpoint + '/roles/' + user_role_id, {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /skills
   */
  getSkills(): Observable<Skills[]> {
    return this.httpClient.get<Skills[]>(
      this.endpoint + '/skills', {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /skills/:id
   */
  getSkillsById(skills_id: number): Observable<Skills> {
    return this.httpClient.get<Skills>(
      this.endpoint + '/countries/' + skills_id, {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /states
   */
   getStates(): Observable<StateCode[]> {
    return this.httpClient.get<StateCode[]>(
      this.endpoint + '/states', {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /states/filter
   */
  getFilteredStates(id_country_code?: number): Observable<StateCode[]> {
    var params:{id_country_code?:string} = {}
    if (id_country_code) params.id_country_code = id_country_code.toString()

    return this.httpClient.get<StateCode[]>(
      this.endpoint + '/states/filter' , {
        'headers': this.headers,
        'params': params
      }
    ).pipe(retry(1))
  }

  /**
   * GET /states/:id
   */
  getStatesById(id_state_code: number): Observable<StateCode> {
    return this.httpClient.get<StateCode>(
      this.endpoint + '/states/' + id_state_code, {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /statuses
   */
  getStatuses(): Observable<Status[]> {
    return this.httpClient.get<Status[]>(
      this.endpoint + '/statuses', {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /statuses/:id
   */
  getStatusesById(id_state_code: number): Observable<Status> {
    return this.httpClient.get<Status>(
      this.endpoint + '/statuses/' + id_state_code, {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /zip_codes
   */
   getZipCodes(): Observable<ZipCode[]> {
    return this.httpClient.get<ZipCode[]>(
      this.endpoint + '/zip_codes', {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /zip_codes/:id
   */
  getZipCodesById(id_zip_code: number): Observable<ZipCode> {
    return this.httpClient.get<ZipCode>(
      this.endpoint + '/zip_codes/' + id_zip_code, {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /users
   */
  getUsers(): Observable<UserModel[]> {
    return this.httpClient.get<UserModel[]>(
      this.endpoint + '/users', {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /users/filter
   */
  getFilteredUsers(user_role_id?: number, status_id?: number, skills_id?: number): Observable<UserModel[]> {
    var params:{user_role_id?:string, status_id?:string, skills_id?:string} = {}
    if (user_role_id) params.user_role_id = user_role_id.toString()
    if (status_id) params.status_id = status_id.toString()
    if (skills_id) params.skills_id = skills_id.toString()
    
    return this.httpClient.get<UserModel[]>(
      this.endpoint + '/users/filter' , {
        'headers': this.headers,
        'params': params
      }
    ).pipe(retry(1))
  }

  /**
   * GET /users/:id
   */
  getUsersById(user_model_id: number): Observable<UserModel> {
    return this.httpClient.get<UserModel>(
      this.endpoint + '/users/' + user_model_id, {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /users/:id/address
   */
  getUserAddressById(user_model_id: number): Observable<UserAddress> {
    return this.httpClient.get<UserAddress>(
      this.endpoint + '/users/' + user_model_id + '/address', {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /users/:id/auth
   */
  getUserAuthById(user_model_id: number): Observable<UserAuth> {
    return this.httpClient.get<UserAuth>(
      this.endpoint + '/users/' + user_model_id + '/auth', {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }

  /**
   * GET /users/:id/media
   */
  getUserMediaById(user_model_id: number): Observable<Media> {
    return this.httpClient.get<Media>(
      this.endpoint + '/users/' + user_model_id + '/media', {
        'headers': this.headers
      }
    ).pipe(retry(1))
  }
}