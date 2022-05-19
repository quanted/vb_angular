import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class LoadingIndicatorService {
    showLoader = new BehaviorSubject(null);

    constructor() {}

    show() {
        this.showLoader.next(true);
    }

    hide() {
        this.showLoader.next(false);
    }
}
