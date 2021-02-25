import { Injectable, OnDestroy } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { first, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { getCurrentUser, getIsLoggedIn } from 'src/app/core/auth/store/auth.reducer';
import { ChecklistEntityService } from '../store/checklist-entity.service';
import { SubscriptionManagerComponent } from '../../../shared/subscription-manager/subscription-manager.component';
import * as environment from '../../../../environments/environment';
import { ChecklistService } from './checklist.service';
import { Checklist } from 'src/app/shared/model/checklist.model';

@Injectable({
  providedIn: 'root'
})
export class ChecklistSocketService extends SubscriptionManagerComponent implements OnDestroy {
  socket: any;
  socketUrl = environment.environment.socketUrl
  readonly url: string = this.socketUrl + 'checklist'

  constructor(
    private store: Store<AppState>,
    private checklistEntityService: ChecklistEntityService,
    private checklistService: ChecklistService
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
    this.listen('checklist').pipe(takeUntil(this.ngDestroyed$)).subscribe(
      (checklistEmit) => {
        const action = checklistEmit.action;
        const checklist: Checklist = checklistEmit.checklist;
        if (action === 'delete') {
          this.checklistService.getFilteredChecklists()
            .pipe(
              withLatestFrom(this.checklistService.getSelectedChecklist()),
              map(([filteredChecklists, selectedChecklist]) => {
                if (selectedChecklist._id === checklist._id) {
                  if (filteredChecklists.length > 1) {
                    const index = filteredChecklists.findIndex((c) => checklist._id === c._id);
                    if (index === 0) {
                      this.checklistService.setSelectedChecklist(filteredChecklists[index + 1]);
                    } else {
                      this.checklistService.setSelectedChecklist(filteredChecklists[index - 1]);
                    }
                  }
                }
                return true;
              }),
              first()
            ).subscribe();

          this.checklistEntityService.removeOneFromCache(checklist);
        } else if (action === 'update') {
          this.store.select(getCurrentUser)
            .pipe(
              withLatestFrom(this.checklistService.getFilteredChecklists(), this.checklistService.getSelectedChecklist()),
              map(([currentUser, filteredChecklists, selectedChecklist]) => {
                if (!checklist.friendShares.find((friend) => friend.userId === currentUser._id)) {
                  if (selectedChecklist._id === checklist._id) {
                    if (filteredChecklists.length > 1) {
                      const index = filteredChecklists.findIndex((c) => checklist._id === c._id);
                      if (index === 0) {
                        this.checklistService.setSelectedChecklist(filteredChecklists[index + 1]);
                      } else {
                        this.checklistService.setSelectedChecklist(filteredChecklists[index - 1]);
                      }
                    }
                  }
                  this.checklistEntityService.removeOneFromCache(checklist);
                }
                return true;
              }),
              first()
            )
            .subscribe();
          this.checklistEntityService.getAll();

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
