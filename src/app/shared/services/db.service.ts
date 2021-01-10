import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user.model';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import * as UI from '../store/ui.actions';
import { take } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private db: AngularFirestore,
    private store: Store<fromRoot.State>
  ) { }

  createUser(userData: User) {
    console.log('PASS CreateUser', userData);
    this.db.collection('user').doc(userData._id).set(userData).then((result) => console.log('result createUser', result)).catch((error) => console.log('error createUser', error));
  }

  getAndStoreUserById(userId) {
    this.db.doc('user/' + userId)
    .valueChanges()
    .subscribe((user: any) => {
      console.log({...user});
      if(user) {
        this.store.dispatch(new UI.SetCurrentLanguage(user.lang));
        this.store.dispatch(new UI.SetCurrentUser(user as User));
      } else {
        console.log('User not found');
      }
    })
  }

  getAndStoreUserNotificationsByUserId(userId) {
    this.store.select(fromRoot.getCurrentLanguage).subscribe(lang => {
      console.log('pass getAndStoreUserNotificationsByUserId')
      this.db.doc('user/' + userId)
      .collection('notification')
      .valueChanges()
      .subscribe((notifications: any) => {
        moment.locale(lang)
        notifications.forEach(notification => {
          notification.createdOn = moment(notification.createdOn.seconds, 'X').format('LL');
        });
        console.log('Notifications : ', {...notifications});
        this.store.dispatch(new UI.SetCurrentUserNotifications(notifications));
      })
    })
  }

  updateUserById(id: string, userData: User): Promise<void> {
    return this.db.collection('user').doc(id).update(userData);
  }
  
  addNotification(targetEmail: string, message: string) {
    console.log('PASSSS')
    this.store.select(fromRoot.getCurrentUser).pipe(take(1)).subscribe((currentUser: User) => {
      this.db.collection('user', ref => ref.where('email', '==', targetEmail))
      .valueChanges()
      .pipe(take(1))
      .subscribe((targetUser: any) => {
        this.db.collection('user').doc(targetUser[0].userId).collection('notification').add({
          message: message,
          read: false,
          senderUsername: currentUser.username,
          senderEmail: currentUser.email,
          createdOn: new Date()
        })
        .then(newNotification => {
          this.updateUserNotificationById(targetUser[0].userId, newNotification.id, { notificationId: newNotification.id });
        })
      })
    })
  }
  
  updateUserNotificationById(userId: string, notificationId: string, notificationData: any) {
    this.db.collection('user').doc(userId).collection('notification').doc(notificationId).update(notificationData);
  }

  deleteNotificationById(userId: string, notificationId: string) {
    this.db.collection('user').doc(userId).collection('notification').doc(notificationId).delete();
  }

}
