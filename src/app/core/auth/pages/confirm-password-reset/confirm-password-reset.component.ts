import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, noop } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';
import { UIService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-confirm-password-reset',
  templateUrl: './confirm-password-reset.component.html',
  styleUrls: ['./confirm-password-reset.component.css']
})
export class ConfirmPasswordResetComponent implements OnInit {
  isLoading$: Observable<boolean>;
  frmSetNewPassword: FormGroup;
  showInvalidLinkMessage = false;
  token = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private uiService: UIService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.checkToken();
    this.frmSetNewPassword = new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern('.{4,}')]
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required]
      })
    });
  }

  checkToken() {
    this.authService.validatePasswordResetLink(this.token).pipe(take(1)).subscribe(
      noop,
      (error) => {
        this.showInvalidLinkMessage = true;
        this.uiService.showSnackbar(error.error.code, null, 5000, 'error');
      });
  }

  setPassword() {
    const password = this.frmSetNewPassword.controls['password'].value;
    const confirmPassword = this.frmSetNewPassword.controls['confirmPassword'].value;

    if (password !== confirmPassword) {
      this.uiService.showSnackbar('different_passwords', null, 5000, 'error');
      return;
    }

    this.authService.resetPassword(this.token, password).subscribe(
      () => {
        this.uiService.showSnackbar('reset_password_success', null, 5000, 'success');
        this.router.navigateByUrl('/login');
      },
      (error) => {
        this.uiService.showSnackbar(error.code, null, 5000, 'error');
      }
    );
  }

}
