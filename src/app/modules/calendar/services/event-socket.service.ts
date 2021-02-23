import { Injectable, OnDestroy } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { getCurrentUser, getIsLoggedIn } from 'src/app/core/auth/store/auth.reducer';
import { EventEntityService } from '../store/event-entity.service';
import { SubscriptionManagerComponent } from 'src/app/shared/subscription-manager/subscription-manager.component';
import * as environment from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventSocketService extends SubscriptionManagerComponent implements OnDestroy {
  socket: any;
  socketUrl = environment.environment.socketUrl
  readonly url: string = this.socketUrl + 'event'

  constructor(
    private store: Store<AppState>,
    private eventEntityService: EventEntityService
  ) {
    super();
  }

  connect() {
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

  disconnect() {
    this.socket.disconnect();
  }

  webSocketListener() {
    this.listen('event').pipe(takeUntil(this.ngDestroyed$)).subscribe(
      (eventEmit) => {
        if (eventEmit.action === 'delete') {
          this.eventEntityService.removeOneFromCache(eventEmit.event);
        } else {
          this.eventEntityService.getAll();
        }
      },
      (error) => console.log(error)
    );
  }

  private listen(eventName: string) {
    return new Observable<any>((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  onDestroy() {
    this.onDestroy();
  }
}
