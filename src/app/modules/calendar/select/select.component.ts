import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { Friend } from 'src/app/shared/model/user.model';
import { CalendarActions } from '../store/action-types';
import { CalendarState, getCurrentCalendar } from '../store/calendar.reducer';


@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  calSelect: FormControl = new FormControl('myCalendar');
  calendarList$: Observable<Friend[]>
  tabIndex = 0;

  constructor(
    private store: Store<AppState>,
    private calendarStore: Store<CalendarState>
  ) { }

  ngOnInit(): void {
    this.calendarList$ = this.store.select(getCurrentUser)
      .pipe(
        mergeMap((currentUser) => this.store.select(getCurrentCalendar).pipe(
          map((currentCalendar) => {
            const currentUserCalendar: Friend = {
              userId: 'myCalendar',
              username: currentUser.username,
              email: currentUser.email
            };
            const calendarList: Friend[] = [currentUserCalendar, ...currentUser.friend];
            this.calSelect = new FormControl(currentCalendar);
            this.tabIndex = calendarList.findIndex((calendar) => calendar.userId === currentCalendar);
            return calendarList;
          })
        )),
      );
  }

  switchCalendar(calendar: string) {
    this.calendarStore.dispatch(CalendarActions.setCurrentCalendar({ currentCalendar: calendar }));
  }

  onTabChanged($event) {
    this.calendarList$.pipe(
      tap((calendarList) => {
        const calendar = calendarList[$event.index];
        this.switchCalendar(calendar.userId);
      }),
      first()
    ).subscribe();
  }

}
