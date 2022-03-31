import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class DashboardService implements OnDestroy {
    private ngUnsubscribe = new Subject();
    data: any;
    negMeanAbsoluteError = [];
    negMeanSquaredError = [];

    constructor() {}

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    /**
     * The data is supplied here as a variable and formatted
     * for chart consumption.
     */
    parseData(data: any) {
        this.data = data;
        this.setCVScores();
    }

    /**
     *
     */
    setCVScores() {
        // Doing this for now but updating this method soon.
        //
        //
        for (const pipe in this.data.cv_score) {
            const selected = "neg_mean_absolute_error";
            if (this.data.cv_score.hasOwnProperty(pipe)) {
                for (let i = 0; i < this.data.cv_score[pipe][selected].length; i++) {
                    this.negMeanAbsoluteError.push({
                        type: pipe,
                        x: i + 1,
                        y: this.data.cv_score[pipe][selected][i],
                    });
                }
            }
        }

        for (const pipe in this.data.cv_score) {
            const selected = "neg_mean_squared_error";
            if (this.data.cv_score.hasOwnProperty(pipe)) {
                for (let i = 0; i < this.data.cv_score[pipe][selected].length; i++) {
                    this.negMeanSquaredError.push({
                        type: pipe,
                        x: i + 1,
                        y: this.data.cv_score[pipe][selected][i],
                    });
                }
            }
        }
    }
}
