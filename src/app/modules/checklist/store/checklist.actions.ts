import {
    createAction,
    props
} from '@ngrx/store';
import { Checklist } from 'src/app/shared/model/checklist.model';


export const setSelectedChecklist = createAction(
    '[Checklist] Set Selected checklist',
    props<{ selectedChecklist: Checklist }>()
);

export const SelectedChecklistAnimationStart = createAction(
    '[Checklist] Selected checklist Animation Start'
);

export const SelectedChecklistAnimationStop = createAction(
    '[Checklist] Selected checklist Animation Stop'
);

export const SetChecklistEmpty = createAction(
    '[Checklist] Set checklist Empty',
    props<{ checklistsEmpty: boolean }>()
);

export const SetToggleChecklist = createAction(
    '[Checklist] Set Toggle checklist',
    props<{ toggleChecklist: string }>()
);


