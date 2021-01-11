import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user.model';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import * as UI from '../store/ui.actions';
import { map, take } from 'rxjs/operators';
import * as moment from 'moment';
import { UserEntityService } from './user-entity.service';
import { UiActions } from '../store/action-types';
import { selectCurrentLanguage } from '../store/ui.reducer';
import { NotificationEntityService } from './notification-entity.service';
import { AppState } from '../../app.reducer';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private db: AngularFirestore,
    private store: Store<AppState>,
    private userDataService: UserEntityService,
    private notificationDataService: NotificationEntityService
  ) { }

  createUser(userData: User) {
    console.log('PASS CreateUser', userData);
    this.db.collection('user').doc(userData._id).set(userData).then((result) => console.log('result createUser', result)).catch((error) => console.log('error createUser', error));
  }

  getAndStoreUserById(userId) {
    this.db.doc('user/' + userId)
      .valueChanges()
      .subscribe((user: any) => {
        console.log({ ...user });
        if (user) {
          this.store.dispatch(UiActions.setCurrentLanguage({ currentLanguage: user.lang }));
        } else {
          console.log('User not found');
        }
      })
  }

  getAndStoreUserNotificationsByUserId(userId) {
    this.store.select(selectCurrentLanguage).subscribe(lang => {
      console.log('pass getAndStoreUserNotificationsByUserId')
      this.db.doc('user/' + userId)
        .collection('notification')
        .valueChanges()
        .subscribe((notifications: any) => {
          moment.locale(lang)
          notifications.forEach(notification => {
            notification.createdOn = moment(notification.createdOn.seconds, 'X').format('LL');
          });
          console.log('Notifications : ', { ...notifications });
          this.store.dispatch(UiActions.setNotifications({ notifications }));
        })
    })
  }

  updateUserById(id: string, userData: User): Promise<void> {
    return this.db.collection('user').doc(id).update(userData);
  }

  addNotification(targetUsername: string, code: string) {
    this.userDataService.getByKey( 'username/' + targetUsername ).subscribe((targetUser: User) => {
      this.userDataService.entities$.pipe(take(1), map(users => users[0])).subscribe((currentUser: User) => {
        this.notificationDataService.add({
          notificationUserId: targetUser._id,
          code: code,
          read: false,
          senderUserId: currentUser._id,
          senderUsername: currentUser.username,
          senderEmail: currentUser.email,
          createdOn: (new Date()).toISOString()
        });
      });
    });
  }

}
