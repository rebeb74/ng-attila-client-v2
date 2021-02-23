import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { Event } from 'src/app/shared/model/event.model';
import { CalendarService } from '../services/calendar.service';
import { CalendarState, getCurrentCalendar, getSelectedDate } from '../store/calendar.reducer';
import { EventEntityService } from '../store/event-entity.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  taskList$: Observable<Event[]>;
  meetingList$: Observable<Event[]>;
  currentCalendarEvents$: Observable<Event[]>

  constructor(
    private calendarService: CalendarService,
    private calendarStore: Store<CalendarState>,
    private eventEntityService: EventEntityService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.currentCalendarEvents$ = this.eventEntityService.entities$
      .pipe(
        mergeMap((events) => this.calendarStore.select(getCurrentCalendar).pipe(
          withLatestFrom(this.store.select(getCurrentUser)),
          map(([currentCalendar, currentUser]) => {
            let currentCalendarEvents = [];
            if (currentCalendar === 'myCalendar') {
              currentCalendarEvents = events.filter((event) => event.userId === currentUser._id);
            } else {
              currentCalendarEvents = events.filter((event) => event.userId === currentCalendar);
            }
            return currentCalendarEvents;
          })
        ))
      );
    this.taskList$ = this.currentCalendarEvents$
      .pipe(
        mergeMap((events) => this.calendarStore.select(getSelectedDate).pipe(
          map((selectedDate) => {
            return events.filter((event) => event.type === 'task' && new Date(event.startTime).toString() === new Date(selectedDate).toString());
          })
        ))
      );
    this.meetingList$ = this.currentCalendarEvents$
      .pipe(
        mergeMap((events) => this.calendarStore.select(getSelectedDate).pipe(
          map((selectedDate) => events.filter((event) => event.type === 'meeting' && new Date(event.startTime).toString() === new Date(selectedDate).toString()))
        ))
      );
  }

  action(action) {
    if (action.action === 'trash') {
      this.deleteEvent(action.value);
    }
    if (action.action === 'repeat') {
      this.repeatTask(action.value);
    }
  }

  swipeCallback(action) {
    console.log('Callback Swipe', action);
  }

  addEvent(eventType) {
    this.calendarService.addEvent(eventType).subscribe();
  }

  editEvent(event) {
    this.calendarService.editEvent(event).subscribe();
  }

  deleteEvent(event) {
    this.calendarService.deleteEvent(event).subscribe();
  }

  deleteEvents(selectedEvents) {
    selectedEvents.forEach((event) => {
      this.deleteEvent(event.value);
    });
  }

  repeatTask(event) {
    this.calendarService.repeatTask(event).subscribe();
  }

}
