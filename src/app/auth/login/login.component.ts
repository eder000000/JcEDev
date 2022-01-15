import { Component, OnInit} from '@angular/core';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { RemoteDbService } from 'src/app/remote-db/remote-db.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm : FormGroup;
  
  constructor(
    private authService: AuthService,
    private remoteDbService: RemoteDbService  
  ){}

  ngOnInit(){
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required]
      }),
      password: new FormControl('', {
        validators: [Validators.required]
      }),
    });
  }

  onSubmit(){
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });

    this.remoteDbService.login(
      this.loginForm.value.email, 
      this.loginForm.value.password
    ).subscribe(token => {
      console.log(token)
      this.remoteDbService.setToken(token.token)
    })
  }
}
