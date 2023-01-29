import { Component, Injectable, Input, OnInit, OnChanges } from "@angular/core";
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
  model!: NgbDateStruct;
  @Input() gregorianDate: any;
  date!: { year: number; month: number };

  @Input("currentDate") currentDate!: [
    year: number,
    month: number,
    day: number
  ];
  constructor(config: NgbInputDatepickerConfig, public test: NgbCalendar, public test2: NgbCalendarIslamicUmalqura) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: 2099, month: 12, day: 31 };
    config.placement = ["top-end", "top-start", "bottom-end", "bottom-start"];

    // weekends are disabled
    // config.markDisabled = (date: NgbDate) => calendar.getWeekday(date) >= 6;
  }

  ngOnChanges(): void {
    // console.log(this.gregorianDate)
    if (this.gregorianDate)

      this.date = this.test2.fromGregorian(new Date(`${this.gregorianDate.year}-${this.gregorianDate.month}-${this.gregorianDate.day}`));
  }

  ngOnInit(): void { }
}
