import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditingComponent } from './product-editing.component';

describe('ProductEditingComponent', () => {
  let component: ProductEditingComponent;
  let fixture: ComponentFixture<ProductEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
