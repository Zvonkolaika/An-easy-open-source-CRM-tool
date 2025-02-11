import { Component, inject, Input, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle, 
} from '@angular/material/dialog';
import { User } from '../../models/user.class';
import { UserService } from '../user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { Deal } from '../../models/deal.class';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { DealService } from '../deal.service';

@Component({
  selector: 'app-dialog-edit-deal',
  standalone: true,
  imports: [MatProgressBarModule, MatFormFieldModule, FormsModule, MatDialogActions, MatButtonModule, 
    MatInputModule, MatDatepickerModule, MatDialogContent, MatDialogTitle, MatMenuModule, MatSelectModule],
  templateUrl: './dialog-edit-deal.component.html',
  styleUrl: './dialog-edit-deal.component.scss'
})
export class DialogEditDealComponent implements OnInit {

  private firestore: Firestore = inject(Firestore);

  constructor(public dialogRef: MatDialogRef<DialogEditDealComponent>,
    private userService: UserService, private dealService: DealService
  ) {
  }

  loading = false;
  @Input() deal!: Deal; // Expect a Deal instance to be passed
  users: User[] = [];

  ngOnInit() {
    console.log('Initial deal:', this.deal); 
    console.log('Initial deal.contact:', this.deal.contact); // Check the value before loading users
    this.loadUsers();
  }
  

  async loadUsers() {
    this.users = await this.userService.getUsers();
    console.log('Users loaded:', this.users);
  
    // Convert contact name to user ID
    if (this.deal.contact) {
      const foundUser = this.users.find(user => 
        `${user.firstName} ${user.lastName}` === this.deal.contact
      );
      if (foundUser) {
        this.deal.contact = foundUser.id!; // Assign the correct ID
      } else {
        console.warn('User not found for contact:', this.deal.contact);
      }
    }
  
    console.log('Updated deal.contact:', this.deal.contact);
  }
  
  

  closeDialog() {
    this.dialogRef.close(null); // Return null when the dialog is closed without saving
  }

  async saveDeal(deal: Deal) {
    this.loading = true;
    try {
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

  trackByUserId(index: number, user: User): string {
    return user.id || '';
  }
}