import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProductsEditingComponent} from './products-editing.component';

describe('ProductsEditingComponent', () => {
    let component: ProductsEditingComponent;
    let fixture: ComponentFixture<ProductsEditingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProductsEditingComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductsEditingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
