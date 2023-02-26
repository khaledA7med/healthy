import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormControl } from "@angular/forms";

import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from "@fullcalendar/core"; // useful for typechecking
import { FullCalendarComponent } from "@fullcalendar/angular";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { INITIAL_EVENTS, createEventId } from "./event-utils";

@Component({
	selector: "app-starter",
	templateUrl: "./starter.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ["./starter.component.scss"],
})

/**
 * Starter Component
 */
export class StarterComponent implements OnInit {
	// bread crumb items
	breadCrumbItems!: Array<{}>;
	@ViewChild("calendar") calendarComponent?: FullCalendarComponent;
	calendarOptions: CalendarOptions = {
		initialView: "dayGridMonth",
		plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
		headerToolbar: {
			left: "prev,next today",
			center: "title",
			right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
		},
		weekends: true,
		editable: true,
		selectable: true,
		selectMirror: false,
		// dateClick: this.handleDateClick.bind(this),
		select: this.handleDateSelect.bind(this),
		eventClick: this.handleEventClick.bind(this),
		eventsSet: this.handleEvents.bind(this),
		events: [
			{ title: "event 1", date: "2023-01-30" },
			{ title: "event 2", date: "2023-02-02" },
		],
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
		if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
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
	constructor(private http: HttpClient, private changeDetector: ChangeDetectorRef) {}

	ngOnInit(): void {
		// this.http.get('https://localhost:44376/')
		/**
		 * BreadCrumb
		 */
		this.breadCrumbItems = [{ label: "Pages" }, { label: "Starter", active: true }];
	}
}
