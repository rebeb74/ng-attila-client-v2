import { NgModule } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';



@NgModule({
  imports: [
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatBadgeModule,
    MatMenuModule
  ],
  exports: [
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatBadgeModule,
    MatMenuModule
  ],
  providers: [
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: false}},
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['l', 'LL', 'L', 'X'],
        },
        display: {
          dateInput: 'LL',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    }
    
  ]
})
export class MaterialModule { }
