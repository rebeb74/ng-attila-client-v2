import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../core/store/app.reducer';
import { getCurrentLanguage } from '../../shared/store/ui.reducer';
import { startOfDay } from './calendar/date-utils';
import { CalendarActions } from './store/action-types';
import { CalendarState } from './store/calendar.reducer';
import { EventSocketService } from './services/event-socket.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  language$: Observable<string>;
  addEvent$: Observable<any>;
  minDate: Date = new Date();
  today = startOfDay(new Date());


  constructor(
    private eventSocketService: EventSocketService,
    private store: Store<AppState>,
    private calendarStore: Store<CalendarState>,
  ) { }

  ngOnInit(): void {
    this.eventSocketService.webSocketListener();
    this.language$ = this.store.select(getCurrentLanguage);
    this.minDate.setFullYear(this.minDate.getFullYear() - 1);
  }

  ngOnDestroy() {
    this.eventSocketService.disconnect();
  }

  onDateChange(selectedDate: Date) {
    this.calendarStore.dispatch(CalendarActions.setSelectedDate({ selectedDate: selectedDate.toString() }));
  }


}
