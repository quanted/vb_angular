import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrls: ['./create-location.component.css']
})
export class CreateLocationComponent implements OnInit {
  projectID;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService) {}

  ngOnInit(): void {
    if(this.route.paramMap) {
      this.projectID = this.route.snapshot.paramMap.get('id');
    }
  }

  userIsAuthenticated(): boolean {
    if(!this.auth.userIsAuthenticated()) {
      this.router.navigateByUrl("/");
      return false;
    }
    return true;
  }

  gohome(): void {
    this.router.navigateByUrl('home');
  }
}
