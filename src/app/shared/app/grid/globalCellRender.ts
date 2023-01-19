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
}
