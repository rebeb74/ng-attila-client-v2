import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Checklist } from 'src/app/shared/model/checklist.model';

@Component({
  selector: 'app-confirm-remove-checklist',
  templateUrl: './confirm-remove-checklist.component.html',
  styleUrls: ['./confirm-remove-checklist.component.css']
})
export class ConfirmRemoveChecklistComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: { removedChecklist: Checklist }
  ) { }

  ngOnInit(): void {
  }

}
