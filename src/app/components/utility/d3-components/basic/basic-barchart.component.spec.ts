import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BasicBarchartComponent } from "./basic-barchart.component";

describe("BasicBarchartComponent", () => {
    let component: BasicBarchartComponent;
    let fixture: ComponentFixture<BasicBarchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BasicBarchartComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BasicBarchartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
