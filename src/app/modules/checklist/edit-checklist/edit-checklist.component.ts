import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { getCurrentUser } from '../../../core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { Checklist } from '../../../shared/model/checklist.model';
import { Friend, User } from '../../../shared/model/user.model';

@Component({
  selector: 'app-edit-checklist',
  templateUrl: './edit-checklist.component.html',
  styleUrls: ['./edit-checklist.component.css']
})
export class EditChecklistComponent implements OnInit {
  editChecklistForm: FormGroup;
  currentUserFriends$: Observable<Friend[]>;
  currentUser$: Observable<User>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: { checklist: Checklist },
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.currentUserFriends$ = this.store.select(getCurrentUser).pipe(map((currentUser) => currentUser.friend), first());
    this.currentUser$ = this.store.select(getCurrentUser);
    this.currentUser$
      .pipe(
        first()
      )
      .subscribe((currentUser) => {
        this.editChecklistForm = new FormGroup({
          _id: new FormControl(this.passedData.checklist._id, {
            validators: [Validators.required]
          }),
          userId: new FormControl(this.passedData.checklist.userId, {
            validators: []
          }),
          checklistName: new FormControl(this.passedData.checklist.checklistName, {
            validators: [Validators.required]
          }),
          items: new FormControl(this.passedData.checklist.items, {
            validators: []
          }),
          createdOn: new FormControl(this.passedData.checklist.createdOn, {
            validators: [Validators.required]
          }),
          friendShares: new FormControl({ value: this.passedData.checklist.friendShares, disabled: currentUser.friend.length === 0 || currentUser._id !== this.passedData.checklist.userId }, {
            validators: []
          })
        });
      });
  }

  friendComparisonFunction(friend, value): boolean {
    return friend.username === value.username;
  }
}
