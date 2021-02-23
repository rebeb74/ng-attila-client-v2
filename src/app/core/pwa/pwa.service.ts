import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { AskUserToUpdateComponent } from './ask-user-to-update/ask-user-to-update.component';

@Injectable()
export class PwaService {

    constructor(
        private swUpdate: SwUpdate,
        private dialog: MatDialog,
    ) {
        this.swUpdate.available.pipe(
            mergeMap(() => this.askUserToUpdate().pipe(
                map((result: boolean) => result)
            ))
        ).subscribe((result) => {
            console.log(result);
            if (result) {
                window.location.reload();
            }
        });
    }

    askUserToUpdate(): Observable<boolean> {
        const askUserToUpdate = this.dialog.open(AskUserToUpdateComponent, {
        });
        return askUserToUpdate.afterClosed()
            .pipe(
                map((result: boolean) => {
                    return result;
                }),
                first()
            );
    }
}
