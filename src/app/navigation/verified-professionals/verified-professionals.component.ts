import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verified-professionals',
  templateUrl: './verified-professionals.component.html',
  styleUrls: ['./verified-professionals.component.css']
})
export class VerifiedProfessionalsComponent implements OnInit {
  textPresentationCard = 'Jalisco con Empleo te conecta con los profesionales para todos tus proyectos de construcción, mejora, y/o reparación.';
	imageProfessionals = './assets/img/undraw_Cooking_re_g99p.png'; 

  constructor() { }

  ngOnInit(): void {
  }

}
