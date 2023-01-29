import { Component, OnInit, Injectable, Input,EventEmitter, Output, OnChanges } from '@angular/core';
import { NgbCalendarIslamicUmalqura, NgbDateStruct, NgbInputDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gregorian-picker',
  templateUrl: './gregorian-picker.component.html',
  styleUrls: ['./gregorian-picker.component.scss'],
  providers:[NgbInputDatepickerConfig, NgbCalendarIslamicUmalqura]
})

@Injectable()
export class GregorianPickerComponent implements OnInit, OnChanges {
  model!: NgbDateStruct;
  date!: { year: number; month: number };
  @Input() hijriDate:any;

  @Input("currentDate") currentDate!: [
    year: number,
    month: number,
    day: number
  ];

  @Output() dateChange: EventEmitter<any> = new EventEmitter()

  constructor(config: NgbInputDatepickerConfig, public test: NgbCalendarIslamicUmalqura) { 
    config.minDate = { year: 1100, month: 1, day: 1 };
    config.maxDate = { year: 1500, month: 12, day: 31 };
    config.placement = ["top-end", "top-start", "bottom-end", "bottom-start"];
  }

  ngOnChanges(): void {
    // console.log(this.gregorianDate)
  }

  ngOnInit(): void {
  }
  
  onDateSelect(e:any){
    console.log(e);
    this.dateChange.emit(e)
  }

}
