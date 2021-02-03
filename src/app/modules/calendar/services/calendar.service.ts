import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { Event } from 'src/app/shared/model/event.model';
import { Friend } from 'src/app/shared/model/user.model';
import { AddEventComponent } from '../add-event/add-event.component';
import { EditEventComponent } from '../edit-event/edit-event.component';
import { EventEntityService } from '../store/event-entity.service';

@Injectable()
export class CalendarService {

  constructor(
    private eventDataService: EventEntityService,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) { }

  addEvent() {
    const addEvent = this.dialog.open(AddEventComponent, {
    });
    addEvent.afterClosed()
      .pipe(
        map((event) => {
          if (!!event) {
            const newEvent: Event = {
              ...event,
              startTime: this.startOfDay(new Date(event.startTime)).toString(),
              createdOn: new Date().toString(),
              updatedOn: new Date().toString(),
            };
            return newEvent;
          }
          return event;
        })
      )
      .subscribe((event: Event) => {
        if (!!event) {
          console.log(event);
          this.eventDataService.add(event);
        }
      });
  }

  editEvent(event: Event) {
    const addEvent = this.dialog.open(EditEventComponent, {
      data: {
        event: event,
      }
    });
    addEvent.afterClosed()
      .pipe(
        map((event) => {
          if (!!event) {
            const newEvent: Event = {
              ...event,
              startTime: this.startOfDay(new Date(event.startTime)).toString(),
              updatedOn: new Date().toString(),
            };
            return newEvent;
          }
          return event;
        })
      )
      .subscribe((event: Event) => {
        if (!!event) {
          console.log('Edited Event', event);
          this.eventDataService.update(event);
        }
      });
  }

  repeatEvent(event) {
    this.store.select(getCurrentUser).pipe(first()).subscribe((currentUser) => {

      const startTime = new Date(event.startTime);
      const newStartTime = new Date(startTime.setDate(startTime.getDay() + Number(event.repeat))).toString();
      event = {
        ...event,
        startTime: newStartTime
      };

      if (!!event.altern) {
        const newUserId = event.altern.userId;
        const newAltern: Friend = {
          userId: currentUser._id,
          email: currentUser.email,
          username: currentUser.username
        };
        event = {
          ...event,
          userId: newUserId,
          altern: newAltern
        };
      }
      this.eventDataService.update(event);
      if (!!event.altern) {
        this.eventDataService.removeOneFromCache(event);
      }
    });
  }

  startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
