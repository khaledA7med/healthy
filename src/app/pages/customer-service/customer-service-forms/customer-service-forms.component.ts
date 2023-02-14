import { Component, OnInit, ViewChild } from "@angular/core";
import AppUtils from "src/app/shared/app/util";
import { ActivatedRoute, Router } from "@angular/router";
import { MessagesService } from "src/app/shared/services/messages.service";
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { MODULES } from "src/app/core/models/MODULES";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { HttpResponse } from "@angular/common/http";
import { EventService } from "src/app/core/services/event.service";
import { reserved } from "src/app/core/models/reservedWord";
import { AppRoutes } from "src/app/shared/app/routers/appRouters";
import { ICSForm } from "src/app/shared/app/models/CustomerService/icustomer-service-form";

@Component({
	selector: "app-customer-service-forms",
	templateUrl: "./customer-service-forms.component.html",
	styleUrls: ["./customer-service-forms.component.scss"],
	providers: [AppUtils],
})
export class CustomerServiceFormsComponent implements OnInit {
	submitted = false;
	formData!: Observable<IBaseMasterTable>;
	formGroup!: FormGroup<ICSForm>;
	documentsToUpload: File[] = [];
	docs: any[] = [];
	subscribes: Subscription[] = [];

	uiState = {
		editMode: false,
		editId: "",
		requestDetails: {},
	};

	vatSelect!: number;
	branchSelect!: string;

	vats = [
		{
			id: 1,
			name: "0%",
		},
		{
			id: 2,
			name: "15%",
		},
	];

	branches = [
		{
			id: 1,
			name: "Cairo",
		},
		{
			id: 2,
			name: "Riyadh",
		},
	];

	@ViewChild("dropzone") dropzone!: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private message: MessagesService,
		private tables: MasterTableService,
		private util: AppUtils,
		private eventService: EventService
	) {}

	ngOnInit(): void {
		this.initForm();
		this.formData = this.tables.getBaseData(MODULES.CustomerServiceForm);
	}

	initForm(): void {
		this.formGroup = new FormGroup<ICSForm>({
			clientID: new FormControl(null, Validators.required),
			clientName: new FormControl(null, Validators.required),
			producer: new FormControl(null, Validators.required),
			endorsType: new FormControl(null, Validators.required),
			classOfBusiness: new FormControl(null, Validators.required),
			netPremium: new FormControl(null),
			policyNo: new FormControl(null, Validators.required),
			lineOfBusiness: new FormControl(null, Validators.required),
			policyFees: new FormControl(null, Validators.required),
			insurComp: new FormControl(null, Validators.required),
			dateOfDeadline: new FormControl(null),
			vatPerc: new FormControl(null),
			vatValue: new FormControl(null),
			existingPolExpDate: new FormControl(null, Validators.required),
			requestDetails: new FormControl(null),
			totalPremium: new FormControl(null),
			cSSpecialConditions: new FormControl(null),
		});
	}
	get f() {
		return this.formGroup.controls;
	}

	validationChecker(): boolean {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
		if (this.formGroup.invalid) return false;
		return true;
	}

	submitForm(form: FormGroup<ICSForm>) {
		this.submitted = true;
		if (!this.validationChecker()) return;
		const formData = new FormData();
	}

	documentsList(evt: File[]) {
		this.documentsToUpload = evt;
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
