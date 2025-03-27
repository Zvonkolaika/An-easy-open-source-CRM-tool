import { Component, Inject, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA
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
import { Contact } from '../../models/contact.class';

interface Type {
  value: string;
  viewValue: string;
}
interface Priority {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogTitle,
    MatButtonModule, MatInputModule, MatFormFieldModule,
    MatDatepickerModule, MatProgressBarModule, FormsModule,
    MatMenuModule, MatSelectModule, NgClass],
  templateUrl: './dialog-add-user.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent {
  constructor(public dialogRef: MatDialogRef<DialogAddUserComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { contact: Contact }
  ) {
    if (data && data.contact) {
      this.user.firstName = data.contact.firstName;
      this.user.lastName = data.contact.lastName;
      this.user.email = data.contact.email;
      this.user.city = data.contact.city;
      this.user.street = data.contact.street;
      this.user.zipCode = data.contact.zipCode;
    }
  }

  errorMessage: string = '';

  private firestore: Firestore = inject(Firestore);

  loading = false;
  user = new User();
  birthDate: Date | null = null;
  selectedValue: string = '';

  types: Type[] = [
    { value: 'Customer', viewValue: 'Customer' },
    { value: 'Partner', viewValue: 'Partner' },
    { value: 'Lead', viewValue: 'Lead' },
    { value: 'Vendor', viewValue: 'Vendor' },
  ];

  priorities: Priority[] = [
    { value: 'High', viewValue: 'High' },
    { value: 'Medium', viewValue: 'Medium' },
    { value: 'Low', viewValue: 'Low' }
  ];


  closeDialog() {
    this.dialogRef.close(null);
  }

  async saveUser() {
    this.loading = true;
    this.errorMessage = '';
    try {

      console.log('Saving user:', this.user);
      if (this.birthDate) {
        this.user.birthDate = this.birthDate.getTime();
      }

      const usersCollection = collection(this.firestore, 'users');
      const q = query(usersCollection, where('firstName', '==', this.user.firstName), where('lastName', '==', this.user.lastName));
      const querySnapshot = await getDocs(q);

      console.log('Query snapshot:', querySnapshot);

      if (!querySnapshot.empty) {
        this.errorMessage = 'A user with the same name already exists.';
        console.log(this.errorMessage);
        this.loading = false;
        return;
      }

      const updatedUser = await this.userService.saveUser(this.user);
      console.log('User saved:', updatedUser);
      this.dialogRef.close(updatedUser);
    } catch (e) {
      console.error('Error saving document: ', e);
    } finally {
      this.loading = false;
    }
  }

  isFormValid(): boolean {
    return !!this.user.firstName && !!this.user.lastName && !!this.user.email && !!this.birthDate && !!this.user.city && !!this.user.type && !!this.user.priority;
  }

  getTypeClass(type: string): string {
    return this.userService.getTypeClass(type);
  }

  getPriorityClass(priority: string): string {
    return this.userService.getPriorityClass(priority);
  }
}
