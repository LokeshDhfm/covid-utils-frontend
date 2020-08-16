import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMergedComponent } from './order-merged.component';

describe('OrderMergedComponent', () => {
  let component: OrderMergedComponent;
  let fixture: ComponentFixture<OrderMergedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMergedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMergedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
