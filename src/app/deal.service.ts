import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, getDocs } from '@angular/fire/firestore';
import { Deal } from '../models/deal.class';

@Injectable({
  providedIn: 'root'
})
export class DealService {
  constructor(private firestore: Firestore) {}

  async saveDeal(deal: Deal): Promise<Deal> {
    const dealsCollection = collection(this.firestore, 'deals');

    if (deal.id) {
      const dealDoc = doc(this.firestore, `deals/${deal.id}`);
      await updateDoc(dealDoc, deal.toJSON());
      console.log('Deal updated with ID:', deal.id);
    } else {
      // Create a copy of the user object without the id field
      const dealWithoutId = { ...deal.toJSON() };
      delete dealWithoutId.id;

      // Add a new user document
      const docRef = await addDoc(dealsCollection, dealWithoutId);
      console.log('Deal saved with ID:', docRef.id);

      // Update the user with the generated ID
      const dealDoc = doc(this.firestore, `deals/${docRef.id}`);
      await updateDoc(dealDoc, { id: docRef.id });

      // Update the local user object with the new ID
      deal.id = docRef.id;
    }

    return deal;
}

async getDeals(): Promise<Deal[]> {
    const dealsCollection = collection(this.firestore, 'deals');
    const dealSnapshot = await getDocs(dealsCollection);
    return dealSnapshot.docs.map(doc => new Deal(doc.data()));
  }

getStageClass(stage: string): string {
    switch (stage) {
      case 'New':
        return 'new-option';
      case 'Discovery':
        return 'discovery-option';
      case 'Proposal':
        return 'proposal-option';
        case 'Negotiation':
          return 'negotiation-option';
        case 'Won':
            return 'won-option';
        case 'Lost':
            return 'lost-option';
      default:
        return '';
    }
  }
  }