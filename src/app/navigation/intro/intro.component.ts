import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {
  textPresentationCard = 'Jalisco con Empleo te conecta con los profesionales para todos tus proyectos de construcción, mejora, y/o reparación.';
	imageConstruction = './assets/img/undraw_under_construction_46_principal (2).png';
	imageSuscription = './assets/img/undraw_coffee_break_h3uu_thumbnails.png';
	textSuscriptionCard = 'Soy un profesional, ¿Cómo puedo suscribirme?'; 
  imageInicio = './assets/img/inicio.png';

  constructor() { }

  ngOnInit(): void {
  }

}
