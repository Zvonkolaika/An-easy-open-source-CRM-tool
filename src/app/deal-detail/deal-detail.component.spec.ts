import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealDetailComponent } from './deal-detail.component';

describe('DialogEditDealComponent', () => {
  let component: DealDetailComponent;
  let fixture: ComponentFixture<DealDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DealDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
