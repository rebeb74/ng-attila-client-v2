import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendarComponent } from './calendar.component';
import { EventResolver } from './resolvers/event.resolver';

const routes: Routes = [
  { path: '', resolve: { event: EventResolver }, component: CalendarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
