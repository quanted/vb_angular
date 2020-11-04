import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HttpClientModule } from "@angular/common/http";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CookieService } from "ngx-cookie-service";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { MapComponent } from "./components/map/map/map.component";
import { LocationComponent } from './components/location/location.component';
import { LocationFormComponent } from "./components/map/location-form/location-form.component";
import { LocationDetailComponent } from './components/location-detail/location-detail.component';
import { LoginComponent } from "./components/auth/login/login.component";
import { DataComponent } from "./components/data/data.component";
import { ResultsComponent } from "./components/results/results.component";
import { HomeComponent } from "./components/home/home.component";
import { RegistrationComponent } from "./components/auth/registration/registration.component";
import { ResetPasswordComponent } from "./components/auth/reset-password/reset-password.component";
import { AccountComponent } from "./components/auth/account/account.component";
import { AnalyticalComponent } from "./components/analytical/analytical.component";
import { PredictionComponent } from "./components/prediction/prediction.component";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    MapComponent,
    LocationComponent,
    LocationFormComponent,
    LocationDetailComponent,
    LoginComponent,
    DataComponent,
    ResultsComponent,
    HomeComponent,
    RegistrationComponent,
    ResetPasswordComponent,
    AccountComponent,
    AnalyticalComponent,
    PredictionComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatExpansionModule,
    MatSelectModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
