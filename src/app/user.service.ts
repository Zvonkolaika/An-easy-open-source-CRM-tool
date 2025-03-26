import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, 
         doc, getDocs, getDoc, deleteDoc } from '@angular/fire/firestore';
import { query, where } from '@angular/fire/firestore';

import { User } from '../models/user.class';
import { Auth, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, signOut, UserCredential, signInAnonymously } from '@angular/fire/auth';
import { Contact } from '../models/contact.class';
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore,
    private auth: Auth,

  ) { }


  // async addUser(email: string, password: string): Promise<UserCredential> {
  //   return await createUserWithEmailAndPassword(this.auth, email, password);
  // }

  async addUser(email: string, password: string): Promise<UserCredential> {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  // async login(email: string, password: string): Promise<UserCredential> {
  //   return await signInWithEmailAndPassword(this.auth, email, password);
  // }

  // async login(email: string, password: string): Promise<UserCredential> {
  //   try {
  //     return await signInWithEmailAndPassword(this.auth, email, password);
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //     throw error;
  //   }
  // }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // async guestLogin(): Promise<void> {
  //   try {
  //     await signInAnonymously(this.auth);
  //   } catch (error) {
  //     console.error('Guest login error:', error);
  //     throw error;
  //   }
  // }

  async guestLogin(): Promise<void> {
    try {
      const userCredential = await signInAnonymously(this.auth);
      console.log('Guest logged in:', userCredential.user.uid);
    } catch (error) {
      console.error('Guest login error:', error);
      throw error;
    }
  }

  
  

  

  // async logout(): Promise<void> {
  //   return await signOut(this.auth);
  // }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  async createWriting(data: any): Promise<void> {
    const user = this.auth.currentUser;
    
    if (user && user.isAnonymous) {
      const writingsCount = await this.getWritingsCount(user.uid);
      
      if (writingsCount >= 1) {
        console.error('Guest user reached writing limit.');
        throw new Error('Anonymous users can only create up to 1 writing.');
      }
  
      try {
        const writingsCollection = collection(this.firestore, 'writings');
        await addDoc(writingsCollection, {
          ...data,
          uid: user.uid,
          createdAt: new Date()
        });
        console.log('Writing created successfully.');
      } catch (error) {
        console.error('Firestore error:', error);
        throw error;
      }
    } else {
      console.error('Error: User is not authenticated or not anonymous.');
      throw new Error('User is not authenticated or not anonymous.');
    }
  }
  
  

  // async createWriting(data: any): Promise<void> {
  //   const user = this.auth.currentUser;
  
  //   if (user && user.isAnonymous) {
  //     const writingsCount = await this.getWritingsCount(user.uid);
      
  //     if (writingsCount >= 5) {
  //       throw new Error('Anonymous users can only create up to 5 writings.');
  //     }
  
  //     const writingsCollection = collection(this.firestore, 'writings');
  //     await addDoc(writingsCollection, {
  //       ...data,
  //       uid: user.uid,
  //       createdAt: new Date()
  //     });
  
  //   } else {
  //     throw new Error('User is not authenticated or not anonymous.');
  //   }
  // }
  
  

  // async createWriting(data: any): Promise<void> {
  //   const user = await this.auth.currentUser;
  //   if (user && user.isAnonymous) {
  //     const writingsCount = await this.getWritingsCount(user.uid);
  //     if (writingsCount >= 20) {
  //       throw new Error('Anonymous users can only create up to 20 writings.');
  //     }
  //     const writingsCollection = collection(this.firestore, 'writings');
  //     await addDoc(writingsCollection, {
  //       ...data,
  //       uid: user.uid,
  //       createdAt: new Date()
  //     });
  //   } else {
  //     throw new Error('User is not authenticated or not anonymous.');
  //   }
  // }

  async getWritingsCount(uid: string): Promise<number> {
    const writingsCollection = collection(this.firestore, 'writings');
    const q = query(writingsCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  }


  // async guestLogin() {
  //   // Just set a dummy user for guest login
  //   localStorage.setItem('user', JSON.stringify({ email: 'guest', role: 'user' }));
  //   return Promise.resolve();
  // }

  // async guestLogin(): Promise<void> {
  //   try {
  //     await signInAnonymously(this.auth);
  //     localStorage.setItem('user', JSON.stringify({ email: 'guest', role: 'user' }));
  //   } catch (error) {
  //     console.error('Guest login failed:', error);
  //     throw error;
  //   }
  // }  

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

  // async getUsers(): Promise<User[]> {
  //   const usersCollection = collection(this.firestore, 'users');
  //   const userSnapshot = await getDocs(usersCollection);
  //   return userSnapshot.docs.map(doc => new User(doc.data()));
  // }

  async getUsers(): Promise<User[]> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const userSnapshot = await getDocs(usersCollection);
      return userSnapshot.docs.map(doc => {
        const userData = doc.data();
        return new User({ ...userData, id: doc.id });
      });
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  // async getUserById(userId: string): Promise<User | null> {
  //   const userDocRef = doc(this.firestore, `users/${userId}`);
  //   const userDoc = await getDoc(userDocRef);
  //   if (userDoc.exists()) {
  //     return new User(userDoc.data());
  //   } else {
  //     return null;
  //   }
  // }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDocRef = doc(this.firestore, `users/${userId}`);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return new User({ ...userDoc.data(), id: userId });
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
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

  async isDuplicateUser(contact: Contact): Promise<boolean> {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('firstName', '==', contact.firstName), where('lastName', '==', contact.lastName));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }
}

