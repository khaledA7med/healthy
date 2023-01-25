import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  ChangeDetectionStrategy,
} from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-starter",
  templateUrl: "./starter.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./starter.component.scss"],
})

/**
 * Starter Component
 */
export class StarterComponent implements OnInit, OnChanges {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  val1: FormControl<string | null> = new FormControl("", { updateOn: "blur" });
  val2: FormControl<string | null> = new FormControl("");
  val3: number = 0;
  perc: number = 0;
  curren: string = "SAR";
  @Input() test!: string;
  constructor(private http: HttpClient) {
    this.val1.valueChanges.subscribe((res) => {
      this.val3 = +res! + +this.val2.value!;
      this.perc = +this.val3! * 0.15;
    });
    this.val2.valueChanges.subscribe((res) => {
      this.val3 = +res! + +this.val1.value!;
      this.perc = +this.val3! * 0.15;
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes["perc"].currentValue);
  }

  ngOnInit(): void {
    // this.http.get('https://localhost:44376/')
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: "Pages" },
      { label: "Starter", active: true },
    ];
  }
}
