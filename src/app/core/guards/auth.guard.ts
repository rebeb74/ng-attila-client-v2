import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable()
export class AuthGuard implements CanActivate {


    constructor(
        private router: Router,
        ) {
    }

    canActivate() {
        const isUser = localStorage.getItem('user');
        if(!!isUser){
            return true;
        } else {
            this.router.navigateByUrl('/');
            return false;
        }
    }

}
