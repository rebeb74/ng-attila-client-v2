import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { WeekDay } from '@angular/common';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';

import { addDays, areDatesInSameMonth, getDaysOfMonth, isDateAfter, isSameDate, isValidDate, startOfDay } from '../date-utils';
import { DayStepDelta } from './day-step-delta.model';
import { EventEntityService } from '../../../store/event-entity.service';
import { Observable } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { CalendarState, getCurrentCalendar } from '../../../store/calendar.reducer';

export const keyCodesToDaySteps = new Map<number, DayStepDelta>([
  [RIGHT_ARROW, 1],
  [LEFT_ARROW, -1],
  [DOWN_ARROW, 7],
  [UP_ARROW, -7]
]);

@Component({
  selector: 'lib-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  daysOfMonth!: readonly Date[];
  daysOfMonth$: Observable<any[]>;
  firstDayOfMonth!: string;
  currentDate = startOfDay(new Date());

  private readonly dateSelector = 'time.month__date';

  @Input() selectedDate?: Date;
  @Input() min?: Date | null;
  @Input() locale?: string;
  @Input() activeDate!: Date;

  private _month!: Date;

  @Input()
  get month() {
    return this._month;
  }
  set month(month: Date) {
    if (!this._month || !areDatesInSameMonth(this._month, month)) {
      this._month = month;
      this.daysOfMonth = getDaysOfMonth(this._month);
      this.daysOfMonth$ = this.eventEntityService.entities$
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
              const daysOfMonth = getDaysOfMonth(this._month);
              let newDaysOfMonth = [];
              daysOfMonth.forEach((dayOfMonth) => {
                const tasksOfDay = currentCalendarEvents.filter((event) => new Date(event.startTime).getTime() === dayOfMonth.getTime() && event.type === 'task');
                const meetingsOfDay = currentCalendarEvents.filter((event) => new Date(event.startTime).getTime() === dayOfMonth.getTime() && event.type === 'meeting');
                newDaysOfMonth = [...newDaysOfMonth, {
                  dayOfMonth: dayOfMonth,
                  tasks: tasksOfDay,
                  meetings: meetingsOfDay
                }];
              });
              return newDaysOfMonth;
            })
          ))
        );
      this.firstDayOfMonth = WeekDay[this.daysOfMonth[0].getDay()].toLowerCase();
    }
  }

  @Output() selectedDateChange = new EventEmitter<Date>();
  @Output() activeDateChange = new EventEmitter<Date>();

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    private eventEntityService: EventEntityService,
    private store: Store<AppState>,
    private calendarStore: Store<CalendarState>
  ) { }

  ngOnInit() {
  }


  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.entries(changes).some(([input, change]) => input !== 'month' && !change.firstChange)) {
      this.changeDetectorRef.detectChanges();
    }
  }

  isSelected(dayOfMonth: Date) {
    return !!this.selectedDate && isSameDate(dayOfMonth, this.selectedDate);
  }

  isDisabled(dayOfMonth: Date) {
    return !!this.min && isDateAfter(this.min, dayOfMonth);
  }

  isActive(dayOfMonth: Date) {
    return !!this.activeDate && isSameDate(dayOfMonth, this.activeDate);
  }

  isCurrent(dayOfMonth: Date) {
    return !!this.currentDate && isSameDate(dayOfMonth, this.currentDate);
  }

  onKeydown(event: KeyboardEvent) {
    const dayStepDelta = keyCodesToDaySteps.get(event.keyCode);

    if (dayStepDelta) {
      event.preventDefault();
      const activeDate = addDays(this.activeDate, dayStepDelta);
      this.activeDateChange.emit(activeDate);
    }
  }

  onMonthClick(event: MouseEvent | Event) {
    // should be MouseEvent | KeyboardEvent, but $event type for keyup.enter is not inferred correctly
    const target = event.target as HTMLElement;

    if (this.isTimeElement(target)) {
      this.onDateClick(target);
    }
  }

  ngOnDestroy(): void {
  }

  private onDateClick(timeElement: HTMLTimeElement) {
    const selectedDate = new Date(timeElement.dateTime + 'T00:00');

    if (isValidDate(selectedDate)) {
      this.selectDate(selectedDate);
    }
  }

  private selectDate(date: Date) {
    if (!this.isSelected(date) && !this.isDisabled(date)) {
      this.selectedDateChange.emit(date);
    }
  }

  private isTimeElement(element: HTMLElement): element is HTMLTimeElement {
    return !!element && element.matches(this.dateSelector);
  }
}
