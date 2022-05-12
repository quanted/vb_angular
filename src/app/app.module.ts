import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { ErrorInterceptor } from "./interceptors/error.interceptor";

import { CookieService } from "ngx-cookie-service";

import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatStepperModule } from "@angular/material/stepper";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSortModule } from "@angular/material/sort";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { HomeComponent } from "./components/home/home.component";
import { ProjectComponent } from "./components/project/project.component";

import { WelcomeComponent } from "./components/home/welcome/welcome.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { RegistrationComponent } from "./components/auth/registration/registration.component";
import { ResetPasswordComponent } from "./components/auth/reset-password/reset-password.component";

import { ProjectCreateComponent } from "./components/project/project-create/project-create.component";
import { ProjectDetailComponent } from "./components/project/project-detail/project-detail.component";
import { LocationComponent } from "./components/project/location/location/location.component";
import { LocationCreateComponent } from "./components/project/location/location-create/location-create.component";
import { LocationDetailComponent } from "./components/project/location/location-detail/location-detail.component";
import { LocationFormComponent } from "./components/project/location/location-form/location-form.component";
import { MapComponent } from "./components/project/location/map/map.component";
import { MiniMapComponent } from "./components/project/location/mini-map/mini-map.component";
import { DataComponent } from "./components/project/data/data.component";
import { DataStatisticsComponent } from "./components/project/data/data-statistics/data-statistics.component";
import { DataDetailComponent } from "./components/project/data/data-detail/data-detail.component";
import { PipelinesComponent } from "./components/project/pipelines/pipelines.component";
import { PipelineGlobalOptionsComponent } from "./components/project/pipelines/pipeline-global-options/pipeline-global-options.component";
import { ModelSelectionComponent } from "./components/dashboards/model-selection/model-selection.component";
import { ModelSelectionModelTableComponent } from "./components/dashboards/model-selection/model-selection-model-table/model-selection-model-table.component";

import { DashboardComponent } from "./components/dashboards/dashboard/dashboard.component";
import { ModelGraphsComponent } from "./components/dashboards/model-graphs/model-graphs.component";
import { ModelDataTableComponent } from "./components/dashboards/model-data-table/model-data-table.component";
import { ScatterPlotComponent } from "./components/dashboards/model-graphs/scatter-plot/scatter-plot.component";
import { LinePlotComponent } from "./components/dashboards/model-graphs/line-plot/line-plot.component";
import { BoxPlotComponent } from "./components/dashboards/model-graphs/box-plot/box-plot.component";
import { DashpanelComponent } from "./components/dashboards/dashpanel/dashpanel.component";

import { FluidHeightDirective } from "./directives/fluid-height.directive";
import { PipelineStatusComponent } from "./components/project/pipelines/pipeline-status/pipeline-status.component";
import { ProjectMetaComponent } from "./components/project/project-meta/project-meta.component";
import { ProjectMetaEditComponent } from "./components/project/project-meta/project-meta-edit/project-meta-edit.component";
import { PipelineDetailComponent } from "./components/project/pipelines/pipeline-detail/pipeline-detail.component";
import { PipelineCreateComponent } from "./components/project/pipelines/pipeline-create/pipeline-create.component";
import { DataCreateComponent } from "./components/project/data/data-create/data-create.component";

import { DeleteConfirmationDialogComponent } from "./dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        NavigationComponent,
        HomeComponent,
        ProjectComponent,
        WelcomeComponent,
        LoginComponent,
        RegistrationComponent,
        ResetPasswordComponent,
        ProjectCreateComponent,
        ProjectDetailComponent,
        LocationComponent,
        LocationCreateComponent,
        LocationDetailComponent,
        LocationFormComponent,
        MapComponent,
        MiniMapComponent,
        DataComponent,
        DataStatisticsComponent,
        DataDetailComponent,
        PipelinesComponent,
        PipelineDetailComponent,
        PipelineCreateComponent,
        PipelineGlobalOptionsComponent,
        ModelSelectionComponent,
        ModelSelectionModelTableComponent,
        DashboardComponent,
        ModelGraphsComponent,
        ModelDataTableComponent,
        ScatterPlotComponent,
        LinePlotComponent,
        BoxPlotComponent,
        DashpanelComponent,
        FluidHeightDirective,
        PipelineStatusComponent,
        ProjectMetaComponent,
        ProjectMetaEditComponent,
        DataCreateComponent,
        DeleteConfirmationDialogComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
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
        MatDialogModule,
        MatTooltipModule,
    ],
    providers: [
        CookieService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
