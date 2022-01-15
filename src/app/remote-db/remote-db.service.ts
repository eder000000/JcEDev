import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Colony } from '../remote-models/colony-model';

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
}
