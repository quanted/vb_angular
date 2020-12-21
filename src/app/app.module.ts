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
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { AccountComponent } from "./components/auth/account/account.component";
import { RegistrationComponent } from "./components/auth/registration/registration.component";
import { ResetPasswordComponent } from "./components/auth/reset-password/reset-password.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { ProjectComponent } from './components/project/project/project.component';
import { ProjectDetailComponent } from './components/project/project-detail/project-detail.component';
import { MapComponent } from "./components/map/map/map.component";
import { MiniMapComponent } from './components/mini-map/mini-map.component';
import { LocationFormComponent } from "./components/map/location-form/location-form.component";
import { LocationDetailComponent } from './components/location/location-detail/location-detail.component';
import { DataComponent } from "./components/data/data.component";
import { AnalyticalComponent } from "./components/analytical/analytical.component";
import { PredictionComponent } from "./components/prediction/prediction.component";
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    AccountComponent,
    RegistrationComponent,
    ResetPasswordComponent,
    LoginComponent,
    HomeComponent,
    ProjectComponent,
    ProjectDetailComponent,
    MapComponent,
    MiniMapComponent,
    LocationFormComponent,
    LocationDetailComponent,
    DataComponent,
    AnalyticalComponent,
    PredictionComponent,
    DashboardComponent,
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
    MatDialogModule,
    MatGridListModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
