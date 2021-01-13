import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable()
export class AuthGuard implements CanActivate {


    constructor(private router: Router) {
    }

    canActivate() {
        const user: string = JSON.parse(localStorage.getItem('user'))
        if(!!user){
            return true;
        } else {
            this.router.navigateByUrl('/');
            return false;
        }
    }

}
