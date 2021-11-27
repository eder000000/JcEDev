import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/firebase/firebase.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Profesional } from 'src/app/user/profesional-data-model';

import { concatJSON } from '../../../utils/json-utils';

@Component({
	selector: 'app-register-pro',
	templateUrl: './register-pro.component.html',
	styleUrls: [ './register-pro.component.css' ]
})
export class RegisterProComponent implements OnInit {
	isLinear = true;
	formNewProfesional: FormGroup;
	selected: any;

	maxDate;
	firstFormNewProfesional: FormGroup;
	secondFormNewProfesional: FormGroup;
	thirdFormNewProfesional: FormGroup;

	constructor(private firebaseService: FirebaseService, private formBuilder: FormBuilder, private router:Router) {}

	ngOnInit() {
		this.maxDate = new Date();
		this.maxDate.setFullYear(this.maxDate.getFullYear() - 15);

		this.firstFormNewProfesional = this.formBuilder.group({
			nombres: new FormControl('', {
				validators: [ Validators.required, Validators.maxLength(30) ]
			}),

			apellidoPaterno: new FormControl('', {
				validators: [ Validators.required, Validators.maxLength(30) ]
			}),

			apellidoMaterno: new FormControl('', {
				validators: [ Validators.required, Validators.maxLength(30) ]
			}),

			fechaNacimiento: new FormControl('', {
				validators: [ Validators.required ]
			}),

			numeroCelular: new FormControl('', {
				validators: [ Validators.required, Validators.maxLength(12), Validators.pattern(/^-?(0|[1-9]\d*)?$/) ]
			}),

			fotoPerfil: new FormControl('')
		});

		this.secondFormNewProfesional = this.formBuilder.group({
			calle: new FormControl('', {
				validators: [ Validators.required ]
			}),

			numExterior: new FormControl('', {
				validators: [ Validators.required, Validators.maxLength(6) ]
			}),

			numInterior: new FormControl('', {
				validators: [ Validators.maxLength(6) ]
			}),

			colonia: new FormControl('', {
				validators: [ Validators.required, Validators.maxLength(30) ]
			}),

			codigoPostal: new FormControl('', {
				validators: [ Validators.required ]
			}),
			municipio: new FormControl('', {
				validators: [ Validators.required ]
			})
		});

		this.thirdFormNewProfesional = this.formBuilder.group({
			oficio: new FormControl('', {
				validators: [ Validators.required, Validators.maxLength(20) ]
			}),

			especialidadOficio: new FormControl('', {
				validators: []
			}),

			descripcionOficio: new FormControl('', {
				validators: []
			}),

			ubicacionTrabajo: new FormControl('', {
				validators: [ Validators.required ]
			})
		});
	}

	save() {
		console.log(this.firstFormNewProfesional.value);
		console.log(this.secondFormNewProfesional.value);
		console.log(this.thirdFormNewProfesional.value);

		var profesional = concatJSON(this.firstFormNewProfesional.value, this.secondFormNewProfesional.value);
		profesional = concatJSON(profesional, this.thirdFormNewProfesional.value);

		this.firebaseService.post(profesional).then(() => {
		this.router.navigate(['/listado']);      
		}).catch(e => {
		console.log('Firebase Error: ', e)
		});
	}
}