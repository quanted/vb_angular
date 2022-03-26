import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RouteGuardService as RouteGuard } from "./services/auth/route-guard.service";

import { LoginComponent } from "./components/auth/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { ProjectComponent } from "./components/project/project.component";
import { CreateLocationComponent } from "./components/project/location/create-location/create-location.component";
import { DashboardComponent } from "./components/dashboards/dashboard/dashboard.component";

const routes: Routes = [
    { path: "", component: LoginComponent },
    { path: "home", component: HomeComponent, canActivate: [RouteGuard] },
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
        component: CreateLocationComponent,
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
