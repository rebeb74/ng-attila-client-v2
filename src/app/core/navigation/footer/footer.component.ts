import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CalendarService } from 'src/app/modules/calendar/services/calendar.service';
import { getIsLoggedIn, getIsLoggedOut } from '../../auth/store/auth.reducer';
import { AppState, selectUrl } from '../../store/app.reducer';
import { ChecklistService } from 'src/app/modules/checklist/services/checklist.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  pageName$: Observable<string>;

  constructor(
    private store: Store<AppState>,
    private calendarService: CalendarService,
    private ChecklistService: ChecklistService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);
    this.isLoggedOut$ = this.store.select(getIsLoggedOut);
    this.pageName$ = this.store.select(selectUrl);
  }

  addEvent(pageName) {
    if (pageName === 'calendar') {
      this.calendarService.addEvent('task').subscribe();
    } else if (pageName === 'checklist') {
      this.ChecklistService.addChecklist().subscribe();
    }
  }

}
