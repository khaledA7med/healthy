import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { Component, OnInit, EventEmitter, Output, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { EventService } from "../../core/services/event.service";

//Logout
import { AuthenticationService } from "../../core/services/auth.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

import { localStorageKeys } from "src/app/core/models/localStorageKeys";
import { reserved } from "src/app/core/models/reservedWord";
import { filter, map, mergeMap } from "rxjs/operators";
import { UserAccess } from "src/app/core/models/iuser";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})
export class TopbarComponent implements OnInit {
  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  modeKey: { light: string; dark: string } = {
    dark: reserved.darkMode,
    light: reserved.lightMode,
  };

  title: string = "";

  userData!: UserAccess;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventService: EventService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.getUser();

    this.element = document.documentElement;

    this.mode = localStorage.getItem(localStorageKeys.themeMode)!;
    this.changeMode(this.mode);

    this.subscribeToRouteChangeEvents();
  }

  private setTitleFromRouteData(routeData: any) {
    if (routeData && routeData["title"]) this.title = routeData["title"];
    else this.title = "";
    this.titleService.setTitle(this.title);
  }

  private getLatestChild(route: any) {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  private subscribeToRouteChangeEvents() {
    // Set initial title
    const latestRoute = this.getLatestChild(this.route);
    if (latestRoute) {
      this.setTitleFromRouteData(latestRoute.data.getValue());
    }
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route),
        map((route) => this.getLatestChild(route)),
        filter((route) => route.outlet === "primary"),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        this.setTitleFromRouteData(event);
      });
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Topbar Light-Dark Mode Change
   */
  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast(reserved.changeMode, mode);
    switch (mode) {
      case reserved.lightMode:
        document.body.setAttribute("data-layout-mode", reserved.lightMode);
        this.element.setAttribute("data-layout-mode", reserved.lightMode);
        document.body.setAttribute("data-sidebar", reserved.lightMode);
        this.element.setAttribute("data-sidebar", reserved.lightMode);
        this.element.setAttribute("data-topbar", reserved.lightMode);
        localStorage.setItem(localStorageKeys.themeMode, reserved.lightMode);
        break;
      case reserved.darkMode:
        document.body.setAttribute("data-layout-mode", reserved.darkMode);
        this.element.setAttribute("data-layout-mode", reserved.darkMode);
        document.body.setAttribute("data-sidebar", reserved.darkMode);
        this.element.setAttribute("data-sidebar", reserved.darkMode);
        this.element.setAttribute("data-topbar", reserved.darkMode);
        localStorage.setItem(localStorageKeys.themeMode, reserved.darkMode);
        break;
      default:
        document.body.setAttribute("data-layout-mode", reserved.lightMode);
        break;
    }
  }

  /**
   * Logout the user
   */
  logout() {
    this.authService.logout();
    this.router.navigate([AppRoutes.Auth.login]);
  }

  windowScroll() {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      (document.getElementById("back-to-top") as HTMLElement).style.display =
        "block";
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display =
        "none";
    }
  }
}
