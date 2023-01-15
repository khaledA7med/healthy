import { Component, OnInit } from "@angular/core";
import { localStorageKeys } from "src/app/core/models/localStorageKeys";
import { reserved } from "src/app/core/models/reservedWord";

@Component({
  selector: "app-horizontal",
  templateUrl: "./horizontal.component.html",
  styleUrls: ["./horizontal.component.scss"],
})

/**
 * Horizontal Component
 */
export class HorizontalComponent implements OnInit {
  constructor() {}
  layoutMode: string =
    localStorage.getItem(localStorageKeys.themeMode) || reserved.lightMode;
  ngOnInit(): void {
    document.documentElement.setAttribute("data-layout", "horizontal");
    document.documentElement.setAttribute("data-topbar", this.layoutMode);
    document.documentElement.setAttribute("data-sidebar", "dark");
    document.documentElement.setAttribute("data-sidebar-size", "lg");
    document.documentElement.setAttribute("data-layout-style", "default");
    document.documentElement.setAttribute("data-layout-mode", this.layoutMode);
    document.documentElement.setAttribute("data-layout-width", "fluid");
    document.documentElement.setAttribute("data-layout-position", "fixed");
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle("right-bar-enabled");
    const rightBar = document.getElementById("theme-settings-offcanvas");
    if (rightBar != null) {
      rightBar.classList.toggle("show");
      rightBar.setAttribute("style", "visibility: visible;");
    }
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    if (document.documentElement.clientWidth <= 1024) {
      document.body.classList.toggle("menu");
    }
  }
}
