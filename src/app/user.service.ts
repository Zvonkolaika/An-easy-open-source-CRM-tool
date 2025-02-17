import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, 
         doc, getDocs, getDoc, deleteDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) { }

  async saveUser(user: User): Promise<User> {
    const usersCollection = collection(this.firestore, 'users');

    if (user.id) {
      const userDoc = doc(this.firestore, `users/${user.id}`);
      await updateDoc(userDoc, user.toJSON());

    } else {
      const userWithoutId = { ...user.toJSON() };
      delete userWithoutId.id;
      const docRef = await addDoc(usersCollection, userWithoutId);
      const userDoc = doc(this.firestore, `users/${docRef.id}`);
      await updateDoc(userDoc, { id: docRef.id });
      user.id = docRef.id;
    }

    return user;
  }

  async getUsers(): Promise<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    const userSnapshot = await getDocs(usersCollection);
    return userSnapshot.docs.map(doc => new User(doc.data()));
  }

  async getUserById(userId: string): Promise<User | null> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return new User(userDoc.data());
    } else {
      return null;
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'Customer':
        return 'customer-option';
      case 'Partner':
        return 'partner-option';
      case 'Lead':
        return 'lead-option';
      case 'Vendor':
        return 'vendor-option';
      default:
        return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High':
        return 'high-option';
      case 'Medium':
        return 'medium-option';
      case 'Low':
        return 'low-option';
      default:
        return '';
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    await deleteDoc(userDocRef);
  }
}
