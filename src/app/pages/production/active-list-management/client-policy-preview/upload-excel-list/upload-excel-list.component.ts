import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MessagesService } from "src/app/shared/services/messages.service";
import readXlsxFile from "read-excel-file";
import { Subscription } from "rxjs";
import { IMotorData, IMotorFormData } from "src/app/shared/app/models/Production/i-motor-active-list";
import { IMedicalData, IMedicalFormData } from "src/app/shared/app/models/Production/i-medical-active-list";
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import AppUtils from "src/app/shared/app/util";
import { ProductionService } from "src/app/shared/services/production/production.service";
import { UploadActivePoliciesData } from "src/app/shared/app/models/Production/production-util";

@Component({
	selector: "app-upload-excel-list",
	templateUrl: "./upload-excel-list.component.html",
	styleUrls: ["./upload-excel-list.component.scss"],
})
export class UploadExcelListComponent implements OnInit, OnDestroy {
	@Input() data!: {
		id: string;
		className: string;
		clientID: number;
		oasisPOlRef: string;
		PoliciesSno: number;
		PolicyNo: string;
	};
	fileInput: FormControl = new FormControl(null, Validators.required);

	uiState = {
		sno: "" as string,
		loadedData: false as boolean,
		updatedState: false as boolean,
		gridReady: false,
		submitted: false,
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

	motorSchema = {
		"Owner / Driver": {
			prop: "ownerDriver",
			type: String,
			required: true,
		},
		"Plate no": {
			prop: "plateNo",
			type: String,
			required: true,
		},
		"Plate char 1": {
			prop: "plateChar1",
			type: String,
			required: true,
		},
		"Plate char 2": {
			prop: "plateChar2",
			type: String,
			required: true,
		},
		"Plate char 3": {
			prop: "plateChar3",
			type: String,
			required: true,
		},
		"Sequence No": {
			prop: "sequenceNo",
			type: String,
			required: true,
		},
		"Custom ID": {
			prop: "customID",
			type: String,
			required: true,
		},
		"Brand Name": {
			prop: "brandName",
			type: String,
			required: true,
		},
		Model: {
			prop: "model",
			type: String,
			required: true,
		},
		Inception: {
			prop: "inception",
			type: Date,
			required: true,
		},
		Expiry: {
			prop: "expiry",
			type: Date,
			required: true,
		},
		"Kcl Date": {
			prop: "kclDate",
			type: Date,
			required: true,
		},
		"#seats": {
			prop: "seats",
			type: String,
			required: true,
		},
		"Body Type": {
			prop: "bodyType",
			type: String,
			required: true,
		},
		"Chassis No": {
			prop: "chassisNo",
			type: String,
			required: true,
		},
		"Market Value": {
			prop: "marketValue",
			type: String,
			required: true,
		},
		"Repair Type": {
			prop: "repairType",
			type: String,
			required: true,
		},
		"Vehicle Owner ID": {
			prop: "vehicleOwnerID",
			type: String,
			required: true,
		},
		"Project Name": {
			prop: "projectName",
			type: String,
			required: true,
		},
	};

	medicalSchema = {
		"Id-Iqama No.": {
			prop: "idIqamaNo",
			type: String,
			required: true,
		},
		"Membership No": {
			prop: "membershipNo",
			type: String,
			required: true,
		},
		"Member Name": {
			prop: "memberName",
			type: String,
			required: true,
		},
		DOB: {
			prop: "dob",
			type: Date,
			required: true,
		},
		Relation: {
			prop: "relation",
			type: String,
			required: true,
		},
		"Marital Status": {
			prop: "maritalStatus",
			type: String,
			required: true,
		},
		Gender: {
			prop: "gender",
			type: String,
			required: true,
		},
		"Sponsor No": {
			prop: "sponsorNo",
			type: String,
			required: true,
		},
		"Endt No": {
			prop: "endtNo",
			type: String,
			required: true,
		},
		"policy number": {
			prop: "policyNo",
			type: String,
			required: true,
		},
		Class: {
			prop: "class",
			type: String,
			required: true,
		},
		City: {
			prop: "city",
			type: String,
			required: true,
		},
		"Staff No": {
			prop: "staffNo",
			type: String,
			required: true,
		},
		Premium: {
			prop: "premium",
			type: String,
			required: true,
		},
		"Mobile No": {
			prop: "mobileNo",
			type: String,
			required: true,
		},
		Nationality: {
			prop: "nationality",
			type: String,
			required: true,
		},
		"CCHI Status": {
			prop: "cchiStatus",
			type: String,
			required: true,
		},
	};

	constructor(
		public modal: NgbActiveModal,
		private message: MessagesService,
		private appUtils: AppUtils,
		private productionService: ProductionService
	) {}

	ngOnInit(): void {
		if (this.data.className === "Motor") {
			this.getVehiclesData();
		} else if (this.data.className === "Medical") this.getMedicalsData();
		else {
		}
	}

	//#region Motor Functions and Vars

	motorFormArr: FormArray<FormGroup<IMotorFormData>> = new FormArray<FormGroup<IMotorFormData>>([]);

	getVehiclesData() {
		let sub = this.productionService.getVehiclesData(String(this.data.PoliciesSno)).subscribe((res) => {
			this.uiState.motorData = res?.data!;
			this.uiState.motorData.forEach((item: any) => this.addVehicle(item));
		});
		this.subscribes.push(sub);
	}

	addVehicle(data?: IMotorData) {
		let vehicle = new FormGroup<IMotorFormData>({
			ownerDriver: new FormControl(data?.ownerDriver || null),
			plateNo: new FormControl(data?.plateNo || null),
			plateChar1: new FormControl(data?.plateChar1 || null),
			plateChar2: new FormControl(data?.plateChar2 || null),
			plateChar3: new FormControl(data?.plateChar3 || null),
			sequenceNo: new FormControl(data?.sequenceNo || null, Validators.required),
			customID: new FormControl(data?.customID || null),
			brandName: new FormControl(data?.brandName || null),
			model: new FormControl(data?.model || null),
			inception: new FormControl((this.appUtils.dateStructFormat(data?.inception!) as any) || null),
			expiry: new FormControl((this.appUtils.dateStructFormat(data?.expiry!) as any) || null),
			kclDate: new FormControl((this.appUtils.dateStructFormat(data?.kclDate!) as any) || null),
			seats: new FormControl(data?.seats || null),
			bodyType: new FormControl(data?.bodyType || null),
			chassisNo: new FormControl(data?.chassisNo || null, Validators.required),
			marketValue: new FormControl(data?.marketValue || null),
			repairType: new FormControl(data?.repairType || null),
			vehicleOwnerID: new FormControl(data?.vehicleOwnerID || null),
			projectName: new FormControl(data?.projectName || null),
		});
		this.motorFormArr?.push(vehicle);
	}

	motorFormArrControls(i: number, control: string): AbstractControl {
		return this.motorFormArr.controls[i].get(control)!;
	}

	motorDates(e: any, i: any, control: string) {
		this.motorFormArrControls(i, control).patchValue(e.gon);
	}

	submitMotorData() {
		this.uiState.submitted = true;
		if (this.motorFormArr.invalid) return;
		else {
			const data: IMotorData[] = this.motorFormArr.getRawValue().map((item) => {
				return {
					...item,
					inception: new Date(this.appUtils.dateFormater(item.inception)) as any,
					expiry: new Date(this.appUtils.dateFormater(item.expiry)) as any,
					kclDate: new Date(this.appUtils.dateFormater(item.kclDate)) as any,
					clientID: this.data.clientID,
					oasisPolRef: this.data.oasisPOlRef,
					policiesSNo: this.data.PoliciesSno,
					policyNo: this.data.PolicyNo,
				};
			});

			const dataToSubmit: UploadActivePoliciesData = {
				data,
				policiesSNo: this.data.PoliciesSno,
			};
			let sub = this.productionService.saveMotorData(dataToSubmit).subscribe((res) => {
				this.message.toast("Uplaoded Data Successfully", "success");
				this.resetFormArr();
				this.modal.close();
			});
			this.subscribes.push(sub);
		}
	}

	//#endregion

	//#region Medical Functions and Vars

	medicalFormArr: FormArray<FormGroup<IMedicalFormData>> = new FormArray<FormGroup<IMedicalFormData>>([]);

	getMedicalsData() {
		let sub = this.productionService.getMedicalsData(String(this.data.PoliciesSno)).subscribe((res) => {
			this.uiState.medicalData = res?.data!;
			this.uiState.medicalData.forEach((item: any) => this.addMedicalItem(item));
		});
		this.subscribes.push(sub);
	}

	addMedicalItem(data?: IMedicalData) {
		let item = new FormGroup<IMedicalFormData>({
			policyNo: new FormControl(data?.policyNo!),
			idIqamaNo: new FormControl(data?.idIqamaNo!),
			membershipNo: new FormControl(data?.membershipNo!, Validators.required),
			memberName: new FormControl(data?.memberName!, Validators.required),
			dob: new FormControl((this.appUtils.dateStructFormat(data?.dob!) as any) || null),
			relation: new FormControl(data?.relation!),
			maritalStatus: new FormControl(data?.maritalStatus!),
			gender: new FormControl(data?.gender!),
			sponsorNo: new FormControl(data?.sponsorNo!),
			endtNo: new FormControl(data?.endtNo!),
			class: new FormControl(data?.class!),
			city: new FormControl(data?.city!),
			staffNo: new FormControl(data?.staffNo!),
			premium: new FormControl(data?.premium!),
			mobileNo: new FormControl(data?.mobileNo!),
			nationality: new FormControl(data?.nationality!),
			cchiStatus: new FormControl(data?.cchiStatus!),
		});
		this.medicalFormArr?.push(item);
	}

	medicalFormArrControls(i: number, control: string): AbstractControl {
		return this.medicalFormArr.controls[i].get(control)!;
	}

	medicalDates(e: any, i: any, control: string) {
		this.medicalFormArrControls(i, control).patchValue(e.gon);
	}

	submitMedicalData() {
		this.uiState.submitted = true;
		if (this.medicalFormArr.invalid) return;
		else {
			const data: IMedicalData[] = this.medicalFormArr.getRawValue().map((item) => {
				return {
					...item,
					clientID: this.data.clientID,
					oasisPolRef: this.data.oasisPOlRef,
					policiesSNo: this.data.PoliciesSno,
					policyNo: item.policyNo || this.data.PolicyNo,
					dob: new Date(this.appUtils.dateFormater(item.dob)) as any,
				};
			});

			const dataToSubmit: UploadActivePoliciesData = {
				data,
				policiesSNo: this.data.PoliciesSno,
			};

			let sub = this.productionService.saveMedicalData(dataToSubmit).subscribe((res) => {
				this.message.toast("Uplaoded Data Successfully", "success");
				this.resetFormArr();
				this.modal.close();
			});
			this.subscribes.push(sub);
		}
	}

	//#endregion
	removeItem(i: number) {
		if (this.data.className === "Motor") this.motorFormArr.removeAt(i);
		else this.medicalFormArr.removeAt(i);
	}

	resetFormArr() {
		if (this.data.className === "Motor") {
			this.motorFormArr.clear();
			this.uiState.motorData.forEach((item: any) => this.addVehicle(item));
		} else if (this.data.className === "Medical") {
			this.medicalFormArr.clear();
			this.uiState.medicalData.forEach((item: any) => this.addMedicalItem(item));
		} else {
		}
	}

	clearFormArr() {
		if (this.data.className === "Motor") {
			this.uiState.motorData = [];
			this.motorFormArr.clear();
			this.motorFormArr.reset();
			this.fileInput.reset();
		} else if (this.data.className === "Medical") {
			this.uiState.medicalData = [];
			this.medicalFormArr.clear();
			this.medicalFormArr.reset();
			this.fileInput.reset();
		} else {
		}
	}

	uploadExeceFile(e: any, schema: any) {
		// This schema Will Change According to the ClassName
		readXlsxFile(e.target.files[0], { schema }).then(({ rows, errors }) => {
			if (errors.length == 0) {
				if (this.data.className === "Motor") {
					this.uiState.motorData = [...rows];
					if (rows.length === 0) this.motorFormArr.clear();
					else rows.forEach((item: any) => this.addVehicle(item));
				} else if (this.data.className === "Medical") {
					this.uiState.medicalData = [...rows];
					if (rows.length === 0) this.medicalFormArr.clear();
					else rows.forEach((item: any) => this.addMedicalItem(item));
				} else {
				}
			} else {
				console.log(errors);
				this.message.popup(
					"Error",
					`Invalid File : ${errors[0].column} is ${errors[0].error === "required" ? "missing" : errors[0].error} ${
						errors.length > 1 && errors[0].row ? "in row " + errors[0].row : ""
					}`,
					"error"
				);
			}
		});
	}

	submitData() {
		if (this.fileInput.valid || this.motorFormArr.length > 0 || this.medicalFormArr.length > 0) {
			if (this.data.className === "Motor") this.submitMotorData();
			else if (this.data.className === "Medical") this.submitMedicalData();
			else {
			}
		} else {
			this.message.popup("Error", "Please Choose a File Before You Can Upload", "error");
		}
	}

	ngOnDestroy() {
		this.uiState.medicalData = [];
		this.uiState.motorData = [];
		this.motorFormArr.clear();
		this.medicalFormArr.clear();
		this.subscribes.forEach((s) => s.unsubscribe());
	}
}
