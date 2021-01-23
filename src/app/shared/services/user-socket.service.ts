import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable()
export class UserSocketService {
  userId: string = JSON.parse(localStorage.getItem('user'))
  socket: any;
  readonly url: string = "http://localhost:3000/user"

  constructor() {
    this.socket = io(this.url, {'reconnection': true, 'reconnectionDelay': 500, query: `userId=${this.userId}`});
    
  }


  listen(eventName: string) {
    return new Observable<User>((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    });
  }

}
