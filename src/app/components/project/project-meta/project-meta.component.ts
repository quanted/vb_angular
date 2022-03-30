import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";

@Component({
    selector: "app-project-meta",
    templateUrl: "./project-meta.component.html",
    styleUrls: ["./project-meta.component.css"],
})
export class ProjectMetaComponent implements OnInit {
    @Input() projectMetadata: any = {};
    @Input() formType: string = "";
    @Output() formCompleted: EventEmitter<any> = new EventEmitter<any>(null);

    projectMetadataForm: FormGroup;

    statusMessage: string = "";

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.projectMetadataForm = this.fb.group({
            name: [null, Validators.required],
            description: [null, Validators.required],
        });
        if (this.projectMetadata) {
            this.projectMetadataForm.setValue(this.projectMetadata);
        }
    }

    sendForm() {
        if (this.projectMetadataForm.valid) {
            this.formCompleted.emit(this.projectMetadataForm.value);
        } else {
            this.statusMessage = "Name and description are required";
        }
    }

    cancel(): void {
        this.formCompleted.emit(null);
    }
}
