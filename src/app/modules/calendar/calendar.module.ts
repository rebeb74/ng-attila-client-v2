import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DefaultDataServiceConfig, EntityDataService } from '@ngrx/data';

import { CalendarModule as CalModule } from './app-calendar/calendar/calendar.module';
import { CalendarService } from './services/calendar.service';
import { EventResolver } from './resolvers/event.resolver';
import { EventEntityService } from './store/event-entity.service';
import { EventSocketService } from './services/event-socket.service';
import { EventDataService } from './store/event-data.service';
import { calendarReducer } from './store/calendar.reducer';

import { CalendarRoutingModule } from './calendar-routing.module';
import { MaterialModule } from '../../shared/material/material.module';

import { CalendarComponent } from './calendar.component';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AddEventComponent } from './add-event/add-event.component';
import { StoreModule } from '@ngrx/store';
import { EventListComponent } from './event-list/event-list.component';
import { SwipeAngularListModule } from 'src/app/shared/swipe-list/swipe-angular-list.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EditEventComponent } from './edit-event/edit-event.component';
import { AppCalendarComponent } from './app-calendar/app-calendar.component';
import { SelectComponent } from './select/select.component';


const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: environment.apiUrl,
  timeout: 3000, // request timeout
};

// AOT compilation support
function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    CalendarComponent,
    AddEventComponent,
    EventListComponent,
    EditEventComponent,
    AppCalendarComponent,
    SelectComponent,
  ],
  imports: [
    CommonModule,
    SwipeAngularListModule,
    CalendarRoutingModule,
    CalModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    StoreModule.forFeature('calendar', calendarReducer),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (httpTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    EventDataService,
    EventEntityService,
    EventDataService,
    EventSocketService,
    CalendarService,
    EventResolver,
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig }
  ]
})
export class CalendarModule {
  constructor(
    entityDataService: EntityDataService,
    eventDataService: EventDataService,
  ) {
    entityDataService.registerService('Event', eventDataService);
  }
}
