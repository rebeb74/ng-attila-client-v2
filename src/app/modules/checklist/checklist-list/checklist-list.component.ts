import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';
import { Checklist } from 'src/app/shared/model/checklist.model';
import { User } from 'src/app/shared/model/user.model';
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
  currentUser$: Observable<User>;
  firstView = true;

  constructor(
    private checklistService: ChecklistService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.currentUser$ = this.store.select(getCurrentUser);
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
    this.checklistService.editChecklist(checklist).pipe(first()).subscribe();
  }

  removeChecklist(checklist) {
    this.checklistService.removeChecklist(checklist).pipe(first()).subscribe();
  }

}
