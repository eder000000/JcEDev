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
      username: new FormControl('', {
        validators: [Validators.required]
      }),
      password: new FormControl('', {
        validators: [Validators.required]
      }),
    });
  }

  onSubmit(){
    this.remoteDbService.login(
      this.loginForm.value.username, 
      this.loginForm.value.password
    ).subscribe(session => {
      this.authService.login({
        token: session.token, 
        user_model_id: session.user_model_id, 
        user_auth_id: session.user_auth_id
      })
    }, error => {
      alert("Username or password error");
    })
  }
}
