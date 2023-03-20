import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FullCalendarComponent } from "@fullcalendar/angular";

import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core"; // useful for typechecking
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

import { INITIAL_EVENTS, createEventId } from "./event-util";

@Component({
  selector: "app-activities",
  templateUrl: "./activities.component.html",
  styleUrls: ["./activities.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesComponent implements OnInit, AfterViewInit {
  @ViewChild("calendar") calendarComponent?: FullCalendarComponent;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private render: Renderer2,
    private el: ElementRef
  ) {}
  ngAfterViewInit(): void {
    let filter = this.el.nativeElement.querySelector(".fc-filters-button");
    let btns = this.el.nativeElement.querySelectorAll(".btn");
    let group = this.el.nativeElement.querySelectorAll(
      ".fc-toolbar-chunk .btn-group button"
    );
    let groupActive = this.el.nativeElement.querySelectorAll(
      ".fc-toolbar-chunk .btn-group button.active"
    );
    group.forEach((element: HTMLElement) => {
      this.render.setStyle(element, "height", "26px");
      this.render.setStyle(element, "padding", "3px 11px");
    });
    groupActive.forEach((element: HTMLElement) => {
      this.render.setStyle(element, "height", "26px");
      this.render.setStyle(element, "padding", "3px 11px");
    });
    btns.forEach((element: HTMLElement) =>
      this.render.addClass(element, "btn-sm")
    );
    this.render.addClass(filter, "btn-soft-info");
    this.render.addClass(filter, "btn-sm");
    this.render.removeClass(filter, "btn-primary");
  }

  calendarOptions: CalendarOptions = {
    timeZone: "local",
    expandRows: true,
    height: "80vh",
    contentHeight: 850,
    droppable: true,
    navLinks: true,

    initialView: "dayGridMonth",

    themeSystem: "bootstrap5",
    dayMaxEventRows: true,
    weekends: true,
    businessHours: {
      daysOfWeek: [0, 1, 2, 3, 4],
      startTime: "8:00",
      endTime: "16:00",
    },
    plugins: [
      dayGridPlugin,
      interactionPlugin,
      timeGridPlugin,
      listPlugin,
      bootstrap5Plugin,
    ],
    views: {
      timeGrid: {
        dayMaxEventRows: 4, // adjust to 6 only for timeGridWeek/timeGridDay
      },
    },
    customButtons: {
      addNewTask: {
        text: "New Activity",
        click: () => {
          console.log("New Activity");
        },
      },
      filters: {
        text: `filter`,
        click: () => {
          console.log("filter");
        },
      },
    },
    headerToolbar: {
      left: "prev,next today filters",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek addNewTask",
    },
    windowResize: (view) => {
      // var newView = getInitialView();
      // calendar.changeView(newView);
    },
    editable: true,
    selectable: true,
    selectMirror: false,
    dateClick: this.handleDateClick.bind(this),
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: INITIAL_EVENTS,
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];
  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selectInfo.view.calendar;
    console.log(selectInfo);
    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  getRawCalendarAPI() {
    let calendarApi = this.calendarComponent?.getApi();
    console.log(calendarApi);
    calendarApi?.next();
  }
  handleDateClick(arg: any) {
    alert("date click! " + arg.dateStr);
    this.getRawCalendarAPI();
  }

  ngOnInit(): void {}
}
