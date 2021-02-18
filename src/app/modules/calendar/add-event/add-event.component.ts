import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Observable } from 'rxjs';
import { first, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { Friend } from 'src/app/shared/model/user.model';
import { getCurrentLanguage } from 'src/app/shared/store/ui.reducer';
import { SubscriptionManagerComponent } from 'src/app/shared/subscription-manager/subscription-manager.component';
import { CalendarState, getCurrentCalendar, getSelectedDate } from '../store/calendar.reducer';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent extends SubscriptionManagerComponent implements OnInit, OnDestroy {
  selectedDate$: Observable<string>;
  alternList$: Observable<Friend[]>;
  currentCalendar$: Observable<string>;
  addTaskForm: FormGroup;
  addMeetingForm: FormGroup;
  minDate = this.startOfDay(new Date());
  tabIndex = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: { eventType: string },
    private calendarStore: Store<CalendarState>,
    private store: Store<AppState>,
    private dateAdapter: DateAdapter<any>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentCalendar$ = this.calendarStore.select(getCurrentCalendar);
    if (this.passedData.eventType === 'meeting') {
      this.tabIndex = 1;
    }
    this.setLanguages();
    this.alternList$ = this.store.select(getCurrentUser)
      .pipe(
        withLatestFrom(this.currentCalendar$),
        map(([currentUser, currentCalendar]) => {
          if (currentCalendar === 'myCalendar') {
            return currentUser.friend;
          } else {
            const currentUserAsFriend: Friend[] = [{
              userId: currentUser._id,
              username: currentUser.username,
              email: currentUser.email
            }];
            return currentUserAsFriend;
          }
        })
      );
    this.selectedDate$ = this.calendarStore.select(getSelectedDate);
    this.initForm();
  }

  initForm() {
    this.selectedDate$
      .pipe(
        first(),
        withLatestFrom(this.currentCalendar$),
        switchMap(([selectedDate, currentCalendar]) => this.alternList$.pipe(
          map((currentUserFriends) => {
            return { selectedDate, currentUserFriends, currentCalendar };
          })
        ))
      )
      .subscribe((data) => {
        console.log('selectedDate)', data.selectedDate);
        this.addTaskForm = new FormGroup({
          title: new FormControl('', {
            validators: [Validators.required]
          }),
          startTime: new FormControl(new Date(data.selectedDate), {
            validators: [Validators.required]
          }),
          repeat: new FormControl('0', {
            validators: []
          }),
          altern: new FormControl({ value: '', disabled: data.currentUserFriends.length === 0 && data.currentCalendar === 'myCalendar' }, {
            validators: []
          }),
          type: new FormControl('task', {
            validators: [Validators.required]
          })
        });

        this.addMeetingForm = new FormGroup({
          title: new FormControl('', {
            validators: [Validators.required]
          }),
          description: new FormControl('', {
            validators: []
          }),
          startTime: new FormControl(new Date(data.selectedDate), {
            validators: [Validators.required]
          }),
          startHour: new FormControl('08:00', {
            validators: [Validators.required]
          }),
          place: new FormControl('', {
            validators: []
          }),
          // alert: new FormControl('', {
          //   validators: [Validators.required]
          // }),
          type: new FormControl('meeting', {
            validators: [Validators.required]
          })
        });
      });
  }

  setLanguages() {
    this.store.select(getCurrentLanguage).pipe(takeUntil(this.ngDestroyed$)).subscribe((lang) => {
      this.dateAdapter.localeChanges.subscribe((localeChange) => console.log('localeChange', localeChange));
      this.dateAdapter.setLocale(lang + '-' + lang.toUpperCase());
      moment.locale(lang);
      NgxMaterialTimepickerModule.setLocale(lang + '-' + lang.toUpperCase());
    });
  }

  formatDate(stringDate: string): Date {
    return this.startOfDay(new Date(moment(stringDate, 'LL').toString()));
  }

  startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}


