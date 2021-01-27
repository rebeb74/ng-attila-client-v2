import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { User } from '../shared/model/user.model';
import { AuthActions } from './action-types';



export interface AuthState {
    user: User;
}

export const initialAuthState: AuthState = {
    user: undefined
};

export const authReducer = createReducer(

    initialAuthState,

    on(AuthActions.login, (state, action) => {
        return {
            ...state,
            user: action.user
        }
    }),

    on(AuthActions.logout, (state, _action) => {
        return {
            ...state,
            user: undefined
        }
    }),

    on(AuthActions.setCurrentUser, (state, action) => {
        return {
            ...state,
            user: action.user
        }
    }),

);

export const getAuthState = createFeatureSelector<AuthState>('auth');
export const getIsLoggedIn = createSelector(getAuthState, auth => !!auth.user);
export const getIsLoggedOut = createSelector(getIsLoggedIn, loggedIn => !loggedIn);
export const getCurrentUser = createSelector(getAuthState, (state: AuthState) => state.user);

