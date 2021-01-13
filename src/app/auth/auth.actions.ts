

import { createAction, props } from '@ngrx/store';
import { Tokens } from "./model/tokens.model";


export const login = createAction(
    "[Login Page] User Login",
    props<{user: string, tokens: Tokens}>()
);

export const logout = createAction(
  "[Top Menu] Logout"
);
