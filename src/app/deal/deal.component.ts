import { Component, inject } from '@angular/core';
import { Firestore, collection } from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { DialogAddDealComponent } from '../dialog-add-deal/dialog-add-deal.component';
import { Deal } from '../../models/deal.class';
import { collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DealService } from '../deal.service';
import { NgClass } from '@angular/common';
import { DatePipe } from '@angular/common';
import { UserService } from '../user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from '../header/header.component'; 

@Component({
  selector: 'app-deal',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, MatMenuModule, MatDialogModule,
    MatCardModule, RouterLink, NgClass, DatePipe, CommonModule, HeaderComponent],
  templateUrl: './deal.component.html',
  styleUrl: './deal.component.scss'
})
export class DealComponent {

  private firestore: Firestore = inject(Firestore);

  deals$: Observable<Deal[]>;
  deals: Deal[] = [];
  filteredDeals: Deal[] = [];
  showFilter: boolean = false;
  showCloseButton: boolean = true;

  constructor(private dealService: DealService, private userService: UserService) {
    this.deals$ = collectionData(collection(this.firestore, 'deals'),
      { idField: 'id' }) as Observable<Deal[]>;
  }

  ngOnInit(): void {
    this.deals$.subscribe(deals => {
      this.deals = deals;
      this.filteredDeals = deals;
      this.loadDeals();
    });
  }

  async loadDeals() {
    this.deals = await this.dealService.getDeals();
    this.filteredDeals = this.deals;
    for (let deal of this.deals) {
      if (deal.contact) {
        const user = await this.userService.getUserById(deal.contact);
        if (user) {
          deal.contact = `${user.firstName} ${user.lastName}`;
        }
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDeals = this.deals.filter(deal => {
      const match = deal.name.toLowerCase().includes(filterValue);
      return match;
    });
  }

  trackByFn(index: number, item: Deal) {
    return item.id;
  }

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddDealComponent);
  }

  getStageClass(type: string): string {
    return this.dealService.getStageClass(type);
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
    this.showCloseButton = true;
  }

  resetFilter() {
    this.showFilter = false;
    this.filteredDeals = this.deals;
    this.showCloseButton = true;
  }
}
