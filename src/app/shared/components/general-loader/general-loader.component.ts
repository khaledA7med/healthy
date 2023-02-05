import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { reserved } from "src/app/core/models/reservedWord";
import { EventService } from "src/app/core/services/event.service";

@Component({
  selector: "app-general-loader",
  templateUrl: "./general-loader.component.html",
  styleUrls: ["./general-loader.component.scss"],
})
export class GeneralLoaderComponent implements OnInit, OnDestroy {
  subscribe!: Subscription;
  isLoading: boolean = false;
  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.subscribe = this.eventService.subscribe(
      reserved.isLoading,
      (loading: boolean) => {
        this.isLoading = loading;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscribe && this.subscribe.unsubscribe();
  }
}
