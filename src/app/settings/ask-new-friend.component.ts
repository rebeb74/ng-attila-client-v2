import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../shared/model/user.model";
import { UserEntityService } from "../shared/services/user-entity.service";

@Component({
    selector: 'app-ask-new-friend',
    template: ` <h3 fxLayoutAlign="center" mat-dialog-title>{{ 'ask_new_friend_title'| translate }}</h3>
                <form>
                    <mat-dialog-content fxLayoutAlign="center">
                        <mat-form-field fxLayoutAlign="center">
                            <input type="text" matInput #newFriendInput [placeholder]="'ask_new_friend_user' | translate" [matAutocomplete]="auto">
                            <mat-autocomplete #auto="matAutocomplete">
                                <mat-option *ngFor="let user of data.availableNewFriends$ | async" [value]="user.username">
                                {{ user.username }}
                                </mat-option>
                            </mat-autocomplete>
                        </mat-form-field>
                    </mat-dialog-content>
                    <mat-dialog-actions fxLayoutAlign="center">
                        <button mat-raised-button [mat-dialog-close]="newFriendInput.value" type="submit">{{ 'submit' | translate }}</button>
                        <button mat-raised-button [mat-dialog-close]="null">{{ 'cancel' | translate }}</button>
                    </mat-dialog-actions>
                </form>`
})

export class AskNewFriendComponent {
    userId: string = JSON.parse(localStorage.getItem('user'))

    allUsers$: Observable<User[]> = this.userDataService.entities$
        .pipe(
            map(users => {
                console.log('allUsers', users)
                const currentUser = users.find(user => user._id === this.userId);
                users = users.filter(users => users._id !== this.userId),
                console.log('allUsers - userID', users)
                users = users.filter(users => !currentUser.friend.find(friend => friend.username === users.username))
                console.log('allUsers - userID', users)
                return users;
            })
            );
    
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {availableNewFriends$: Observable<User[]>},
        private userDataService: UserEntityService
        ) {

    }
}