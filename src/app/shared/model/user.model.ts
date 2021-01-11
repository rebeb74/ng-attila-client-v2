export interface User {
    filter(arg0: (user: any) => boolean): any;
    _id: string;
    email: string;
    lang: string;
    username: string;
    birthdate: string;
    createdOn: string;
    updatedOn: string;
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

