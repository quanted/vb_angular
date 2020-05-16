import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { MapComponent } from "./components/map/map.component";
import { DataComponent } from "./components/data/data.component";
import { ResultsComponent } from "./components/results/results.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { AccountComponent } from "./components/auth/account/account.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "account", component: AccountComponent },
  { path: "map", component: MapComponent },
  { path: "data", component: DataComponent },
  { path: "results", component: ResultsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
