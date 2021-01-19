import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable()
export class UserSocketService {

  socket: any;
  readonly url: string = "http://localhost:3000/user"

  constructor() {
    this.socket = io(this.url, {'reconnection': true, 'reconnectionDelay': 500});
  }


  listen(eventName: string) {
    return new Observable<User>((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    });
  }

}
