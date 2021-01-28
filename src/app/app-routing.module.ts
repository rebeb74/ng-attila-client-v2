import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ConfirmPasswordResetComponent } from './core/auth/pages/confirm-password-reset/confirm-password-reset.component';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { PasswordResetComponent } from './core/auth/pages/password-reset/password-reset.component';
import { SignupComponent } from './core/auth/pages/signup/signup.component';
import { UserResolver } from './core/resolvers/user.resolver';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { ContactUsComponent } from './modules/contact-us/contact-us.component';
import { CoreComponent } from './core/core.component';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '', component: CoreComponent, resolve: { user: UserResolver }, children: [
      { path: 'home', component: HomeComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'password-reset', component: PasswordResetComponent },
      { path: 'reset-confirm/:token', component: ConfirmPasswordResetComponent },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
      { path: 'calendar', canActivate: [AuthGuard], loadChildren: () => import('./modules/calendar/calendar.module').then((m) => m.CalendarModule) },
      { path: 'checklist', canActivate: [AuthGuard], loadChildren: () => import('./modules/checklist/checklist.module').then((m) => m.ChecklistModule) },
      { path: '**', component: PageNotFoundComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
