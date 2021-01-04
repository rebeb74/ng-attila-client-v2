import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { MaterialModule } from './material/material.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIService } from './shared/ui.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.reducer';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { CalendarComponent } from './calendar/calendar.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { SettingsComponent } from './settings/settings.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AskPasswordComponent } from './settings/ask-password.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { ConfirmPasswordResetComponent } from './auth/confirm-password-reset/confirm-password-reset.component';
import { SidenavNotificationsComponent } from './sidenav-notifications/sidenav-notifications.component';
import { FriendRequestComponent } from './sidenav-notifications/friend-request/friend-request.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    WelcomeComponent,
    LoginComponent,
    SignupComponent,
    CalendarComponent,
    ChecklistComponent,
    SettingsComponent,
    PageNotFoundComponent,
    AskPasswordComponent,
    PasswordResetComponent,
    ConfirmPasswordResetComponent,
    SidenavNotificationsComponent,
    FriendRequestComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (httpTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    StoreModule.forRoot(reducers)
  ],
  entryComponents:[AskPasswordComponent],
  providers: [
    AuthService,
    UIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
