export interface Notification {
    _id?: string;
    notificationUserId: string;
    code: string;
    read: boolean;
    senderUserId: string;
    senderUsername: string;
    senderEmail: string;
    createdOn: string;
}