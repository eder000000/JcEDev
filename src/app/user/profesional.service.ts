import { Injectable } from '@angular/core';
import { Profesional } from './profesional-data-model';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {
  arrProfesional: Profesional[];

  constructor() { 
    this.arrProfesional = [];
  }

  insert(dataProfesional): void{
    this.arrProfesional.push(dataProfesional);
    console.log(this.arrProfesional);

  }
}
