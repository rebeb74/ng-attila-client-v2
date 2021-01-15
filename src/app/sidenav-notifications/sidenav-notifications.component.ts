import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { fadeOutUpOnLeaveAnimation } from 'angular-animations';
import { Store } from '@ngrx/store';
import { User } from 'src/app/shared/model/user.model';
import { Observable } from 'rxjs';
import { Notification } from '../shared/model/notification.model';
import { first, map, take, tap } from 'rxjs/operators';
import { selectCurrentLanguage } from '../shared/store/ui.reducer';
import { NotificationEntityService } from '../shared/services/notification-entity.service';
import * as moment from 'moment';
import { AppState } from '../app.reducer';
import { UserEntityService } from '../shared/services/user-entity.service';


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

  constructor(
    private store: Store<AppState>,
    private notificationDataService: NotificationEntityService,
    private userDataService: UserEntityService
  ) { }

  ngOnInit(): void {
    this.currentUserNotifications$ = this.notificationDataService.entities$;

  }

  onClose() {
    this.sidenavNotificationsClose.emit();
  }


  onAccept(notification) {
    console.log(notification)
    this.userDataService.entities$
      .pipe(take(1))
      .subscribe(
        users => {
          const currentUser: User = users.find(users => users._id === notification.notificationUserId);
          const senderUser: User = users.find(users => users._id === notification.senderUserId);
          var newShare = JSON.parse(JSON.stringify(currentUser.share));
          newShare.push({
            userId: senderUser._id,
            email: senderUser.email,
            username: senderUser.username
          });
          const user: User = {
            ...currentUser,
            share: newShare
          }
          this.userDataService.update(user);
          this.notificationDataService.delete(notification)
      }

      );
  }

  onDecline(notification) {
    this.notificationDataService.delete(notification)

  }

  getFormat(date) {
    this.store.select(selectCurrentLanguage).pipe(first()).subscribe(lang => {
      moment.locale(lang)
    })
    return moment(date).format('LL')
  }
}
