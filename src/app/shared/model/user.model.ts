export interface User {
    find(arg0: (user: any) => boolean);
    filter(arg0: (user: any) => boolean): any;
    _id: string;
    email: string;
    lang: string;
    username: string;
    birthdate: string;
    createdOn: string;
    updatedOn: string;
    share?: Share[];
    isAdmin?: false;
}

export interface Share {
    userId: string,
    email: string,
    username: string
}

