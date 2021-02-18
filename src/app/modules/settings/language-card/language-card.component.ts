import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from 'src/app/core/store/app.reducer';
import { UIService } from 'src/app/shared/services/ui.service';
import { getCurrentLanguage, getLanguages } from 'src/app/shared/store/ui.reducer';
import { SubscriptionManagerComponent } from 'src/app/shared/subscription-manager/subscription-manager.component';

@Component({
  selector: 'app-language-card',
  templateUrl: './language-card.component.html',
  styleUrls: ['./language-card.component.css']
})
export class LanguageCardComponent extends SubscriptionManagerComponent implements OnInit, OnDestroy {
  languages$: Observable<string[]>;
  currentLang$: Observable<string>;

  constructor(
    private uiService: UIService,
    private store: Store<AppState>,
    private dateAdapter: DateAdapter<any>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setLanguages();
  }

  switchLang(newLang) {
    this.uiService.switchLang(newLang);
  }

  setLanguages() {
    this.languages$ = this.store.select(getLanguages);
    this.currentLang$ = this.store.select(getCurrentLanguage);
    this.currentLang$.pipe(takeUntil(this.ngDestroyed$)).subscribe((lang) => {
      this.datePickerLocale(lang);
      moment.locale(lang);
    });
  }

  datePickerLocale(lang: string) {
    this.dateAdapter.setLocale(lang + '-' + lang.toUpperCase());
  }

  ngOnDestroy() {
    this.onDestroy();
  }
}
