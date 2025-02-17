import { Component, inject, Input } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle } from '@angular/material/dialog';
import { User } from '../../models/user.class';
import { UserService } from '../user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
  imports: [MatProgressBarModule, MatFormFieldModule, FormsModule, 
            MatDialogActions, MatButtonModule, MatInputModule, 
            MatDatepickerModule, MatDialogContent, MatDialogTitle],
  templateUrl: './dialog-edit-user.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './dialog-edit-user.component.scss'
})
export class DialogEditUserComponent {

  @Input() user!: User;
  private firestore: Firestore = inject(Firestore);

  constructor(public dialogRef: MatDialogRef<DialogEditUserComponent>,
    private userService: UserService
  ) {}

  loading = false;
  birthDate: Date | null = null;

  ngOnInit() {
    if (this.user && this.user.birthDate) {
      this.birthDate = new Date(this.user.birthDate);
    }
  }

  closeDialog() {
    this.dialogRef.close(null); 
  }

  async saveUser(user: User) {
    this.loading = true;
    try {
      if (this.birthDate) {
        this.user.birthDate = this.birthDate.getTime();
      }
      const updatedUser = await this.userService.saveUser(this.user);
      this.dialogRef.close(updatedUser);
    } catch (e) {
      console.error('Error saving document: ', e);
    } finally {
      this.loading = false;
    }
  }

  isFormValid(): boolean {
    return !!this.user.firstName && !!this.user.lastName && !!this.user.email;
  }
}
