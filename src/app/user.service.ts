import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, getDocs, getDoc } from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {}

  async saveUser(user: User): Promise<User> {
    const usersCollection = collection(this.firestore, 'users');

    if (user.id) {
      // Update the existing user document
      const userDoc = doc(this.firestore, `users/${user.id}`);
      await updateDoc(userDoc, user.toJSON());
      console.log('User updated with ID:', user.id);
    } else {
      // Create a copy of the user object without the id field
      const userWithoutId = { ...user.toJSON() };
      delete userWithoutId.id;

      // Add a new user document
      const docRef = await addDoc(usersCollection, userWithoutId);
      console.log('User saved with ID:', docRef.id);

      // Update the user with the generated ID
      const userDoc = doc(this.firestore, `users/${docRef.id}`);
      await updateDoc(userDoc, { id: docRef.id });

      // Update the local user object with the new ID
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
}
