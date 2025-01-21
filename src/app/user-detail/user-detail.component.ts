import { Component, OnInit, inject } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Firestore, getDoc, doc } from '@angular/fire/firestore';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { User } from '../../models/user.class';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';


@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatIconModule, MatButtonModule, MatMenuModule, MatDialogModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {

  private firestore: Firestore = inject(Firestore);

  // user: { id?: string } = {}; // Initialize user with an optional id property
  userId = '';
  user: User = new User();
  readonly dialog = inject(MatDialog);

  constructor(private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = params.get('id') || '';
      // const id = params.get('id');
        console.log('User ID:', this.userId);
        this.getUser();
      } 
    );
  }

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


  editUserDetail() {
    const dialog = this.dialog.open(DialogEditUserComponent);
    dialog.componentInstance.user = this.user;
  }

  editMenu(): void {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
  }

  

  // openDialog(){
  //   const dialogRef = this.dialog.open(DialogAddUserComponent);
   
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('Dialog result:', result); // Debug log

  //     if (result) {
  //       // this.saveUsers(result);
  //     }
  //   });
  // }

}