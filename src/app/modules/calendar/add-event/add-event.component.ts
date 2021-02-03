import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { Friend } from 'src/app/shared/model/user.model';
import { getCurrentLanguage } from 'src/app/shared/store/ui.reducer';
import { CalendarState, getSelectedDate } from '../store/calendar.reducer';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  selectedDate$: Observable<string>;
  currentUserFriends$: Observable<Friend[]>;
  addTaskForm: FormGroup;
  addMeetingForm: FormGroup;
  minDate = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: any,
    private calendarStore: Store<CalendarState>,
    private store: Store<AppState>,
    private dateAdapter: DateAdapter<any>,
  ) { }

  ngOnInit(): void {
    this.setLanguages();
    this.currentUserFriends$ = this.store.select(getCurrentUser)
      .pipe(
        map((currentUser) => currentUser.friend)
      );
    this.selectedDate$ = this.calendarStore.select(getSelectedDate);
    this.initForm();
  }

  initForm() {
    this.selectedDate$
      .pipe(
        switchMap((selectedDate) => this.currentUserFriends$.pipe(
          map((currentUserFriends) => {
            return { selectedDate, currentUserFriends };
          })
        ))
      )
      .subscribe((data) => {
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
          altern: new FormControl({ value: '', disabled: data.currentUserFriends.length === 0 }, {
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
    this.store.select(getCurrentLanguage).subscribe((lang) => {
      this.dateAdapter.setLocale(lang + '-' + lang.toUpperCase());
      NgxMaterialTimepickerModule.setLocale(lang + '-' + lang.toUpperCase());
    });
  }


}


