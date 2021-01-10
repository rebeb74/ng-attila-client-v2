import { Component, OnInit } from '@angular/core';
import { UIService } from '../shared/services/ui.service';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit {

  constructor(
    private uiService: UIService
  ) { }

  ngOnInit(): void {
    this.uiService.setCurrentPageName('checklist');
  }

}
