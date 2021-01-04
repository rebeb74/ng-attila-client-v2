import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ConfirmPasswordResetComponent } from './auth/confirm-password-reset/confirm-password-reset.component';
import { LoginComponent } from './auth/login/login.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'password-confirmation', component: ConfirmPasswordResetComponent },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'checklist', component: ChecklistComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
