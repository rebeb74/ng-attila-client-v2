
import { authReducer, AuthState } from './auth/auth.reducer';
import { ActionReducer, ActionReducerMap, createFeatureSelector,  MetaReducer } from '@ngrx/store';
import { environment } from '../environments/environment';
import { getSelectors, routerReducer, RouterReducerState } from '@ngrx/router-store';
import { uiReducer, UiState } from './shared/store/ui.reducer';

export interface AppState {
    ui: UiState;
    auth: AuthState;
    router: RouterReducerState<any>;
}

export const reducers: ActionReducerMap<AppState> = {
    ui: uiReducer,
    auth: authReducer,
    router: routerReducer
};

export function logger(reducer: ActionReducer<any>)
: ActionReducer<any> {
    return (state, action) => {
        // console.log("state before: ", state);
        // console.log("action", action);
        
        return reducer(state, action);
    }
    
}

export const getRouter = createFeatureSelector<AppState, RouterReducerState>('router');
  
export const {
    selectCurrentRoute,   // select the current route
    selectFragment,       // select the current route fragment
    selectQueryParams,    // select the current route query params
    selectQueryParam,     // factory function to select a query param
    selectRouteParams,    // select the current route params
    selectRouteParam,     // factory function to select a route param
    selectRouteData,      // select the current route data
    selectUrl,            // select the current url
  } = getSelectors(getRouter);


export const metaReducers: MetaReducer<AppState>[] =
    !environment.production ? [logger] : [];
