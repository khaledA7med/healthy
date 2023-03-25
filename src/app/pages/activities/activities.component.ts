import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FullCalendarComponent } from "@fullcalendar/angular";

import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventInput,
  EventMountArg,
} from "@fullcalendar/core"; // useful for typechecking
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

import { createEventId } from "./event-util";
import { ActivitiesService } from "src/app/shared/services/activities/activities.service";
import { ITaskParams } from "src/app/shared/app/models/Activities/itask-params";
import { Observable, Subscription } from "rxjs";
import { ITasks } from "src/app/shared/app/models/Activities/itasks";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NewTaskComponent } from "src/app/shared/components/new-task/new-task.component";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";

@Component({
  selector: "app-activities",
  templateUrl: "./activities.component.html",
  styleUrls: ["./activities.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActivitiesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("calendar") calendarComponent?: FullCalendarComponent;
  uiState = {};
  modalRef!: NgbModalRef;
  formData!: Observable<IBaseMasterTable>;
  subscribe: Subscription[] = [];
  constructor(
    private changeDetector: ChangeDetectorRef,
    private render: Renderer2,
    private el: ElementRef,
    private activityService: ActivitiesService,
    private modalService: NgbModal,
    private tables: MasterTableService
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
    selectable: true,
    navLinks: true,

    initialView: "dayGridMonth",

    themeSystem: "bootstrap5",
    dayMaxEventRows: true,
    weekends: true,
    editable: true,
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
        click: () => this.addNewTask(),
      },
      filters: {
        text: `filter`,
        click: () => {
          console.log("filter");
        },
      },
    },
    eventTimeFormat: {
      // like '14:30:00'
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    },
    displayEventTime: false,
    headerToolbar: {
      left: "prev,next today filters",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek addNewTask",
    },
    windowResize: (view) => {
      // var newView = getInitialView();
      // calendar.changeView(newView);
    },
    dateClick: this.handleDateClick.bind(this),
    select: this.handleDateSelect.bind(this),
    eventDidMount: (info: EventMountArg) => this.eventTooltip(info),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDisplay: "block",
    events: ({ start, end }: EventInput, cb: (evt: EventInput[]) => void) =>
      this.getAllEvents({ start, end }, cb),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];
  handleDateSelect(selectInfo: DateSelectArg) {
    const title = 'prompt("Please enter a new title for your event")';
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    let data = {
      startstr: selectInfo.startStr,
      endstr: selectInfo.endStr,
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay,
    };

    this.addNewTask(data);
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event);
    // if (
    //   confirm(
    //     `Are you sure you want to delete the event '${clickInfo.event.title}'`
    //   )
    // ) {
    //   clickInfo.event.remove();
    // }
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
    // alert("date click! " + arg.dateStr);
    // this.getRawCalendarAPI();
  }

  eventTooltip(info: EventMountArg) {
    // var tooltip = new ngbtoo(info.el, {
    //   title: info.event.extendedProps.description,
    //   placement: 'top',
    //   trigger: 'hover',
    //   container: 'body'
    // });
  }

  getAllEvents(
    { start, end }: EventInput,
    cb: (evt: EventInput[]) => void,
    formData?: ITaskParams
  ) {
    const from = ((start as Date).getTime() / 1000).toString();
    const to = ((end as Date).getTime() / 1000).toString();

    let data: ITaskParams = {
      ...formData,
      timeStampFrom: from,
      timeStampTo: to,
      module: formData?.module || "All",
    };

    let sub = this.activityService
      .getAllTasks(data)
      .subscribe((res: IBaseResponse<ITasks[]>) => {
        let events: EventInput[] | undefined = [];
        let dateNow = new Date().getTime();
        events = res.data?.map((el: ITasks) => {
          let deadlineChecker = new Date(el.dueDateTo!).getTime() < dateNow;
          return {
            id: el.sNo?.toString(),
            title: `${el.module} | ${el.taskName}`,
            borderColor: "#f1717100",
            start: el.dueDateFrom,
            end: el.dueDateTo,
            className:
              el.status === "Open" && deadlineChecker
                ? "bg-soft-danger"
                : el.status === "Closed"
                ? "bg-soft-success"
                : "bg-soft-warning",
            allDay: el.isAllDay,
            extendedProps: {
              ...el,
            } as ITasks,
          };
        });
        cb(events!);
      });
    this.subscribe.push(sub);
  }

  addNewTask(data?: { start?: Date; end?: Date; allDay?: boolean }) {
    this.modalRef = this.modalService.open(NewTaskComponent, {
      backdrop: "static",
      size: "lg",
      centered: true,
    });
    this.modalRef.componentInstance.clickedDate = {
      isAllDay: data?.allDay,
      dueDateFrom: data?.start,
      dueDateTo: data?.end,
    } as ITasks;
  }

  ngOnInit(): void {
    this.formData = this.tables.getBaseData(MODULES.Activities);
  }

  ngOnDestroy(): void {
    this.subscribe && this.subscribe.forEach((el) => el.unsubscribe());
  }
}
