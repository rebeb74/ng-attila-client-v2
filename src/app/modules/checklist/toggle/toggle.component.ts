import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ChecklistService } from '../services/checklist.service';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css']
})
export class ToggleComponent implements OnInit {
  toggleValue$: Observable<string>;

  constructor(
    private checklistService: ChecklistService
  ) { }

  ngOnInit(): void {
    this.toggleValue$ = this.checklistService.getToggleChecklist();
  }

  switchToggle(checklistToggle: string) {
    this.checklistService.setToggleChecklist(checklistToggle);
  }

  addChecklist() {
    this.checklistService.addChecklist().pipe(first()).subscribe();
  }

}
