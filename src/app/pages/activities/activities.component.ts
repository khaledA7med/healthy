import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
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
  EventDropArg,
} from "@fullcalendar/core"; // useful for typechecking
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import interactionPlugin, {
  EventResizeDoneArg,
} from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

import { ActivitiesService } from "src/app/shared/services/activities/activities.service";
import { ITaskParams } from "src/app/shared/app/models/Activities/itask-params";
import { Observable, Subscription } from "rxjs";
import { ITasks } from "src/app/shared/app/models/Activities/itasks";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import {
  NgbModal,
  NgbModalRef,
  NgbOffcanvas,
} from "@ng-bootstrap/ng-bootstrap";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { FormControl, FormGroup } from "@angular/forms";
import { TaskPreviewComponent } from "src/app/shared/components/task-preview/task-preview.component";
import { MessagesService } from "src/app/shared/services/messages.service";

@Component({
  selector: "app-activities",
  templateUrl: "./activities.component.html",
  styleUrls: ["./activities.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActivitiesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("calendar") calendarComponent?: FullCalendarComponent;
  uiState = {
    lists: { assign: [] as any },
    isLoading: false as boolean,
  };
  modalRef!: NgbModalRef;
  formData!: Observable<IBaseMasterTable>;
  formGroup!: FormGroup;
  @ViewChild("filter") content!: TemplateRef<any>;
  subscribe: Subscription[] = [];
  constructor(
    private changeDetector: ChangeDetectorRef,
    private render: Renderer2,
    private el: ElementRef,
    private activityService: ActivitiesService,
    private modalService: NgbModal,
    private tables: MasterTableService,
    private offcanvas: NgbOffcanvas,
    private message: MessagesService
  ) {}

  initForm() {
    this.formGroup = new FormGroup({
      leadNo: new FormControl(null),
      requestNo: new FormControl(null),
      claimNo: new FormControl(null),
      taskName: new FormControl(null),
      assignedTo: new FormControl(null),
      assignedBy: new FormControl(null),
      status: new FormControl(null),
      type: new FormControl(null),
      module: new FormControl(null),
    });
  }

  get f() {
    return this.formGroup.controls;
  }

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
        click: () => this.openFilter(),
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
    windowResize: () =>
      this.calendarComponent?.getApi().changeView(this.getInitialView()),
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDrop: this.handleDragging.bind(this),
    eventResize: this.handleDragging.bind(this),
    eventDisplay: "block",
    events: ({ start, end }: EventInput, cb: (evt: EventInput[]) => void) =>
      this.getAllEvents({ start, end }, cb),
  };
  currentEvents: EventApi[] = [];

  getInitialView(): string {
    if (window.innerWidth >= 768 && window.innerWidth < 1200)
      return "timeGridWeek";
    else if (window.innerWidth <= 768) return "listMonth";
    else return "dayGridMonth";
  }

  handleDateSelect(selectInfo: DateSelectArg) {
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
    this.modalRef = this.modalService.open(TaskPreviewComponent, {
      backdrop: "static",
      size: "lg",
      centered: true,
      modalDialogClass: "task-preview",
      backdropClass: "modal-backdrop-preview",
    });

    let task = clickInfo.event.extendedProps as ITasks;
    this.modalRef.componentInstance.task = task;
    let sub = this.modalRef.closed.subscribe(() =>
      this.calendarComponent?.getApi().refetchEvents()
    );
    this.subscribe.push(sub);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  handleDragging(event: EventDropArg | EventResizeDoneArg) {
    let evt = event.event.extendedProps as ITasks,
      start = new Date(event.event.start!).getTime() / 1000,
      end = new Date(event.event.end!).getTime() / 1000;

    let data: ITasks = {
      sNo: evt.sNo ? +evt.sNo! : 0,
      module: evt.module!,
      moduleSNo: +evt.moduleSNo!,
      taskName: evt.taskName!,
      type: evt.type!,
      timeStampFrom: start.toString(),
      timeStampTo: end.toString(),
      isAllDay: evt.isAllDay!,
      status: "Open",
      taskDetails: evt.taskDetails!,
      assignedTo: evt.assignedTo!,
      clientName: evt.clientName!,
    };

    let sub = this.activityService
      .addTask(data)
      .subscribe((res: IBaseResponse<any>) => {
        if (!res.status) this.message.popup("Oops!", res.message!, "warning");
      });
    this.subscribe.push(sub);
  }

  openFilter() {
    this.offcanvas.open(this.content, {
      position: "top",
    });
  }

  submitFilter() {
    this.calendarComponent?.getApi().refetchEvents();
  }

  getAllEvents({ start, end }: EventInput, cb: (evt: EventInput[]) => void) {
    this.uiState.isLoading = true;
    const from = ((start as Date).getTime() / 1000).toString();
    const to = ((end as Date).getTime() / 1000).toString();
    let formData = this.formGroup.getRawValue();
    let data: ITaskParams = {
      ...formData,
      timeStampFrom: from,
      timeStampTo: to,
      module: formData.module || "All",
      assignedBy:
        formData.assignedBy === "@Me" ? "_Current" : formData.assignedBy,
      assignedTo:
        formData.assignedTo === "@Me" ? "_Current" : formData.assignedTo,
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
        this.offcanvas.dismiss();
        this.uiState.isLoading = false;
      });
    this.subscribe.push(sub);
  }

  addNewTask(data?: { start?: Date; end?: Date; allDay?: boolean }) {
    this.modalRef = this.modalService.open(TaskPreviewComponent, {
      backdrop: "static",
      size: "lg",
      centered: true,
      backdropClass: "modal-backdrop-preview",
    });
    this.modalRef.componentInstance.clickedDate = {
      isAllDay: data?.allDay,
      dueDateFrom: data?.start,
      dueDateTo: data?.end,
      isModule: false,
    } as ITasks;
    let sub = this.modalRef.closed.subscribe(() =>
      this.calendarComponent?.getApi().refetchEvents()
    );
    this.subscribe.push(sub);
  }

  ngOnInit(): void {
    this.initForm();
    this.formData = this.tables.getBaseData(MODULES.Activities);
    let sub = this.formData.subscribe((res) => {
      this.uiState.lists.assign = res.Producers?.content.filter(
        (el) => !el.name.startsWith("Direct Business")
      );
      this.uiState.lists.assign?.unshift({ id: Date.now(), name: "@Me" });
    });
    this.subscribe.push(sub);
  }

  ngOnDestroy(): void {
    this.subscribe && this.subscribe.forEach((el) => el.unsubscribe());
  }
}
