import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Friend, User } from '../../../shared/model/user.model';
import { Notification } from '../../../shared/model/notification.model';

import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-friend-card',
  templateUrl: './friend-card.component.html',
  styleUrls: ['./friend-card.component.scss']
})
export class FriendCardComponent implements OnInit {
  currentUserFriends$: Observable<Friend[]>;
  currentUser$: Observable<User>;
  friendRequestsReceived$: Observable<Notification[]>;
  friendRequestsSent$: Observable<Notification[]>;


  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this.currentUser$ = this.settingsService.getCurrentUser();
    this.currentUserFriends$ = this.settingsService.getCurrentUserFriends();
    this.friendRequestsReceived$ = this.settingsService.getFriendRequestsReceived();
    this.friendRequestsSent$ = this.settingsService.getFriendRequestsSent();
  }

  addFriend(): void {
    this.settingsService.addFriend().subscribe();
  }

  removeFriend(id: string): void {
    this.settingsService.removeFriend(id).subscribe();
  }

  onAcceptFriendRequest(notification: Notification): void {
    this.settingsService.onAcceptFriendRequest(notification).subscribe();
  }

  onDeclineFriendRequest(notification: Notification): void {
    this.settingsService.onDeclineFriendRequest(notification);
  }

  deleteNotification(notification: Notification): void {
    this.settingsService.deleteNotification(notification);
  }

}
