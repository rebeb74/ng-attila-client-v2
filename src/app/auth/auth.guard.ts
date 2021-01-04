import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Route } from '@angular/router';
import * as fromRoot from '../app.reducer';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';


@Injectable()
export class AuthGuard implements CanActivate {


    constructor(private store: Store<fromRoot.State>) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select(fromRoot.getIsAuth).pipe(take(1));
    }

}
