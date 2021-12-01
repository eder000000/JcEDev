import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore'
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Profesional } from '../user/profesional-data-model';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  allPros: Observable<any[]>;
  prosCollection: AngularFirestoreCollection<Profesional>;
  storageRef: AngularFireStorageReference;
  storageTask: AngularFireUploadTask;

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { 
    this.allPros = db.collection('pro').valueChanges();
  }

  post(profesional: any): any {
    console.log(profesional);
    return this.db.collection('pro').add(profesional);
  }
  
  getAll(): Observable<Profesional[]> {
    return this.allPros;
  }

  async uploadImage(event: any) {
      const id = Math.random().toString(36).substring(2);
      this.storageRef = this.storage.ref(id);
      await this.storageRef.put(event.target.files[0])
      return this.storageRef.getDownloadURL()
  }
}
