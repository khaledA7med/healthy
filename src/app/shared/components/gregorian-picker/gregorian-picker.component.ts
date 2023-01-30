import { Component, OnInit, Injectable, Input,EventEmitter, Output, OnChanges } from '@angular/core';
import { NgbCalendarIslamicUmalqura, NgbDateStruct, NgbInputDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gregorian-picker',
  templateUrl: './gregorian-picker.component.html',
  styleUrls: ['./gregorian-picker.component.scss'],
  providers:[
    NgbInputDatepickerConfig, NgbCalendarIslamicUmalqura
  ]
})

@Injectable()
export class GregorianPickerComponent implements OnInit, OnChanges {
  date!: NgbDateStruct;
  @Input() hijriDate:any;
  @Input() model!: any;

  @Input("currentDate") currentDate!: [
    year: number,
    month: number,
    day: number
  ];

  @Output() dateChange: EventEmitter<any> = new EventEmitter()

  constructor(config: NgbInputDatepickerConfig, public changeDate: NgbCalendarIslamicUmalqura) { 
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: 2099, month: 12, day: 31 };
    config.placement = ["top-end", "top-start", "bottom-end", "bottom-start"];
  }

  ngOnChanges(): void {
    if(this.model){
      const updatedDate = this.changeDate.toGregorian(this.model).toLocaleDateString().split("/");
      this.date = { day: +updatedDate[1], month: +updatedDate[0], year: +updatedDate[2]};
    }
  }

  ngOnInit(): void {

  }
  
  onDateSelect(e:any){
    // console.log(e);
    this.dateChange.emit(e)
  }

}
