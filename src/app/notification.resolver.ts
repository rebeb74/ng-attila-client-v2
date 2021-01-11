import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { filter, first, tap } from "rxjs/operators";
import { NotificationEntityService } from "./shared/services/notification-entity.service";



@Injectable()
export class NotificationResolver implements Resolve<boolean> {

    constructor(private notificationDataService: NotificationEntityService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        
        const userId: string = JSON.parse(localStorage.getItem('user'))
        if (!!userId) {
        return this.notificationDataService.loaded$
            .pipe(
                tap(loaded => {
                    if (!loaded) {
                        this.notificationDataService.getAll();
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