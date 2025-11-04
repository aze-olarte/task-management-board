import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartPriorityComponent } from './bar-chart-priority.component';

describe('BarChartPriorityComponent', () => {
  let component: BarChartPriorityComponent;
  let fixture: ComponentFixture<BarChartPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartPriorityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarChartPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
