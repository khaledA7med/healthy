import { LOCALE_ID, NgModule } from "@angular/core";
import sa from "@angular/common/locales/fr";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { LayoutsModule } from "./layouts/layouts.module";
import { PagesModule } from "./pages/pages.module";

// Auth
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// Language
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { interceptorProviders } from "./core/helpers";
import { UrlSerializer } from "@angular/router";
import { LowerCaseUrlSerializer } from "./core/helpers/LowerCaseUrlSerializer";
import { registerLocaleData } from "@angular/common";
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}
registerLocaleData(sa, "SAR");

@NgModule({
  declarations: [AppComponent],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: "en",
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    PagesModule,
  ],
  providers: [
    interceptorProviders,
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
    // { provide: LOCALE_ID, useValue: "SAR" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
