import { Component } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";
import { ClientGroupComponent } from "./client-group.component";
import { ClientsGroupsService } from "src/app/shared/services/clients/clients.groups.service";
import { MessagesService } from "src/app/shared/services/messages.service";
import { SweetAlertResult } from "sweetalert2";

@Component({
	selector: "app-client-Group-list-controls",
	template: `
		<div class="col">
			<div ngbDropdown class="d-inline-block">
				<button type="button" class="btn btn-ghost-secondary waves-effect rounded-pill" id="actionDropdown" ngbDropdownToggle>
					<i class="ri-more-2-fill"></i>
				</button>
				<div ngbDropdownMenu aria-labelledby="actionDropdown">
					<button ngbDropdownItem (click)="Delete()" class="btn btn-sm d-flex align-items-center">
						<div>
							<i class="ri-delete-bin-line mx-2" style="font-size: 16px;"></i>
						</div>
						<div>Delete</div>
					</button>
				</div>
			</div>
		</div>
	`,
	styles: ["#actionDropdown::after {display: none}"],
})
export class ClientGroupListControlsComponent {
	private params!: ICellRendererParams;
	private comp!: ClientGroupComponent;
	constructor(private message: MessagesService, private groupService: ClientsGroupsService) {}

	agInit(params: ICellRendererParams) {
		this.params = params;
		this.comp = this.params.context.comp;
	}

	Delete() {
		let sno = Number(this.params.data.sNo);
		this.message.confirm("Delete", "Delete This Group ?", "Delete", "warning").then((e: SweetAlertResult) => {
			if (e.isConfirmed) {
				this.groupService.deleteClientGroup(sno).subscribe(
					(res) => {
						if (res.body?.status) {
							this.message.popup(res.body?.message!, "success");
							this.comp.gridApi.setDatasource(this.comp.dataSource);
						} else {
							this.message.popup(res.body?.message!, "error");
						}
					},
					(err) => {
						this.message.popup("Opps", err.message, "error");
					}
				);
			}
		});
	}
}
