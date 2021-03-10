import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    ) {}

  ngOnInit(): void {
    if(this.route.paramMap) {
      this.projectID = this.route.snapshot.paramMap.get('id');
      console.log("create:projectID: ", this.projectID);
    }
  }

  gohome(): void {
    this.router.navigateByUrl('home');
  }
}
