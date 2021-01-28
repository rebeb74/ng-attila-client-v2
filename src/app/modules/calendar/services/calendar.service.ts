import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { CalendarState, getSelectedDate } from '../store/calendar.reducer';
import { EventEntityService } from '../store/event-entity.service';
import { EventSocketService } from './event-socket.service';

@Injectable()
export class CalendarService {
  selectedDateSubject = new Subject<string>();

  constructor(
    private eventSocketService: EventSocketService,
    private eventDataService: EventEntityService,
    private calendarStore: Store<CalendarState>
  ) { }

  webSocketListener() {
    this.eventSocketService.listen('event').subscribe(
      () => {
        this.eventDataService.clearCache();
        this.eventDataService.getAll();
      },
      (error) => console.log(error)
    );
  }

  webSocketDisconnect() {
    this.eventSocketService.disconnect();
  }

  addEvent() {
    this.calendarStore.select(getSelectedDate);
  }
}
