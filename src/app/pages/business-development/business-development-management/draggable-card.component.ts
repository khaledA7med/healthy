import { Component, Input, OnInit } from "@angular/core";
import { IBusinessDevelopment } from "src/app/shared/app/models/BusinessDevelopment/ibusiness-development";

@Component({
  selector: "app-draggable-card",
  template: `
    <div class="card my-3 tasks-box">
      <div class="card-body pt-1">
        <div class="d-flex align-items-baseline mb-2">
          <a
            href="javascript:void(0)"
            class="text-muted fw-medium fs-14 flex-grow-1"
            >#{{ item.leadNo }}</a
          >
          <div ngbDropdown class="d-inline-block">
            <button
              type="button"
              class="btn btn-ghost-secondary waves-effect rounded-pill custom-dd"
              ngbDropdownToggle
            >
              <i class="ri-more-fill"></i>
            </button>
            <div ngbDropdownMenu>
              <button ngbDropdownItem class="btn btn-sm">Edit</button>
              <button ngbDropdownItem class="btn btn-sm">View</button>
            </div>
          </div>
        </div>
        <h6 class="fs-16 text-truncate task-title">
          <a href="#" class="link-dark d-block">{{ item.name }}</a>
        </h6>
        <div class="d-flex align-items-center">
          <div class="flex-grow-1">
            <span class="badge badge-soft-primary">{{ item.leadType }}</span>
          </div>
        </div>
      </div>
      <div class="card-footer border-top-dashed">
        <div class="d-flex">
          <div class="flex-grow-1">
            <span class="text-muted"
              ><i class="ri-timer-line align-bottom"></i>
              {{ item.savedDate | date : "mediumDate" }}</span
            >
          </div>
          <div class="flex-shrink-0">
            <span class="text-muted"
              ><i class="ri-alarm-line align-bottom"></i>
              {{ item.deadline | date : "mediumDate" }}</span
            >
          </div>
        </div>
      </div>
      <!--end card-body-->
      <div class="progress progress-sm">
        <div
          [class]="'progress-bar ' + barBg"
          role="progressbar"
          style="width: 100%"
          aria-valuenow="55"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  `,
  styles: [".custom-dd::after {display: none;}"],
})
export class DraggableCardComponent {
  @Input() item!: IBusinessDevelopment;
  @Input() barBg!: string;
  constructor() {}
}