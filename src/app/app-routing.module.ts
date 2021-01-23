import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ConfirmPasswordResetComponent } from './auth/confirm-password-reset/confirm-password-reset.component';
import { LoginComponent } from './auth/login/login.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { SignupComponent } from './auth/signup/signup.component';
import { BaseComponent } from './base/base.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { UserResolver } from './user.resolver';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '', component: BaseComponent, resolve: { user: UserResolver }, children: [
    { path: 'welcome', component: WelcomeComponent },
    { path: 'contact-us', component: ContactUsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: 'reset-confirm/:token', component: ConfirmPasswordResetComponent },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'calendar', canActivate: [AuthGuard], loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
    { path: 'checklist', canActivate: [AuthGuard], loadChildren: () => import('./checklist/checklist.module').then(m => m.ChecklistModule) },
    { path: '**', component: PageNotFoundComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
