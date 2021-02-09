import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from '@ngrx/data';
import { Checklist } from 'src/app/shared/model/checklist.model';

@Injectable()
export class ChecklistDataService extends DefaultDataService<Checklist>{

    constructor(
        http: HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        config: DefaultDataServiceConfig,
    ) {
        super('Checklist', http, httpUrlGenerator, config);
    }


}
