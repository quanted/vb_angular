// The HttpRequestInterceptor is to be used for testing the application services
// using mock data responses. For example, instead of making test requests to the 
// actual api endpoint and recieving a response, the HttpRequestInterceptor
// intercepts the request by the service and provides mock data that we specify.


import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { AnalyticalModelResponse, mockModel } from '../../models/analytical-model-response';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url === "http://127.0.0.1:8080/api/analyticalmodel/project_id=1") {
            console.log('Loaded from json : ' + request.url);
            return of(new HttpResponse({ status: 200, body: ((mockModel) as any).default }));
        }
        console.log('Loaded from http call :' + request.url);
        return next.handle(request);
    }
}