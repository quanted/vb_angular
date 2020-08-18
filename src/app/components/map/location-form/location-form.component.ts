import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-location-form",
  templateUrl: "./location-form.component.html",
  styleUrls: ["./location-form.component.css"],
})
export class LocationFormComponent implements OnInit {
  locationForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.locationForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      start_latitude: [null, Validators.required],
      start_longitude: [null, Validators.required],
      end_latitude: [null, Validators.required],
      end_longitude: [null, Validators.required],
      o_latitude: [null, Validators.required],
      o_longitude: [null, Validators.required],
    });
  }

  saveLocation() {
    if (this.locationForm.valid) {
      console.log(this.locationForm.value);
    }
  }

  clearForm() {
    this.locationForm.reset();
  }
}
