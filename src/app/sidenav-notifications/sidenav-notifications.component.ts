import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromRoot from '../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-sidenav-notifications',
  templateUrl: './sidenav-notifications.component.html',
  styleUrls: ['./sidenav-notifications.component.css']
})
export class SidenavNotificationsComponent implements OnInit {
  @Output() sidenavNotificationsClose = new EventEmitter<void>()
  
  currentUserNotifications$: Observable<Notification[]>;

  constructor(
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.currentUserNotifications$ = this.store.select(fromRoot.getCurrentUserNotifications);
  }

  onClose(){
    this.sidenavNotificationsClose.emit();
  }
}
