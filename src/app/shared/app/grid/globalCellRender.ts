import { formatCurrency } from "@angular/common";
import { CellEvent, ValueFormatterParams } from "ag-grid-community";

export default class GlobalCellRender {
  public static dateFormater(e: ValueFormatterParams) {
    if (e.value) {
      var monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      var d = new Date(e.value),
        month = "" + monthNames[d.getMonth()],
        day = "" + d.getDate(),
        year = d.getFullYear();
      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      return [day + " " + month, year].join(", ");
    } else {
      return "";
    }
  }

  public static getBusinessDateCount(startDate: Date, endDate: Date) {
    let elapsed: any, daysBeforeFirstSunday: any, daysAfterLastSunday: any;
    let ifThen = function (a: any, b: any, c: any) {
      return a == b ? c : a;
    };

    elapsed = endDate.getTime() - startDate.getTime();
    elapsed /= 86400000;

    daysBeforeFirstSunday = (7 - startDate.getDay()) % 7;
    daysAfterLastSunday = endDate.getDay();

    elapsed -= daysBeforeFirstSunday + daysAfterLastSunday;
    elapsed = (elapsed / 7) * 5;
    elapsed +=
      ifThen(daysBeforeFirstSunday - 1, -1, 0) +
      ifThen(daysAfterLastSunday, 6, 5);
    return Math.ceil(elapsed).toString();
  }

  public static currencyFormater(e: ValueFormatterParams) {
    return formatCurrency(+e.value, "en-US", "", "", "1.2-2");
  }

  public static NotifyChecker(e: ValueFormatterParams): string {
    if (e.value == 1 || e.value == true) {
      return `<div class="text-primary fs-20 text-center"><i class="ri-checkbox-fill"></i></div>`;
    } else {
      return `<div class="fs-20 text-center"><i class="ri-checkbox-blank-line"></i></div>`;
    }
  }
}
