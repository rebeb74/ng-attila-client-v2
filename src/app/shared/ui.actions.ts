import { Action } from "@ngrx/store";
import { User } from "../auth/user.model";


export const START_LOADING = '[UI] Start Loading';
export const STOP_LOADING = '[UI] Stop Loading';
export const SET_CURRENT_USER = '[UI] Set Current User';
export const SET_CURRENT_USER_NOTIFICATIONS = '[UI] Set Current User Notifications';
export const SET_LANGUAGES = '[UI] Set Languages';
export const SET_CURRENT_LANGUAGE = '[UI] Set Current Language';
export const SET_PAGE_NAME = '[UI] Set Page Name';

export class StartLoading implements Action {
    readonly type = START_LOADING;
}

export class StopLoading implements Action {
    readonly type = STOP_LOADING;
}

export class SetCurrentUser implements Action {
    readonly type = SET_CURRENT_USER;

    constructor(public user: User) {}
}

export class SetCurrentUserNotifications implements Action {
    readonly type = SET_CURRENT_USER_NOTIFICATIONS;

    constructor(public notifications: Notification[]) {}
}

export class SetCurrentLanguage implements Action {
    readonly type = SET_CURRENT_LANGUAGE;

    constructor(public currentLanguage: string) {}
}

export class SetLanguages implements Action {
    readonly type = SET_LANGUAGES;

    constructor(public languages: string[]) {}
}

export class SetPageName implements Action {
    readonly type = SET_PAGE_NAME;

    constructor(public PageName: string) {}
}

export type UIActions = StartLoading | StopLoading | SetCurrentUser | SetPageName | SetLanguages | SetCurrentLanguage | SetCurrentUserNotifications;