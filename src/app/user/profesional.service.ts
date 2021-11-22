// #FIXME: Unused service: Replaced with firebase-service

import { Injectable } from '@angular/core';
import { Profesional } from './profesional-data-model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {
  arrProfesional: Profesional[];

  constructor(private router: Router) { 
    this.arrProfesional = [];
  }

  insert(dataProfesional): void{
    this.arrProfesional.push(dataProfesional);
    console.log(this.arrProfesional);
    this.router.navigate(['/listado']);

  }

  getAll(): Promise<Profesional[]>{
    return new Promise((resolve, reject) => {
      resolve(this.arrProfesional);
    });
  }
}
