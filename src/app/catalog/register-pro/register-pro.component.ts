import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/firebase/firebase.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { concatJSON } from '../../../utils/json-utils';
import { HerokuAddressService } from 'src/app/heroku-address/heroku-address.service';

// import { Municipality } from 'src/app/address/municipality-model';
// import { Colony } from 'src/app/address/address-model';
// import { ZipCode } from 'src/app/address/zip-code-model';
import { Municipality } from 'src/app/remote-models/municipality-model';
import { Colony } from 'src/app/remote-models/colony-model';
import { ZipCode } from 'src/app/remote-models/zip-code-model';
import { RemoteDbService } from 'src/app/remote-db/remote-db.service';
import { Skills } from 'src/app/remote-models/skills-model';
import { Media } from 'src/app/remote-models/media-model';
import { UserModel } from 'src/app/remote-models/user-model';
import { AuthService } from 'src/app/auth/auth.service';

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
	allSkills: Skills[]; 

	profileImageId: number
	profileImageUrl: string
	showProfilePicturePreview: string

	photoEvidences: [number[]]
	isPhotoEvidencesLoading: boolean[]

	userID:string

	constructor(
		private firebaseService: FirebaseService,
		private formBuilder: FormBuilder,
		private router: Router,
		private addressService: HerokuAddressService, 
		private remoteDbService: RemoteDbService, 
		private authService: AuthService
	) {}

	ngOnInit() {
		this.maxDate = new Date();
		this.maxDate.setFullYear(this.maxDate.getFullYear() - 15);
		this.selectedMun = ""
		this.showProfilePicturePreview = "hidden"
		this.photoEvidences = [[]]
		this.isPhotoEvidencesLoading = [false]
		this.profileImageId = 0;
		this.profileImageUrl = '';
		this.userID = 'xxxxxx'.replace(/[x]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		 });

		// this.addressService.getMunicipalities(14).subscribe((mun) => {
		// 	this.allMunicipalities = mun;
		// });

		// JAL_CODE = 14
		this.remoteDbService.getFilteredMunicipalities(14)
			.subscribe((mun) => {
				this.allMunicipalities = mun
			})

		// Load skills
		this.remoteDbService.getSkills()
			.subscribe((skills) => {
				this.allSkills = skills;	
			})

		this.firstFormNewProfesional = this.formBuilder.group({
			nombres: new FormControl('', {
				validators: [ Validators.required, Validators.maxLength(30) ]
			}),

			segundoNombre: new FormControl(''),

			apellidos: new FormControl('', {
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
					oficio_select: new FormControl('', Validators.required)
				})
			]), 

			ubicacionTrabajo: new FormControl('', {
				validators: [ Validators.required ]
			}) 
		});
	}

	removeFormControl(i) {
		let usersArray = this.thirdFormNewProfesional.controls.oficios as FormArray;
		usersArray.removeAt(i);
		
		this.photoEvidences[i].forEach(id => {
			this.remoteDbService.deleteMedia(id).subscribe(() => {
				console.log(`Media ${id} has been delated`)
			});
		})

		this.photoEvidences.splice(i, 1)
		this.isPhotoEvidencesLoading.splice(i, 1)
	}

	addFormControl() {
		let usersArray = this.thirdFormNewProfesional.controls.oficios as FormArray;
		let arraylen = usersArray.length;

		let newUsergroup: FormGroup = this.formBuilder.group({
			oficio_select: new FormControl('', Validators.required)
		});

		usersArray.insert(arraylen, newUsergroup);
		this.photoEvidences.push([])
		this.isPhotoEvidencesLoading.push(false)
	}

	get oficios(): FormArray {
		return this.thirdFormNewProfesional.get('oficios') as FormArray;
	}

	save() {
		var profesional = concatJSON(this.firstFormNewProfesional.value, this.secondFormNewProfesional.value);
		var oficiosArray = this.thirdFormNewProfesional.value.oficios;
		for (var j = 0; j < oficiosArray.length; j++) {
			oficiosArray[j]["fotos"] = this.photoEvidences[j]
		}

		profesional = concatJSON(profesional, this.thirdFormNewProfesional.value);
		profesional = concatJSON(profesional, { fotoPerfil: this.profileImageId });

		console.log(profesional);
		var user:UserModel = this.buildUserModel(profesional);
		console.log(user);

		// this.firebaseService
		// 	.post(profesional)
		// 	.then(() => {
		// 		this.router.navigate([ '/listado' ]);
		// 	})
		// 	.catch((e) => {
		// 		console.log('Firebase Error: ', e);
		// 	});
	}

	buildUserModel(profesional): UserModel {
		// TODO: POST Address before posting user model to get address id
		// TODO: Get Org id from user_model in session

		

		return {
			"user_model_address_id": 1,
			"user_model_birthday": profesional.fechaNacimiento.toISOString(),
			"user_model_creator_id": this.authService.getSession().user_auth_id,
			"user_model_first_name": profesional.nombres,
			"user_model_id": 1,
			"user_model_last_name": profesional.apellidos,
			"user_model_media_id": this.profileImageId,
			"user_model_org": 1,
			"user_model_phone_number": profesional.numeroCelular,
			"user_model_professions": [
			  {
				"profession_evidences": [
				  {
					"evidence_id": 1,
					"evidence_media": 1
				  }
				],
				"profession_id": 1,
				"profession_skill": 1
			  }
			],
			"user_model_registry_date": (new Date()).toISOString(),
			"user_model_surname": profesional.segundoNombre,
			"user_model_updated_date": (new Date()).toISOString(),
			"user_model_working_areas": [
			  {
				"working_area_id": 1,
				"working_area_municipality": 1
			  }
			],
			"user_role_id": 5,
			"user_status_id": 1
		}
	}

	renderColonies(value) {
		this.remoteDbService.getFilteredColonies(undefined, value).subscribe((col) => {
			this.allColonies = col;
			this.secondFormNewProfesional.controls.codigoPostal.setValue('');
		})
	}

	renderZip(value) {
		this.allColonies.forEach((colony) => {
			if (colony.id_colony_code === parseInt(value)) {
				this.remoteDbService.getZipCodesById(colony.id_zip_code).subscribe((zip) => 
					this.secondFormNewProfesional.controls.codigoPostal.setValue(zip.zip_code)
				)
			}
		});
	}

	renderAddress(value) {
		this.remoteDbService.getZipCodes().subscribe((zips) => {
			var zip_id:number = 0;
			zips.every(zip => {
				if (zip.zip_code === value) {
					zip_id = zip.id_zip_code;
					return false;
				}
				return true;
			})

			if (zip_id === 0) {
				alert("Invalid Zip Code!")
				this.secondFormNewProfesional.controls.codigoPostal.setValue('');
				return;
			}

			this.remoteDbService.getFilteredColonies(zip_id).subscribe((col) => {
				this.allColonies = col;
				this.allMunicipalities.forEach((mun) => {
					if (mun.id_municipality === col[0].id_municipality) {
						this.secondFormNewProfesional.controls.municipio.setValue(mun.id_municipality.toString());
					}
				});
			})
		})
	}

	async uploadImage(event) {
		// const observable = await this.firebaseService.uploadImage(event.target.files[0])
		// observable.subscribe(url => {
		// 	this.profileImageUrl = url
		// 	this.showProfilePicturePreview = "visible"
		// })

		this.showProfilePicturePreview = "loading"
		if (this.profileImageId != 0) {
			this.remoteDbService.deleteMedia(this.profileImageId).subscribe(() => {
				console.log("Old profile picture has been removed");
				this.readImages(event.target.files, 0, new FileReader(), undefined);
			})
		} else {
			this.readImages(event.target.files, 0, new FileReader(), undefined);
		}
	}

	async uploadPhotoEvidence(event, index) {
		// Clear array
		this.photoEvidences[index].splice(0, this.photoEvidences[index].length)
		this.isPhotoEvidencesLoading[index] = true
		await this.readImages(event.target.files, 0, new FileReader(), index)
	}

	async readImages(imageArray, index, reader, skillIndex) {
		reader.onloadend = () => {
			// POST IMAGE
			var loadedDate = new Date()
			var loadedString = `${loadedDate.getDate()}${loadedDate.getMonth()}${loadedDate.getFullYear()}${loadedDate.getMilliseconds()}`
			var media_data = '';
			var media_title = `${this.userID}_${loadedString}`;
			if (reader.result.includes('jpeg')) {
				media_data = reader.result.split('data:image/jpeg;base64,')[1]; 
				media_title += '.jpeg';
			} else if (reader.result.includes('png')) {
				media_data = reader.result.split('data:image/png;base64,')[1];
				media_title += '.png';
			}

			var newMedia:Media = {
				media_id: 0, 
				media_link: '', 
				media_size: 0, 
				media_description: `User ${this.userID} Image Uploaded on ${loadedString}`, 
				media_title: media_title, 
				media_data: media_data, 
				media_status_id: 1, 
				media_content_updated_date: `${loadedDate}`, 
				media_content_upload_date: `${loadedDate}`
			}

			this.remoteDbService.postMedia(newMedia).subscribe(media => {
				console.log(media);

				// Skill Evidence Media
				if (skillIndex != undefined) {
					this.photoEvidences[skillIndex].push(media.media_id);	
					if (index < imageArray.length-1) {
						this.readImages(imageArray, index+1, reader, skillIndex);
					} else {
						this.isPhotoEvidencesLoading[skillIndex] = false
						console.log('Links: ', this.photoEvidences[skillIndex]);
					}

				// Profile Picture Media
				} else {
					this.showProfilePicturePreview = "visible"
					this.profileImageId = media.media_id;
					this.profileImageUrl = `https://jce-flask-02.herokuapp.com/media/${media.media_id}/content`
				}
			})
		}
		
		reader.readAsDataURL(imageArray[index])
	}

	/**
	
	*/
}
