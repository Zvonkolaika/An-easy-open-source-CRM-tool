import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle, 
} from '@angular/material/dialog';
import { Input } from '@angular/core';
import { User } from '../../models/user.class';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
  imports: [MatProgressBarModule, MatFormFieldModule, FormsModule, MatDialogActions, MatButtonModule, 
    MatInputModule, MatDatepickerModule, MatDialogContent, MatDialogTitle],
  templateUrl: './dialog-edit-user.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './dialog-edit-user.component.scss'
})
export class DialogEditUserComponent {

  @Input() user!: User; // Expect a User instance to be passed

  constructor(public dialogRef: MatDialogRef<DialogEditUserComponent>) {
    this.birthDate = new Date(); // Initialize with the current date or any other default value
  }

  loading = false;
  birthDate: Date;

  closeDialog() {
    this.dialogRef.close(null); // Return null when the dialog is closed without saving
  }

  async saveUser() {
    this.loading = true;
  
    console.log('User data to save:', this.user);
    this.dialogRef.close(this.user); // Pass the user data to UserComponent
  }

}
