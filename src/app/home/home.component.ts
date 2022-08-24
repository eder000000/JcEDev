import { userError } from '@angular/compiler-cli/src/transformers/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { RemoteDbService } from '../remote-db/remote-db.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [ './home.component.css' ]
})
export class HomeComponent implements OnInit {
	verifiedProfessionalsQuantity = 0; 
	textPresentationCard = 'Jalisco con Empleo te conecta con los profesionales para todos tus proyectos de construcción, mejora, y/o reparación.';
	imageConstruction = './assets/img/undraw_under_construction_46_principal.png';
	imageSuscription = './assets/img/undraw_coffee_break_h3uu_thumbnails.png';
	textSuscriptionCard = 'Soy un profesional, ¿Cómo puedo suscribirme?'; 

	constructor(public router: Router, 
				private remoteDbService: RemoteDbService) {}

	ngOnInit(): void {
		this.remoteDbService.getUsers().subscribe(allUsers => {
			allUsers.forEach(user => {
				if (user.user_model_org == 1){
					this.verifiedProfessionalsQuantity++;
				}
			})
		})
	}
}
