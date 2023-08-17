import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verified-professionals',
  templateUrl: './verified-professionals.component.html',
  styleUrls: ['./verified-professionals.component.css']
})
export class VerifiedProfessionalsComponent implements OnInit {
  textPresentationCard = 'Jalisco con Empleo te conecta con los profesionales para todos tus proyectos de construcción, mejora, y/o reparación.';
	imageVerified = './assets/img/Verificados.png'; 

  constructor() { }

  ngOnInit(): void {
  }

}
