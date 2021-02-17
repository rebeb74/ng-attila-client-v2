import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { fadeOutUpOnLeaveAnimation } from 'angular-animations';
import { Store } from '@ngrx/store';
import { Friend, User } from 'src/app/shared/model/user.model';
import { Observable } from 'rxjs';
import { Notification } from '../../shared/model/notification.model';
import { first, map, withLatestFrom } from 'rxjs/operators';
import { getCurrentLanguage } from '../../shared/store/ui.reducer';
import { NotificationEntityService } from '../../shared/services/notification-entity.service';
import * as moment from 'moment';
import { AppState } from '../store/app.reducer';
import { UserEntityService } from '../../shared/services/user-entity.service';
import { UIService } from '../../shared/services/ui.service';
import * as _ from 'lodash';
import { getCurrentUser } from '../auth/store/auth.reducer';
import { ChecklistService } from 'src/app/modules/checklist/services/checklist.service';
import { Checklist } from 'src/app/shared/model/checklist.model';


@Component({
  selector: 'app-sidenav-notifications',
  templateUrl: './sidenav-notifications.component.html',
  styleUrls: ['./sidenav-notifications.component.css'],
  animations: [
  ]
})

export class SidenavNotificationsComponent implements OnInit {
  @Output() sidenavNotificationsClose = new EventEmitter<void>()
  currentUserNotifications$: Observable<Notification[]>;
  selectedChecklist$: Observable<Checklist>

  constructor(
    private store: Store<AppState>,
    private notificationEntityService: NotificationEntityService,
    private userEntityService: UserEntityService,
    private uiService: UIService,
    private checklistService: ChecklistService
  ) { }

  ngOnInit(): void {
    this.selectedChecklist$ = this.checklistService.getSelectedChecklist();
    this.currentUserNotifications$ = this.notificationEntityService.entities$
      .pipe(
        withLatestFrom(this.store.select(getCurrentUser)),
        map(([notifications, currentUser]) => notifications.filter((notification) => notification.notificationUserId === currentUser._id))
      );

  }

  onClose() {
    this.sidenavNotificationsClose.emit();
  }


  onAcceptFriendRequest(notification) {
    this.userEntityService.entities$.pipe(first()).subscribe((users) => {
      const currentUser: User = users.find((user) => user._id === notification.notificationUserId);
      const newFriend: Friend[] = _.cloneDeep(currentUser.friend);
      newFriend.push({
        userId: notification.senderUserId,
        email: notification.senderEmail,
        username: notification.senderUsername
      });
      const newUser = {
        ...currentUser,
        friend: newFriend
      };
      this.userEntityService.update(newUser);
    });
    this.uiService.addNotification(notification.senderUserId, notification.notificationUserId, 'friend_request_accepted');
    this.deleteNotification(notification);
  }

  onDeclineFriendRequest(notification) {
    this.uiService.addNotification(notification.senderUserId, notification.notificationUserId, 'friend_request_declined');
    this.deleteNotification(notification);
  }

  deleteNotification(notification) {
    this.notificationEntityService.delete(notification);
    this.currentUserNotifications$.pipe(first()).subscribe((notifications) => {
      if (notifications.length === 0) {
        this.onClose();
      }
    });
  }

  getFormat(date) {
    this.store.select(getCurrentLanguage).pipe(first()).subscribe((lang) => {
      moment.locale(lang);
    });
    return moment(date).format('LL');
  }
}
