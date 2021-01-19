import { Component, OnInit } from '@angular/core';
import { UIService } from './shared/services/ui.service';
import { Observable } from 'rxjs';
import { User } from './shared/model/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser$: Observable<User>
  loading = true;

  constructor(
    private uiService: UIService,
    ) {
  }

  ngOnInit() {
    this.uiService.webSocketListener();

    this.uiService.initLang();

  }


}
