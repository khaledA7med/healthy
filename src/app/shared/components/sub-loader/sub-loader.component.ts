import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-sub-loader",
  template: `
    <div class="loader-container">
      <div class="spinner-border text-success" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `,
  styles: [
    `
      .loader-container {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 50%;
        left: 50%;
        height: 100%;
        width: 100%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        background-color: rgba(var(--vz-light-rgb), 0.6);
      }
    `,
  ],
})
export class SubLoaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
