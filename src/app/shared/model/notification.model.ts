export interface Notification {
    notificationId?: string;
    message: string;
    read: boolean;
    senderUsername: string;
    senderEmail: string;
    createdOn: Date;
}