import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryEditingComponent } from './category-editing.component';

describe('CategoryEditingComponent', () => {
  let component: CategoryEditingComponent;
  let fixture: ComponentFixture<CategoryEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
