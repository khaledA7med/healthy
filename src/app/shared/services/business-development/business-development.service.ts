import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class BusinessDevelopmentService {
  private readonly env = environment.baseURL;
  constructor(private http: HttpClient) {}
}
