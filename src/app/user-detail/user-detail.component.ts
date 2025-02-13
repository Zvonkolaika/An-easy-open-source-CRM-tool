import { Component, OnInit, inject } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Firestore, getDoc, doc } from '@angular/fire/firestore';
import { MatCard, MatCardHeader, MatCardContent} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { User } from '../../models/user.class';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import {MatSelectModule} from '@angular/material/select';
import { NgClass } from '@angular/common';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { DealService } from '../deal.service';
import { UserDeleteDialogComponent } from '../user-delete-dialog/user-delete-dialog.component';

interface Type {
  value: string;
  viewValue: string;
}
interface Priority {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardContent, 
    MatSelectModule, NgClass, FormsModule, MatCardModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatDialogModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {

  private firestore: Firestore = inject(Firestore);

  // user: { id?: string } = {}; // Initialize user with an optional id property
  userId = '';
  user: User = new User();
  readonly dialog = inject(MatDialog);
  

  constructor(private route: ActivatedRoute,
      private router: Router,
      private dealService: DealService,
      private userService: UserService,
     ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = params.get('id') || '';
      // const id = params.get('id');
        console.log('User ID:', this.userId);
        this.getUser();
      } 
    );
  }

  types: Type[] = [
    {value: 'Customer', viewValue: 'Customer'},
    {value: 'Partner', viewValue: 'Partner'},
    {value: 'Lead', viewValue: 'Lead'},
    {value: 'Vendor', viewValue: 'Vendor'},
  ];

  priorities: Priority[] = [
    {value: 'High', viewValue: 'High'},
    {value: 'Medium', viewValue: 'Medium'},
    {value: 'Low', viewValue: 'Low'}
  ];

  async getUser() {
    if (!this.userId) {
      console.error('Invalid User ID');
      return;
    }
  
    try {
      const userDocRef = doc(this.firestore, 'users', this.userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        // Explicitly create a User instance
        this.user = new User(userDoc.data());
        console.log('User data:', this.user);

        
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error getting document:', error);
    }
  }


  

  editUserDetail(): void {
    const dialog = this.dialog.open(DialogEditUserComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());

    dialog.afterClosed().subscribe((updatedUser: User) => {
      if (updatedUser) {
        this.user = updatedUser;
        // Update the component with the new user data
      }
    });
  }

  editMenu(): void {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    // dialog.componentInstance.userId = this.userId;

    dialog.afterClosed().subscribe((updatedUser: User) => {
      if (updatedUser) {
        this.user = updatedUser;
        // Update the component with the new user data
      }
    });
  }

  getTypeClass(type: string): string {
    return this.userService.getTypeClass(type);
  }

  getPriorityClass(priority: string): string {
    return this.userService.getPriorityClass(priority);
  }

  async saveUser(user: User) {

    try {
      const updatedUser = await this.userService.saveUser(user);
    } catch (e) {
      console.error('Error saving document: ', e);
    } finally {
    }
  }

  async deleteUser(user: User) {
    try {
      if (user.id) {
        const deals = await this.dealService.getDealsByUserId(user.id);
        if (deals.length > 0) {
          this.dialog.open(UserDeleteDialogComponent, {
            data: { message: 'The user cannot be deleted because they have associated deals.' }
          });
          return;
        }
        await this.userService.deleteUser(user.id);
        this.router.navigate(['/user']); // Navigate back to the users list after deletion
      } else {
        console.error('User ID is undefined');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  // async deleteUser(user: User) {
  //   try {
  //     if (user.id) {
  //       const deals = await this.dealService.getDealsByUserId(user.id);
  //       if (deals.length > 0) {
  //         console.error('User cannot be deleted because they have associated deals.');
  //         alert('User cannot be deleted because they have associated deals.');
  //         return;
  //       }
  //       await this.userService.deleteUser(user.id);
  //       this.router.navigate(['/users']); // Navigate back to the users list after deletion
  //     } else {
  //       console.error('User ID is undefined');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // }


  // async deleteUser(user: User) {
  //   try {
  //     if (user.id) {
  //       await this.userService.deleteUser(user.id);
  //     } else {
  //       console.error('User ID is undefined');
  //     }
  //     this.router.navigate(['/user']); // Navigate back to the users list after deletion
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // }


}

