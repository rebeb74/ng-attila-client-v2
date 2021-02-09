import { Injectable, OnDestroy } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { getCurrentUser, getIsLoggedIn } from 'src/app/core/auth/store/auth.reducer';
import { ChecklistEntityService } from '../store/checklist-entity.service';
import { SubscriptionManagerComponent } from 'src/app/shared/subscription-manager/subscription-manager.component';

@Injectable({
  providedIn: 'root'
})
export class ChecklistSocketService extends SubscriptionManagerComponent implements OnDestroy {
  socket: any;
  readonly url: string = 'http://localhost:3000/checklist'

  constructor(
    private store: Store<AppState>,
    private checklistEntityService: ChecklistEntityService
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
    this.listen('checklist').pipe(takeUntil(this.ngDestroyed$)).subscribe(
      (checklistEmit) => {
        if (checklistEmit.action === 'delete') {
          this.checklistEntityService.removeOneFromCache(checklistEmit.checklist);
        } else {
          this.checklistEntityService.getAll();
        }
      },
      (error) => console.log(error)
    );
  }

  private listen(checklistName: string) {
    return new Observable<any>((subscriber) => {
      this.socket.on(checklistName, (data) => {
        subscriber.next(data);
      });
    });
  }

  onDestroy() {
    this.onDestroy();
  }
}
