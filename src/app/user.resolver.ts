import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { filter, first, map, tap } from "rxjs/operators";
import { UserEntityService } from "./shared/services/user-entity.service";



@Injectable()
export class UserResolver implements Resolve<boolean> {

    constructor(private userDataService: UserEntityService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        
        
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
    }

}