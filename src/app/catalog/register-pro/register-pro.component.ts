import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/firebase/firebase.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Profesional } from 'src/app/user/profesional-data-model';

import { concatJSON } from '../../../utils/json-utils';
import { HerokuAddressService } from 'src/app/heroku-address/heroku-address.service';
import { Municipality } from 'src/app/address/municipality-model';
import { Colony } from 'src/app/address/address-model';
import { ZipCode } from 'src/app/address/zip-code-model';

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

	allMunicipalities: Municipality[];
	allColonies: Colony[];
	selectedMun: string;

	profileImageUrl: string
	showProfilePicturePreview: boolean

	constructor(
		private firebaseService: FirebaseService,
		private formBuilder: FormBuilder,
		private router: Router,
		private addressService: HerokuAddressService
	) {}

	ngOnInit() {
		this.maxDate = new Date();
		this.maxDate.setFullYear(this.maxDate.getFullYear() - 15);
		this.selectedMun = ""
		this.showProfilePicturePreview = false

		this.addressService.getMunicipalities(14).subscribe((mun) => {
			this.allMunicipalities = mun;
		});

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
			})
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
			oficios: new FormArray([
				new FormGroup({
					oficio_name: new FormControl('', Validators.required),
					oficio_descripcion: new FormControl('', Validators.required)
				})
			])
			/* 			oficio: this.formBuilder.array([
				this.formBuilder.group({
					oficio_name: [ 'user1', Validators.required ],
					oficio_descripcion: [ '', Validators.required ]
				})
			]) */
		});
	}

	removeFormControl(i) {
		let usersArray = this.thirdFormNewProfesional.controls.oficios as FormArray;
		usersArray.removeAt(i);
	}

	addFormControl() {
		let usersArray = this.thirdFormNewProfesional.controls.oficios as FormArray;
		let arraylen = usersArray.length;

		let newUsergroup: FormGroup = this.formBuilder.group({
			oficio_name: [ '', Validators.required ],
			oficio_descripcion: [ '', Validators.required ]
		});

		usersArray.insert(arraylen, newUsergroup);
	}

	get oficios(): FormArray {
		return this.thirdFormNewProfesional.get('oficios') as FormArray;
	}

	save() {
		var profesional = concatJSON(this.firstFormNewProfesional.value, this.secondFormNewProfesional.value);
		profesional = concatJSON(profesional, this.thirdFormNewProfesional.value);
		profesional = concatJSON(profesional, { fotoPerfil: this.profileImageUrl });

		this.firebaseService
			.post(profesional)
			.then(() => {
				this.router.navigate([ '/listado' ]);
			})
			.catch((e) => {
				console.log('Firebase Error: ', e);
			});
	}

	renderColonies(value) {
		this.addressService.getColonies(value).subscribe((col) => {
			this.allColonies = col;
			this.secondFormNewProfesional.controls.codigoPostal.setValue('');
		});
	}

	renderZip(value) {
		this.allColonies.forEach((colony) => {
			if (colony.id_colony_code === parseInt(value)) {
				this.secondFormNewProfesional.controls.codigoPostal.setValue(colony.zip_code);
			}
		});
	}

	renderAddress(value) {
		this.addressService.getColoniesFromZip(value).subscribe((col) => {
			if (col.length === 0) {
				alert('Invalid zip code!');
				this.secondFormNewProfesional.controls.codigoPostal.setValue('');
			} else {
				this.allColonies = col;
				this.allMunicipalities.forEach((mun) => {
					if (mun.municipality_name === col[0].municipality_name) {
						this.secondFormNewProfesional.controls.municipio.setValue(mun.id_municipality + '');
					}
				});
			}
		});
	}

	async uploadImage(event) {
		console.log("Uploading image")
		const observable = await this.firebaseService.uploadImage(event)
		observable.subscribe(url => {
			this.profileImageUrl = url
			this.showProfilePicturePreview = true
			console.log(url)
		})
	}
}
