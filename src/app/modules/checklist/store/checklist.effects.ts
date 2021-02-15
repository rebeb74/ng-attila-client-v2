import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ChecklistActions } from './action-types';
import { tap, withLatestFrom } from 'rxjs/operators';
import { ChecklistService } from '../services/checklist.service';


@Injectable()
export class ChecklistEffects {

    toggleChecklist$ = createEffect(() =>
        this.actions$
            .pipe(
                ofType(ChecklistActions.SetToggleChecklist),
                withLatestFrom(this.checklistService.getFilteredChecklists()),
                tap(([, checklists]) => {
                    if (checklists.length > 0) {
                        this.checklistService.setSelectedChecklist(checklists[0]);
                    }
                })
            )
        ,
        { dispatch: false });

    constructor(
        private actions$: Actions,
        private checklistService: ChecklistService
    ) {

    }


}
