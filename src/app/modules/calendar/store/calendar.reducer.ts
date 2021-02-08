import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { CalendarActions } from './action-types';

export interface CalendarState {
    selectedDate: string;
    currentCalendar: string;
}

export const initialAuthState: CalendarState = {
    selectedDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toString(),
    currentCalendar: 'myCalendar'
};

export const calendarReducer = createReducer(

    initialAuthState,

    on(CalendarActions.setSelectedDate, (state, action) => {
        return {
            ...state,
            selectedDate: action.selectedDate
        };
    }),

    on(CalendarActions.setCurrentCalendar, (state, action) => {
        return {
            ...state,
            currentCalendar: action.currentCalendar
        };
    }),

);

export const getCalendarState = createFeatureSelector<CalendarState>('calendar');
export const getSelectedDate = createSelector(getCalendarState, (state: CalendarState) => state.selectedDate);
export const getCurrentCalendar = createSelector(getCalendarState, (state: CalendarState) => state.currentCalendar);
