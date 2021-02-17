import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, first, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { NotificationEntityService } from '../../../shared/services/notification-entity.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { getCurrentUser } from '../../../core/auth/store/auth.reducer';
import { AppState } from '../../../core/store/app.reducer';
import { Friend, User } from '../../../shared/model/user.model';
import { UIService } from '../../../shared/services/ui.service';
import { UserEntityService } from '../../../shared/services/user-entity.service';
import { AskPasswordComponent } from '../account-card/ask-password/ask-password.component';
import { AskNewFriendComponent } from '../friend-card/ask-new-friend/ask-new-friend.component';
import { Notification } from '../../../shared/model/notification.model';
import * as _ from 'lodash';

@Injectable()
export class SettingsService {
  currentUser$: Observable<User>;
  availableNewFriends$: Observable<User[]>;
  currentUserFriends$: Observable<Friend[]>;
  friendRequestsReceived$: Observable<Notification[]>;
  friendRequestsSent$: Observable<Notification[]>;

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private authService: AuthService,
    private userEntityService: UserEntityService,
    private uiService: UIService,
    private notificationEntityService: NotificationEntityService,
  ) {
    this.setCurrentUser();
    this.setCurrentUserFriends();
    this.setFriendRequestsSent();
    this.setFriendRequestsReceived();
    this.setAvailableNewFriends();
  }

  setCurrentUser(): void {
    this.currentUser$ = this.store.select(getCurrentUser);
  }

  setCurrentUserFriends(): void {
    this.currentUserFriends$ = this.currentUser$
      .pipe(
        map((currentUser) => currentUser.friend),
      );
  }

  setFriendRequestsReceived(): void {
    this.friendRequestsReceived$ = this.notificationEntityService.entities$
      .pipe(
        withLatestFrom(this.currentUser$),
        map(([notifications, currentUser]: [Notification[], User]) => notifications.filter((notification: Notification) => notification.code === 'friend_request' && notification.notificationUserId === currentUser._id))
      );
  }

  setFriendRequestsSent(): void {
    this.friendRequestsSent$ = this.notificationEntityService.entities$
      .pipe(
        withLatestFrom(this.currentUser$),
        map(([notifications, currentUser]: [Notification[], User]) => notifications.filter((notification: Notification) => notification.code === 'friend_request' && notification.senderUserId === currentUser._id))
      );
  }

  setAvailableNewFriends(): void {
    this.availableNewFriends$ = this.userEntityService.entities$
      .pipe(
        withLatestFrom(this.friendRequestsSent$, this.currentUser$),
        map(([users, friendRequestSent, currentUser]: [User[], Notification[], User]) => {
          users = users.filter((users) => users._id !== currentUser._id);
          users = users.filter((users) => !currentUser.friend.find((friend) => friend.username === users.username));
          users = users.filter((users) => !friendRequestSent.find((friendRequestSent) => friendRequestSent.notificationUserId === users._id));
          return users;
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.currentUser$;
  }

  getCurrentUserFriends(): Observable<Friend[]> {
    return this.currentUserFriends$;
  }

  getFriendRequestsReceived(): Observable<Notification[]> {
    return this.friendRequestsReceived$;
  }

  getFriendRequestsSent(): Observable<Notification[]> {
    return this.friendRequestsSent$;
  }

  getAvailableNewFriends(): Observable<User[]> {
    return this.availableNewFriends$;
  }

  onAcceptFriendRequest(notification): Observable<boolean> {
    return this.userEntityService.entities$
      .pipe(
        map((users) => {
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
          this.uiService.addNotification(notification.senderUserId, notification.notificationUserId, 'friend_request_accepted');
          this.notificationEntityService.delete(notification);
          return true;
        }),
        first()
      );
  }

  onDeclineFriendRequest(notification): void {
    this.uiService.addNotification(notification.senderUserId, notification.notificationUserId, 'friend_request_declined');
    this.uiService.deleteNotification(notification);
  }

  addFriend(): Observable<boolean> {
    const askNewFriendUser = this.dialog.open(AskNewFriendComponent, {
      data: {
        availableNewFriends$: this.availableNewFriends$
      }
    });
    return askNewFriendUser.afterClosed()
      .pipe(
        switchMap((newFriendUsername) => {
          if (!!newFriendUsername) {
            return this.userEntityService.entities$
              .pipe(
                withLatestFrom(this.availableNewFriends$, this.currentUser$),
                map(([users, availableNewFriends, currentUser]) => {
                  if (!users.find((user) => user.username === newFriendUsername)) {
                    this.uiService.showSnackbar('user_not_found', null, 5000, 'error');
                    return false;
                  } else if (!availableNewFriends.find((user) => user.username === newFriendUsername)) {
                    this.uiService.showSnackbar('user_already_friend', null, 5000, 'error');
                    return false;
                  } else {
                    if (newFriendUsername === currentUser.username) {
                      return false;
                    } else {
                      const newFriendUser: User = users.find((user) => user.username === newFriendUsername);
                      this.uiService.addNotification(newFriendUser._id, currentUser._id, 'friend_request');
                      return true;
                    }
                  }
                }),
                first()
              );
          } else {
            return of(false);
          }
        }),
        first()
      );
  }

  removeFriend(id): Observable<boolean> {
    return this.currentUser$
      .pipe(
        map((currentUser: User) => {
          const updatedUser: User = JSON.parse(JSON.stringify(currentUser));
          const friend: Friend = currentUser.friend.find((friend) => friend.userId === id);
          updatedUser.friend = updatedUser.friend.filter((friend: Friend) => friend.userId !== id);
          return { updatedUser, friend, currentUser };
        }),
        switchMap((data) => this.userEntityService.update(data.updatedUser).pipe(
          map((resultUpdateUser) => {
            if (!!resultUpdateUser) {
              this.uiService.addNotification(data.friend.userId, data.currentUser._id, 'removed_from_friends');
              return true;
            } else {
              throwError(of(false));
              return false;
            }
          }),
          catchError((error) => {
            console.error(error);
            return of(false);
          }),
          first()
        )),
        first()
      );
  }

  onUpdateAccount(accountForm: FormGroup): Observable<boolean> {
    const askPassword = this.dialog.open(AskPasswordComponent, {
    });
    return askPassword.afterClosed()
      .pipe(
        switchMap((password) => this.currentUser$.pipe(
          concatMap((currentUser) => {
            if (!!password) {
              return of(password).pipe(
                switchMap(() => this.authService.login({ username: currentUser.username, password }).pipe(
                  switchMap(((loginSuccess) => {
                    if (!!loginSuccess) {
                      const updatedUser: User = {
                        ...currentUser,
                        ...accountForm.value,
                        updatedOn: new Date().toString(),
                        birthdate: new Date(accountForm.value.birthdate).toString()
                      };
                      return of(updatedUser).pipe(
                        concatMap((updatedUser: User) => this.userEntityService.update(updatedUser).pipe(
                          map(() => {
                            this.uiService.showSnackbar('account_update_success', null, 5000, 'success');
                            return true;
                          }),
                          catchError((error) => {
                            this.uiService.showSnackbar(error.error.error.code, null, 5000, 'error');
                            accountForm.patchValue(currentUser);
                            return of(false);
                          }),
                          first()
                        )),
                        first()
                      );
                    } else {
                      throwError(of(false));
                      accountForm.patchValue(currentUser);
                      return of(false);
                    }
                  })),
                  catchError((error) => {
                    this.uiService.showSnackbar(error, null, 5000, 'error');
                    accountForm.patchValue(currentUser);
                    return of(false);
                  }),
                  first()
                )),
                first()
              );
            } else {
              accountForm.patchValue(currentUser);
              return of(false);
            }
          }),
          first()
        )),
        first()
      );
  }

  deleteNotification(notification): void {
    this.uiService.deleteNotification(notification);
  }
}
