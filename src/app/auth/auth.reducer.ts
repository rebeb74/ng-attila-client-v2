
import { AuthActions, SET_AUTHENTICATED, SET_UNAUTHENTICATED } from './auth.actions';


export interface State {
    isAuhtenticated: boolean;
}

const initialState: State = {
    isAuhtenticated: false
};

export function authReducer(state = initialState, action: AuthActions) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                isAuhtenticated: true
            }
        case SET_UNAUTHENTICATED:
            return {
                isAuhtenticated: false
            }
        default: {
            return state;
        }
    }
}

export const getIsAuthenticated = (state: State) => state.isAuhtenticated;