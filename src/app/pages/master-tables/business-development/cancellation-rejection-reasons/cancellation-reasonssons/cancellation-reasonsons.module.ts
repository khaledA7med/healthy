import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancellationReasonsComponent } from './cancellation-reasons/cancellation-reasons.component';
import { CancellationReasonsFormsComponent } from './cancellation-reasons/cancellation-reasons-forms.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';

export const routes: Routes = [
  { path: "", component: CancellationReasonsComponent },
];

@NgModule({
  declarations: [
    CancellationReasonsComponent,
    CancellationReasonsFormsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ]
})
export class CancellationReasonsonsModule { }
