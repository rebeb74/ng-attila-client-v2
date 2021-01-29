import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  list = [
    {
      id: 1,
      title: 'Realizar la tarea asignada!',
      subTitle: '9:00pm',
      mark: false
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  action(action) {
    console.log(action);

  }

  clickOnItem(item) {
    console.log('Click on item', item);
  }

  swipeCallback(action) {
    console.log('Callback Swipe', action);
  }
}
