import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-ask-password',
    template: ` <h3 mat-dialog-title>{{ 'pw_needed'| translate }}</h3>
                <form>
                    <mat-dialog-content>
                        <mat-form-field>
                            <input type="password" matInput #pwInput [placeholder]="'your_pw' | translate">
                        </mat-form-field>
                    </mat-dialog-content>
                    <mat-dialog-actions>
                        <button mat-button [mat-dialog-close]="pwInput.value" type="submit">{{ 'submit' | translate }}</button>
                        <button mat-button [mat-dialog-close]="null">{{ 'cancel' | translate }}</button>
                    </mat-dialog-actions>
                </form>`
})

export class AskPasswordComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {

    }
}