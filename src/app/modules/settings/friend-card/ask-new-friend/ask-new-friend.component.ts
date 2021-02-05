import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/model/user.model';

@Component({
  selector: 'app-ask-new-friend',
  templateUrl: './ask-new-friend.component.html',
  styleUrls: ['./ask-new-friend.component.css']
})
export class AskNewFriendComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { availableNewFriends$: Observable<User[]> }) { }

  ngOnInit(): void {
  }

}
