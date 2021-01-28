import { Notification } from '../model/notification.model';
import { createAction, props } from '@ngrx/store';


export const startLoading = createAction(
    '[Ui] Start Loading'
);

export const stopLoading = createAction(
    '[UI] Stop Loading'
);

export const setNotifications = createAction(
    '[UI] Set Notifications',
    props<{ notifications: Notification[] }>()
);

export const setLanguages = createAction(
    '[UI] Set Languages',
    props<{ languages: string[] }>()
);

export const setCurrentLanguage = createAction(
    '[UI] Set Current Language',
    props<{ currentLanguage: string }>()
);
