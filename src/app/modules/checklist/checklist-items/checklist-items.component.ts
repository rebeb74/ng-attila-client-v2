import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { Checklist, Item } from 'src/app/shared/model/checklist.model';
import { ChecklistService } from '../services/checklist.service';
import { first, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/app.reducer';
import { User } from 'src/app/shared/model/user.model';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';

@Component({
  selector: 'app-checklist-items',
  templateUrl: './checklist-items.component.html',
  styleUrls: ['./checklist-items.component.scss']
})
export class ChecklistItemsComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedChecklistItems$: Observable<Item[]>;
  selectedChecklist$: Observable<Checklist>;
  currentUser$: Observable<User>

  constructor(
    private checklistService: ChecklistService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUser);
    this.selectedChecklistItems$ = this.checklistService.getSelectedChecklistItems();
    this.selectedChecklist$ = this.checklistService.getSelectedChecklist();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const newListItem: Item = {
      value: value.trim(),
      createdOn: new Date().toString()
    };

    // Add item
    if ((value || '').trim()) {
      this.checklistService.addItem(newListItem).pipe(first()).subscribe();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(item: Item): void {
    this.checklistService.removeItem(item).pipe(first()).subscribe();
  }

  onBackspaceKeydown(event) {
    event.stopImmediatePropagation();
    document.getElementById('inputList').focus();
  }

  editChecklist() {
    this.selectedChecklist$
      .pipe(
        first(),
        switchMap((selectedChecklist) => this.checklistService.editChecklist(selectedChecklist))
      )
      .subscribe();
  }

  removeChecklist() {
    this.selectedChecklist$
      .pipe(
        first(),
        switchMap((selectedChecklist) => this.checklistService.removeChecklist(selectedChecklist))
      )
      .subscribe();
  }
}
