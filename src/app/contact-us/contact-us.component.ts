import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../app.reducer';
import { UIService } from '../shared/services/ui.service';
import { selectIsLoading } from '../shared/store/ui.reducer';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup;
  isLoading$: Observable<boolean>;
  mailSent = false;
  
  constructor(
    private uiService: UIService,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.contactForm = new FormGroup({
      firstname: new FormControl('', {
        validators: [Validators.required]
      }),
      lastname: new FormControl('', {
        validators: [Validators.required]
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      message: new FormControl('', {
        validators: [Validators.required]
      }),
      subject: new FormControl('', {
        validators: [Validators.required]
      }),
      phone: new FormControl('', { 
        validators: [Validators.required]
      }),
    });
  }

  onSubmit() {
      this.uiService.sendContactEmail(this.contactForm.value).subscribe(
        res => {
          if (res.emailSent){
            this.mailSent = true;
          } else {
            this.uiService.showSnackbar('error_send_contact_mail', null, 5000, 'error');
          }
        }
      );
  }
}
