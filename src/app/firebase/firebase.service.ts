import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { Profesional } from '../user/profesional-data-model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  allPros: Observable<any[]>;
  prosCollection: AngularFirestoreCollection<Profesional>;

  constructor(private db: AngularFirestore) { 
    this.allPros = db.collection('pro').valueChanges();
  }

  post(profesional: Profesional): any {
    return this.db.collection('pro').add(profesional);
  }
  
  getAll(): Observable<Profesional[]> {
    return this.allPros;
  }
}
