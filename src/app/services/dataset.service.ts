import { Injectable, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, Observer, of, Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";

import * as XLSX from "xlsx";

import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root",
})
export class DatasetService implements OnDestroy {
    private ngUnsubscribe = new Subject();
    dataSet = [];

    constructor(private http: HttpClient) {}

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getDataset(dataset_id): Observable<any> {
        return this.http.get(`${environment.apiURL}dataset/${dataset_id}/`).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                return of({ error: `Failed to fetch dataset id=${dataset_id}!\n`, err });
            })
        );
    }

    getDatasets(): Observable<any> {
        return this.http.get(environment.apiURL + "dataset/").pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to fetch datasets!` });
            })
        );
    }

    createDataset(newDataset): Observable<any> {
        return this.http.post(environment.apiURL + "dataset/", newDataset).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to add dataset!` });
            })
        );
    }

    updateDataset(updatedDataset, id): Observable<any> {
        return this.http.put(environment.apiURL + `dataset/${id}/`, updatedDataset).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to update dataset!` });
            })
        );
    }

    deleteDataset(dataset): Observable<any> {
        return this.http.delete(environment.apiURL + `dataset/${dataset.id}/`).pipe(
            takeUntil(this.ngUnsubscribe),
            catchError((err) => {
                console.log(err);
                return of({ error: `Failed to delete dataset!` });
            })
        );
    }

    loadDatasetFromFile(target): Observable<any> {
        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(target.files[0]);
        return new Observable((observer: Observer<any>) => {
            reader.onload = (e: any) => {
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];

                observer.next({
                    fileName: target.files[0].name,
                    dataArray: XLSX.utils.sheet_to_json(ws, { header: 1 }),
                    dataCSV: XLSX.utils.sheet_to_csv(ws),
                });
                observer.complete();
            };
            reader.onerror = (err) => {
                console.log("FileReader.error: ", err);
                reader.abort();
                observer.next({
                    error: "failed to read input file",
                });
                observer.complete();
            };
        });
    }
}
