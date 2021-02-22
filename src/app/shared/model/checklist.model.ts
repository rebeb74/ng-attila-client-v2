import { Friend } from './user.model';

export interface Item {
    _id?: string;
    value: string;
    createdOn: string;
}

export interface Checklist {
    _id?: string;
    userId: string;
    checklistName: string;
    username?: string;
    items: Item[];
    friendShares: Friend[];
    createdOn: string;
}

export function compareChecklists(a, b) {
    if (a.createdOn < b.createdOn) {
        return 1;
    }
    if (a.createdOn > b.createdOn) {
        return -1;
    }
    return 0;
}

