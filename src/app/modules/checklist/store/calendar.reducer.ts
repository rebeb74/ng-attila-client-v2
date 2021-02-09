import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { ChecklistActions } from './action-types';

export interface ChecklistState {
    selectedDate: string;
    currentCalendar: string;
}

export const initialAuthState: ChecklistState = {
    selectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toString(),
    currentCalendar: 'myCalendar'
};

export const calendarReducer = createReducer(

    initialAuthState,

    on(ChecklistActions.setSelectedDate, (state, action) => {
        return {
            ...state,
            selectedDate: action.selectedDate
        };
    }),

    on(ChecklistActions.setCurrentCalendar, (state, action) => {
        return {
            ...state,
            currentCalendar: action.currentCalendar
        };
    }),

);

export const getChecklistState = createFeatureSelector<ChecklistState>('checklist');
export const getSelectedDate = createSelector(getChecklistState, (state: ChecklistState) => state.selectedDate);
export const getCurrentCalendar = createSelector(getChecklistState, (state: ChecklistState) => state.currentCalendar);
