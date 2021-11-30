import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/firebase/firebase.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

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

	constructor(private firebaseService: FirebaseService, private formBuilder: FormBuilder, private router: Router) {}

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

	onSubmit() {
		this.firebaseService
			.post(this.formNewProfesional.value)
			.then(() => {
				this.router.navigate([ '/listado' ]);
			})
			.catch((e) => {
				console.log('Firebase Error: ', e);
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
		console.log(this.firstFormNewProfesional.value);
		console.log(this.secondFormNewProfesional.value);
		console.log(this.thirdFormNewProfesional.value);
	}
}
