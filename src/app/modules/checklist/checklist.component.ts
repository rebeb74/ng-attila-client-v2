import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Checklist } from 'src/app/shared/model/checklist.model';
import { ChecklistService } from './services/checklist.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit {
  checklists$: Observable<Checklist[]>;
  toggleChecklist$: Observable<string>;

  constructor(
    private checklistService: ChecklistService,
  ) { }

  ngOnInit(): void {
    this.checklists$ = this.checklistService.getFilteredChecklists();
    this.toggleChecklist$ = this.checklistService.getToggleChecklist();
  }

  addChecklist() {
    this.checklistService.addChecklist().subscribe();
  }
}
