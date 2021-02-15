import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Checklist } from '../../../shared/model/checklist.model';
import { ChecklistService } from '../services/checklist.service';

@Injectable()
export class ChecklistDataService extends DefaultDataService<Checklist>{

    constructor(
        http: HttpClient,
        httpUrlGenerator: HttpUrlGenerator,
        config: DefaultDataServiceConfig,
        private checklistService: ChecklistService
    ) {
        super('Checklist', http, httpUrlGenerator, config);
    }

    add(checklist): Observable<Checklist> {
        return super.add(checklist)
            .pipe(
                tap((newChecklist) => {
                    setTimeout(() => {
                        this.checklistService.setSelectedChecklist(newChecklist);
                    }, 50);
                })
            );
    }


}
