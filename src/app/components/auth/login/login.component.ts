import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  registeringUser = false;
  resetUserPW = false;

  loginForm: FormGroup;
  statusMessage = '';

  constructor(private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.auth
        .login(
          this.loginForm.get('username').value,
          this.loginForm.get('password').value
        )
        .subscribe(
          response => {
            if (response?.error?.error?.non_field_errors[0]) {
              this.statusMessage = response.error.error.non_field_errors[0];
            } else {
              // sucessful login
            }
          },
          error => {
            this.statusMessage = "unknown error";
          },
          () => {
            // can call stuff here
          });
    } else {
      this.statusMessage = 'Username and Password are required';
    }
  }

  register(): void {
    if (this.registeringUser) {
      this.registeringUser = false;
    } else {
      this.resetUserPW = false;
      this.registeringUser = true;
    }
  }

  isRegistering($event): void {
    this.registeringUser = $event;
  }

  resetPW(): void {
    if (this.resetUserPW) {
      this.resetUserPW = false;
    } else {
      this.registeringUser = false;
      this.resetUserPW = true;
    }
  }

  isResetting($event): void {
    this.resetUserPW = $event;
  }
}
