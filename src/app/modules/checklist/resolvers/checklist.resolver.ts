import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { ChecklistEntityService } from '../store/checklist-entity.service';

@Injectable({
  providedIn: 'root'
})
export class ChecklistResolver implements Resolve<boolean> {

  constructor(
    private checklistEntityService: ChecklistEntityService,
  ) { }

  resolve(): Observable<boolean> {
    const isUser = localStorage.getItem('user');
    if (!!isUser) {
      return this.checklistEntityService.loaded$
        .pipe(
          tap((checklistLoaded) => {
            if (!checklistLoaded) {
              this.checklistEntityService.getAll();
            }
          }),
          filter((checklistLoaded) => !!checklistLoaded),
          first()
        );
    } else {
      return of(false);
    }
  }
}

