import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CategoriesEditingComponent} from './categories-editing.component';

describe('CategoriesEditingComponent', () => {
    let component: CategoriesEditingComponent;
    let fixture: ComponentFixture<CategoriesEditingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CategoriesEditingComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CategoriesEditingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
