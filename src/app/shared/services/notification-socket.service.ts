import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Notification } from '../model/notification.model'

@Injectable({
  providedIn: 'root'
})
export class NotificationSocketService {
  userId: string = JSON.parse(localStorage.getItem('user'))
  socket: any;
  readonly url: string = "http://localhost:3000/notification"

  constructor() {
    this.socket = io(this.url, {'reconnection': true, 'reconnectionDelay': 500, query: `userId=${this.userId}`});
  }


  listen(eventName: string) {
    return new Observable<Notification>((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    });
  }

}
