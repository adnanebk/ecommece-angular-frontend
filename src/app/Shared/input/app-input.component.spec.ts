import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AppInputComponent} from './app-input.component';

describe('InputComponent', () => {
  let component: AppInputComponent;
  let fixture: ComponentFixture<AppInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppInputComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
