import { Component, OnInit } from '@angular/core';
import { UIService } from '../shared/ui.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(
    private uiService: UIService
  ) { }

  ngOnInit(): void {
    this.uiService.setCurrentPageName('calendar');
  }

}
