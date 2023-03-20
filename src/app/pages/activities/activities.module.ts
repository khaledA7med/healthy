import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FullCalendarModule } from "@fullcalendar/angular";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { ActivitiesComponent } from "./activities.component";

export const routes: Routes = [
  { path: AppRoutes.Activities.taskboard, component: ActivitiesComponent },
];

@NgModule({
  declarations: [ActivitiesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    FullCalendarModule,
  ],
})
export class ActivitiesModule {}
