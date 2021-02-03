import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIService } from './services/ui.service';
import { UserResolver } from '../core/resolvers/user.resolver';
import { UserEntityService } from './services/user-entity.service';
import { UserDataService } from './services/user-data.service';
import { UserSocketService } from './services/user-socket.service';
import { NotificationEntityService } from './services/notification-entity.service';
import { NotificationSocketService } from './services/notification-socket.service';
import { StorageService } from './services/storage.service';
import { NotificationDataService } from './services/notification-data.service';
import { SubscriptionManagerComponent } from './subscription-manager/subscription-manager.component';


@NgModule({
  declarations: [SubscriptionManagerComponent],
  imports: [
    CommonModule
  ],
  providers: [
    UIService,
    UserResolver,
    UserEntityService,
    UserDataService,
    UserSocketService,
    NotificationEntityService,
    NotificationDataService,
    NotificationSocketService,
    StorageService,
  ]
})
export class SharedModule { }
