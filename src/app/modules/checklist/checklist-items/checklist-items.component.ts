import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { Checklist, Item } from 'src/app/shared/model/checklist.model';
import { ChecklistService } from '../services/checklist.service';

@Component({
  selector: 'app-checklist-items',
  templateUrl: './checklist-items.component.html',
  styleUrls: ['./checklist-items.component.scss']
})
export class ChecklistItemsComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedChecklistItems$: Observable<Item[]>;
  selectedChecklist$: Observable<Checklist>;

  constructor(
    private checklistService: ChecklistService
  ) { }

  ngOnInit(): void {
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
      this.checklistService.addItem(newListItem).subscribe();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(item: Item): void {
    this.checklistService.removeItem(item).subscribe();
  }

  onBackspaceKeydown(event) {
    event.stopImmediatePropagation();
    document.getElementById('inputList').focus();
  }
}
