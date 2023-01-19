import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-client-registry-forms",
  templateUrl: "./client-registry-forms.component.html",
  styleUrls: ["./client-registry-forms.component.scss"],
})
export class ClientRegistryFormsComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((res) => {
      console.log(res.get("id"));
    });
  }
}
