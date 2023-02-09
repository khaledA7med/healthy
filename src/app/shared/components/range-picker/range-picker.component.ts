import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepicker,
  NgbInputDatepicker,
  NgbInputDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { DatepickerServiceInputs } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service";

@Component({
  selector: "app-range-picker",
  templateUrl: "./range-picker.component.html",
  styleUrls: ["./range-picker.component.scss"],
})
export class RangePickerComponent {
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate | null;
  toDate!: NgbDate | null;
  viewValue: string = "";
  @Input() monthCount: number = 1;
  @ViewChild("datepicker") dp!: NgbInputDatepicker;
  @Output() dateChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.fromDate = calendar.getToday();
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate && this.toDate) {
      this.viewValue = `${this.formatter.format(
        this.fromDate
      )} To ${this.formatter.format(this.toDate)}`;
      this.dp.close();
    } else {
      this.viewValue = `${this.formatter.format(this.fromDate)}`;
    }

    let dateToSubmit = {
      // from: this.formatter.format(this.fromDate),
      // to: this.formatter.format(this.toDate),
      from: this.fromDate,
      to: this.toDate,
    };
    this.dateChange.emit(dateToSubmit);
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }
}
