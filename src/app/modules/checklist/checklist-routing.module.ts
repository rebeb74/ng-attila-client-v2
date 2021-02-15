import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChecklistComponent } from './checklist.component';
import { ChecklistResolver } from './resolvers/checklist.resolver';

const routes: Routes = [
  { path: '', resolve: { checklist: ChecklistResolver }, component: ChecklistComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChecklistRoutingModule { }
