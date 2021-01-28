import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { CalendarActions } from './action-types';

export interface CalendarState {
    selectedDate: string;
}

export const initialAuthState: CalendarState = {
    selectedDate: (new Date).toString(),
};

export const calendarReducer = createReducer(

    initialAuthState,

    on(CalendarActions.setSelectedDate, (state, action) => {
        return {
            ...state,
            selectedDate: action.selectedDate
        };
    }),

    on(CalendarActions.setSelectedDate, (state, action) => {
        return {
            ...state,
            selectedDate: action.selectedDate
        };
    }),

);

export const getCalendarState = createFeatureSelector<CalendarState>('calendar');
export const getSelectedDate = createSelector(getCalendarState, (state: CalendarState) => state.selectedDate);
