import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Checklist } from 'src/app/shared/model/checklist.model';
import { ChecklistActions } from './action-types';

export interface ChecklistState {
    selectedChecklist: Checklist;
    animation: boolean;
    checklistsEmpty: boolean;
    toggleChecklist: string;
}

export const initialAuthState: ChecklistState = {
    selectedChecklist: null,
    animation: false,
    checklistsEmpty: true,
    toggleChecklist: 'all'
};

export const checklistReducer = createReducer(

    initialAuthState,

    on(ChecklistActions.setSelectedChecklist, (state, action) => {
        return {
            ...state,
            selectedChecklist: action.selectedChecklist
        };
    }),

    on(ChecklistActions.SelectedChecklistAnimationStart, (state, _action) => {
        return {
            ...state,
            animation: true
        };
    }),

    on(ChecklistActions.SelectedChecklistAnimationStop, (state, _action) => {
        return {
            ...state,
            animation: false
        };
    }),

    on(ChecklistActions.SetChecklistEmpty, (state, action) => {
        return {
            ...state,
            checklistsEmpty: action.checklistsEmpty
        };
    }),

    on(ChecklistActions.SetToggleChecklist, (state, action) => {
        return {
            ...state,
            toggleChecklist: action.toggleChecklist
        };
    }),

);

export const getChecklistState = createFeatureSelector<ChecklistState>('checklist');
export const getSelectedChecklist = createSelector(getChecklistState, (state: ChecklistState) => state.selectedChecklist);
export const getSelectedChecklistIsAnimated = createSelector(getChecklistState, (state: ChecklistState) => state.animation);
export const getChecklistsEmpty = createSelector(getChecklistState, (state: ChecklistState) => state.checklistsEmpty);
export const getToggleChecklist = createSelector(getChecklistState, (state: ChecklistState) => state.toggleChecklist);
