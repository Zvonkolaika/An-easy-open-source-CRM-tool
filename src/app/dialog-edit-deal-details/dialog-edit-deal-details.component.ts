import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { Input } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { Deal } from '../../models/deal.class';
import { DealService } from '../deal.service';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-dialog-edit-deal-details',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogTitle,
    MatButtonModule, MatInputModule, MatFormFieldModule,
    MatDatepickerModule, MatProgressBarModule, FormsModule],
  templateUrl: './dialog-edit-deal-details.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './dialog-edit-deal-details.component.scss'
})
export class DialogEditDealDetailsComponent {

  @Input() deal!: Deal;

  private firestore: Firestore = inject(Firestore);

  constructor(public dialogRef: MatDialogRef<DialogEditDealDetailsComponent>,
    private userService: UserService, private dealService: DealService
  ) {}

  loading = false;
  expectedCloseDate: Date | null = null;

  ngOnInit() {
    if (this.deal && this.deal.expectedCloseDate) {
      this.expectedCloseDate = new Date(this.deal.expectedCloseDate);
    }
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  async saveDeal(deal: Deal) {
    this.loading = true;
    try {
      if (this.expectedCloseDate) {
        this.deal.expectedCloseDate = this.expectedCloseDate.getTime();
      }
      const updatedDeal = await this.dealService.saveDeal(this.deal);
      this.dialogRef.close(updatedDeal);
    } catch (e) {
      console.error('Error saving document:', e);
    } finally {
      this.loading = false;
    }
  }

  isFormValid(): boolean {
    return !!this.deal.name && !!this.deal.contact;
  }
}


