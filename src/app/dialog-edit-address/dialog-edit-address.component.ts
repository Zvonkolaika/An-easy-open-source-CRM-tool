import { Component, inject, Input } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { UserService } from '../user.service';
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

  @Input() user!: User; 

  private firestore: Firestore = inject(Firestore);

  constructor(
    public dialogRef: MatDialogRef<DialogEditAddressComponent>,
    private userService: UserService
  ) {}

  loading = false;

  closeDialog() {
    this.dialogRef.close(null); 
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

