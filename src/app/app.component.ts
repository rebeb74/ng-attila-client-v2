import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { UIService } from './shared/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  

  constructor(
    private authService: AuthService,
    private uiService: UIService
    ) {
  }
  
  ngOnInit() {
    this.authService.initAuthListener();
    this.uiService.initLang();
    
  }

}
