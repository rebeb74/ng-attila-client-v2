import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClient } from '@angular/common/http';

import { DefaultDataServiceConfig, EntityDataService } from '@ngrx/data';
import { ChecklistDataService } from './store/checklist-data.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ChecklistRoutingModule } from './checklist-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { environment } from 'src/environments/environment';
import { ChecklistEntityService } from './store/checklist-entity.service';
import { ChecklistSocketService } from './services/checklist-socket.service';
import { ChecklistResolver } from './resolvers/checklist.resolver';
import { ChecklistService } from './services/checklist.service';
import { checklistReducer } from './store/checklist.reducer';

import { ChecklistComponent } from './checklist.component';
import { ChecklistListComponent } from './checklist-list/checklist-list.component';
import { ChecklistItemsComponent } from './checklist-items/checklist-items.component';
import { AddChecklistComponent } from './add-checklist/add-checklist.component';
import { EditChecklistComponent } from './edit-checklist/edit-checklist.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToggleComponent } from './toggle/toggle.component';
import { EffectsModule } from '@ngrx/effects';
import { ChecklistEffects } from './store/checklist.effects';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ConfirmRemoveChecklistComponent } from './confirm-remove-checklist/confirm-remove-checklist.component';


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
    ChecklistComponent,
    ChecklistListComponent,
    ChecklistItemsComponent,
    AddChecklistComponent,
    EditChecklistComponent,
    ToggleComponent,
    ConfirmRemoveChecklistComponent
  ],
  imports: [
    CommonModule,
    ChecklistRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    DragDropModule,
    StoreModule.forFeature('checklist', checklistReducer),
    EffectsModule.forFeature([ChecklistEffects]),
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
