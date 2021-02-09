export interface List {
    _id?: string;
    value: string;
    checked: boolean;
    createdOn: string;
}

export interface Checklist {
    _id?: string;
    userId: string;
    listName: string;
    username: string;
    list: List[];
    public: boolean;
    createdOn: string;
}
