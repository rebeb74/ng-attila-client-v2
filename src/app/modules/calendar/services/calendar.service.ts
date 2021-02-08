import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first, map, withLatestFrom } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { Event } from 'src/app/shared/model/event.model';
import { Friend } from 'src/app/shared/model/user.model';
import { AddEventComponent } from '../add-event/add-event.component';
import { EditEventComponent } from '../edit-event/edit-event.component';
import { CalendarState, getCurrentCalendar } from '../store/calendar.reducer';
import { EventEntityService } from '../store/event-entity.service';

@Injectable()
export class CalendarService {

  constructor(
    private eventDataService: EventEntityService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private calendarStore: Store<CalendarState>
  ) { }

  addEvent(eventType) {
    const addEvent = this.dialog.open(AddEventComponent, {
      data: {
        eventType: eventType
      }
    });
    addEvent.afterClosed()
      .pipe(
        withLatestFrom(this.store.select(getCurrentUser), this.calendarStore.select(getCurrentCalendar)),
        map(([event, currentUser, currentCalendar]) => {
          if (!!event) {
            if (currentCalendar === 'myCalendar') {
              const newEvent: Event = {
                ...event,
                userId: currentUser._id,
                startTime: this.startOfDay(new Date(event.startTime)).toString(),
                createdOn: new Date().toString(),
                updatedOn: new Date().toString(),
              };
              return newEvent;
            } else {
              const newEvent: Event = {
                ...event,
                userId: currentCalendar,
                startTime: this.startOfDay(new Date(event.startTime)).toString(),
                createdOn: new Date().toString(),
                updatedOn: new Date().toString(),
              };
              return newEvent;
            }
          }
          return event;
        }),
        first()
      )
      .subscribe((event: Event) => {
        if (!!event) {
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
        }),
        first()
      )
      .subscribe((event: Event) => {
        if (!!event) {
          console.log('Edited Event', event);
          this.eventDataService.update(event);
        }
      });
  }

  repeatTask(task) {
    this.store.select(getCurrentUser).pipe(first()).subscribe((currentUser) => {

      const startTime = new Date(task.startTime);
      const newStartTime = new Date(startTime.setDate(startTime.getDate() + Number(task.repeat))).toString();
      task = {
        ...task,
        startTime: newStartTime
      };

      if (!!task.altern) {
        const newUserId = task.altern.userId;
        const newAltern: Friend = {
          userId: currentUser._id,
          email: currentUser.email,
          username: currentUser.username
        };
        task = {
          ...task,
          userId: newUserId,
          altern: newAltern
        };
      }
      this.eventDataService.update(task);
      if (!!task.altern) {
        this.eventDataService.removeOneFromCache(task);
      }
    });
  }

  startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
