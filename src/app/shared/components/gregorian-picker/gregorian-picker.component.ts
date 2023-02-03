import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnChanges,
} from "@angular/core";
import {
  NgbCalendar,
  NgbCalendarIslamicUmalqura,
  NgbDateStruct,
  NgbInputDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-gregorian-picker",
  templateUrl: "./gregorian-picker.component.html",
  styleUrls: ["./gregorian-picker.component.scss"],
  providers: [NgbInputDatepickerConfig, NgbCalendarIslamicUmalqura],
})
export class GregorianPickerComponent implements OnChanges {
  date!: NgbDateStruct;
  @Input() model!: any;

  @Input() submitted: boolean = false;
  @Input() required: boolean = false;

  @Input("currentDate") currentDate!: any;

  @Output() dateChange: EventEmitter<any> = new EventEmitter();

  constructor(
    config: NgbInputDatepickerConfig,
    public changeDate: NgbCalendarIslamicUmalqura,
    private calendar: NgbCalendar
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: 2099, month: 12, day: 31 };
    config.placement = ["top-end", "top-start", "bottom-end", "bottom-start"];
  }

  ngOnChanges(): void {
    if (this.model) this.date = this.model;
    if (this.currentDate && !this.currentDate.year) {
      let crr = new Date(this.model);
      this.date = {
        day: +crr.getDate(),
        month: +crr.getMonth() + 1,
        year: +crr.getFullYear(),
      };
    }
  }

  editMode(date: any) {
    if (date) {
      let crr = new Date(date);
      this.date = {
        day: +crr.getDate(),
        month: +crr.getMonth() + 1,
        year: +crr.getFullYear(),
      };
      this.onDateSelect(this.date);
    }
  }

  get today() {
    this.onDateSelect(this.calendar.getToday());
    return this.calendar.getToday();
  }

  onDateSelect(e: any) {
    let hijri = this.changeDate.fromGregorian(
      new Date(`${e.year}-${e.month}-${e.day}`)
    );
    let obj = {
      gon: e,
      hijri,
    };
    this.dateChange.emit(obj);
  }
}
