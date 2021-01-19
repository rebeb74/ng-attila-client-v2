import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from "@ngrx/data";
import { Observable } from "rxjs";
import { Notification } from '../model/notification.model';
import { environment } from '../../../environments/environment'
import { filter, map, take, tap, withLatestFrom } from "rxjs/operators";
import { UserEntityService } from "./user-entity.service";
import { Friend, User } from "../model/user.model";
import * as _ from 'lodash';

@Injectable()
export class NotificationDataService extends DefaultDataService<Notification>{
    userId: string = JSON.parse(localStorage.getItem('user'));
    constructor(
        http: HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        config: DefaultDataServiceConfig,
        private userDataService: UserEntityService
    ) {
        super('Notification', http, httpUrlGenerator, config);
    }

    getAll(): Observable<Notification[]> {
        return super.getAll()
            // .pipe(
            //     tap(notifications => {
            //         const friendRequestsAccepted = notifications.filter(notification => notification.code === 'friend_request_accepted' && notification.notificationUserId === this.userId);
            //         console.log('friendRequestsAccepted', friendRequestsAccepted)
            //         if (friendRequestsAccepted.length > 0) {
            //             this.userDataService.entities$.pipe(take(1)).subscribe(users => {
            //                 const currentUser: User = users.find(user => user._id === this.userId)
            //                 const newFriend: Friend[] = _.cloneDeep(currentUser.friend);
            //                 friendRequestsAccepted.forEach(request => {
            //                     newFriend.push({
            //                         userId: request.senderUserId,
            //                         email: request.senderEmail,
            //                         username: request.senderUsername
            //                     });
            //                 });
            //                 const newUser = {
            //                     ...currentUser,
            //                     friend: newFriend
            //                 }
            //                 this.userDataService.update(newUser)
            //             });
            //         }
            //     })
            // )
    }

}