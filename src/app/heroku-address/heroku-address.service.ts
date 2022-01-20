import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Colony } from '../address/address-model';
import { Municipality } from '../address/municipality-model';

@Injectable({
	providedIn: 'root'
})
export class HerokuAddressService {
	endpoint: string = 'https://addressing-mexico-api.herokuapp.com';
	constructor(private httpClient: HttpClient) {}

	httpHeader = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json'
		})
	};

	/**
	 * GET, 
	 * POST, 
	 * PUT, 
	 * DELETE
	 */

	getColonies(id_mun: number): Observable<Colony[]> {
		return this.httpClient.get<Colony[]>(this.endpoint + '/municipalities/' + id_mun + '/colonies').pipe(retry(1));
	}

	getMunicipalities(state_code: number): Observable<Municipality[]> {
		return this.httpClient
			.get<Municipality[]>(this.endpoint + '/states/' + state_code + '/municipalities')
			.pipe(retry(1));
	}

	getColoniesFromZip(zip: string): Observable<Colony[]> {
		return this.httpClient.get<Colony[]>(this.endpoint + '/zip/' + zip + '/colonies').pipe(retry(1));
	}
}
