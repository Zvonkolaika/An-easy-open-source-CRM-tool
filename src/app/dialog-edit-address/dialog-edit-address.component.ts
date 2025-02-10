import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { UserService } from '../user.service';
import { Input } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle, 
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dialog-edit-address',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogTitle, 
    MatButtonModule, MatInputModule, MatFormFieldModule,
    MatDatepickerModule, MatProgressBarModule, FormsModule],
  templateUrl: './dialog-edit-address.component.html',
  styleUrl: './dialog-edit-address.component.scss'
})
export class DialogEditAddressComponent {

  @Input() user!: User; // Expect a User instance to be passed

  private firestore: Firestore = inject(Firestore);

  // userId: string;  

  constructor(
    public dialogRef: MatDialogRef<DialogEditAddressComponent>,
    private userService: UserService
  ) {}

  loading = false;
  // user = User;

  closeDialog() {
    this.dialogRef.close(null); // Return null when the dialog is closed without saving
  }

    async saveUser(user: User) {

    this.loading = true;
    try {
      const updatedUser = await this.userService.saveUser(user);
      this.dialogRef.close(updatedUser);
    } catch (e) {
      console.error('Error saving document: ', e);
    } finally {
      this.loading = false;
    }
  }

  isFormValid(): boolean {
    return !!this.user.city;
  }
}

