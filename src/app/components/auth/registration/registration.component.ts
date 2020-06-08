import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

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
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      password2: [null, Validators.required],
    });
  }

  register(): void {
    if (
      this.registrationForm.get("password").value !==
      this.registrationForm.get("password2").value
    ) {
      this.statusMessage = "Passwords must match";
      return;
    }
    if (this.registrationForm.valid) {
      this.auth
        .register(
          this.registrationForm.get("first_name").value,
          this.registrationForm.get("last_name").value,
          this.registrationForm.get("username").value,
          this.registrationForm.get("email").value,
          this.registrationForm.get("password").value
        )
        .subscribe((response) => {
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
