import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-subscription-manager',
  template: ''
})
export class SubscriptionManagerComponent implements OnDestroy {
  public ngDestroyed$ = new Subject();

  constructor() { }

  ngOnDestroy(): void {
    this.ngDestroyed$.unsubscribe();
  }

  onDestroy(): void {
    this.ngDestroyed$.next();
  }
}
