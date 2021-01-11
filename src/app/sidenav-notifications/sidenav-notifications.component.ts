import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { fadeOutUpOnLeaveAnimation } from 'angular-animations';
import { Store } from '@ngrx/store';
import { User } from 'src/app/shared/model/user.model';
import { DbService } from 'src/app/shared/services/db.service';
import * as fromRoot from '../app.reducer';
import { Observable } from 'rxjs';
import { Notification } from '../shared/model/notification.model';


@Component({
  selector: 'app-sidenav-notifications',
  templateUrl: './sidenav-notifications.component.html',
  styleUrls: ['./sidenav-notifications.component.css'],
  animations: [
    // trigger(
    //   'modalFadeZoom',
    //   [
    //     transition(
    //       ':enter', [
    //       style({ transform: 'translateY(100%)', opacity: 0 }),
    //       animate('500ms', style({ transform: 'translateY(0)', 'opacity': 1 }))
    //     ]
    //     ),
    //     transition(
    //       ':leave', [
    //       style({ transform: 'translateY(0%)', opacity: 0 }),
    //       animate('500ms', style({ transform: 'translateY(-100%)', 'opacity': 1 }))
    //     ]
    //     ),

    //   ])
    // bounceInUpOnEnterAnimation({ anchor: 'enter', duration: 1000, delay: 100, translate: '100%' }),
    fadeOutUpOnLeaveAnimation({ anchor: 'leave', duration: 1000, delay: 100, translate: '100%' })
  ]

})
export class SidenavNotificationsComponent implements OnInit {
  @Output() sidenavNotificationsClose = new EventEmitter<void>()
  currentUser: User;
  currentUserNotifications$: Observable<Notification[]>;

  constructor(
    private dbService: DbService,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.currentUserNotifications$ = this.store.select(fromRoot.getCurrentUserNotifications);
    this.store.select(fromRoot.getCurrentUser).subscribe((currentUser: User) => {
      this.currentUser = currentUser;
    })
  }

  onClose() {
    this.sidenavNotificationsClose.emit();
  }


  onAccept() {

  }

  onDecline(notificationId) {
    this.dbService.deleteNotificationById(this.currentUser._id, notificationId);

  }
}
