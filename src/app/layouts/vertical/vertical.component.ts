import { Component, OnInit } from "@angular/core";
import { localStorageKeys } from "src/app/core/models/localStorageKeys";
import { reserved } from "src/app/core/models/reservedWord";

@Component({
  selector: "app-vertical",
  templateUrl: "./vertical.component.html",
  styleUrls: ["./vertical.component.scss"],
})
export class VerticalComponent implements OnInit {
  isCondensed = false;
  layoutMode: string;
  constructor() {
    this.layoutMode =
      localStorage.getItem(localStorageKeys.themeMode) || reserved.lightMode;
  }

  ngOnInit(): void {
    document.documentElement.setAttribute("data-layout", "vertical");
    document.documentElement.setAttribute("data-topbar", this.layoutMode);
    document.documentElement.setAttribute("data-sidebar", this.layoutMode);
    document.documentElement.setAttribute("data-sidebar-size", "lg");
    document.documentElement.setAttribute("data-layout-style", "default");
    document.documentElement.setAttribute("data-layout-mode", this.layoutMode);
    document.documentElement.setAttribute("data-layout-width", "fluid");
    document.documentElement.setAttribute("data-layout-position", "fixed");

    window.addEventListener("resize", function () {
      if (document.documentElement.clientWidth <= 767) {
        document.documentElement.setAttribute("data-sidebar-size", "");
      } else if (document.documentElement.clientWidth <= 1024) {
        document.documentElement.setAttribute("data-sidebar-size", "sm");
      } else if (document.documentElement.clientWidth >= 1024) {
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    });
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    document.body.classList.toggle("sidebar-enable");
    const currentSIdebarSize =
      document.documentElement.getAttribute("data-sidebar-size");
    if (document.documentElement.clientWidth >= 767) {
      if (currentSIdebarSize == null) {
        document.documentElement.getAttribute("data-sidebar-size") == null ||
        document.documentElement.getAttribute("data-sidebar-size") == "lg"
          ? document.documentElement.setAttribute("data-sidebar-size", "sm")
          : document.documentElement.setAttribute("data-sidebar-size", "lg");
      } else if (currentSIdebarSize == "md") {
        document.documentElement.getAttribute("data-sidebar-size") == "md"
          ? document.documentElement.setAttribute("data-sidebar-size", "sm")
          : document.documentElement.setAttribute("data-sidebar-size", "md");
      } else {
        document.documentElement.getAttribute("data-sidebar-size") == "sm"
          ? document.documentElement.setAttribute("data-sidebar-size", "lg")
          : document.documentElement.setAttribute("data-sidebar-size", "sm");
      }
    }
    if (document.documentElement.clientWidth <= 767) {
      document.body.classList.toggle("vertical-sidebar-enable");
    }
    this.isCondensed = !this.isCondensed;
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
