import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-ask-password',
    template: ` <h3 fxLayoutAlign="center" mat-dialog-title>{{ 'pw_needed'| translate }}</h3>
                <form>
                    <mat-dialog-content fxLayoutAlign="center">
                        <mat-form-field fxLayoutAlign="center">
                            <input type="password" matInput #pwInput [placeholder]="'your_pw' | translate">
                        </mat-form-field>
                    </mat-dialog-content>
                    <mat-dialog-actions fxLayoutAlign="center">
                        <button mat-raised-button [mat-dialog-close]="pwInput.value" type="submit">{{ 'submit' | translate }}</button>
                        <button mat-raised-button [mat-dialog-close]="null">{{ 'cancel' | translate }}</button>
                    </mat-dialog-actions>
                </form>`
})

export class AskPasswordComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {

    }
}