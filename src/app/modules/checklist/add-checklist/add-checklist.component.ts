import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { Friend } from '../../../shared/model/user.model';

@Component({
  selector: 'app-add-checklist',
  templateUrl: './add-checklist.component.html',
  styleUrls: ['./add-checklist.component.css']
})
export class AddChecklistComponent implements OnInit {
  addChecklistForm: FormGroup;
  currentUserFriends$: Observable<Friend[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.currentUserFriends$ = this.store.select(getCurrentUser).pipe(map((currentUser) => currentUser.friend), first());
    this.currentUserFriends$
      .pipe(
        first()
      )
      .subscribe((currentUserFriends) => {
        this.addChecklistForm = new FormGroup({
          checklistName: new FormControl('', {
            validators: [Validators.required]
          }),
          friendShares: new FormControl({ value: '', disabled: currentUserFriends.length === 0 }, {
            validators: []
          })
        });
      });
  }
}
