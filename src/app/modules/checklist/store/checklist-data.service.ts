import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, DefaultDataServiceConfig, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
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

    getAll(): Observable<Checklist[]> {
        return super.getAll().pipe(
            withLatestFrom(this.checklistService.getSelectedChecklist(), this.checklistService.getFilteredChecklists()),
            map(([checklists, selectedChecklist, _filteredChecklists]) => {
                if (!selectedChecklist && checklists.length > 0) {
                    this.checklistService.setSelectedChecklist(checklists[0]);
                }
                return checklists;
            })
        );
    }


}
