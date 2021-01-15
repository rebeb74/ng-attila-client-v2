import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { map } from "rxjs/operators";
import { UserEntityService } from "../shared/services/user-entity.service";

@Component({
    selector: 'app-ask-new-share-user',
    template: ` <h3 fxLayoutAlign="center" mat-dialog-title>{{ 'ask_new_share_title'| translate }}</h3>
                <form>
                    <mat-dialog-content fxLayoutAlign="center">
                        <mat-form-field fxLayoutAlign="center">
                            <input type="text" matInput #newShareInput [placeholder]="'ask_new_share_user' | translate" [matAutocomplete]="auto">
                            <mat-autocomplete #auto="matAutocomplete">
                                <mat-option *ngFor="let username of allUsersUsernames$ | async">
                                {{ username }}
                                </mat-option>
                            </mat-autocomplete>
                        </mat-form-field>
                    </mat-dialog-content>
                    <mat-dialog-actions fxLayoutAlign="center">
                        <button mat-raised-button [mat-dialog-close]="newShareInput.value" type="submit">{{ 'submit' | translate }}</button>
                        <button mat-raised-button [mat-dialog-close]="null">{{ 'cancel' | translate }}</button>
                    </mat-dialog-actions>
                </form>`
})

export class AskNewShareUserComponent {
    userId: string = JSON.parse(localStorage.getItem('user'))

    allUsersUsernames$ = this.userDataService.entities$
        .pipe(
            map(users => {
                const currentUser = users.find(user => user._id === this.userId);
                users = users.filter(users => users._id !== this.userId),
                users = users.filter(users => currentUser.share.find(share => share.username !== users.username))
                var allUsernames: string[] = [];
                users.forEach(user => {
                  allUsernames.push(user.username);
                })
                return allUsernames;
            })
            );
    
    constructor(
        @Inject(MAT_DIALOG_DATA) public passedData: any,
        private userDataService: UserEntityService
        ) {

    }
}