import { FormControl } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-business-forms",
  templateUrl: "./business-forms.component.html",
  styleUrls: ["./business-forms.component.scss"],
})
export class BusinessFormsComponent implements OnInit {
  formGroup!: FormGroup;

  documentsToUpload: File[] = [];
  docs: any[] = [];
  uiState = {
    isClient: true, // Choose client Or Group
    submitted: false,
  };
  constructor() {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      leadType: new FormControl("New"),
      deadline: new FormControl(null),
    });
  }
  get f() {
    return this.formGroup.controls;
  }
  toggleDate(e: any) {
    if (e.target.checked) {
      this.f["deadline"].enabled;
    } else this.f["deadline"].disabled;
  }

  toggleCurInsured() {}
  documentsList(e: any) {}
}
