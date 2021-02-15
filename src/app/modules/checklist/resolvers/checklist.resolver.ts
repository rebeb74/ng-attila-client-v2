import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, first, map, mergeMap } from 'rxjs/operators';
import { ChecklistService } from '../services/checklist.service';
import { ChecklistEntityService } from '../store/checklist-entity.service';

@Injectable({
  providedIn: 'root'
})
export class ChecklistResolver implements Resolve<boolean> {

  constructor(
    private checklistEntityService: ChecklistEntityService,
    private checklistsService: ChecklistService
  ) { }

  resolve(): Observable<boolean> {
    const isUser = localStorage.getItem('user');
    if (!!isUser) {
      return this.checklistEntityService.loaded$
        .pipe(
          mergeMap((checklistLoaded) => this.checklistsService.getChecklists().pipe(
            map((checklists) => {
              if (!checklistLoaded) {
                this.checklistEntityService.getAll();
              } else {
                if (checklists.length > 0) {
                  this.checklistsService.setSelectedChecklist(checklists[0]);
                }
              }
              return checklistLoaded;
            })
          )),
          filter((checklistLoaded) => !!checklistLoaded),
          first()
        );
    } else {
      return of(false);
    }
  }
}

