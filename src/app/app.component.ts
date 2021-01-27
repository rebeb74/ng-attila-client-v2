import { Component, OnInit } from '@angular/core';
import { UIService } from './shared/services/ui.service';
import { Observable } from 'rxjs';
import { User } from './shared/model/user.model';
import { Store } from '@ngrx/store';
import { AppState } from './app.reducer';
import { getIsLoggedIn } from './auth/auth.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser$: Observable<User>

  constructor(
    private uiService: UIService,
    private store: Store<AppState>,
    ) {
  }

  ngOnInit() {
    this.store.select(getIsLoggedIn).subscribe(isLoggedIn => {
      if(isLoggedIn){
        this.uiService.webSocketListener();
      } 
    })
  }


}
