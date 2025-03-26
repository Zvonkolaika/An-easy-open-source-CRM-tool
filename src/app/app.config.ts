import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideAuth, getAuth } from '@angular/fire/auth';


const firebaseConfig = {
  apiKey: "AIzaSyDk5-eYvlwqyOm1CM-z50a0dX0Kr1XBT9w",
  authDomain: "simple-crm-8428e.firebaseapp.com",
  projectId: "simple-crm-8428e",
  storageBucket: "simple-crm-8428e.firebasestorage.app",
  messagingSenderId: "718576740179",
  appId: "1:718576740179:web:901283cd06970be2ace3a6"
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(),
  provideFirebaseApp(() => initializeApp(firebaseConfig)),
  provideFirestore(() => getFirestore()),
  provideCharts(withDefaultRegisterables()),
  provideAuth(() => getAuth()),
  ],
};



