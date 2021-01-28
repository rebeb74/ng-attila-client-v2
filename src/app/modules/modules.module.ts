import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '../shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { AskPasswordComponent } from './settings/ask-password.component';
import { AskNewFriendComponent } from './settings/ask-new-friend.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

// AOT compilation support
function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    SettingsComponent,
    HomeComponent,
    AskPasswordComponent,
    AskNewFriendComponent,
    PageNotFoundComponent,
    ContactUsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (httpTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [AskPasswordComponent, AskNewFriendComponent],
})
export class ModulesModule { }
