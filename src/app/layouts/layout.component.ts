import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { Privigles } from "../core/models/iuser";
import { AuthenticationService } from "../core/services/auth.service";

import { EventService } from "../core/services/event.service";
import { PermissionsService } from "../core/services/permissions.service";
import { IBaseResponse } from "../shared/app/models/App/IBaseResponse";
import { LAYOUT_VERTICAL } from "./layout.model";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})

/**
 * Layout Component
 */
export class LayoutComponent implements OnInit, OnDestroy {
  layoutType!: string;
  subscribe: Subscription[] = [];
  constructor(
    private eventService: EventService,
    private auth: AuthenticationService,
    private perm: PermissionsService
  ) {}
  ngOnInit(): void {
    this.layoutType = LAYOUT_VERTICAL;

    // listen to event and change the layout, theme, etc
    const sub = this.eventService.subscribe("changeLayout", (layout) => {
      this.layoutType = layout;
    });

    this.subscribe.push(sub);
  }

  ngOnDestroy(): void {
    if (this.subscribe) this.subscribe.forEach((s) => s.unsubscribe());
  }
}
