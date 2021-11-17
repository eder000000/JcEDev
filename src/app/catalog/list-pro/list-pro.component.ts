import { Component, OnInit } from '@angular/core';
import { Oficio } from 'src/app/job/oficios.model';
import { OficiosService } from 'src/app/job/oficios.service';

@Component({
	selector: 'app-list-pro',
	templateUrl: './list-pro.component.html',
	styleUrls: [ './list-pro.component.css' ]
})
export class ListProComponent implements OnInit {
	oficios: Oficio[];
	panelOpenState = false;

	constructor(private oficiosService: OficiosService) {}

	ngOnInit() {
		this.oficios = this.oficiosService.getOficios();
	}
}
