import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { AuthActions } from './action-types';
import { Tokens } from './model/tokens.model';



export interface AuthState {
    user: string;
    tokens: Tokens;
}

export const initialAuthState: AuthState = {
    user: undefined,
    tokens: undefined
};

export const authReducer = createReducer(

    initialAuthState,

    on(AuthActions.login, (_state, action) => {
        return {
            user: action.user,
            tokens: action.tokens
        }
    }),

    on(AuthActions.logout, (_state, _action) => {
        return {
            user: undefined,
            tokens: undefined
        }
    })

);

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectIsLoggedIn = createSelector(selectAuthState, auth => !!auth.user);
export const selectIsLoggedOut = createSelector(selectIsLoggedIn, loggedIn => !loggedIn);
export const selectTokens = createSelector(selectAuthState, state => state.tokens);
export const selectCurrentUserId = createSelector(selectAuthState, state => state.user);
