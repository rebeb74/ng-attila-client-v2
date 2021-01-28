import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Event } from '../model/event.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { first } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/auth/auth.reducer';

@Injectable({
  providedIn: 'root'
})
export class EventSocketService {
  socket: any;
  readonly url: string = 'http://localhost:3000/event'

  constructor(
    private store: Store<AppState>
  ) {
    this.store.select(getCurrentUser).pipe(first()).subscribe((currentUser) => {
      this.socket = io(this.url, {'reconnection': true, 'reconnectionDelay': 500, query: `userId=${currentUser._id}`});
    });
  }


  listen(eventName: string) {
    return new Observable<Event>((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

}
