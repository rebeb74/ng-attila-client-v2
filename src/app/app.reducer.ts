
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface State {
    ui: fromUi.State;
    auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
    ui: fromUi.uiReducer,
    auth: fromAuth.authReducer
};

export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);
export const getCurrentUser = createSelector(getUiState, fromUi.getCurrentUser);
export const getPageName = createSelector(getUiState, fromUi.getPageName);
export const getLanguages = createSelector(getUiState, fromUi.getLanguages);
export const getCurrentLanguage = createSelector(getUiState, fromUi.getCurrentLanguage);
export const getCurrentUserNotifications = createSelector(getUiState, fromUi.getCurrentUserNotifications);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuthenticated);
