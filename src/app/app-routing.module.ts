import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from "./components/auth/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { CreateProjectComponent } from './components/project/create-project/create-project.component';
import { CreateLocationComponent } from './components/location/create-location/create-location.component';
import { ProjectComponent } from './components/project/project/project.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "create-project", component: CreateProjectComponent },
  { path: "create-location/:id", component: CreateLocationComponent },
  { path: "project/:id", component: ProjectComponent },
  { path: "dashboard/:id", component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
