import { Injectable } from "@angular/core";
import Swal, { SweetAlertIcon } from "sweetalert2";
@Injectable({
  providedIn: "root",
})
export class MessagesService {
  constructor() {}
  confirm(
    btnTitle: string = "Sure!",
    message: string = "Message",
    btn: string = "primary",
    icon: SweetAlertIcon = "question"
  ): any {
    return Swal.fire({
      title: "Are you sure?",
      text: `You want to ${message}!`,
      icon: icon,
      showCancelButton: true,
      background: "var(--vz-modal-bg)",
      customClass: {
        confirmButton: `btn btn-${btn} btn-sm w-xs me-2 mt-2`,
        cancelButton: "btn btn-ghost-danger btn-sm w-xs mt-2",
      },
      confirmButtonText: `Yes, ${btnTitle}`,
      buttonsStyling: false,
      showCloseButton: true,
    });
  }

  popup(title: string, message: string, icon: SweetAlertIcon = "info") {
    return Swal.fire({
      title: title,
      text: message,
      icon: icon,
      background: "var(--vz-modal-bg)",
    });
  }

  toast(message: string, icon: SweetAlertIcon = "info") {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "var(--vz-modal-bg)",
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: icon,
      title: message,
    });
  }
}
