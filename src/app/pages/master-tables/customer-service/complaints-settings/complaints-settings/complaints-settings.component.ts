import { HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { EventService } from "src/app/core/services/event.service";
import { Subscription } from "rxjs";
import { IBaseResponse } from "src/app/shared/app/models/App/IBaseResponse";
import { MessagesService } from "src/app/shared/services/messages.service";
import { reserved } from "src/app/core/models/reservedWord";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ComplaintSettingsService } from "src/app/shared/services/master-tables/customer-service/complaint-settings.service";
import { IComplaintSettings, IComplaintSettingsData } from "src/app/shared/app/models/MasterTables/customer-service/i-complaint-settings";

@Component({
	selector: "app-complaints-settings",
	templateUrl: "./complaints-settings.component.html",
	styleUrls: ["./complaints-settings.component.scss"],
})
export class ComplaintsSettingsComponent implements OnInit, OnDestroy {
	submitted: boolean = false;
	ComplaintsSettingsFormSubmitted = false as boolean;
	ComplaintsSettingsForm!: FormGroup<IComplaintSettings>;
	subscribes: Subscription[] = [];

	constructor(private ComplaintSettingsService: ComplaintSettingsService, private message: MessagesService, private eventService: EventService) {}

	ngOnInit(): void {
		this.initComplaintsSettingsForm();
	}

	initComplaintsSettingsForm() {
		this.ComplaintsSettingsForm = new FormGroup<IComplaintSettings>({
			compalintDeadLine: new FormControl(null, Validators.required),
			reminderDays: new FormControl(null, Validators.required),
		});
	}

	get f() {
		return this.ComplaintsSettingsForm.controls;
	}

	fillAddComplaintsSettingsForm(data: IComplaintSettingsData) {
		this.f.compalintDeadLine?.patchValue(data.compalintDeadLine!);
		this.f.reminderDays?.patchValue(data.reminderDays!);
	}

	validationChecker(): boolean {
		if (this.ComplaintsSettingsForm.invalid) {
			this.message.popup("Attention!", "Please Fill Required Inputs", "warning");
			return false;
		}
		return true;
	}

	submitComplaintsSettingsData(form: FormGroup) {
		this.submitted = true;
		const formData = form.getRawValue();
		const data: IComplaintSettings = {
			compalintDeadLine: formData.compalintDeadLine,
			reminderDays: formData.reminderDays,
		};
		if (!this.validationChecker()) return;
		this.eventService.broadcast(reserved.isLoading, true);
		let sub = this.ComplaintSettingsService.saveComplaintSettings(data).subscribe((res: HttpResponse<IBaseResponse<number>>) => {
			if (res.body?.status) {
				this.submitted = false;
				this.resetComplaintsSettingsForm();
				this.message.toast(res.body?.message!, "success");
			} else this.message.popup("Oops!", res.body?.message!, "error");

			this.eventService.broadcast(reserved.isLoading, false);
		});
		this.subscribes.push(sub);
	}

	resetComplaintsSettingsForm() {
		this.ComplaintsSettingsForm.reset();
	}

	ngOnDestroy(): void {
		this.subscribes && this.subscribes.forEach((s) => s.unsubscribe());
	}
}
