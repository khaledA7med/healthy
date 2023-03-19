import { HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { EventService } from "src/app/core/services/event.service";
import { Observable, Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MasterTableService } from "src/app/core/services/master-table.service";
import { IBaseMasterTable } from "src/app/core/models/masterTableModels";
import { MODULES } from "src/app/core/models/MODULES";
import { DefaultEmailsService } from "src/app/shared/services/master-tables/default-emails.service";
import { IDefaultEmails, IDefaultEmailsData } from "src/app/shared/app/models/MasterTables/i-default-emails";

@Component({
	selector: "app-default-emails",
	templateUrl: "./default-emails.component.html",
	styleUrls: ["./default-emails.component.scss"],
})
export class DefaultEmailsComponent implements OnInit, OnDestroy {
	lookupData!: Observable<IBaseMasterTable>;
	DefaultEmailsFormSubmitted = false as boolean;
	DefaultEmailsForm!: FormGroup<IDefaultEmails>;

	uiState = {
		submitted: false,
		getDefaultEmailsMode: false as Boolean,
		getDefaultEmailsData: {} as IDefaultEmailsData,
		list: [] as IDefaultEmails,
		category: "Claims - Clients",
	};
	subscribes: Subscription[] = [];

	getDefaultEmails() {
		this.eventService.broadcast(reserved.isLoading, true);
		let sub = this.DefaultEmailsService.getDefaultEmails(this.uiState.category).subscribe((res: HttpResponse<IBaseResponse<IDefaultEmailsData>>) => {
			if (res.body?.status) {
				this.uiState.getDefaultEmailsMode = true;
				this.uiState.getDefaultEmailsData = res.body?.data!;
				this.fillDefaultEmails(res.body?.data!);
			} else this.message.popup("Oops!", res.body?.message!, "error");

			this.eventService.broadcast(reserved.isLoading, false);
		});
		this.subscribes.push(sub);
	}

	constructor(
		private DefaultEmailsService: DefaultEmailsService,
		private message: MessagesService,
		private table: MasterTableService,
		private eventService: EventService
	) {}

	ngOnInit(): void {
		this.initDefaultEmailsForm();
		this.getLookupData();
	}

	getLookupData() {
		this.lookupData = this.table.getBaseData(MODULES.DefaultEmails);
	}

	initDefaultEmailsForm() {
		this.DefaultEmailsForm = new FormGroup<IDefaultEmails>({
			category: new FormControl("", Validators.required),
			item: new FormControl("", Validators.required),
		});
	}

	get f() {
		return this.DefaultEmailsForm.controls;
	}

	fillAddLineOfBusinessForm(data: IDefaultEmailsData) {
		this.f.category?.patchValue(data.category!);
		this.f.item?.patchValue(data.item!);
	}

	fillDefaultEmails(data: IDefaultEmailsData) {
		this.f.item?.patchValue(data.item!);
	}

	validationChecker(): boolean {
		if (this.DefaultEmailsForm.invalid) {
			this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
			return false;
		}
		return true;
	}

	filter(e: any) {
		this.uiState.category = e?.name;
		this.getDefaultEmails();
	}

	submitDefaultEmailsData(form: FormGroup) {
		this.uiState.submitted = true;
		const formData = form.getRawValue();
		const data: IDefaultEmailsData = {
			category: formData.category,
			item: formData.item,
		};
		if (!this.validationChecker()) return;
		this.eventService.broadcast(reserved.isLoading, true);
		let sub = this.DefaultEmailsService.saveDefaultEmails(data).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
			if (res.body?.status) {
				this.uiState.submitted = false;
				this.resetDefaultEmailsForm();
				this.getDefaultEmails();
				this.message.toast(res.body?.message!, "success");
			} else this.message.popup("Oops!", res.body?.message!, "error");

			this.eventService.broadcast(reserved.isLoading, false);
		});
		this.subscribes.push(sub);
	}

	resetDefaultEmailsForm() {
		this.DefaultEmailsForm.reset();
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
