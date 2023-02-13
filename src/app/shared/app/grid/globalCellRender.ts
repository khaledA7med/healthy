import { formatCurrency } from "@angular/common";
import { CellEvent, ValueFormatterParams } from "ag-grid-community";

export default class GlobalCellRender {
	public static dateFormater(e: ValueFormatterParams) {
		if (e.value) {
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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

	public static currencyFormater(e: ValueFormatterParams) {
		return formatCurrency(+e.value, "en-US", "", "", "1.2-2");
	}

	public static NotifyChecker(e: ValueFormatterParams): string {
		if (e.value == 1) {
			return `<div class="text-primary fs-20 text-center"><i class="ri-checkbox-fill"></i></div>`;
		} else {
			return `<div class="fs-20 text-center"><i class="ri-checkbox-blank-line"></i></div>`;
		}
	}
}
