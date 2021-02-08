import { Component, OnInit } from '@angular/core';
import { startOfDay } from './calendar/date-utils';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { getCurrentLanguage } from 'src/app/shared/store/ui.reducer';
import { CalendarState, getSelectedDate } from '../store/calendar.reducer';
import { CalendarActions } from '../store/action-types';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-app-calendar',
  templateUrl: './app-calendar.component.html',
  styleUrls: ['./app-calendar.component.css']
})
export class AppCalendarComponent implements OnInit {
  language$: Observable<string>;
  minDate: Date = new Date();
  selectedDate$: Observable<Date>

  constructor(
    private store: Store<AppState>,
    private calendarStore: Store<CalendarState>,
  ) { }

  ngOnInit(): void {
    this.selectedDate$ = this.calendarStore.select(getSelectedDate)
      .pipe(
        map((selectedDate) => startOfDay(new Date(selectedDate)))
      );
    this.language$ = this.store.select(getCurrentLanguage);
    this.minDate.setFullYear(this.minDate.getFullYear() - 1);
  }
  onDateChange(selectedDate: Date) {
    this.calendarStore.dispatch(CalendarActions.setSelectedDate({ selectedDate: selectedDate.toString() }));
  }

}
