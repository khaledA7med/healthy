import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  Inject,
} from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

// Menu Pachage
// import MetisMenu from 'metismenujs';

import { MENU } from "./menu";
import { MenuItem } from "../sidebar/menu.model";
import { DOCUMENT } from "@angular/common";
import { EventService } from "src/app/core/services/event.service";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { Title } from "@angular/platform-browser";
import { IPrivileges, UserAccess } from "src/app/core/models/iuser";
import { localStorageKeys } from "src/app/core/models/localStorageKeys";
import { reserved } from "src/app/core/models/reservedWord";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { filter, map, mergeMap } from "rxjs/operators";
import { MenuService } from "src/app/shared/services/menu.service";

@Component({
  selector: "app-horizontal-topbar",
  templateUrl: "./horizontal-topbar.component.html",
  styleUrls: ["./horizontal-topbar.component.scss"],
})
export class HorizontalTopbarComponent implements OnInit {
  element: any;

  // menu: any;
  menuItems: MenuItem[] = [];
  @ViewChild("sideMenu") sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  mode: string | undefined;
  title: string = "";

  modeKey: { light: string; dark: string } = {
    dark: reserved.darkMode,
    light: reserved.lightMode,
  };

  privileges!: IPrivileges;

  userData!: UserAccess;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventService: EventService,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private menu: MenuService
  ) {}
  ngOnInit(): void {
    this.userData = this.authService.getUser();

    this.element = document.documentElement;

    this.mode = localStorage.getItem(localStorageKeys.themeMode)!;
    this.changeMode(this.mode);

    // Menu Items
    // this.permission.getAccessRoles().subscribe((res: IPrivileges) => {
    //   this.privileges = res;
    //   this.menuItems = this.menu.getMenu(this.privileges);
    // this.modifyMenuAuth();
    // });

    this.menuItems = this.menu.getMenu();
    this.subscribeToRouteChangeEvents();
  }

  /***
   * Activate droup down set
   */
  ngAfterViewInit() {
    this.initActiveMenu();
  }

  private setTitleFromRouteData(routeData: any) {
    if (routeData && routeData["title"]) this.title = routeData["title"];
    else this.title = "";
    this.titleService.setTitle(this.title + " | Oasis - Computer Systems");
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

  removeActivation(items: any) {
    items.forEach((item: any) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        item.nextElementSibling
          ? item.nextElementSibling.classList.remove("show")
          : null;
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });
  }

  // remove active items of two-column-menu
  activateParentDropdown(item: any) {
    // navbar-nav menu add active
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
    if (parentCollapseDiv) {
      // to set aria expand true remaining
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute(
        "aria-expanded",
        "true"
      );
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement
          .closest(".collapse")
          .classList.add("show");
        if (
          parentCollapseDiv.parentElement.closest(".collapse")
            .previousElementSibling
        )
          parentCollapseDiv.parentElement
            .closest(".collapse")
            .previousElementSibling.classList.add("active");
        parentCollapseDiv.parentElement
          .closest(".collapse")
          .previousElementSibling.setAttribute("aria-expanded", "true");
      }
      return false;
    }
    return false;
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

  updateActive(event: any) {
    const ul = document.getElementById("navbar-nav");

    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
  }

  initActiveMenu() {
    const pathName = window.location.pathname;
    const ul = document.getElementById("navbar-nav");

    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) =>
        x.classList.contains("active")
      );
      this.removeActivation(activeItems);
      let matchingMenuItem = items.find((x: any) => {
        return x.pathname === pathName;
      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  toggleSubItem(event: any) {
    if (event.target && event.target.nextElementSibling)
      event.target.nextElementSibling.classList.toggle("show");
  }

  toggleItem(event: any) {
    let isCurrentMenuId = event.target.closest("a.nav-link");

    let isMenu = isCurrentMenuId.nextElementSibling as any;
    let dropDowns = Array.from(document.querySelectorAll("#navbar-nav .show"));
    dropDowns.forEach((node: any) => {
      node.classList.remove("show");
    });

    isMenu ? isMenu.classList.add("show") : null;

    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const iconItems = Array.from(ul.getElementsByTagName("a"));
      let activeIconItems = iconItems.filter((x: any) =>
        x.classList.contains("active")
      );
      activeIconItems.forEach((item: any) => {
        item.setAttribute("aria-expanded", "false");
        item.classList.remove("active");
      });
    }
    if (isCurrentMenuId) {
      this.activateParentDropdown(isCurrentMenuId);
    }
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }
}
