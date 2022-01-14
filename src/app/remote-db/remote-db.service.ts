import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Colony } from '../remote-models/colony-model';

@Injectable({
  providedIn: 'root'
})
export class RemoteDbService {
  endpoint:string = 'http://127.0.0.1:5000'
  constructor(private httpClient: HttpClient)  { }

  // TODO: Add token to header after login
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': "*" 
    })
  };

  /**
   * GET /colonies
   */
  getColonies(): Observable<Colony[]> {
    return this.httpClient.get<Colony[]>(
      this.endpoint + '/colonies'
    ).pipe(retry(1))
  }
}
