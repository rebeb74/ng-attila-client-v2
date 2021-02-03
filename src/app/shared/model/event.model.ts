import { Friend } from './user.model';

export interface Event {
    _id?: string;
    userId: string;
    title: string;
    description: string;
    startTime: string;
    startHour?: string;
    place?: string;
    alert?: Date;
    repeat?: string;
    altern?: Friend;
    type: 'meeting' | 'task';
    createdOn: string;
    updatedOn: string;
}
