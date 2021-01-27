import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UIService } from '../shared/services/ui.service';
import { Store } from '@ngrx/store';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Friend, User } from '../shared/model/user.model';
import { Notification } from '../shared/model/notification.model';
import { AuthService } from '../auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AskPasswordComponent } from './ask-password.component'
import { first, map, mergeMap, take, withLatestFrom } from 'rxjs/operators';
import { UserEntityService } from '../shared/store/user-entity.service';
import { getCurrentLanguage, getIsLoading, getLanguages } from '../shared/store/ui.reducer';
import { AppState } from '../app.reducer';
import { NotificationEntityService } from '../shared/store/notification-entity.service';
import { AskNewFriendComponent } from './ask-new-friend.component';
import * as _ from 'lodash';
import { getCurrentUser } from '../auth/auth.reducer';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  languages$: Observable<string[]>;
  currentLang$: Observable<string>;
  isLoading$: Observable<boolean>;
  accountForm: FormGroup;
  maxDate = new Date();
  minDate = new Date();
  showConfirmMessage = false;
  currentUser$: Observable<User>;
  currentUserFriends$: Observable<Friend[]>;
  friendRequestsReceived$: Observable<Notification[]>;
  friendRequestsSent$: Observable<Notification[]>;
  availableNewFriends$: Observable<User[]>;
  currentUserSub: Subscription;


  constructor(
    private uiService: UIService,
    private store: Store<AppState>,
    private dateAdapter: DateAdapter<any>,
    private authService: AuthService,
    private dialog: MatDialog,
    private userDataService: UserEntityService,
    private notificationDataService: NotificationEntityService
  ) { }

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUser);
    this.isLoading$ = this.store.select(getIsLoading);
    this.setAccountForm();
    this.setLanguages();
    this.setCurrentUserFriends();
    this.setFriendRequestsSent();
    this.setFriendRequestsReceived();
    this.setAvailableNewFriends();
  }

  setLanguages() {
    this.languages$ = this.store.select(getLanguages);
    this.currentLang$ = this.store.select(getCurrentLanguage);
    this.currentLang$.subscribe(lang => this.datePickerLocale(lang));
  }

  setCurrentUserFriends() {
    this.currentUserFriends$ = this.currentUser$
      .pipe(
        map(currentUser => currentUser.friend)
      );
  }

  setFriendRequestsReceived() {
    this.friendRequestsReceived$ = this.notificationDataService.entities$
      .pipe(
        withLatestFrom(this.currentUser$),
        map(([notifications, currentUser]: [Notification[], User]) => notifications.filter((notification: Notification) => notification.code === 'friend_request' && notification.notificationUserId === currentUser._id))
      )
  }

  setFriendRequestsSent() {
    this.friendRequestsSent$ = this.notificationDataService.entities$
      .pipe(
        withLatestFrom(this.currentUser$),
        map(([notifications, currentUser]: [Notification[], User]) => notifications.filter((notification: Notification) => notification.code === 'friend_request' && notification.senderUserId === currentUser._id))
      )
  }

  setAccountForm() {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 10);
    this.minDate.setFullYear(this.minDate.getFullYear() - 99);

    this.currentUserSub = this.currentUser$.subscribe((user: User) => {
      this.accountForm = new FormGroup({
        email: new FormControl(user.email, {
          validators: [Validators.required, Validators.email]
        }),
        username: new FormControl(user.username, {
          validators: [Validators.required, Validators.pattern('.{4,}')]
        }),
        birthdate: new FormControl(user.birthdate, {
          validators: [Validators.required]
        }),
      });
    });
  }

  setAvailableNewFriends() {
    this.availableNewFriends$ = this.userDataService.entities$
      .pipe(
        withLatestFrom(this.friendRequestsSent$, this.currentUser$),
        map(([users, friendRequestSent, currentUser]: [User[], Notification[], User]) => {
          users = users.filter(users => users._id !== currentUser._id),
            users = users.filter(users => !currentUser.friend.find(friend => friend.username === users.username))
          users = users.filter(user => !friendRequestSent.find(friendRequestSent => friendRequestSent.notificationUserId === user._id));
          return users;
        })
      );
  }

  switchLang(newLang) {
    this.uiService.switchLang(newLang);
  }

  datePickerLocale(lang: string) {
    this.dateAdapter.setLocale(lang + '-' + lang.toUpperCase());
  }

  onUpdateAccount() {
    const askPassword = this.dialog.open(AskPasswordComponent, {
    });
    askPassword.afterClosed().subscribe(password => {
      if (password) {
        this.currentUser$.pipe(first()).subscribe((user: User) => {
          this.authService
            .login({ username: user.username, password })
            .pipe(take(1))
            .subscribe(
              (success) => {
                if (!!success) {
                  const updatedUser: User = {
                    ...user,
                    ...this.accountForm.value
                  }
                  this.userDataService.update(updatedUser).subscribe(
                    () => {
                      this.uiService.showSnackbar('account_update_success', null, 5000, 'success');
                    },
                    (error) => {
                      this.uiService.showSnackbar(error.error.error.code, null, 5000, 'error');
                    }
                  );
                }
              },
              (error) => {
                this.uiService.showSnackbar(error, null, 5000, 'error');
              }
            );
        });
      }
    });
  }

  sendPasswordResetRequest() {
    this.currentUser$.pipe(
      mergeMap(currentUser => this.authService.sendPasswordResetRequest(currentUser.email)),
      first()
    )
      .subscribe((result) => {
        console.log('result', result)
            if (result) {
              this.showConfirmMessage = true;
            }
      }
      )
  };

  addFriend() {
    const askNewFriendUser = this.dialog.open(AskNewFriendComponent, {
      data: {
        availableNewFriends$: this.availableNewFriends$
      }
    });
    askNewFriendUser.afterClosed().subscribe(newFriendUsername => {
      if (newFriendUsername) {
        this.userDataService.entities$
        .pipe(
          withLatestFrom(this.availableNewFriends$, this.currentUser$),
          map(([users, availableNewFriends, currentUser]) => {
            if (!users.find(user => user.username === newFriendUsername)) {
              this.uiService.showSnackbar('user_not_found', null, 5000, 'error');
            } else if (!availableNewFriends.find(user => user.username === newFriendUsername)) {
              this.uiService.showSnackbar('user_already_friend', null, 5000, 'error');
            } else {
              if (newFriendUsername === currentUser.username) {
                return;
              }
              const newFriendUser: User = users.find(user => user.username === newFriendUsername);
              this.uiService.addNotification(newFriendUser._id, currentUser._id, 'friend_request');
            }
          }),
          first()
          )
        .subscribe();
      }
    });
  }

  removeFriend(id) {
    this.currentUser$.pipe(take(1)).subscribe(
      (user: User) => {
        let updatedUser: User = JSON.parse(JSON.stringify(user));
        const friend: Friend = user.friend.find(friend => friend.userId === id);
        this.uiService.addNotification(friend.userId, user._id, 'removed_from_friends');
        updatedUser.friend = updatedUser.friend.filter((friend: Friend) => friend.userId !== id)
        this.userDataService.update(updatedUser);
      }
    )
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
      this.userDataService.update(newUser);
    });
    this.uiService.addNotification(notification.senderUserId, notification.notificationUserId, 'friend_request_accepted');
    this.notificationDataService.delete(notification);
  }

  onDeclineFriendRequest(notification) {
    this.uiService.addNotification(notification.senderUserId, notification.notificationUserId, 'friend_request_declined');
    this.deleteNotification(notification)
  }


  deleteNotification(notification) {
    this.notificationDataService.delete(notification);
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }

}
