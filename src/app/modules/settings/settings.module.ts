import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SettingsRoutingModule } from './settings-routing.module';
import { AskPasswordComponent } from './account-card/ask-password/ask-password.component';
import { AskNewFriendComponent } from './friend-card/ask-new-friend/ask-new-friend.component';
import { AccountCardComponent } from './account-card/account-card.component';
import { LanguageCardComponent } from './language-card/language-card.component';
import { ResetPasswordCardComponent } from './reset-password-card/reset-password-card.component';
import { FriendCardComponent } from './friend-card/friend-card.component';
import { SettingsService } from './services/settings.service';

// AOT compilation support
function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    SettingsComponent,
    AskPasswordComponent,
    AskNewFriendComponent,
    AccountCardComponent,
    LanguageCardComponent,
    ResetPasswordCardComponent,
    FriendCardComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
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
  providers: [
    SettingsService
  ]
})
export class SettingsModule { }
