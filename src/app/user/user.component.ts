import { Component, inject } from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from '../../models/user.class';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { NgClass } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule,
            MatDialogModule, MatCardModule, RouterLink, NgClass, HeaderComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  private firestore: Firestore = inject(Firestore);

  users$: Observable<User[]>;
  users: User[] = [];

  constructor(private userService: UserService) {
    this.users$ = collectionData(collection(this.firestore, 'users'), 
    { idField: 'id' }) as Observable<User[]>;
  }

  ngOnInit(): void {
    this.users$.subscribe(users => {
      this.users = users;
    });
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddUserComponent);
  }

  getTypeClass(type: string): string {
    return this.userService.getTypeClass(type);
  }

  getPriorityClass(priority: string): string {
    return this.userService.getPriorityClass(priority);
  }
}


