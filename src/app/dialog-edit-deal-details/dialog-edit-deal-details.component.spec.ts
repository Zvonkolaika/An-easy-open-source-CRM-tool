import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditDealDetailsComponent } from './dialog-edit-deal-details.component';

describe('DialogEditDealDetailsComponent', () => {
  let component: DialogEditDealDetailsComponent;
  let fixture: ComponentFixture<DialogEditDealDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditDealDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEditDealDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
