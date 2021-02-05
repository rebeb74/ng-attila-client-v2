import { Injectable, OnDestroy } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Event } from '../../../shared/model/event.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { getCurrentUser, getIsLoggedIn } from 'src/app/core/auth/store/auth.reducer';
import { EventEntityService } from '../store/event-entity.service';
import { SubscriptionManagerComponent } from 'src/app/shared/subscription-manager/subscription-manager.component';

@Injectable({
  providedIn: 'root'
})
export class EventSocketService extends SubscriptionManagerComponent implements OnDestroy {
  socket: any;
  readonly url: string = 'http://localhost:3000/event'

  constructor(
    private store: Store<AppState>,
    private eventDataService: EventEntityService
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

  disconnect() {
    this.socket.disconnect();
  }

  webSocketListener() {
    this.listen('event').pipe(takeUntil(this.ngDestroyed$)).subscribe(
      () => {
        this.eventDataService.clearCache();
        this.eventDataService.getAll();
      },
      (error) => console.log(error)
    );
  }

  private listen(eventName: string) {
    return new Observable<Event>((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  onDestroy() {
    this.onDestroy();
  }
}
