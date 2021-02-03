import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Event } from 'src/app/shared/model/event.model';
import { CalendarService } from '../services/calendar.service';
import { CalendarState, getSelectedDate } from '../store/calendar.reducer';
import { EventEntityService } from '../store/event-entity.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  taskList$: Observable<Event[]>;
  meetingList$: Observable<Event[]>;

  constructor(
    private calendarService: CalendarService,
    private calendarStore: Store<CalendarState>,
    private eventDataService: EventEntityService,
  ) { }

  ngOnInit(): void {
    this.taskList$ = this.eventDataService.entities$
      .pipe(
        mergeMap((events) => this.calendarStore.select(getSelectedDate).pipe(
          map((selectedDate) => {
            return events.filter((event) => event.type === 'task' && event.startTime === selectedDate);
          })
        ))
      );
    this.meetingList$ = this.eventDataService.entities$
      .pipe(
        mergeMap((events) => this.calendarStore.select(getSelectedDate).pipe(
          map((selectedDate) => events.filter((event) => event.type === 'meeting' && event.startTime === selectedDate))
        ))
      );
  }

  action(action) {
    console.log(action);
    if (action.action === 'trash') {
      this.deleteEvent(action.value);
    }
    if (action.action === 'repeat') {
      this.repeatEvent(action.value);
    }
  }

  swipeCallback(action) {
    console.log('Callback Swipe', action);
  }

  addEvent() {
    this.calendarService.addEvent();
  }

  editEvent(event) {
    this.calendarService.editEvent(event);
  }

  deleteEvent(event) {
    this.eventDataService.delete(event);
  }

  repeatEvent(event) {
    this.calendarService.repeatEvent(event);
  }

}
