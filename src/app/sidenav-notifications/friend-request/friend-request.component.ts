import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { User } from 'src/app/shared/model/user.model';
import { DbService } from 'src/app/shared/services/db.service';
import * as fromRoot from '../../app.reducer';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss'],
  animations: [
    trigger(
      'modalFadeZoom',
      [
        transition(
          ':enter', [
            style({ transform: 'translateY(100%)', opacity: 0 }),
                    animate('500ms', style({ transform: 'translateY(0)', 'opacity': 1 }))
          ]
        ),
      ])
  ]
})
export class FriendRequestComponent implements OnInit {
  @Input() senderUsername: string;
  @Input() senderEmail: string;
  @Input() notificationDate: Date;
  @Input() notificationId: string;
  currentUser: User;

  constructor(
    private dbService: DbService,
    private store: Store<fromRoot.State>
  ) {

  }
  @Output() public deleteAnimation = new EventEmitter<{ notificationId: string }>();

  ngOnInit(): void {
    this.store.select(fromRoot.getCurrentUser).pipe(take(1)).subscribe((currentUser: User) => {
      this.currentUser = currentUser;
    })
  }

  onAccept() {

  }

  onDecline() {
    this.deleteAnimation.emit({ notificationId: this.notificationId });
    this.dbService.deleteNotificationById(this.currentUser._id, this.notificationId);

  }
}
