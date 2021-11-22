import { Component, OnInit } from '@angular/core';
import { OficiosService } from 'src/app/job/oficios.service';

@Component({
	selector: 'app-pro-details',
	templateUrl: './pro-details.component.html',
	styleUrls: [ './pro-details.component.css' ],
	providers: [ OficiosService ]
})
export class ProDetailsComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
