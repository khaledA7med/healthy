import { Component, Injectable, Input, OnInit, OnChanges, EventEmitter, Output } from "@angular/core";
import {
  NgbCalendar,
  NgbCalendarIslamicUmalqura,
  NgbDatepickerI18n,
  NgbDateStruct,
  NgbInputDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";

const WEEKDAYS = ["ن", "ث", "ر", "خ", "ج", "س", "ح"];
const MONTHS = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

@Injectable()
export class IslamicI18n extends NgbDatepickerI18n {
  getMonthShortName(month: number) {
    return MONTHS[month - 1];
  }

  getMonthFullName(month: number) {
    return MONTHS[month - 1];
  }

  getWeekdayLabel(weekday: number) {
    return WEEKDAYS[weekday - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

@Component({
  selector: "app-hijri-picker",
  templateUrl: "./hijri-picker.component.html",
  styleUrls: ["./hijri-picker.component.scss"],
  providers: [
    NgbInputDatepickerConfig,
    NgbCalendarIslamicUmalqura,
    { provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura },
    { provide: NgbDatepickerI18n, useClass: IslamicI18n },
  ],
})
export class HijriPickerComponent implements OnInit, OnChanges {
  @Input() gregorianDate: any;
  date!: NgbDateStruct;
  @Input() model!: any;

  @Input("currentDate") currentDate!: [
    year: number,
    month: number,
    day: number
  ];

  @Output() dateChange: EventEmitter<any> = new EventEmitter()

  constructor(config: NgbInputDatepickerConfig, public changeDate: NgbCalendarIslamicUmalqura) {
    config.minDate = { year: 1100, month: 1, day: 1 };
    config.maxDate = { year: 1500, month: 12, day: 31 };
    config.placement = ["top-end", "top-start", "bottom-end", "bottom-start"];

    // weekends are disabled
    // config.markDisabled = (date: NgbDate) => calendar.getWeekday(date) >= 6;
  }

  ngOnChanges(): void {
    if(this.model){
      this.date = this.changeDate.fromGregorian(new Date(`${this.model.year}-${this.model.month}-${this.model.day}`));
    }
  }

  ngOnInit(): void { }

  onDateSelect(e: any) {
    this.dateChange.emit(e)
  }
}
