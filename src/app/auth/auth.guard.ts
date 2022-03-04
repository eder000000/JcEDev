import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private authService: AuthService, private router: Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        // FIXME: Prevent login after already logged in
        if (route.url[0].path === 'login') {
            console.log("Going to login")
            if (this.authService.isAuth()) {
                console.log("Already logged in")
                this.router.navigate(['/home']);
            } else {
                return true;
            }
        } else if (this.authService.isAuth()) {
            return true;
        } else {
            console.log("Permission error")
            this.router.navigate(['/login']);
        }
    }
}