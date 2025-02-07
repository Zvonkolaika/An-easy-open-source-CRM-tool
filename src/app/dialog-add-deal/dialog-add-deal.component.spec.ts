import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddDealComponent } from './dialog-add-deal.component';

describe('DialogAddDealComponent', () => {
  let component: DialogAddDealComponent;
  let fixture: ComponentFixture<DialogAddDealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddDealComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
