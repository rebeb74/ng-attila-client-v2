import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { AuthService } from './auth/services/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIService } from './shared/services/ui.service';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './app.reducer';
import { CalendarComponent } from './calendar/calendar.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { SettingsComponent } from './settings/settings.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AskPasswordComponent } from './settings/ask-password.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { ConfirmPasswordResetComponent } from './auth/confirm-password-reset/confirm-password-reset.component';
import { SidenavNotificationsComponent } from './sidenav-notifications/sidenav-notifications.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { DefaultDataServiceConfig, EntityDataModule, EntityDataService } from '@ngrx/data';
import { entityConfig } from './entity-metadata';
import { AuthEffects } from './auth/auth.effects';
import { UserEntityService } from './shared/services/user-entity.service';
import { TokenInterceptor } from './token.interceptor';
import { UserResolver } from './user.resolver';
import { BaseComponent } from './base/base.component';
import { UserDataService } from './shared/services/user-data.service';
import { NotificationEntityService } from './shared/services/notification-entity.service';
import { NotificationDataService } from './shared/services/notification-data.service';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: environment.apiUrl,
  timeout: 3000, // request timeout
}

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
    BaseComponent
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
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictStateSerializability: true
      }
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([AuthEffects]),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal
    }),
    EntityDataModule.forRoot(entityConfig)
  ],
  entryComponents: [AskPasswordComponent],
  providers: [
    AuthService,
    UIService,
    UserEntityService,
    UserResolver,
    UserDataService,
    NotificationEntityService,
    NotificationDataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private entityDataService: EntityDataService,
    private userDataService: UserDataService,
    private notificationDataService: NotificationDataService
    ) {
    entityDataService.registerService('User', userDataService);
    entityDataService.registerService('Notification', notificationDataService);
  }
 }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
