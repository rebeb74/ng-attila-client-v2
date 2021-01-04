export interface User {
    userId: string;
    email: string;
    lang: string;
    username: string;
    birthdate: Date;
    createdOn: Date;
    updatedOn: Date;
    share?: [{
        userId: string,
        email: string,
        username: string
    }];
    isShared?: [{
        userId: string,
        email: string,
        username: string
    }];
    isAdmin?: false;
}

export interface Notification extends User {
    notificationId?: string;
    message: string;
    read: boolean;
    senderUsername: string;
    senderEmail: string;
    createdOn: Date;
}