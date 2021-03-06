import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, OnDestroy, QueryList } from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';

import { merge } from 'rxjs';
import { filter, mergeMap, startWith, takeUntil } from 'rxjs/operators';

import { CustomControl } from './custom-control';
import { SubscriptionManagerComponent } from 'src/app/shared/subscription-manager/subscription-manager.component';

@Component({
  selector: 'lib-modal',
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent extends SubscriptionManagerComponent implements AfterContentInit, OnDestroy {
  @Input() isOverlayOpen = false;
  @Input() closeOnValueChange = true;
  @ContentChildren(CustomControl) private controlList!: QueryList<CustomControl<any>>;

  private _overlayOrigin?: CdkOverlayOrigin;

  set overlayOrigin(overlayOrigin: CdkOverlayOrigin | undefined) {
    this._overlayOrigin = overlayOrigin;
    this.changeDetectorRef.markForCheck();
  }
  get overlayOrigin() {
    return this._overlayOrigin;
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  ngAfterContentInit() {
    this.controlList.changes.pipe(
      startWith(this.controlList),
      mergeMap((controlList) => merge(...controlList.map((control: CustomControl<any>) => control.valueChange))),
      filter(() => this.closeOnValueChange),
      takeUntil(this.ngDestroyed$)
    ).subscribe(() => {
      this.isOverlayOpen = false;
      this.changeDetectorRef.markForCheck();
    });
  }

  toggleOverlay() {
    this.isOverlayOpen = !this.isOverlayOpen;
    this.changeDetectorRef.markForCheck();
  }

  onDestroy() {
    this.onDestroy();
  }
}
