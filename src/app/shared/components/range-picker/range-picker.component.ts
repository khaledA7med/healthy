import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbInputDatepicker,
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-range-picker",
  templateUrl: "./range-picker.component.html",
  styleUrls: ["./range-picker.component.scss"],
})
export class RangePickerComponent implements OnChanges {
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate | null;
  toDate!: NgbDate | null;
  isSelected: NgbDate | null = null;
  viewValue: string = "";
  @Input() monthCount: number = 1;
  @ViewChild("datepicker") dp!: NgbInputDatepicker;
  @Output() dateChange: EventEmitter<any> = new EventEmitter();

  @Input() selected!: { from: Date; to: Date };

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.fromDate = calendar.getToday();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selected?.from && this.selected?.to) {
      let from = this.selected.from,
        to = this.selected.to;

      this.viewValue = `${from?.getFullYear()}-${
        from?.getMonth() + 1
      }-${from?.getDate()} To ${to?.getFullYear()}-${
        to?.getMonth() + 1
      }-${to?.getDate()}`;
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) this.fromDate = date;
    else if (this.fromDate && !this.toDate && date && date.after(this.fromDate))
      this.toDate = date;
    else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.equals(this.fromDate)
    )
      this.toDate = date;
    else {
      this.toDate = null;
      this.fromDate = date;
    }

    if (this.fromDate.equals(this.toDate)) {
      this.viewValue = `${this.formatter.format(this.fromDate)}`;
      this.dp.close();
    } else if (this.fromDate && this.toDate) {
      this.viewValue = `${this.formatter.format(
        this.fromDate
      )} To ${this.formatter.format(this.toDate)}`;
      this.dp.close();
    } else this.viewValue = `${this.formatter.format(this.fromDate)}`;

    let dateToSubmit = {
      from: this.fromDate,
      to: this.toDate,
      range: this.toDate?.after(this.fromDate),
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

  clearDateRange() {
    this.fromDate = null;
    this.toDate = null;
    this.viewValue = "";
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }
}
