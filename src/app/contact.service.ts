import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, 
  query, where, getDocs, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Contact } from '../models/contact.class';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private firestore: Firestore) {}

  // async getContactsByUserId(userId: string): Promise<Deal[]> {
  //   const dealsCollection = collection(this.firestore, 'deals');
  //   const q = query(dealsCollection, where('contact', '==', userId));
  //   const querySnapshot = await getDocs(q);
  //   return querySnapshot.docs.map(doc => new Deal(doc.data()));
  // }

  async saveContact(contact: Contact): Promise<Contact> {
    const contactsCollection = collection(this.firestore, 'contacts');

    if (contact.id) {
      const contactDoc = doc(this.firestore, `contacts/${contact.id}`);
      await updateDoc(contactDoc, contact.toJSON());

    } else {
      const contactWithoutId = { ...contact.toJSON() };
      delete contactWithoutId.id;
      const docRef = await addDoc(contactsCollection, contactWithoutId);
      const contactDoc = doc(this.firestore, `contacts/${docRef.id}`);
      await updateDoc(contactDoc, { id: docRef.id });
      contact.id = docRef.id;
    }

    return contact;
  }

  async getContact(): Promise<Contact[]> {
    const contactsCollection = collection(this.firestore, 'contacts');
    const contactSnapshot = await getDocs(contactsCollection);
    return contactSnapshot.docs.map(doc => new Contact(doc.data()));
  }

  async getContactById(contactId: string): Promise<Contact> {
    const contactDocRef = doc(this.firestore, `contacts/${contactId}`);
    const contactDoc = await getDoc(contactDocRef);
    if (contactDoc.exists()) {
      return new Contact(contactDoc.data());
    } else {
      throw new Error('No such document!');
    }
  }


// Function to get user by email and return the user id
// async getUserIdByEmail(email: string): Promise<string | null> {
//   const usersRef = collection(this.firestore, "users");
//   const q = query(usersRef, where("mail", "==", email));
//   const querySnapshot = await getDocs(q);
  
//   if (!querySnapshot.empty) {
//     // Assuming you are getting a single user, you can grab the first document
//     const userDoc = querySnapshot.docs[0];
//     return userDoc.id;  // This will return the user ID
//   } else {
//     throw new Error('User not found');
//   }
// }


  // Add a new contact
  async addContact(contact: Contact): Promise<void> {
    const contactsCollection = collection(this.firestore, 'contacts');
    const docRef = await addDoc(contactsCollection, contact.toJSON());
    await updateDoc(doc(this.firestore, `contacts/${docRef.id}`), { id: docRef.id });
  }

  // Get all contacts
  async getContacts(): Promise<Contact[]> {
    const contactsCollection = collection(this.firestore, 'contacts');
    const contactSnapshot = await getDocs(contactsCollection);
    return contactSnapshot.docs.map(doc => new Contact(doc.data()));
  }

  // Convert a contact to a user
  async upgradeToUser(contact: Contact, type: string, priority: string, password: string): Promise<void> {
    const usersCollection = collection(this.firestore, 'users');

    // Create new user from contact info
    const newUser = new User({
      ...contact,
      type,
      priority,
      password,
    });

    const docRef = await addDoc(usersCollection, newUser.toJSON());
    await updateDoc(doc(this.firestore, `users/${docRef.id}`), { id: docRef.id });

    // Remove from contacts
    // await deleteDoc(doc(this.firestore, `contacts/${contact.id}`));
  }
}
