import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from "./components/auth/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { CreateProjectComponent } from './components/project/create-project/create-project.component';
import { MapComponent } from "./components/map/map/map.component";
import { ProjectComponent } from './components/project/project/project.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "create-project", component: CreateProjectComponent },
  { path: "map/:id", component: MapComponent },
  { path: "project/:id", component: ProjectComponent },
  { path: "dashboard/:id", component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
