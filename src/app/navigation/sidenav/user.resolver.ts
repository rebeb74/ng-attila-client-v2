import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { filter, first, map, tap } from "rxjs/operators";
import { UserEntityService } from "../../shared/services/user-entity.service";



@Injectable()
export class UserResolver implements Resolve<boolean> {

    constructor(private userDataService: UserEntityService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const user: string = JSON.parse(localStorage.getItem('user'))
        return this.userDataService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                        this.userDataService.getByKey(user['_id']);
                    }
                }),
                filter(loaded => !!loaded),
                first()
            );
    }

}