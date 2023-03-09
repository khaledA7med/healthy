import { Component, OnDestroy, OnInit } from "@angular/core";
import { AgChartOptions } from "ag-charts-community";

@Component({
  selector: "app-dashboard-customer-service",
  templateUrl: "./dashboard-customer-service.component.html",
  styleUrls: ["./dashboard-customer-service.component.scss"],
})
export class DashboardCustomerServiceComponent implements OnInit, OnDestroy {
  options: AgChartOptions;

  constructor() {
    this.options = {
      autoSize: false,
      width: 750,
      height: 750,
      theme: "ag-default-dark",
      data: [
        { type: "Android", value: 56.9, other: 7 },
        { type: "iOS", value: 22.5, other: 8 },
        { type: "BlackBerry", value: 6.8, other: 9 },
        { type: "Symbian", value: 8.5, other: 10 },
        { type: "Bada", value: 2.6, other: 11 },
        { type: "Windows", value: 1.9, other: 12 },
      ],
      legend: {
        position: "top",
      },
      // title: {
      //   text: "Dwelling Fires (UK)",
      //   fontSize: 18,
      // },
      // subtitle: {
      //   text: "Source: Home Office",
      // },
      series: [
        {
          type: "pie",
          calloutLabelKey: "type",
          fillOpacity: 0.9,
          strokeWidth: 0,
          angleKey: "value",
          sectorLabelKey: "value",
          calloutLabel: {
            enabled: false,
          },
          sectorLabel: {
            color: "white",
            fontWeight: "bold",
          },
          title: {
            // text: "2018/19",
          },
          // innerLabels: [
          //   {
          //     text: "numFormatter.format(total)",
          //     fontSize: 24,
          //     fontWeight: "bold",
          //   },
          //   {
          //     text: "Total",
          //     fontSize: 16,
          //   },
          // ],
          fills: [
            "#fb7451",
            "#f4b944",
            "#57cc8b",
            "#49afda",
            "#3988dc",
            "#72508c",
            "#b499b5",
            "#b7b5ba",
          ],
          innerRadiusRatio: 0.5,
          highlightStyle: {
            item: {
              fillOpacity: 0,
              stroke: "#535455",
              strokeWidth: 1,
            },
          },

          tooltip: {
            renderer: ({ datum, calloutLabelKey, title, sectorLabelKey }) => {
              console.log({ datum, calloutLabelKey, title, sectorLabelKey });
              return {
                title: datum.type,
                content: `${datum[calloutLabelKey!]}: ${`numFormatter.format(
                    datum[sectorLabelKey!]
                  )`}`,
              };
            },
          },
        },
      ],
    };
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }
}
