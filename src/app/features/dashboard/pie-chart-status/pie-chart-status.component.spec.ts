import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartStatusComponent } from './pie-chart-status.component';

describe('PieChartStatusComponent', () => {
  let component: PieChartStatusComponent;
  let fixture: ComponentFixture<PieChartStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieChartStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
