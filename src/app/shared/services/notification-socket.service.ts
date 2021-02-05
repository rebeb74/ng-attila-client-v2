import { Injectable, OnDestroy } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Notification } from '../model/notification.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { getCurrentUser, getIsLoggedIn } from 'src/app/core/auth/store/auth.reducer';
import { takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { SubscriptionManagerComponent } from '../subscription-manager/subscription-manager.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationSocketService extends SubscriptionManagerComponent implements OnDestroy {
  socket: any;
  readonly url: string = 'http://localhost:3000/notification'

  constructor(
    private store: Store<AppState>
  ) {
    super();
    this.store.select(getIsLoggedIn)
      .pipe(
        takeUntil(this.ngDestroyed$),
        withLatestFrom(this.store.select(getCurrentUser)),
        tap(([isLoggedIn, currentUser]) => {
          if (isLoggedIn) {
            this.socket = io(this.url, { 'reconnection': true, 'reconnectionDelay': 500, query: `userId=${currentUser._id}` });
          }
        })
      )
      .subscribe();
  }


  listen(eventName: string) {
    return new Observable<Notification>((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  onDestroy() {
    this.onDestroy();
  }

}
