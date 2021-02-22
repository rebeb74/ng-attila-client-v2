import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getIsLoggedIn, getIsLoggedOut } from 'src/app/core/auth/store/auth.reducer';
import { AppState } from 'src/app/core/store/app.reducer';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  slides = [
    { image: '../../../../assets/images/man-clean.jpg', text: 'text_slide1' },
    { image: '../../../../assets/images/woman-smartphone.jpg', text: 'text_slide2' },
    { image: '../../../../assets/images/responsive.jpg', text: 'text_slide3' },
    { image: '../../../../assets/images/checklist.jpg', text: 'text_slide4' },
    { image: '../../../../assets/images/online.jpg', text: 'text_slide5' },
    { image: '../../../../assets/images/meeting.jpg', text: 'text_slide6' },
  ];

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(getIsLoggedIn);
    this.isLoggedOut$ = this.store.select(getIsLoggedOut);
  }

}
