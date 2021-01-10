
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUi from './shared/store/ui.reducer';
import * as fromAuth from './auth/auth.reducer';
import { AuthState } from './auth/auth.reducer';

export interface State {
    ui: fromUi.State;
    auth: AuthState;
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

// export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
// export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuthenticated);


// import {
//     ActionReducer,
//     ActionReducerMap,
//     createFeatureSelector,
//     createSelector,
//     MetaReducer
//   } from '@ngrx/store';
//   import { environment } from '../environments/environment';
//   import {routerReducer} from '@ngrx/router-store';
  
//   export interface AppState {
  
//   }
  
//   export const reducers: ActionReducerMap<AppState> = {
//       router: routerReducer
//   };
  
//   export function logger(reducer:ActionReducer<any>)
//       : ActionReducer<any> {
//       return (state, action) => {
//           console.log("state before: ", state);
//           console.log("action", action);
  
//           return reducer(state, action);
//       }
  
//   }
  
  
//   export const metaReducers: MetaReducer<AppState>[] =
//       !environment.production ? [logger] : [];
  