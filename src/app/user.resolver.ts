import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { filter, first, map, tap } from "rxjs/operators";
import { UserEntityService } from "./shared/services/user-entity.service";



@Injectable()
export class UserResolver implements Resolve<boolean> {

    constructor(private userDataService: UserEntityService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        const userId: string = JSON.parse(localStorage.getItem('user'))
        if (!!userId) {
            return this.userDataService.loaded$
                .pipe(
                    tap(loaded => {
                        if (!loaded) {
                            this.userDataService.getAll();
                        }
                    }),
                    filter(loaded => !!loaded),
                    first()
                );
        } else {
            return of(null);
        }
    }

}