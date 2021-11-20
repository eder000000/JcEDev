import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [ './home.component.css' ]
})
export class HomeComponent implements OnInit {
	textPresentationCard = 'Jalisco con Empleo te conecta con los profesionales para todos tus proyectos de construcción, mejora, y/o reparación.';
	imageConstruction = './assets/img/undraw_under_construction_46_principal.png';
	imageSuscription = './assets/img/undraw_coffee_break_h3uu_thumbnails.png';
	textSuscriptionCard = 'Soy un profesional, ¿Cómo puedo suscribirme?';
	constructor() {}

	ngOnInit(): void {}
}
