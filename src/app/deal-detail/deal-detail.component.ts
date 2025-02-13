import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Firestore } from '@angular/fire/firestore';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Deal } from '../../models/deal.class';
import { DialogEditDealComponent } from '../dialog-edit-deal/dialog-edit-deal.component';
import { MatSelectModule } from '@angular/material/select';
import { NgClass, CommonModule } from '@angular/common';
import { DealService } from '../deal.service';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DialogEditDealDetailsComponent } from '../dialog-edit-deal-details/dialog-edit-deal-details.component';

interface Stage {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-deal-detail',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardContent,
    MatSelectModule, NgClass, FormsModule, CommonModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatDialogModule, MatCardModule],
  templateUrl: './deal-detail.component.html',
  styleUrl: './deal-detail.component.scss'
})

export class DealDetailComponent implements OnInit {

  private firestore: Firestore = inject(Firestore);

  dealId = '';
  deal: Deal = new Deal();
  readonly dialog = inject(MatDialog);
  contactName: string = '';

  constructor(private route: ActivatedRoute,
    private dealService: DealService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.dealId = params.get('id') || '';
      this.getDeal();
    });
  }

  stages: Stage[] = [
    { value: 'New', viewValue: 'New' },
    { value: 'Discovery', viewValue: 'Discovery' },
    { value: 'Proposal', viewValue: 'Proposal' },
    { value: 'Negotiation', viewValue: 'Negotiation' },
    { value: 'Won', viewValue: 'Won' },
    { value: 'Lost', viewValue: 'Lost' }
  ];

  async getDeal() {
    if (!this.dealId) {
      console.error('Invalid Deal ID');
      return;
    }

    try {
      this.deal = await this.dealService.getDealById(this.dealId);
      if (this.deal.contact) {
        const user = await this.userService.getUserById(this.deal.contact);
        if (user) {
          this.contactName = `${user.firstName} ${user.lastName}`;
        }
      }
    } catch (error) {
      console.error('Error getting document:', error);
    }
  }

  async editDealDetail(): Promise<void> {
    const dialog = this.dialog.open(DialogEditDealComponent);
    dialog.componentInstance.deal = new Deal(this.deal.toJSON());
    dialog.afterClosed().subscribe(async (updatedDeal: Deal) => {
      if (updatedDeal) {
        this.deal = updatedDeal;
        if (this.deal.contact) {
          const user = await this.userService.getUserById(this.deal.contact);
          if (user) {
            this.contactName = `${user.firstName} ${user.lastName}`;
          }
        }
      }
    });
  }

  getStageClass(stage: string): string {
    return this.dealService.getStageClass(stage);
  }

  async saveDeal(deal: Deal) {
    try {
      const updatedDeal = await this.dealService.saveDeal(deal);
    } catch (e) {
      console.error('Error saving document: ', e);
    }
  }

  editMenu(): void {
    const dialog = this.dialog.open(DialogEditDealDetailsComponent);
    dialog.componentInstance.deal = new Deal(this.deal.toJSON());
    dialog.afterClosed().subscribe((updatedDeal: Deal) => {
      if (updatedDeal) {
        this.deal = updatedDeal;
      }
    });
  }

  async deleteDeal(deal: Deal) {
    try {
      if (deal.id) {
        await this.dealService.deleteDeal(deal.id);
      } else {
        console.error('User ID is undefined');
      }
      this.router.navigate(['/deal']);
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  }
}
