import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MaterialModule } from '../shared/material/material.module';
import { AuthModule } from './auth/auth.module';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { SidenavNotificationsComponent } from './sidenav-notifications/sidenav-notifications.component';
import { CoreComponent } from './core.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CalendarService } from '../modules/calendar/services/calendar.service';
import { EventEntityService } from '../modules/calendar/store/event-entity.service';
import { ChecklistService } from '../modules/checklist/services/checklist.service';
import { ChecklistEntityService } from '../modules/checklist/store/checklist-entity.service';
import { FooterComponent } from './navigation/footer/footer.component';
import { AskUserToUpdateComponent } from './pwa/ask-user-to-update/ask-user-to-update.component';
import { PwaService } from './pwa/pwa.service';

// AOT compilation support
function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    SidenavNotificationsComponent,
    CoreComponent,
    FooterComponent,
    AskUserToUpdateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AuthModule,
    FlexLayoutModule,
    MaterialModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (httpTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  exports: [
  ],
  providers: [
    CalendarService,
    ChecklistService,
    EventEntityService,
    ChecklistEntityService,
    PwaService
  ]
})
export class CoreModule { }
