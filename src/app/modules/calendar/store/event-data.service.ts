import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from '@ngrx/data';
import { Event } from '../../../shared/model/event.model';

@Injectable()
export class EventDataService extends DefaultDataService<Event>{

    constructor(
        http: HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        config: DefaultDataServiceConfig,
    ) {
        super('Event', http, httpUrlGenerator, config);
    }


}
