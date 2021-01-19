import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { fadeOutUpOnLeaveAnimation } from 'angular-animations';
import { Store } from '@ngrx/store';
import { Friend, User } from 'src/app/shared/model/user.model';
import { Observable } from 'rxjs';
import { Notification } from '../shared/model/notification.model';
import { first, map, take, tap } from 'rxjs/operators';
import { selectCurrentLanguage } from '../shared/store/ui.reducer';
import { NotificationEntityService } from '../shared/services/notification-entity.service';
import * as moment from 'moment';
import { AppState } from '../app.reducer';
import { UserEntityService } from '../shared/services/user-entity.service';
import { UIService } from '../shared/services/ui.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-sidenav-notifications',
  templateUrl: './sidenav-notifications.component.html',
  styleUrls: ['./sidenav-notifications.component.css'],
  animations: [
    fadeOutUpOnLeaveAnimation({ anchor: 'leave', duration: 500, delay: 100, translate: '100%' })
  ]
})

export class SidenavNotificationsComponent implements OnInit {
  @Output() sidenavNotificationsClose = new EventEmitter<void>()
  currentUserNotifications$: Observable<Notification[]>;
  userId: string = JSON.parse(localStorage.getItem('user'))

  constructor(
    private store: Store<AppState>,
    private notificationDataService: NotificationEntityService,
    private userDataService: UserEntityService,
    private uiService: UIService
  ) { }

  ngOnInit(): void {
    this.currentUserNotifications$ = this.notificationDataService.entities$
      .pipe(
        map(notifications => notifications.filter(notification => notification.notificationUserId === this.userId))
      );

  }

  onClose() {
    this.sidenavNotificationsClose.emit();
  }


  onAcceptFriendRequest(notification) {
    this.userDataService.entities$.pipe(take(1)).subscribe(users => {
      const currentUser: User = users.find(user => user._id === notification.notificationUserId)
      const newFriend: Friend[] = _.cloneDeep(currentUser.friend);
        newFriend.push({
          userId: notification.senderUserId,
          email: notification.senderEmail,
          username: notification.senderUsername
        });
      const newUser = {
        ...currentUser,
        friend: newFriend
      }
      this.userDataService.update(newUser)
    });
    this.uiService.addNotification(notification.senderUserId, notification.notificationUserId, 'friend_request_accepted');
    this.notificationDataService.delete(notification);
  }

  onDeclineFriendRequest(notification){
    this.uiService.addNotification(notification.senderUserId, notification.notificationUserId, 'friend_request_declined');
    this.deleteNotification(notification)
  }
  
  deleteNotification(notification) {
    this.notificationDataService.delete(notification);
  }

  getFormat(date) {
    this.store.select(selectCurrentLanguage).pipe(first()).subscribe(lang => {
      moment.locale(lang)
    })
    return moment(date).format('LL')
  }
}
