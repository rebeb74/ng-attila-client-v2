import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/core/store/app.reducer';
import { UIService } from 'src/app/shared/services/ui.service';
import { getIsLoading } from 'src/app/shared/store/ui.reducer';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  eventForm: FormGroup;
  isLoading$: Observable<boolean>;
  mailSent = false;

  constructor(
    private uiService: UIService,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public passedData: any
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(getIsLoading);
    this.eventForm = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required]
      }),
      description: new FormControl('', {
        validators: [Validators.required]
      }),
      startTime: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      startHour: new FormControl('', {
        validators: [Validators.required]
      }),
      place: new FormControl('', {
        validators: [Validators.required]
      }),
      alert: new FormControl('', {
        validators: [Validators.required]
      }),
      repeat: new FormControl('', {
        validators: [Validators.required]
      }),
      altern: new FormControl('', {
        validators: [Validators.required]
      }),
      type: new FormControl('', {
        validators: [Validators.required]
      })
    });
  }

  onSubmit() {
    this.uiService.sendContactEmail(this.eventForm.value).subscribe(
      (res) => {
        if (res.emailSent) {
          this.mailSent = true;
        } else {
          this.uiService.showSnackbar('error_send_contact_mail', null, 5000, 'error');
        }
      }
    );
  }
}


