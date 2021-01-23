import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChecklistRoutingModule } from './checklist-routing.module';
import { ChecklistComponent } from './checklist.component';


@NgModule({
  declarations: [ChecklistComponent],
  imports: [
    CommonModule,
    ChecklistRoutingModule
  ]
})
export class ChecklistModule { }
