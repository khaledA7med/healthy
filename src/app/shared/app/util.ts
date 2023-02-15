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
}
