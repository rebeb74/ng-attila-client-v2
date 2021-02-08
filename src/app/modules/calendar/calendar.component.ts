import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventSocketService } from './services/event-socket.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  constructor(
    private eventSocketService: EventSocketService,
  ) { }

  ngOnInit(): void {
    this.eventSocketService.webSocketListener();
  }

  ngOnDestroy() {
    this.eventSocketService.disconnect();
  }

}
