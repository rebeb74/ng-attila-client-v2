
import { User } from '../model/user.model';
import { Notification } from '../model/notification.model';
import {
    UIActions,
    START_LOADING,
    STOP_LOADING,
    SET_CURRENT_USER,
    SET_PAGE_NAME,
    SET_LANGUAGES,
    SET_CURRENT_LANGUAGE,
    SET_CURRENT_USER_NOTIFICATIONS
} from './ui.actions';


export interface State {
    isLoading: boolean;
    user: User;
    pageName: string;
    languages: string[];
    currentLanguage: string;
    notifications: Notification[]
}

const initialState: State = {
    isLoading: false,
    user: null,
    pageName: 'welcome',
    languages: [],
    currentLanguage: 'fr',
    notifications: []
};

export function uiReducer(state = initialState, action: UIActions) {
    switch (action.type) {
        case START_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case STOP_LOADING:
            return {
                ...state,
                isLoading: false
            }
        case SET_CURRENT_USER:
            return {
                ...state,
                user: action.user
            }
        case SET_PAGE_NAME:
            return {
                ...state,
                pageName: action.PageName
            }
        case SET_LANGUAGES:
            return {
                ...state,
                languages: action.languages
            }
        case SET_CURRENT_LANGUAGE:
            return {
                ...state,
                currentLanguage: action.currentLanguage
            }
        case SET_CURRENT_USER_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.notifications
            }
        default: {
            return state;
        }
    }
}

export const getIsLoading = (state: State) => state.isLoading;
export const getCurrentUser = (state: State) => state.user;
export const getPageName = (state: State) => state.pageName;
export const getLanguages = (state: State) => state.languages;
export const getCurrentLanguage = (state: State) => state.currentLanguage;
export const getCurrentUserNotifications = (state: State) => state.notifications;