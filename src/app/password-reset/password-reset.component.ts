import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { PatternValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { RemoteDbService } from 'src/app/remote-db/remote-db.service';
import { PasswordMatch } from './passwordMatch';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  passwordValidator : PatternValidator;
  newPasswordGroup: FormGroup;
  
  constructor(
    private remoteDbService: RemoteDbService,
    private router: Router
  ) {}

/*
  Politica:
    La contraseña debe tener al entre 8 y 16 caracteres, 
    al menos un dígito, al menos una minúscula, 
    al menos una mayúscula y al menos un caracter no alfanumérico.  
*/ 

  ngOnInit(): void {
    this.newPasswordGroup = new FormGroup({
      newPassword: new FormControl('', {
        validators: [Validators.required]
      }), 
      confirmNewPassword: new FormControl('', {
        validators: [Validators.required]
      }) 
    }, { 
      validators: PasswordMatch('newPassword', 'confirmNewPassword')
    })
  }
  
  get f(){
    return this.newPasswordGroup.controls;
  }

  onSubmit() {
    this.remoteDbService.resetPassword(this.newPasswordGroup.value.newPassword).subscribe(() => {
      this.router.navigate(['/login'])
    });
  }

}
