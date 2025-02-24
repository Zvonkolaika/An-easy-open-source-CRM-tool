import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../contact.service';
import { Contact } from '../../models/contact.class';
import { ReactiveFormsModule } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
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

@Component({
  selector: 'app-DialogRegister',
  templateUrl: './dialog-register.component.html',
  imports: [MatDialogContent, MatDialogActions, MatDialogTitle,
    MatButtonModule, MatInputModule, MatFormFieldModule,
    MatDatepickerModule, MatProgressBarModule, FormsModule, 
    MatMenuModule, MatSelectModule,
    ReactiveFormsModule
  ],
  standalone: true,
  styleUrls: ['./dialog-register.component.scss']
})
export class DialogRegisterComponent {

  
  loading = false;
  // DialogRegisterForm: FormGroup;
  errorMessage: string = '';
  contact = new Contact();

  constructor(public dialogRef: MatDialogRef<DialogRegisterComponent>, private ContactService: ContactService) {
    // this.DialogRegisterForm = this.fb.group({
    //   firstName: ['', Validators.required],
    //   lastName: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   birthDate: ['', Validators.required],
    //   street: ['', Validators.required],
    //   zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    //   city: ['', Validators.required],
    // });
  }

  // async onDialogRegister() {
  //   if (this.DialogRegisterForm.invalid) return;

  //   const newContact = new Contact(this.DialogRegisterForm.value);
  //   try {
  //     await this.ContactService.addContact(newContact);
  //     console.log('Contact DialogRegistered successfully:', newContact);
  //   } catch (error) {
  //     this.errorMessage = 'Registration failed: ' + (error as any).message;
  //   }
  // }

  closeDialog() {
    this.dialogRef.close(null);
  }

  isFormValid(): boolean {
    return !!this.contact.firstName && !!this.contact.lastName && !!this.contact.email && !!this.contact.city;
  }

  async saveContact() {
    this.loading = true;
    try {
      const updatedContact = await this.ContactService.saveContact(this.contact);
      this.dialogRef.close(updatedContact);
    } catch (e) {
      console.error('Error saving document: ', e);
    } finally {
      this.loading = false;
    }
  }
}
