import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Observable } from 'rxjs';
import { first, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Event } from 'src/app/shared/model/event.model';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { Friend } from 'src/app/shared/model/user.model';
import { getCurrentLanguage } from 'src/app/shared/store/ui.reducer';
import { CalendarState, getCurrentCalendar, getSelectedDate } from '../store/calendar.reducer';
import { SubscriptionManagerComponent } from 'src/app/shared/subscription-manager/subscription-manager.component';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent extends SubscriptionManagerComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedDate$: Observable<string>;
  alternList$: Observable<Friend[]>;
  currentCalendar$: Observable<string>;
  addTaskForm: FormGroup;
  addMeetingForm: FormGroup;
  minDate = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: { event: Event },
    private calendarStore: Store<CalendarState>,
    private store: Store<AppState>,
    private dateAdapter: DateAdapter<any>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.currentCalendar$ = this.calendarStore.select(getCurrentCalendar);
    this.setLanguages();
    this.alternList$ = this.store.select(getCurrentUser)
      .pipe(
        map((currentUser) => {
          return currentUser.friend;
        })
      );
    this.selectedDate$ = this.calendarStore.select(getSelectedDate);
    this.initForm();
  }

  ngAfterViewInit() {
  }

  initForm() {
    if (this.passedData.event.type === 'task') {
      this.alternList$
        .pipe(
          withLatestFrom(this.currentCalendar$),
          map(([currentUserFriends, currentCalendar]) => {
            return { currentUserFriends, currentCalendar };
          }),
          first()
        )
        .subscribe((data) => {
          this.addTaskForm = new FormGroup({
            _id: new FormControl(this.passedData.event._id, {
              validators: [Validators.required]
            }),
            title: new FormControl(this.passedData.event.title, {
              validators: [Validators.required]
            }),
            startTime: new FormControl(new Date(this.passedData.event.startTime), {
              validators: [Validators.required]
            }),
            repeat: new FormControl(this.passedData.event.repeat, {
              validators: []
            }),
            altern: new FormControl({ value: this.passedData.event.altern, disabled: (data.currentUserFriends.length === 0 && data.currentCalendar === 'myCalendar') || data.currentCalendar !== 'myCalendar' }, {
              validators: []
            }),
            type: new FormControl(this.passedData.event.type, {
              validators: [Validators.required]
            })
          });
        });
    } else if (this.passedData.event.type === 'meeting') {

      this.addMeetingForm = new FormGroup({
        _id: new FormControl(this.passedData.event._id, {
          validators: [Validators.required]
        }),
        title: new FormControl(this.passedData.event.title, {
          validators: [Validators.required]
        }),
        description: new FormControl(this.passedData.event.description, {
          validators: []
        }),
        startTime: new FormControl(new Date(this.passedData.event.startTime), {
          validators: [Validators.required]
        }),
        startHour: new FormControl(this.passedData.event.startHour, {
          validators: [Validators.required]
        }),
        place: new FormControl(this.passedData.event.place, {
          validators: []
        }),
        // alert: new FormControl(this.passedData.event.alert, {
        //   validators: [Validators.required]
        // }),
        type: new FormControl(this.passedData.event.type, {
          validators: [Validators.required]
        })
      });
    }
  }

  setLanguages() {
    this.store.select(getCurrentLanguage).pipe(takeUntil(this.ngDestroyed$)).subscribe((lang) => {
      this.dateAdapter.setLocale(lang + '-' + lang.toUpperCase());
      NgxMaterialTimepickerModule.setLocale(lang + '-' + lang.toUpperCase());
    });
  }

  friendComparisonFunction(friend, value): boolean {
    return friend.username === value.username;
  }

  onDestroy() {
    this.onDestroy();
  }
}
