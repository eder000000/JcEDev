import { Injectable } from '@angular/core';
import { Oficio } from './oficios.model';
import { Speciality } from './specialities.model';

@Injectable({
	providedIn: 'root'
})
export class OficiosService {
	private oficios: Oficio[] = [
		new Oficio('001', 'Fontanero', 'Trabajos de fontaneria', [ new Speciality('01', 'Muebles', 'Muebles bonitos') ])
	];

	constructor() {}

	getOficios() {
		return this.oficios.slice();
		console.log(this.oficios);
	}
}
