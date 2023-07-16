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
import { Subscription, fromEvent, merge, of } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Global";
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;
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

  ngOnInit(): void {
    this.checkNetworkStatus();
  }

  // To check internet connection stability
  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, "online"),
      fromEvent(window, "offline")
    )
      .pipe(map(() => navigator.onLine))
      .subscribe((status) => (this.networkStatus = status));
  }

  checkConnection() {
    if (!this.networkStatus) {
      this.networkStatus = true;
      setTimeout(() => {
        this.networkStatus = false;
      }, 2000);
    }
  }

  ngOnDestroy(): void {
    this.networkStatus$.unsubscribe();
  }
}
