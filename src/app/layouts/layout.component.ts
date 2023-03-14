import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

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
  constructor(private eventService: EventService) {}
  ngOnInit(): void {
    this.layoutType = LAYOUT_VERTICAL;

    // listen to event and change the layout, theme, etc
    const sub = this.eventService.subscribe(
      "changeLayout",
      (layout) => (this.layoutType = layout)
    );

    this.subscribe.push(sub);
  }

  ngOnDestroy(): void {
    if (this.subscribe) this.subscribe.forEach((s) => s.unsubscribe());
  }
}
