import { Injectable, NgModule } from '@angular/core';
import { SwipeAngularListComponent } from './swipe-angular-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { CommonModule } from '@angular/common';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides = {
    pinch: { enable: false },
    rotate: { enable: false }
  };
}

@NgModule({
  declarations: [SwipeAngularListComponent, ItemListComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    }
  ],
  exports: [SwipeAngularListComponent, ItemListComponent]
})
export class SwipeAngularListModule {
}
