import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, 
         query, where, getDocs, getDoc, deleteDoc } from '@angular/fire/firestore';
import { Deal } from '../models/deal.class';

@Injectable({
  providedIn: 'root'
})
export class DealService {
  constructor(private firestore: Firestore) { }

  async getDealsByUserId(userId: string): Promise<Deal[]> {
    const dealsCollection = collection(this.firestore, 'deals');
    const q = query(dealsCollection, where('contact', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => new Deal(doc.data()));
  }

  async saveDeal(deal: Deal): Promise<Deal> {
    const dealsCollection = collection(this.firestore, 'deals');

    if (deal.id) {
      const dealDoc = doc(this.firestore, `deals/${deal.id}`);
      await updateDoc(dealDoc, deal.toJSON());

    } else {
      const dealWithoutId = { ...deal.toJSON() };
      delete dealWithoutId.id;
      const docRef = await addDoc(dealsCollection, dealWithoutId);
      const dealDoc = doc(this.firestore, `deals/${docRef.id}`);
      await updateDoc(dealDoc, { id: docRef.id });
      deal.id = docRef.id;
    }

    return deal;
  }

  async getDeals(): Promise<Deal[]> {
    const dealsCollection = collection(this.firestore, 'deals');
    const dealSnapshot = await getDocs(dealsCollection);
    return dealSnapshot.docs.map(doc => new Deal(doc.data()));
  }

  async getDealById(dealId: string): Promise<Deal> {
    const dealDocRef = doc(this.firestore, `deals/${dealId}`);
    const dealDoc = await getDoc(dealDocRef);
    if (dealDoc.exists()) {
      return new Deal(dealDoc.data());
    } else {
      throw new Error('No such document!');
    }
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

  async deleteDeal(dealId: string): Promise<void> {
    const dealDocRef = doc(this.firestore, `deals/${dealId}`);
    await deleteDoc(dealDocRef);
  }
}