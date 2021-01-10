import { Component, OnInit } from '@angular/core';
import { UIService } from '../shared/services/ui.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private uiService:UIService
  ) { }

  ngOnInit(): void {
    this.uiService.setCurrentPageName('welcome');
  }

}
