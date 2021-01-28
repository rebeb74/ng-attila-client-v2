import { createAction, props } from '@ngrx/store';
import { User } from '../../../shared/model/user.model';


export const login = createAction(
  '[Login Page] User Login',
  props<{ user: User }>()
);

export const logout = createAction(
  '[Top Menu] Logout'
);

export const setCurrentUser = createAction(
  '[Auth] Set Current User',
  props<{ user: User }>()
);
