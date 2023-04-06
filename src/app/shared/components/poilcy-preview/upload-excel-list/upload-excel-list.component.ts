import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MessagesService } from "src/app/shared/services/messages.service";
import readXlsxFile from "read-excel-file";
import { Subscription } from "rxjs";
import { IMotorData } from "src/app/shared/app/models/Production/i-motor-active-list";
import { IMedicalData } from "src/app/shared/app/models/Production/i-medical-active-list";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { PersonsData, PersonsDataForm } from "src/app/shared/app/models/Production/production-util";

@Component({
	selector: "app-upload-excel-list",
	templateUrl: "./upload-excel-list.component.html",
	styleUrls: ["./upload-excel-list.component.scss"],
})
export class UploadExcelListComponent implements OnInit, OnDestroy {
	@Input() data!: {
		id: string;
		className: string;
	};
	@ViewChild("fileInput") fileInput!: ElementRef;

	uiState = {
		sno: "" as string,
		loadedData: false as boolean,
		updatedState: false as boolean,
		gridReady: false,
		submitted: false,
		testData: [] as any[],
		motorData: [] as IMotorData[],
		medicalData: [] as IMedicalData[],
		filters: {
			pageNumber: 1,
			pageSize: 50,
			orderBy: "sNo",
			orderDir: "asc",
		},
	};
	subscribes: Subscription[] = [];

	//#region The Following data is for testing Reasons only and will be deleted when API is Ready

	personsFormArr: FormArray<FormGroup<PersonsDataForm>> = new FormArray<FormGroup<PersonsDataForm>>([]);

	addPerson(data?: PersonsData) {
		let person = new FormGroup<PersonsDataForm>({
			Name: new FormControl(data?.Name || null),
			Age: new FormControl(data?.Age || null),
		});
		this.personsFormArr?.push(person);
	}
	removePerson(i: number) {
		this.personsFormArr.removeAt(i);
	}
	resetFormArr() {
		this.personsFormArr.clear();
		this.uiState.testData.forEach((person: any) => this.addPerson(person));
	}
	clearFromArr() {
		this.personsFormArr.reset();
		this.personsFormArr.clear();
		this.fileInput.nativeElement.value = "";
	}
	//#endregion
	constructor(public modal: NgbActiveModal, private message: MessagesService) {}

	ngOnInit(): void {
		console.log(this.data);
	}

	uploadExeceFile(e: any) {
		// This schema Will Change According to the ClassName
		const schema = {
			Name: {
				prop: "Name",
				type: String,
				required: true,
			},
			Age: {
				prop: "Age",
				type: Number,
				required: true,
			},
		};

		readXlsxFile(e.target.files[0], this.data.className === "Motor" ? { schema } : { schema }).then(({ rows, errors }) => {
			if (errors.length == 0) {
				console.log(rows);
				this.uiState.testData = [...rows];
				// if (this.data.className === "Motor") this.uiState.motorData = rows;
				// else this.uiState.medicalData = rows;
				rows.forEach((person: any) => this.addPerson(person));
			} else {
				console.log(errors);
				this.message.popup(
					"Error",
					`Invalid File : ${errors[0].column} is ${errors[0].error === "required" ? "missing from" : errors[0].error + " in"} ${
						errors.length < 1 && errors[0].row ? "row " + errors[0].row : ""
					}`,
					"error"
				);
			}
		});
	}

	submitData() {}

	ngOnDestroy() {
		this.subscribes.forEach((s) => s.unsubscribe());
	}
}
