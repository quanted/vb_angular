import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from "./components/home/home.component";
import { MapComponent } from "./components/map/map/map.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { ProjectComponent } from './components/project/project/project.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "map", component: MapComponent },
  { path: "project/:id", component: ProjectComponent },
  { path: "dashboard/:id", component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
