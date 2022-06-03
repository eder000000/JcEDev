import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { RemoteDbService } from 'src/app/remote-db/remote-db.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit {
  emailRecoveryForm : FormGroup;
  emailMessage : string = "Ingrese un correo válido.";
  submitted : boolean = false;
  
  constructor(
    private remoteDbService: RemoteDbService  
  ) {}

  ngOnInit(){
    this.emailRecoveryForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required]
      })

    });
  }
  
  onSubmit(){
    this.submitted = true;
    this.remoteDbService.getFilteredEmails(this.emailRecoveryForm.value.email).subscribe(emails => {
      if (emails.length > 0) this.emailMessage = "Se envió la liga de restablecimiento de contraseña a su correo."
      else this.emailMessage = "El correo ingresado no se encuentra en los correos registrados."
    });   
  }
}
