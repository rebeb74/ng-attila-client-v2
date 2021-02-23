import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import BritishLocale from '@angular/common/locales/en-GB';
import GermanLocale from '@angular/common/locales/de';
import FrenchLocale from '@angular/common/locales/fr';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import { extModules } from '../build-specifics';
import { EffectsModule } from '@ngrx/effects';
import { DefaultDataServiceConfig, EntityDataModule, EntityDataService } from '@ngrx/data';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';


import { metaReducers, reducers } from './core/store/app.reducer';
import { entityConfig } from './core/store/entity-metadata';
import { AuthEffects } from './core/auth/store/auth.effects';
import { environment } from '../environments/environment';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { UserDataService } from './shared/services/user-data.service';
import { NotificationDataService } from './shared/services/notification-data.service';

import { AppComponent } from './app.component';
import { ModulesModule } from './modules/modules.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: environment.apiUrl,
  timeout: 3000, // request timeout
};

registerLocaleData(FrenchLocale);
registerLocaleData(BritishLocale);
registerLocaleData(GermanLocale);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HammerModule,
    SharedModule,
    ModulesModule,
    CoreModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (httpTranslateLoader),
        deps: [HttpClient]
      }
    }),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictStateSerializability: true
      }
    }),
    extModules,
    EffectsModule.forRoot([AuthEffects]),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal
    }),
    EntityDataModule.forRoot(entityConfig),
  ],
  providers: [
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
    entityDataService: EntityDataService,
    userDataService: UserDataService,
    notificationDataService: NotificationDataService
  ) {
    entityDataService.registerService('User', userDataService);
    entityDataService.registerService('Notification', notificationDataService);
  }
}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}


