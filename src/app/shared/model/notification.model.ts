export interface Notification {
    _id?: string;
    notificationUserId: string;
    notificationUsername: string;
    notificationUserEmail: string;
    code: string;
    read: boolean;
    senderUserId: string;
    senderUsername: string;
    senderEmail: string;
    createdOn: string;
}
