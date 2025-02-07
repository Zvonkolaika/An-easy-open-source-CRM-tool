import { Component, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, updateDoc, doc } from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {DialogAddDealComponent } from '../dialog-add-deal/dialog-add-deal.component';
import { Deal } from '../../models/deal.class';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DealService } from '../deal.service';
import { NgClass } from '@angular/common';
import { DatePipe } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-deal',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, 
    MatDialogModule, MatCardModule, RouterLink, NgClass, DatePipe],
  templateUrl: './deal.component.html',
  styleUrl: './deal.component.scss'
})
export class DealComponent {

   private firestore: Firestore = inject(Firestore);

    deals$: Observable<Deal[]>;
     deals: Deal[] = []; // Array to store loaded users

  constructor(private dealService: DealService, private userService: UserService) {
      this.deals$ = collectionData(collection(this.firestore, 'deals'), { idField: 'id' }) as Observable<Deal[]>;
    }

    ngOnInit(): void {
      this.deals$.subscribe(deals => {
        this.deals = deals;
        console.log('Loaded deals:', this.deals); // Debug log
        this.loadDeals();
      });

    }

    async loadDeals() {
      this.deals = await this.dealService.getDeals();
      for (let deal of this.deals) {
        if (deal.contact) {
          const user = await this.userService.getUserById(deal.contact);
          if (user) {
            deal.contact = `${user.firstName} ${user.lastName}`;
          }
        }
      }
    }

   readonly dialog = inject(MatDialog);
  
    openDialog(){
      const dialogRef = this.dialog.open(DialogAddDealComponent);
    }

    getStageClass(type: string): string {
      return this.dealService.getStageClass(type);
    }

}
