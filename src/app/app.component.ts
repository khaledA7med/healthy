import { Component } from "@angular/core";
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
import { reserved } from "./core/models/reservedWord";
import { EventService } from "./core/services/event.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Oasis";
  constructor(private router: Router, private eventService: EventService) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.eventService.broadcast(reserved.isLoading, true);
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.eventService.broadcast(reserved.isLoading, false);
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
