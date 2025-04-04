import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../contact.service';
import { Contact } from '../../models/contact.class';
import { Firestore, collection } from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { collectionData } from '@angular/fire/firestore';
import { Observable, forkJoin } from 'rxjs';
import { NgClass } from '@angular/common';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { UserService } from '../user.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatCardModule, MatIconModule,
    MatDialogModule, MatButtonModule, MatTooltipModule,
    NgClass, CommonModule, HeaderComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})

export class ContactComponent implements OnInit {

  private firestore: Firestore = inject(Firestore);

  contacts$: Observable<Contact[]>;
  contacts: Contact[] = [];
  errorMessage: string | null = null;
  duplicateStatus: { [key: string]: boolean } = {};

  constructor(private contactService: ContactService, private userService: UserService) {
    this.contacts$ = collectionData(collection(this.firestore, 'contacts'),
      { idField: 'id' }) as Observable<Contact[]>;
  }

  ngOnInit(): void {
    this.contacts$.subscribe(async contacts => {
      this.contacts = contacts;
      await this.checkAllDuplicates();
    });
  }

  async checkAllDuplicates(): Promise<void> {
    const duplicateChecks = this.contacts.map(contact => this.checkDuplicateUser(contact));
    const results = await forkJoin(duplicateChecks).toPromise();
    if (results) {
      this.contacts.forEach((contact, index) => {
        if (contact.id) {
          this.duplicateStatus[contact.id] = results[index];
        }
      });
    }
  }

  async checkDuplicateUser(contact: Contact): Promise<boolean> {

    return await this.userService.isDuplicateUser(contact);
  }

  async handleIconClick(contact: Contact) {
    if (contact.id && this.duplicateStatus[contact.id]) {
      this.dialog.open(WarningDialogComponent, {
        data: { message: 'A user with the same name already exists.' }
      });
    } else {
      this.openDialog(contact);
    }
  }

  readonly dialog = inject(MatDialog);

  openDialog(contact: Contact) {
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      data: { contact }
    });
  }
}

