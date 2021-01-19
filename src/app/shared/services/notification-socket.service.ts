import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Notification } from '../model/notification.model'

@Injectable({
  providedIn: 'root'
})
export class NotificationSocketService {

  socket: any;
  readonly uri: string = "http://localhost:3000/notification"

  constructor() {
    this.socket = io(this.uri, {'reconnection': true, 'reconnectionDelay': 500});
  }


  listen(eventName: string) {
    return new Observable<Notification>((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    });
  }

}
