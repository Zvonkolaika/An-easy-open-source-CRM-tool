import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc } from '@angular/fire/firestore';
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
}
