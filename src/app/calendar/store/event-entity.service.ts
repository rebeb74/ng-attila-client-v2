import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Event } from '../model/event.model';

@Injectable()
export class EventEntityService extends EntityCollectionServiceBase<Event> {


    constructor(
        serviceElementsFactory: EntityCollectionServiceElementsFactory
        ){

        super('Event', serviceElementsFactory);
    }
}
