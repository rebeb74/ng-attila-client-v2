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
    altern?: string;
    type: 'meeting' | 'task';
    createdOn: string;
    updatedOn: string;
}
