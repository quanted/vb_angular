import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
})
export class RegistrationComponent implements OnInit {
  @Output() registeringUser = new EventEmitter<boolean>();

  registrationForm: FormGroup;
  statusMessage = "";

  constructor(private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  register(): void {
    if (this.registrationForm.valid) {
      this.auth.register(this.registrationForm.get("username"), this.registrationForm.get("password"))
      .subscribe(response => {
        if (response.error) {
          this.statusMessage = response.error;
        }
      });
    } else {
      this.statusMessage = "All fields are required";
    }
  }

  cancel(): void {
    this.registeringUser.emit(false);
  }
}
