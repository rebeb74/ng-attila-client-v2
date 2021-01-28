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
import { AskPasswordComponent } from './ask-password/ask-password.component';
import { AskNewFriendComponent } from './ask-new-friend/ask-new-friend.component';

// AOT compilation support
function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    SettingsComponent,
    AskPasswordComponent,
    AskNewFriendComponent,
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
  entryComponents: [AskPasswordComponent, AskNewFriendComponent],
})
export class SettingsModule { }
