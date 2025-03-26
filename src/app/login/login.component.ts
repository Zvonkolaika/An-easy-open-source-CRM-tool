import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { UserService } from '../user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogRegisterComponent } from '../dialog-register/dialog-register.component';
import { ContactService } from '../contact.service';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore,  collection, query, where, getDocs } from "firebase/firestore";
import { Contact } from '../../models/contact.class';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule,
            MatInputModule, FormsModule, MatIconModule, 
            MatDividerModule, MatButtonModule, MatDialogModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, 
    private userService: UserService, private contactService: ContactService) 
    {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // <-- "email" instead of "username"
      password: ['', Validators.required]
    });
  }

  private auth = getAuth();
  private firestore = getFirestore();

  // async onSubmit() {
  //   try {
  //     // Step 1: Sign in using Firebase Authentication
  //     const { email, password } = this.loginForm.value;
  //     const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

  //     // Step 2: Get user ID (uid) from Firebase Authentication
  //     const userId = userCredential.user.uid;

  //     // Step 3: Fetch the contact (assuming contactId is same as userId)
  //     const contact = await this.getContactById(userId);
      
  //     if (contact) {
  //       // If contact exists, navigate to the dashboard
  //       this.router.navigate(['/dashboard']);
  //     } else {
  //       // If contact does not exist in Firestore, offer registration
  //       alert("Contact not found in the system. Please register.");
  //     }
  //   } catch (error) {
  //     // If authentication fails, alert the user
  //     alert('Invalid email or password!');
  //   }
  // }

  async getUserIdByEmail(email: string): Promise<string | null> {
    const usersRef = collection(this.firestore, "contacts");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    console.log(email);
    console.log(querySnapshot);
    if (!querySnapshot.empty) {
      // Assuming you are getting a single user, you can grab the first document
      const userDoc = querySnapshot.docs[0];
      return userDoc.id;  // This will return the user ID
    } else {
      // throw new Error('User not found');
      // console.error('User not found');
      return null;
    }
  }

  async onSubmit() {

    const loginID = await this.getUserIdByEmail(this.loginForm.value.email);
    if (loginID != null) {

      const contact = await this.getContactById(loginID);
      if (contact != null) {
        if (contact.password == this.loginForm.value.password) {

          // if (contact) {
          // If contact exists, navigate to the dashboard
          this.router.navigate(['/dashboard']);
          return;
        }
      }
    }
    console.log('Contact not found in the system. Please register.');
      // If contact does not exist in Firestore, offer registration
      this.dialog.open(WarningDialogComponent, {
        data: { message: 'Contact or password is not correct. Please register.' }
      }).afterClosed().subscribe(() => {
        // Clear the login form after the dialog is closed
        this.loginForm.reset();
      });

    
}
  
  

  // async onSubmit() {

    
    // if (this.loginForm.valid) {
    //   const { email, password } = this.loginForm.value;
    //   try {
    //     await this.userService.login(email, password);
    //     localStorage.setItem('user', JSON.stringify({ email }));
    //     this.router.navigate(['/dashboard']);
    //   } catch (error) {
    //     console.error('Login error:', error);
    //     this.errorMessage = 'Invalid email or password';
    //   }
    // }
  // }

  async guestLogin() {
    try {
      await this.userService.guestLogin();
      console.log('Guest logged in');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Guest login error:', (error as any).message);
      this.errorMessage = 'Guest login failed';
    }
  }

  private async getContactById(userId: string): Promise<Contact | null> {
    try {
      const contact = await this.contactService.getContactById(userId);
      return contact;
    } catch (error) {
      console.error('Error fetching contact:', error);
      return null;
    }
  }

  readonly dialog = inject(MatDialog);
  
    openDialog() {
      const dialogRef = this.dialog.open(DialogRegisterComponent);
    }

  // DialogRegister() {
  //   this.router.navigate(['/DialogRegister']); // Navigate to registration page
  // }
}
