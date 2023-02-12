import { Directive, ElementRef, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { EventService } from "../../core/services/event.service";
import { localStorageKeys } from "../../core/models/localStorageKeys";
import { reserved } from "../../core/models/reservedWord";

@Directive({
  selector: "[appTableView]",
})
export class TableViewDirective implements OnDestroy {
  mode: string =
    localStorage.getItem(localStorageKeys.themeMode) || reserved.lightMode;

  subscribe: Subscription;

  constructor(private elem: ElementRef, private eventService: EventService) {
    this.loadMode(this.mode);
    this.subscribe = this.eventService.subscribe(reserved.changeMode, (mode) =>
      this.loadMode(mode)
    );
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
