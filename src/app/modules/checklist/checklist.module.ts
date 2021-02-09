import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChecklistRoutingModule } from './checklist-routing.module';
import { ChecklistComponent } from './checklist.component';

import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DefaultDataServiceConfig, EntityDataService } from '@ngrx/data';
import { ChecklistDataService } from './store/checklist-data.service';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChecklistEntityService } from './store/checklist-entity.service';
import { ChecklistSocketService } from './services/checklist-socket.service';
import { ChecklistResolver } from './resolvers/checklist.resolver';
import { ChecklistService } from './services/checklist.service';


const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: environment.apiUrl,
  timeout: 3000, // request timeout
};

// AOT compilation support
function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [ChecklistComponent],
  imports: [
    CommonModule,
    ChecklistRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (httpTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    ChecklistDataService,
    ChecklistEntityService,
    ChecklistSocketService,
    ChecklistResolver,
    ChecklistService,
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig }
  ]
})
export class ChecklistModule {
  constructor(
    entityDataService: EntityDataService,
    checklistDataService: ChecklistDataService,
  ) {
    entityDataService.registerService('Checklist', checklistDataService);
  }
}
