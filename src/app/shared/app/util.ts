import { Injectable } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
@Injectable({
	providedIn: "root",
})
export default class AppUtils {
	public static nullValues(object: any) {
		Object.keys(object).forEach((key) => {
			if (!object[key] && typeof object[key] !== "number") {
				object[key] = "-";
			}
		});
	}

	public formatDate(e: any, time?: boolean) {
		if (e) {
			var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var d = new Date(e),
				month = "" + monthNames[d.getMonth()],
				day = "" + d.getDate(),
				year = d.getFullYear();
			if (month.length < 2) month = "0" + month;
			if (day.length < 2) day = "0" + day;
			if (!time) {
				return `${day}-${month}-${year}`;
			} else {
				var hh = "" + d.getHours(),
					mm = "" + d.getMinutes();
				if (hh.length < 2) hh = "0" + hh;
				if (mm.length < 2) mm = "0" + mm;
				return [day + "-" + month + "-" + year + " " + hh + ":" + mm].join(" ");
			}
		} else return "";
	}

	public formatBytes(bytes: number, decimals?: number): string {
		if (bytes === 0) {
			return "0 Bytes";
		}
		const k = 1024;
		const dm = decimals! <= 0 ? 0 : decimals || 2;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
	}

	public dateStructFormat(date: any): NgbDateStruct {
		date = new Date(date);
		return {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate(),
		} as any;
	}

	public dateFormater(dt: any) {
		let date = "";
		if (dt) {
			date = new Date(`${dt.year}/${dt.month}/${dt.day}`).toLocaleDateString();
		}
		return date;
	}

	public currencyFormater(val: number): number {
		return +Intl.NumberFormat("en-US", {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2,
		})
			.format(val)
			.replace(/,/g, "");
	}

	public reportViewer(url: string, reportTitle: string) {
		const myWindow = window.open(url, "_blank", "fullscreen: true");
		const content = `		
						<!DOCTYPE html>
						<html lang="en">
							<head>
								<title>${reportTitle}</title>
								<link rel="icon" type="image/x-icon" href="assets/images/favicon.ico">
								<style>
								body {height: 98vh;}
								.myIFrame {
								border: none;
								}
								</style>
							</head>
							<body>
								<iframe
								src="${url}"
								class="myIFrame justify-content-center"
								frameborder="5"
								width="100%"
								height="99%"
								referrerpolicy="no-referrer-when-downgrade"
								>
								</iframe>
							</body>
						</html>

		`;
		myWindow?.document.write(content);
	}
}
