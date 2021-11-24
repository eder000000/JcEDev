import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

let emailRegex = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';

@Component({
	selector: 'app-add-oficio',
	templateUrl: './add-oficio.component.html',
	styleUrls: [ './add-oficio.component.css' ]
})
export class AddOficioComponent implements OnInit {
	public usersForm: FormGroup;

	constructor(private fb: FormBuilder) {}

	ngOnInit() {
		this.usersForm = this.fb.group({
			date: this.fb.control(new Date()),
			users: this.fb.array([
				this.fb.group({
					firstName: [ 'user 1', Validators.required ],
					lastName: [ '', Validators.required ],
					email: [ '', Validators.pattern(emailRegex) ]
				}),
				this.fb.group({
					firstName: [ 'user 2', Validators.required ],
					lastName: [ '', Validators.required ],
					email: [ '', Validators.pattern(emailRegex) ]
				})
			])
		});
	}

	removeFormControl(i) {
		let usersArray = this.usersForm.controls.users as FormArray;
		usersArray.removeAt(i);
	}

	addFormControl() {
		let usersArray = this.usersForm.controls.users as FormArray;
		let arraylen = usersArray.length;

		let newUsergroup: FormGroup = this.fb.group({
			firstName: [ '', Validators.required ],
			lastName: [ '', Validators.required ],
			email: [ '', Validators.pattern(emailRegex) ]
		});

		usersArray.insert(arraylen, newUsergroup);
	}

	get users() {
		return this.usersForm.get('users') as FormArray;
	}

	onSubmit() {
		console.log(this.usersForm.value);
		this.usersForm.reset();
	}
}
