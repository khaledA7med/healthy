import { Component, OnInit } from "@angular/core";
import { localStorageKeys } from "src/app/core/models/localStorageKeys";
import { reserved } from "src/app/core/models/reservedWord";

@Component({
  selector: "app-two-column",
  templateUrl: "./two-column.component.html",
  styleUrls: ["./two-column.component.scss"],
})

/**
 * TwoColumnComponent
 */
export class TwoColumnComponent implements OnInit {
  constructor() {}
  isCondensed = false;
  layoutMode: string =
    localStorage.getItem(localStorageKeys.themeMode) || reserved.lightMode;

  ngOnInit(): void {
    document.documentElement.setAttribute("data-layout", "twocolumn");
    document.documentElement.setAttribute("data-topbar", this.layoutMode);
    document.documentElement.setAttribute("data-sidebar", this.layoutMode);
    document.documentElement.setAttribute("data-sidebar-size", "lg");
    document.documentElement.setAttribute("data-layout-style", "default");
    document.documentElement.setAttribute("data-layout-mode", this.layoutMode);
    document.documentElement.setAttribute("data-layout-width", "fluid");
    document.documentElement.setAttribute("data-layout-position", "fixed");
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    document.body.classList.toggle("twocolumn-panel");
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
}
