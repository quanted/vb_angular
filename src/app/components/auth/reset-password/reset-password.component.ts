import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  @Output() resetUserPW = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  done(): void {
    this.resetUserPW.emit(false);
  }
}
