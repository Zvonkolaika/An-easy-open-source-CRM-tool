import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditDealComponent } from './dialog-edit-deal.component';

describe('DialogEditDealComponent', () => {
  let component: DialogEditDealComponent;
  let fixture: ComponentFixture<DialogEditDealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditDealComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEditDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
