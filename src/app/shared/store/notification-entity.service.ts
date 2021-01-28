import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Notification } from '../model/notification.model';

@Injectable()
export class NotificationEntityService extends EntityCollectionServiceBase<Notification> {


    constructor(
        serviceElementsFactory: EntityCollectionServiceElementsFactory
        ){

        super('Notification', serviceElementsFactory);
    }
}
