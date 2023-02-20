import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { PatternValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { RemoteDbService } from 'src/app/remote-db/remote-db.service';
import { PasswordMatch } from 'src/utils/passwordMatch';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  passwordValidator: PatternValidator;
  signupGroup: FormGroup;

  constructor(
    private remoteDbService: RemoteDbService,
    private authService: AuthService,
    private router: Router
  ) { }

  /*
    Politica:
      La contraseña debe tener al entre 8 y 16 caracteres, 
      al menos un dígito, al menos una minúscula, 
      al menos una mayúscula y al menos un caracter no alfanumérico.  
  */

  ngOnInit(): void {
    this.signupGroup = new FormGroup({
      username: new FormControl('', {
        validators: [Validators.required]
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        validators: [Validators.required]
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required]
      })
    }, {
      validators: PasswordMatch('password', 'confirmPassword')
    })
  }

  get f() {
    return this.signupGroup.controls;
  }

  onSubmit() {
    if (this.signupGroup.valid) {
      this.remoteDbService.signup(
        this.signupGroup.value.username,
        this.signupGroup.value.email,
        this.signupGroup.value.password
        ).subscribe(() => {
          alert("Registro completado. Espere verificación.");
          this.router.navigate(['/']);
    },
      () => alert("Es posible que la dirección de correo ya esté en uso."));  
    } else alert("Formulario no enviado. Hay campos con errores.");
  }

}
