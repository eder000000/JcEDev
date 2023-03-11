import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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
import { UserAddress } from 'src/app/remote-models/user-address-model';
import { ContentObserver } from '@angular/cdk/observers';
import { element } from 'protractor';
import { isContinueStatement } from 'typescript';
import { Profession } from 'src/app/remote-models/profession-model';
import { WorkingArea } from 'src/app/remote-models/working-area-model';

@Component({
	selector: 'app-edit-pro',
	templateUrl: './edit-pro.component.html',
	styleUrls: [ './edit-pro.component.css' ]
})
export class EditProComponent implements OnInit {
	endpoint:string = "https://dashboard.heroku.com/apps/jce-demo-deploy-01"

	isLoaded = false;
	isLinear = true;
	formNewProfesional: FormGroup;
	selected: any;

	maxDate;
	firstFormNewProfesional: FormGroup;
	secondFormNewProfesional: FormGroup;
	thirdFormNewProfesional: FormGroup;

	allMunicipalities: Municipality[];
	allColonies: Colony[];
	allSkills: Skills[]; 

	profileImageId: number
	profileImageUrl: string
	showProfilePicturePreview: string
	zipCodeId: number

	photoEvidences: [number[]]
	isPhotoEvidencesLoading: boolean[]

	userID:string
	userModelId:string
	userAddressId:number
	userOldProfessions:Profession[]
	userOldWorkingAreas:WorkingArea[]

	//Declarations for "Working Areas" chips
	//V1
	separatorKeysCodes: number[] = [ENTER, COMMA];
	workingAreasCtrl = new FormControl('');
	filteredWorkingAreas: Observable<string[]>;
	workingAreas: string[] = [];
	allWorkingAreas: string[] = [];
	@ViewChild('workingAreaInput') workingAreaInput: ElementRef<HTMLInputElement>;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router, 
		private remoteDbService: RemoteDbService, 
		private authService: AuthService,
		private route: ActivatedRoute
		// private _ngZone: NgZone		
	) {}

	generateForm() {
		this.firstFormNewProfesional = this.formBuilder.group({
			nombres: new FormControl('', {
				// validators: [ Validators.required, Validators.maxLength(30) ]
			}),

			segundoNombre: new FormControl(''),

			apellidos: new FormControl('', {
				// validators: [ Validators.required, Validators.maxLength(30) ]
			}),

			fechaNacimiento: new FormControl('', {
				// validators: [ Validators.required ]
			}),

			numeroCelular: new FormControl('', {
				// validators: [ Validators.required, Validators.maxLength(12), Validators.pattern(/^-?(0|[1-9]\d*)?$/) ]
			})
		});

		this.secondFormNewProfesional = this.formBuilder.group({
			calle: new FormControl('', {
				// validators: [ Validators.required ]
			}),

			numExterior: new FormControl('', {
				// validators: [ Validators.required, Validators.maxLength(6) ]
			}),

			numInterior: new FormControl('', {
				// validators: [ Validators.maxLength(6) ]
			}),

			colonia: new FormControl('', {
				// validators: [ Validators.required, Validators.maxLength(30) ]
			}),

			codigoPostal: new FormControl('', {
				// validators: [ Validators.required ]
			}),

			municipio: new FormControl('', {
				// validators: [ Validators.required ]
			})
		});

		this.thirdFormNewProfesional = this.formBuilder.group({
			general_description: new FormControl(''),
			oficios: new FormArray([
				new FormGroup({
					oficio_select: new FormControl('', Validators.required)
				})
			]), 
			ubicacionTrabajo: new FormArray([])
			// ubicacionTrabajo: new FormControl('', {
			// 	validators: [ Validators.required ]
			// })
		});
	}

	loadInfo(user, address?, colony?, zipCode?, mun?) {
		console.log(user);

		this.firstFormNewProfesional.setValue({
			nombres: user.user_model_first_name,
			segundoNombre: user.user_model_surname,
			apellidos: user.user_model_last_name,
			fechaNacimiento: user.user_model_birthday,
			numeroCelular: user.user_model_phone_number, 
		})

		this.secondFormNewProfesional.setValue({
			calle: address ? address.street_name : "", 
			numExterior: address ? address.main_number : "", 
			numInterior: address ? address.interior_number : "", 
			codigoPostal: zipCode ? zipCode.zip_code : "",
			colonia: colony ? colony.id_colony_code + "" : "", 
			municipio: mun ? mun.id_municipality + "" : ""
		})
		
		// Set professions and evidences
		for (var i = 0; i < user.user_model_professions.length; i++){
			this.addFormControl()
			let _oficions_array = this.thirdFormNewProfesional.controls.oficios as FormArray
			let _oficio = user.user_model_professions[i]
			_oficions_array.at(i).setValue({
				oficio_select: _oficio.profession_skill+""
			})
			// Set evidences
			for (var j = 0; j < _oficio.profession_evidences.length; j++){
				this.photoEvidences[i].push(_oficio.profession_evidences[j].evidence_media)
			}
		}

		// Remove default skill_form
		this.removeFormControl(user.user_model_professions.length);
		
		// Set working areas
		for (var i = 0; i < user.user_model_working_areas.length; i++){
			this.workingAreas.push(
				this.allMunicipalities.find(
					mun => mun.id_municipality === user.user_model_working_areas[i].working_area_municipality
				).municipality_name
			)
		}

		// Set general_description (if exists)
		if (user.user_model_description) {
			let _general_desc_form = this.thirdFormNewProfesional.controls.general_description as FormControl
			_general_desc_form.setValue(user.user_model_description)
		}

		this.profileImageUrl = `${this.endpoint}/media/${user.user_model_media_id}/content`
		this.showProfilePicturePreview = "visible"		

		//Declarations for "Working Areas" chips
		this.filteredWorkingAreas = this.workingAreasCtrl.valueChanges.pipe(
			startWith(null),
			map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allWorkingAreas.slice())),
		);

		console.log(this.secondFormNewProfesional.controls)
	}

	ngOnInit() {
		this.maxDate = new Date();
		this.maxDate.setFullYear(this.maxDate.getFullYear() - 15);
		this.showProfilePicturePreview = "hidden"
		this.photoEvidences = [[]]
		this.isPhotoEvidencesLoading = [false]
		this.profileImageId = 0;
		this.profileImageUrl = '';
		this.userID = 'xxxxxx'.replace(/[x]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		 });
		 this.userModelId = "0";

		// Generate form controllers
		this.generateForm();

		// JAL_CODE = 14
		this.remoteDbService.getFilteredMunicipalities(14).subscribe((mun) => {
			this.allMunicipalities = mun;
			
			//For Working Area chiplist 
			this.allMunicipalities.forEach(municipality => {
				this.allWorkingAreas.push(municipality.municipality_name)
			});

			this.route.params.subscribe(params => {
				this.userModelId = params.id;
				console.log(this.userModelId)
				this.remoteDbService.getUsersById(params.id).subscribe(user => {
					this.profileImageId = user.user_model_media_id
					this.userAddressId = user.user_model_address_id
					this.userOldProfessions = user.user_model_professions
					this.userOldWorkingAreas = user.user_model_working_areas

					this.remoteDbService.getUserAddressById(params.id).subscribe(address => {
						this.remoteDbService.getColonyById(address.id_colony_code).subscribe(colony => {
							this.remoteDbService.getZipCodesById(address.id_zip_code).subscribe(zipCode => {
								this.zipCodeId = zipCode.id_zip_code
								this.remoteDbService.getMunicipalityById(address.id_municipality).subscribe(mun => {
									// Load specific colonies for this mun
									this.remoteDbService.getFilteredColonies(undefined, address.id_municipality).subscribe((col) => {
										this.allColonies = col;
										// Load skills
										this.remoteDbService.getSkills().subscribe((skills) => {
											this.allSkills = skills;
											this.loadInfo(user, address, colony, zipCode, mun);
											this.isLoaded = true;	
										})
									});
								})							
							})
						})
					}, () => {
						this.loadInfo(user);
						this.isLoaded = true;
					})
				})
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
		this.photoEvidences.push([]);
		this.isPhotoEvidencesLoading.push(false);
	}

	get oficios(): FormArray {
		return this.thirdFormNewProfesional.get('oficios') as FormArray;
	}

	save() {
		var profesional = concatJSON(this.firstFormNewProfesional.value, this.secondFormNewProfesional.value);
		var oficiosArray = this.thirdFormNewProfesional.value.oficios;
		for (var j = 0; j < oficiosArray.length; j++) {
			oficiosArray[j]['fotos'] = this.photoEvidences[j];
		}

		profesional = concatJSON(profesional, this.thirdFormNewProfesional.value);
		profesional = concatJSON(profesional, { fotoPerfil: this.profileImageId });
		
		//Pendiente de agregar a la lista para posterior guardado - 20-06-22
		console.log("ESTO ES DESCRIPCION GENERAL")
		console.log(this.thirdFormNewProfesional.value.general_description)
		

		
		// Build UserAddress from professional object
		// FIXME: Interior number defaulted as 0 (it's needed for the backend) 

		var newUserAddress:UserAddress = {
			id_user_address: this.userAddressId, 
			street_name: profesional.calle, 
			main_number: parseInt(profesional.numExterior), 
			interior_number: parseInt(profesional.numInterior) | 0, 
			id_colony_code: parseInt(profesional.colonia), 
			id_zip_code: this.zipCodeId, 
			id_state_code: 14, 
			id_municipality: parseInt(profesional.municipio), 
			id_country_code: 52, 
			date_added: (new Date()).toISOString(), 
			last_update_date: (new Date()).toISOString()
		}

		// console.log('[Before Post] New User Address Object', newUserAddress)
		this.remoteDbService.putUserAddress(newUserAddress, parseInt(this.userModelId)).subscribe(
			user_address => {
				// console.log('[After Post] New User Address Object', user_address)

				// FIXME: At this moment, all orgs are from JcE (BE)
				// FIXME: Build working areas (from array)

				var newUserModelProfessions = [];
				profesional.oficios.forEach(oficio => {
					var newOficioEvidence = [];
					oficio.fotos.forEach(foto => {
						newOficioEvidence.push({
							"evidence_id": 1, 
							"evidence_media": foto
						})
					})

					newUserModelProfessions.push({
						"profession_evidences": newOficioEvidence, 
						"profession_id": 1, 
						"profession_skill": parseInt(oficio.oficio_select)
					})
				})


				var newUserModelWorkingAreas = [];
				this.workingAreas.forEach(elementArea => {
					this.allMunicipalities.forEach(elementMun => {
						if(elementArea == elementMun.municipality_name){
							newUserModelWorkingAreas.push({
								"working_area_id": elementMun.id_state_code,
								"working_area_municipality": elementMun.id_municipality			
							});
						} 
					})
				})

				console.log(profesional)
				console.log("User Model Id: ", this.userModelId);

				var newUserModel:UserModel = {
					"user_model_address_id": newUserAddress.id_user_address,
					"user_model_birthday": profesional.fechaNacimiento.toISOString(),
					"user_model_creator_id": this.authService.getSession().user_auth_id,
					"user_model_first_name": profesional.nombres,
					"user_model_id": parseInt(this.userModelId),
					"user_model_last_name": profesional.apellidos,
					"user_model_media_id": this.profileImageId,
					"user_model_org": 1,
					"user_model_phone_number": profesional.numeroCelular,
					"user_model_professions": this.userOldProfessions,
					"user_model_registry_date": (new Date()).toISOString(),
					"user_model_surname": profesional.segundoNombre,
					"user_model_updated_date": (new Date()).toISOString(),
					"user_model_working_areas": this.userOldWorkingAreas,
					"user_model_description": profesional.general_description,
					"user_role_id": 5,
					"user_status_id": 1
				}	

				console.log('[Before Post] New User Model Object', newUserModel)
				console.log('Nuevo usuario agregado')
				
				this.remoteDbService.putUserData(newUserModel).subscribe(
					result => {
						this.router.navigate([ '/listado' ]);
					} 
				)
			}
		)
		

		// this.firebaseService
		// 	.post(profesional)
		// 	.then(() => {
		// 		this.router.navigate([ '/listado' ]);
		// 	})
		// 	.catch((e) => {
		// 		console.log('Firebase Error: ', e);
		// 	});
	}

	renderColonies(value) {
		this.remoteDbService.getFilteredColonies(undefined, value).subscribe((col) => {
			this.allColonies = col;
			this.secondFormNewProfesional.controls.codigoPostal.setValue('');
		});
	}

	renderZip(value) {
		this.allColonies.forEach((colony) => {
			if (colony.id_colony_code === parseInt(value)) {
				this.remoteDbService
					.getZipCodesById(colony.id_zip_code)
					.subscribe((zip) => {
						this.secondFormNewProfesional.controls.codigoPostal.setValue(zip.zip_code)
						this.zipCodeId = zip.id_zip_code
					})
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

			this.zipCodeId = zip_id
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

	@Input('cdkTextareaAutosize') enable: false;	

	//Declarations for "Working Areas" chips
	add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		// Add our fruit
		if (value) {
		  let addElement = true
		  this.workingAreas.forEach(actualWorkingArea => {
			if(actualWorkingArea == value) addElement = false;
		  });

		  if(addElement) this.workingAreas.push(value);
		}
	
		// Clear the input value
		
		if(event.input){
			event.input.value = '';    
		  }
		
		this.workingAreasCtrl.setValue(null);
	  }
	
	  remove(fruit: string): void {
		const index = this.workingAreas.indexOf(fruit);
	
		if (index >= 0) {
		  this.workingAreas.splice(index, 1);
		}
	  }
	
	  selectedChipListWorkingArea(event: MatAutocompleteSelectedEvent): void {
		this.workingAreas.push(event.option.viewValue);
		this.workingAreaInput.nativeElement.value = '';
		this.workingAreasCtrl.setValue(null);
	  }
	
	  //Fixme: Cuadratic algorithm (refactoring)
	  private _filter(value: string): string[] {
		this.allWorkingAreas = [];
		if(this.workingAreas.length != 0){		
			this.allMunicipalities.forEach(actualMunicipality => {
					let addElement = true;
					this.workingAreas.forEach(selectedMunicipality => {
						if(actualMunicipality.municipality_name == selectedMunicipality) addElement = false;
					})
					if(addElement) this.allWorkingAreas.push(actualMunicipality.municipality_name);
			})
		} 
		else {
			this.allMunicipalities.forEach(municipality => {
				this.allWorkingAreas.push(municipality.municipality_name)
			});
		}

		const filterValue = value.toLowerCase();
		return this.allWorkingAreas.filter(fruit => fruit.toLowerCase().includes(filterValue));
	  }
}
