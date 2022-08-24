import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  textPresentationCard = 'Jalisco con Empleo te conecta con los profesionales para todos tus proyectos de construcción, mejora, y/o reparación.';
	imageConstruction = './assets/img/undraw_Notify_re_65on.png';
	imageSuscription = './assets/img/undraw_coffee_break_h3uu_thumbnails.png';
	textSuscriptionCard = 'Soy un profesional, ¿Cómo puedo suscribirme?';


  constructor() { }

  ngOnInit(): void {
  }

}
