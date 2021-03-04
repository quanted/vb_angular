import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  @Output() resetUserPW = new EventEmitter<boolean>();

  resetForm: FormGroup;
  statusMessage = "";

  constructor(private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    })
  }

  reset(): void {
    if (this.resetForm.valid) {
      this.auth.resetPW(this.resetForm.get('email'))
      .subscribe(response => {
        if (response.error) {
          this.statusMessage = response.error;
        }
      });
    } else {
      this.statusMessage = "A valid email is required";
    }
  }

  cancel(): void {
    this.resetUserPW.emit(false);
  }
}
