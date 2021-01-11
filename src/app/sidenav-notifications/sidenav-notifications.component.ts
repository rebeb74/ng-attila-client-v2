import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { fadeOutUpOnLeaveAnimation } from 'angular-animations';
import { Store } from '@ngrx/store';
import { User } from 'src/app/shared/model/user.model';
import { DbService } from 'src/app/shared/services/db.service';
import * as fromRoot from '../app.reducer';
import { Observable } from 'rxjs';
import { Notification } from '../shared/model/notification.model';
import { first } from 'rxjs/operators';
import { selectCurrentLanguage } from '../shared/store/ui.reducer';
import { NotificationEntityService } from '../shared/services/notification-entity.service';
import * as moment from 'moment';
import { AppState } from '../app.reducer';


@Component({
  selector: 'app-sidenav-notifications',
  templateUrl: './sidenav-notifications.component.html',
  styleUrls: ['./sidenav-notifications.component.css'],
  animations: [
    fadeOutUpOnLeaveAnimation({ anchor: 'leave', duration: 1000, delay: 100, translate: '100%' })
  ]
})

export class SidenavNotificationsComponent implements OnInit {
  @Output() sidenavNotificationsClose = new EventEmitter<void>()
  currentUser: User;
  currentUserNotifications$: Observable<Notification[]>;

  constructor(
    private store: Store<AppState>,
    private notificationDataService: NotificationEntityService
  ) { }

  ngOnInit(): void {
    this.currentUserNotifications$ = this.notificationDataService.entities$;

  }

  onClose() {
    this.sidenavNotificationsClose.emit();
  }


  onAccept() {

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
