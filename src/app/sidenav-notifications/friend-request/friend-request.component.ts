import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss']
})
export class FriendRequestComponent implements OnInit {
  @Input() senderUsername: string;
  @Input() senderEmail: string;
  @Input() notificationDate: Date;

  constructor(
  ) {

  }

  ngOnInit(): void {

  }

  onAccept() {

  }

  onDecline() {

  }
}
