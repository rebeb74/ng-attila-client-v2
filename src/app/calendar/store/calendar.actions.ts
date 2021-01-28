import {
    createAction,
    props
} from '@ngrx/store';


export const setSelectedDate = createAction(
    '[Calendar] Set Selected Date',
    props<{ selectedDate: string }>()
);


