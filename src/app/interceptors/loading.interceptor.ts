import { Injectable, Injector } from "@angular/core";
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoadingIndicatorService } from "../services/loading-indicator.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const loaderService = this.injector.get(LoadingIndicatorService);

        loaderService.show();

        return next.handle(req).pipe(finalize(() => loaderService.hide()));
    }
}
