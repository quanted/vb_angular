import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RouteGuardService as RouteGuard } from "./services/auth/route-guard.service";

import { LoginComponent } from "./components/auth/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { AboutComponent } from "./components/about/about.component";
import { ProjectComponent } from "./components/project/project.component";
import { LocationCreateComponent } from "./components/project/location/location-create/location-create.component";
import { DashboardComponent } from "./components/dashboards/dashboard/dashboard.component";

const routes: Routes = [
    { path: "", component: LoginComponent },
    { path: "home", component: HomeComponent, canActivate: [RouteGuard] },
    { path: "about", component: AboutComponent, canActivate: [RouteGuard] },
    {
        path: "project",
        component: ProjectComponent,
        canActivate: [RouteGuard],
    },
    {
        path: "project/:id",
        component: ProjectComponent,
        canActivate: [RouteGuard],
    },
    {
        path: "create-location/:id",
        component: LocationCreateComponent,
        canActivate: [RouteGuard],
    },
    {
        path: "dashboard/:id",
        component: DashboardComponent,
        canActivate: [RouteGuard],
    },
    { path: "**", component: LoginComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
