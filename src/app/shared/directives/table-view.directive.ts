import { AfterViewInit, Directive, ElementRef, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { EventService } from "../../core/services/event.service";
import { localStorageKeys } from "../../core/models/localStorageKeys";
import { reserved } from "../../core/models/reservedWord";
import PerfectScrollbar from "perfect-scrollbar";

@Directive({
  selector: "[appTableView]",
})
export class TableViewDirective implements OnDestroy, AfterViewInit {
  mode: string =
    localStorage.getItem(localStorageKeys.themeMode) || reserved.lightMode;

  subscribe: Subscription;

  constructor(private elem: ElementRef, private eventService: EventService) {
    this.loadMode(this.mode);
    this.subscribe = this.eventService.subscribe(reserved.changeMode, (mode) =>
      this.loadMode(mode)
    );
  }
  ngAfterViewInit(): void {
    const agBodyHorizontalViewport: HTMLElement =
      this.elem.nativeElement.querySelector(
        ".gridScrollbar .ag-body-horizontal-scroll-viewport"
      );
    const agBodyViewport: HTMLElement = this.elem.nativeElement.querySelector(
      ".gridScrollbar .ag-body-vertical-scroll-viewport"
    );

    if (agBodyViewport) {
      const vertical = new PerfectScrollbar(agBodyViewport, {
        wheelPropagation: true,
        wheelSpeed: 1,
        minScrollbarLength: 20,
      });
      vertical.update();
    }
    if (agBodyHorizontalViewport) {
      const horizontal = new PerfectScrollbar(agBodyHorizontalViewport, {
        wheelPropagation: true,
        wheelSpeed: 1,
        minScrollbarLength: 20,
      });
      horizontal.update();
    }
  }

  loadMode(mode: string): void {
    mode === reserved.lightMode
      ? this.elem.nativeElement.classList.replace(
          "ag-theme-alpine-dark",
          "ag-theme-alpine"
        )
      : mode === reserved.darkMode
      ? this.elem.nativeElement.classList.replace(
          "ag-theme-alpine",
          "ag-theme-alpine-dark"
        )
      : this.elem.nativeElement.classList.add("ag-theme-alpine");
  }

  ngOnDestroy(): void {
    this.subscribe?.unsubscribe();
  }
}
