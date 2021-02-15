import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Checklist } from 'src/app/shared/model/checklist.model';
import { ChecklistService } from '../services/checklist.service';

@Component({
  selector: 'app-checklist-list',
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.scss']
})

export class ChecklistListComponent implements OnInit, AfterContentChecked {
  checklists$: Observable<Checklist[]>;
  selectedChecklist$: Observable<Checklist>;
  selectedChecklistAnimation$: Observable<boolean>;
  firstView = true;

  constructor(
    private checklistService: ChecklistService,
  ) { }

  ngOnInit(): void {
    this.checklists$ = this.checklistService.getFilteredChecklists();
    this.selectedChecklistAnimation$ = this.checklistService.getSlectedChecklistAnimation();
    this.selectedChecklist$ = this.checklistService.getSelectedChecklist();
  }

  ngAfterContentChecked() {
    this.firstView = false;
  }

  setSelectedChecklist(selectedChecklist: Checklist) {
    this.checklistService.setSelectedChecklist(selectedChecklist);
  }

  editChecklist(checklist) {
    this.checklistService.editChecklist(checklist).subscribe();
  }

  removeChecklist(checklist) {
    this.checklistService.removeChecklist(checklist).subscribe();
  }

}
