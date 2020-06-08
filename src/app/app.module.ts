import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HttpClientModule } from "@angular/common/http";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { MapComponent } from "./components/map/map.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { DataComponent } from "./components/data/data.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ResultsComponent } from "./components/results/results.component";
import { HomeComponent } from "./components/home/home.component";
import { RegistrationComponent } from "./components/auth/registration/registration.component";
import { ResetPasswordComponent } from "./components/auth/reset-password/reset-password.component";
import { AccountComponent } from "./components/auth/account/account.component";

import { AngularEsriModule } from "angular-esri-components";

import { CookieService } from "ngx-cookie-service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    MapComponent,
    LoginComponent,
    DataComponent,
    ResultsComponent,
    HomeComponent,
    RegistrationComponent,
    ResetPasswordComponent,
    AccountComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    AngularEsriModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
