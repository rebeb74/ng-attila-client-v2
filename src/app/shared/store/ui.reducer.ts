import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Notification } from '../model/notification.model';
import { UiActions } from './action-types';
import { environment } from '../../../environments/environment';


export interface UiState {
    isLoading: boolean;
    languages: string[];
    currentLanguage: string;
    notifications: Notification[];
}

export const initialAuthState: UiState = {
    isLoading: false,
    languages: environment.languages,
    currentLanguage: 'fr',
    notifications: [],
};

export const uiReducer = createReducer(

    initialAuthState,

    on(UiActions.setCurrentLanguage, (state, action) => {
        return {
            ...state,
            currentLanguage: action.currentLanguage
        };
    }),

    on(UiActions.setLanguages, (state, action) => {
        return {
            ...state,
            languages: action.languages
        };
    }),

    on(UiActions.setNotifications, (state, action) => {
        return {
            ...state,
            notifications: action.notifications
        };
    }),

    on(UiActions.startLoading, (state, _action) => {
        return {
            ...state,
            isLoading: true
        };
    }),

    on(UiActions.stopLoading, (state, _action) => {
        return {
            ...state,
            isLoading: false
        };
    }),

);

export const getUiState = createFeatureSelector<UiState>('ui');
export const getIsLoading = createSelector(getUiState, (state: UiState) => state.isLoading);
export const getLanguages = createSelector(getUiState, (state: UiState) => state.languages);
export const getCurrentLanguage = createSelector(getUiState, (state: UiState) => state.currentLanguage);
export const getNotifications = createSelector(getUiState, (state: UiState) => state.notifications);
