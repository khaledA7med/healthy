import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FullCalendarModule } from "@fullcalendar/angular";

import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { ActivitiesComponent } from "./activities.component";
import { TaskPreviewModule } from "src/app/shared/components/task-preview/task-preview.module";

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
    TaskPreviewModule,
  ],
})
export class ActivitiesModule {}
