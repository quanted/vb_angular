import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

import { MapService } from "src/app/services/map.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  projectID;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private mapService: MapService
  ) {}
  
  userIsAuthenticated(): boolean {
    if(!this.auth.userIsAuthenticated()) {
      this.router.navigateByUrl("/");
      return false;
    }
    return true;
  }

  ngOnInit() {
    if(this.route.paramMap) {
      this.projectID = this.route.snapshot.paramMap.get('id');
    }
    this.mapService.initMap();
  }
}
