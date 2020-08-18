import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { MapComponent } from "./components/map/map/map.component";
import { DataComponent } from "./components/data/data.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { AnalyticalComponent } from "./components/analytical/analytical.component";
import { PredictionComponent } from "./components/prediction/prediction.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "map", component: MapComponent },
  { path: "data", component: DataComponent },
  { path: "analytical", component: AnalyticalComponent },
  { path: "prediction", component: PredictionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
