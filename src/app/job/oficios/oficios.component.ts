import { Component, OnInit } from '@angular/core';

let emailRegex = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
@Component({
	selector: 'app-oficios',
	templateUrl: './oficios.component.html',
	styleUrls: [ './oficios.component.css' ]
})
export class OficiosComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
