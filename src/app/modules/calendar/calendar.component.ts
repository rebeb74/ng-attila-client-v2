import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../../core/store/app.reducer';
import { getCurrentLanguage } from '../../shared/store/ui.reducer';
import { startOfDay } from 'date-utils';
import { UIService } from '../../shared/services/ui.service';
import { CalendarActions } from './store/action-types';
import { CalendarState, getSelectedDate } from './store/calendar.reducer';
import { CalendarService } from './services/calendar.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  language$: Observable<string>;
  addEvent$: Observable<any>;
  addEventSub: Subscription;
  minDate: Date = new Date();
  today = startOfDay(new Date());


  constructor(
    private calendarService: CalendarService,
    private store: Store<AppState>,
    private calendarStore: Store<CalendarState>,
    private uiService: UIService
  ) { }

  ngOnInit(): void {
    this.calendarStore.select(getSelectedDate).subscribe(console.log);
    this.addEventListener();
    this.calendarService.webSocketListener();
    this.language$ = this.store.select(getCurrentLanguage);
    this.minDate.setFullYear(this.minDate.getFullYear() - 1);
  }

  addEventListener() {
    this.addEvent$ = this.uiService.addEventSubject.asObservable();
    this.addEventSub = this.addEvent$.subscribe(() => {
      this.calendarService.addEvent();
    });
  }

  ngOnDestroy() {
    this.calendarService.webSocketDisconnect();
    this.addEventSub.unsubscribe();
  }

  onDateChange(selectedDate: Date) {
    this.calendarStore.dispatch(CalendarActions.setSelectedDate({ selectedDate: selectedDate.toString() }));
  }
}
