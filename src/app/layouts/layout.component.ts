import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthenticationService } from "../core/services/auth.service";

import { EventService } from "../core/services/event.service";
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
    private auth: AuthenticationService
  ) {}
  ngOnInit(): void {
    this.layoutType = LAYOUT_VERTICAL;

    // listen to event and change the layout, theme, etc
    const sub = this.eventService.subscribe("changeLayout", (layout) => {
      this.layoutType = layout;
    });

    const sub2 = this.auth.getAccessRoles().subscribe((res) => {
      console.log(res);
    });
    this.subscribe.push(sub, sub2);
  }

  ngOnDestroy(): void {
    if (this.subscribe) this.subscribe.forEach((s) => s.unsubscribe());
  }
}
