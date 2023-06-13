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

  templateComfirmation(
    title: string = "",
    msg: string = "",
    btnTitle: string = "",
    btn: string = "primary",
    icon: SweetAlertIcon = "warning"
  ) {
    const swal = Swal.mixin({
      customClass: {
        confirmButton: `btn btn-${btn} btn-sm mx-2`,
        cancelButton: "btn btn-danger btn-sm mx-2",
      },
      background: "var(--vz-modal-bg)",
      buttonsStyling: false,
    });
    return swal.fire({
      title: title,
      html: msg,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: btnTitle,
    });
  }

  popup(title: string, message: string, icon: SweetAlertIcon = "info") {
    return Swal.fire({
      title: title,
      text: message,
      icon: icon,
      background: "var(--vz-modal-bg)",
      buttonsStyling: false,
      customClass: {
        confirmButton: `btn btn-outline-primary btn-sm`,
      },
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

  timerPopup(title: string, body: string, icon: SweetAlertIcon = "warning") {
    return Swal.fire({
      title: title,
      html: body,
      timer: 3000,
      background: "var(--vz-modal-bg)",
      timerProgressBar: true,
      icon: icon,
      allowOutsideClick: false,
      buttonsStyling: false,
      customClass: {
        confirmButton: `btn btn-primary btn-sm`,
      },
    });
  }
}
