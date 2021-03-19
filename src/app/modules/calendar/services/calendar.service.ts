import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map, withLatestFrom } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { Event } from 'src/app/shared/model/event.model';
import { Friend } from 'src/app/shared/model/user.model';
import { UIService } from 'src/app/shared/services/ui.service';
import { UserEntityService } from 'src/app/shared/services/user-entity.service';
import { AddEventComponent } from '../add-event/add-event.component';
import { EditEventComponent } from '../edit-event/edit-event.component';
import { CalendarState, getCurrentCalendar } from '../store/calendar.reducer';
import { EventEntityService } from '../store/event-entity.service';

@Injectable()
export class CalendarService {

  constructor(
    private eventEntityService: EventEntityService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private calendarStore: Store<CalendarState>,
    private uiService: UIService,
    private userEntityService: UserEntityService
  ) { }

  addEvent(eventType): Observable<boolean> {
    const addEvent = this.dialog.open(AddEventComponent, {
      data: {
        eventType: eventType
      }
    });
    return addEvent.afterClosed()
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
              this.eventEntityService.add(newEvent);
              return true;
            } else {
              const newEvent: Event = {
                ...event,
                userId: currentCalendar,
                startTime: this.startOfDay(new Date(event.startTime)).toString(),
                createdOn: new Date().toString(),
                updatedOn: new Date().toString(),
              };
              this.uiService.addNotification(currentCalendar, currentUser._id, 'add_event_from_friend', [newEvent.title, newEvent.startTime]);
              this.eventEntityService.add(newEvent);
              return true;
            }
          } else {
            return false;
          }
        }),
        first()
      );
  }

  editEvent(event: Event): Observable<boolean> {
    const addEvent = this.dialog.open(EditEventComponent, {
      data: {
        event: event,
      }
    });
    return addEvent.afterClosed()
      .pipe(
        withLatestFrom(this.store.select(getCurrentUser), this.calendarStore.select(getCurrentCalendar)),
        map(([event, currentUser, currentCalendar]) => {
          if (!!event) {
            const editedEvent: Event = {
              ...event,
              startTime: this.startOfDay(new Date(event.startTime)).toString(),
              updatedOn: new Date().toString(),
            };
            if (currentCalendar !== 'myCalendar') {
              this.uiService.addNotification(currentCalendar, currentUser._id, 'edit_event_from_friend', [editedEvent.title, editedEvent.startTime]);
            }
            this.eventEntityService.update(editedEvent);
            return true;
          }
          return false;
        }),
        first()
      );
  }

  repeatTask(task: Event): Observable<Event> {
    return this.store.select(getCurrentUser)
      .pipe(
        withLatestFrom(this.calendarStore.select(getCurrentCalendar), this.userEntityService.entities$),
        map(([currentUser, currentCalendar, users]) => {
          const startTime = new Date(task.startTime);
          const newStartTime = new Date(startTime.setDate(startTime.getDate() + Number(task.repeat))).toString();
          task = {
            ...task,
            startTime: newStartTime
          };

          if (!!task.altern) {
            if (currentCalendar === 'myCalendar') {
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
            } else {
              const currentCalendarUser = users.find((user) => user._id === currentCalendar);
              const newUserId = currentUser._id;
              const newAltern: Friend = {
                userId: currentCalendarUser._id,
                email: currentCalendarUser.email,
                username: currentCalendarUser.username
              };
              task = {
                ...task,
                userId: newUserId,
                altern: newAltern
              };
            }
          }
          this.eventEntityService.update(task);
          if (!!task.altern) {
            this.eventEntityService.removeOneFromCache(task);
          }
          return task;
        }),
        first()
      );
  }

  deleteEvent(event: Event): Observable<boolean> {
    console.log(event);
    return this.eventEntityService.delete(event)
      .pipe(
        withLatestFrom(this.store.select(getCurrentUser), this.calendarStore.select(getCurrentCalendar)),
        map(([, currentUser, currentCalendar]) => {
          if (currentCalendar !== 'myCalendar') {
            this.uiService.addNotification(currentCalendar, currentUser._id, 'remove_event_from_friend', [event.title, event.startTime]);
          }
          return true;
        })
      );
  }

  startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
