import { Component, OnInit } from "@angular/core";
import { EventService } from "../../core/services/event.service";
import {
  LAYOUT_VERTICAL,
  LAYOUT_MODE,
  LAYOUT_WIDTH,
  LAYOUT_POSITION,
  TOPBAR,
  SIDEBAR_SIZE,
  SIDEBAR_VIEW,
  SIDEBAR_COLOR,
  SIDEBAR_IMAGE,
} from "../layout.model";

@Component({
  selector: "app-rightsidebar",
  templateUrl: "./rightsidebar.component.html",
  styleUrls: ["./rightsidebar.component.scss"],
})

/**
 * Right Sidebar component
 */
export class RightsidebarComponent implements OnInit {
  layout: string | undefined;
  mode: string | undefined;
  width: string | undefined;
  position: string | undefined;
  topbar: string | undefined;
  size: string | undefined;
  sidebarView: string | undefined;
  sidebar: string | undefined;
  attribute: any;
  sidebarImage: any;
  grd: any;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.layout = LAYOUT_VERTICAL;
    this.mode = LAYOUT_MODE;
    this.width = LAYOUT_WIDTH;
    this.position = LAYOUT_POSITION;
    this.topbar = TOPBAR;
    this.size = SIDEBAR_SIZE;
    this.sidebarView = SIDEBAR_VIEW;
    this.sidebar = SIDEBAR_COLOR;
    this.sidebarImage = SIDEBAR_IMAGE;
    this.attribute = "";
  }

  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast("changeLayout", layout);
  }

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
