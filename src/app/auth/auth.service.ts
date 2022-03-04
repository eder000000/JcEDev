import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { RemoteDbService } from '../remote-db/remote-db.service';

interface Session {
    token:string, 
    user_auth_id:number,
    user_model_id:number
}

@Injectable()
export class AuthService{
    authChange = new Subject<boolean>();

    private session:Session = null;

    constructor(
        private router: Router, 
        private remoteDbService: RemoteDbService){}

    // TODO: SignUp Functions
    // registerUser(authData: AuthData){
    //     this.user = {
    //         email: authData.email,
    //         userId: Math.round(Math.random() * 10000).toString()
    //     };
    //     this.authSuccesfully();
    // }

    login(session:Session){
        this.session = session;
        this.remoteDbService.setToken(session.token);
        this.authSuccesfully();
    }

    logout(){
        this.session = null;
        this.authChange.next(false);
        this.router.navigate(['/login']);
    }

    getSession(){
        return { ...this.session};
    }

    getToken(){
        return this.session.token;
    }

    getUserModelObservable(){
        return this.remoteDbService.getUsersById(this.session.user_model_id);
    }

    isAuth(){
        return this.session != null;
    }

    private authSuccesfully(){
        this.authChange.next(true);
        this.router.navigate(['/home']);
    }
}
