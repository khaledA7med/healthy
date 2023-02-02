import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
} from "@angular/core";
import {
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
  @Input() hijriDate: any;
  @Input() model!: any;

  @Input() submitted: boolean = false;
  @Input() required: boolean = false;

  @Input("currentDate") currentDate!: [
    year: number,
    month: number,
    day: number
  ];

  @Output() dateChange: EventEmitter<any> = new EventEmitter();

  constructor(
    config: NgbInputDatepickerConfig,
    public changeDate: NgbCalendarIslamicUmalqura
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: 2099, month: 12, day: 31 };
    config.placement = ["top-end", "top-start", "bottom-end", "bottom-start"];
  }

  ngOnChanges(): void {
    if (this.model) this.date = this.model;
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
