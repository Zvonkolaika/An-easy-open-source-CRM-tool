import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
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
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogTitle, 
    MatButtonModule, MatInputModule, MatFormFieldModule,
    MatDatepickerModule, MatProgressBarModule, FormsModule],
  templateUrl: './dialog-add-user.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent {
  constructor(public dialogRef: MatDialogRef<DialogAddUserComponent>) {}

  private firestore: Firestore = inject(Firestore);

  loading = false;

  user = new User();
  birthDate: Date | null = null;

  // closeDialog(){
  //   this.dialogRef.close();
  // }

  closeDialog() {
    this.dialogRef.close(null); // Return null when the dialog is closed without saving
  }

  async saveUser() {
    if (this.birthDate) {
      this.user.birthDate = this.birthDate.getTime();
    } else {
      this.user.birthDate = null;
    }
    this.loading = true;
  
    console.log('User data to save:', this.user);
    this.dialogRef.close(this.user); // Pass the user data to UserComponent
  }

}
