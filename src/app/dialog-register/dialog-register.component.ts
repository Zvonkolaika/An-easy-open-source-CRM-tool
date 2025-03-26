import { Component, inject } from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from '../../models/contact.class';
import { ReactiveFormsModule } from '@angular/forms';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import {FormControl} from '@angular/forms';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-DialogRegister', 
  templateUrl: './dialog-register.component.html',
  imports: [MatDialogContent, MatDialogActions, MatDialogTitle,
    MatButtonModule, MatInputModule, MatFormFieldModule,
    MatDatepickerModule, MatProgressBarModule, FormsModule, 
    MatMenuModule, MatSelectModule,
    ReactiveFormsModule, MatTooltipModule],
  standalone: true,
  styleUrls: ['./dialog-register.component.scss']
})
export class DialogRegisterComponent {

  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
  
  loading = false;
  confirmPassword: string = '';
  errorMessage: string = '';
  contact = new Contact();

  constructor(public dialogRef: MatDialogRef<DialogRegisterComponent>, private ContactService: ContactService) {
   
  }
   readonly dialog = inject(MatDialog);

 // Regex pattern for password validation: At least 8 characters, including letters, numbers, and symbols
 passwordPattern = '^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?/|`~]).{8,}$';

 isPasswordValid(): boolean {
   const regex = new RegExp(this.passwordPattern);
   return regex.test(this.contact.password);
 }

 doPasswordsMatch(): boolean {
  const passwordsMatch = this.contact.password === this.confirmPassword;
  // console.log('Passwords match:', passwordsMatch);
  return passwordsMatch;
}

  closeDialog() {
    this.dialogRef.close(null);
  }

  isFormValid(): boolean {
    return !!(
      this.contact.firstName &&
      this.contact.lastName &&
      this.contact.email &&
      this.contact.city &&
      this.isPasswordValid() &&
      this.doPasswordsMatch()
    );
  }

  async saveContact() {
    this.loading = true;
    try {
      const updatedContact = await this.ContactService.saveContact(this.contact);
      this.dialogRef.close(updatedContact);
      this.dialog.open(WarningDialogComponent, {
        data: { message: 'Your contact has been saved. Please log in to proceed.' }
      });
    } catch (e) {
      console.error('Error saving document: ', e);
    } finally {
      this.loading = false;
    }
  }
}
