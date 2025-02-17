import { DealService } from '../deal.service';
import { Deal } from '../../models/deal.class';
import { Component} from '@angular/core';
import { User } from '../../models/user.class';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgClass } from '@angular/common';

interface Stage {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog-add-deal',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogTitle,
    MatButtonModule, MatInputModule, MatFormFieldModule,
    MatDatepickerModule, MatProgressBarModule, FormsModule, 
    MatMenuModule, MatSelectModule, NgClass],
  templateUrl: './dialog-add-deal.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrls: ['./dialog-add-deal.component.scss']
})

export class DialogAddDealComponent {
  deal: Deal = new Deal();
  users: User[] = [];
  expectedCloseDate: Date | null = null;
  loading = false;
  selectedValue: string = '';
  stages: Stage[] = [
    { value: 'New', viewValue: 'New' },
    { value: 'Discovery', viewValue: 'Discovery' },
    { value: 'Proposal', viewValue: 'Proposal' },
    { value: 'Negotiation', viewValue: 'Negotiation' },
    { value: 'Won', viewValue: 'Won' },
    { value: 'Lost', viewValue: 'Lost' }
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogAddDealComponent>,
    private dealService: DealService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    this.users = await this.userService.getUsers();
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  async saveDeal() {
    this.loading = true;
    try {
      if (this.expectedCloseDate) {
        this.deal.expectedCloseDate = this.expectedCloseDate.getTime();
      }
      const updatedDeal = await this.dealService.saveDeal(this.deal);
      this.dialogRef.close(updatedDeal);
    } catch (e) {
      console.error('Error saving deal:', e);
    } finally {
      this.loading = false;
    }
  }

  isFormValid(): boolean {
    return !!this.deal.name && !!this.deal.stage && !!this.deal.value && !!this.deal.contact && !!this.expectedCloseDate;
  }

  getStageClass(type: string): string {
    return this.dealService.getStageClass(type);
  }
}
