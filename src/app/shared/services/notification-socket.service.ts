import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Notification } from '../model/notification.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { getCurrentUser, getIsLoggedIn } from 'src/app/core/auth/store/auth.reducer';
import { tap, withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationSocketService {
  socket: any;
  readonly url: string = 'http://localhost:3000/notification'

  constructor(
    private store: Store<AppState>
  ) {
    this.store.select(getIsLoggedIn)
      .pipe(
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
      this.store.select(getIsLoggedIn).subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.socket.on(eventName, (data) => {
            subscriber.next(data);
          });
        } return subscriber.complete();
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

}
