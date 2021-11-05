import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { ProfesionalService } from 'src/app/user/profesional.service';


@Component({
  selector: 'app-register-pro',
  templateUrl: './register-pro.component.html',
  styleUrls: ['./register-pro.component.css']
})
export class RegisterProComponent implements OnInit {
  formNewProfesional : FormGroup;
  maxDate;


  constructor(private profesionalService: ProfesionalService) { }

    

  ngOnInit(){
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 15);

    this.formNewProfesional = new FormGroup({
      
      nombres: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(30)]
      }),

      apellidoPaterno: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(30)]
      }),

      apellidoMaterno: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(30)]
      }),

      fechaNacimiento: new FormControl('', {
        validators: [Validators.required]
      }),

      numeroCelular: new FormControl('', {
        validators: [Validators.required, 
                      Validators.maxLength(12),  
                      Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
      }),

      fotoPerfil: new FormControl(''
      ),

      calle: new FormControl('', {
        validators: [Validators.required]
      }),

      numExterior: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(6)]
      }),
      
      numInterior: new FormControl('', {
        validators: [Validators.maxLength(6)]
      }),

      colonia: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(30)]
      }),

      municipio: new FormControl('', {
        validators: [Validators.required]
      }),


      oficio: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(20)]
      }),

      descripcionOficio: new FormControl('', {
        validators: []
      }),

      ubicacionTrabajo: new FormControl('', {
        validators: [Validators.required]
      })
     });
  }
 

  onSubmit() {
    console.log(this.formNewProfesional.value);
    this.profesionalService.insert(this.formNewProfesional.value);
  }


}
