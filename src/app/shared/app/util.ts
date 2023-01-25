export default class AppUtils {
  public static nullValues(object: any) {
    Object.keys(object).forEach((key) => {
      if (!object[key] && typeof object[key] !== "number") {
        object[key] = "-";
      }
    });
  }
}
