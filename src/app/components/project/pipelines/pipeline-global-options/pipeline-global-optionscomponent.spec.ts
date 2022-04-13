import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PipelineGlobalOptionsComponent } from "./pipeline-global-options.component";

describe("GlobalCvComponent", () => {
    let component: PipelineGlobalOptionsComponent;
    let fixture: ComponentFixture<PipelineGlobalOptionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PipelineGlobalOptionsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PipelineGlobalOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
