import { Component, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc } from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from '../../models/user.class';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatCardModule, RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  private firestore: Firestore = inject(Firestore);

  users$: Observable<User[]>;
  users: User[] = []; // Array to store loaded users



  constructor() {
    this.users$ = collectionData(collection(this.firestore, 'users'), { idField: 'id' }) as Observable<User[]>;
  }

  ngOnInit(): void {
    this.users$.subscribe(users => {
      this.users = users;
      console.log('Loaded users:', this.users); // Debug log
    });
  }

  // async loadUsers() {
  //   const querySnapshot = await getDocs(collection(this.firestore, 'users'));
  //   this.users = querySnapshot.docs.map(doc => doc.data() as User);
  //   console.log('Loaded users:', this.users); // Debug log
  // }

  async saveUsers(user: User) {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const docRef = await addDoc(usersCollection, user.toJSON());
      console.log('User saved with ID:', docRef.id);

      // Update the user with the generated ID
      const userDoc = doc(this.firestore, `users/${docRef.id}`);
      await updateDoc(userDoc, { id: docRef.id });

    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  readonly dialog = inject(MatDialog);

  openDialog(){
    const dialogRef = this.dialog.open(DialogAddUserComponent);
   
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result); // Debug log

      if (result) {
        this.saveUsers(result);
      }
    });
  }

}


