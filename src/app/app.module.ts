import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { ProjectComponent } from './components/project/project/project.component';
import { CreateProjectComponent } from './components/project/create-project/create-project.component';
import { ProjectDetailComponent } from './components/project/project-detail/project-detail.component';
import { LocationComponent } from './components/location/location/location.component';
import { CreateLocationComponent } from './components/location/create-location/create-location.component';
import { LocationDetailComponent } from './components/location/location-detail/location-detail.component';
import { LocationFormComponent } from './components/location/location-form/location-form.component';
import { MapComponent } from './components/location/map/map.component';
import { MiniMapComponent } from './components/location/mini-map/mini-map.component';
import { DataComponent } from './components/data/data.component';
import { DataDetailComponent } from './components/data/data-detail/data-detail.component';
import { AnalyticalComponent } from './components/analytical/analytical.component';
import { CreatePipelineComponent } from './components/analytical/create-pipeline/create-pipeline.component';
import { AnalyticalModelsComponent } from './components/analytical/analytical-models/analytical-models.component';
import { ModelSelectionComponent } from './components/dashboard/model-selection/model-selection.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { GlobalCvComponent } from './components/analytical/global-cv/global-cv.component';
import { WelcomeComponent } from './components/home/welcome/welcome.component';
import { ModelGraphsComponent } from './components/dashboard/model-graphs/model-graphs.component';
import { ModelDataTableComponent } from './components/dashboard/model-data-table/model-data-table.component';
import { ScatterPlotComponent } from './components/dashboard/model-graphs/scatter-plot/scatter-plot.component';
import { LinePlotComponent } from './components/dashboard/model-graphs/line-plot/line-plot.component';
import { BoxPlotComponent } from './components/dashboard/model-graphs/box-plot/box-plot.component';
import { ModelSelectionModelTableComponent } from './components/dashboard/model-selection/model-selection-model-table/model-selection-model-table.component';
import { DashpanelComponent } from './components/dashboard/dashpanel/dashpanel.component';
import { DataStatisticsComponent } from './components/data/data-statistics/data-statistics.component';
import { CvYhatVsY1Component } from './components/dashboard/model-graphs/cv-yhat-vs-y1/cv-yhat-vs-y1.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    RegistrationComponent,
    ResetPasswordComponent,
    LoginComponent,
    HomeComponent,
    ProjectComponent,
    ProjectDetailComponent,
    MapComponent,
    MiniMapComponent,
    LocationFormComponent,
    CreateLocationComponent,
    LocationDetailComponent,
    DataComponent,
    DashboardComponent,
    AnalyticalComponent,
    AnalyticalModelsComponent,
    CreatePipelineComponent,
    CreateProjectComponent,
    LocationComponent,
    ModelSelectionComponent,
    DataDetailComponent,
    GlobalCvComponent,
    WelcomeComponent,
    ModelGraphsComponent,
    ModelDataTableComponent,
    ScatterPlotComponent,
    LinePlotComponent,
    BoxPlotComponent,
    ModelSelectionModelTableComponent,
    DashpanelComponent,
    DataStatisticsComponent,
    CvYhatVsY1Component
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
    MatPaginatorModule,
    MatExpansionModule,
    MatGridListModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatStepperModule,
    MatCheckboxModule,
    MatSortModule,
    MatSlideToggleModule
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
