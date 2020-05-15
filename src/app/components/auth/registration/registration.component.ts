import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
})
export class RegistrationComponent implements OnInit {
  @Output() registerUser = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  done(): void {
    this.registerUser.emit(false);
  }
}
